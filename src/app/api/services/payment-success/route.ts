import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_PRIVATE || '');
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS
    }
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
        return NextResponse.json({ error: 'Session ID missing' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const cartData = session.metadata?.cart ? JSON.parse(session.metadata.cart) : null;
            if (!cartData) throw new Error("Données du panier manquantes");

            // Get files from session metadata or handle separately? 
            // In the DB version, we looked at "cookies" or "Order" logic. 
            // Here, files are in Firebase temp folder. Path info is in cart cookie but maybe inconsistent if we rely only on cookie.
            // Using cartData from metadata (which we sent to Stripe) is safer if we included file paths there.
            // But we didn't include file paths in metadata in create-payment-session (we included limited fields).
            // We should try to get files from the Cookie OR just trust the user/upload flow.
            // Let's rely on the cookie "cart" for file paths if available, or just accept that "files" might be loose.

            const cookieStore = await cookies();
            const cartCookie = cookieStore.get('cart')?.value;
            const cartFromCookie = cartCookie ? JSON.parse(cartCookie) : [];
            const files = cartFromCookie[0]?.files || [];

            let fileLinksHtml = "";

            if (files && files.length > 0) {
                const bucket = firebaseAdmin.storage().bucket();
                const orderRef = session.id; // Use session ID as folder name
                const orderFolder = `order-files/${orderRef}`;

                for (const fileInfo of files) {
                    try {
                        const tempFileRef = bucket.file(fileInfo.path);
                        // Extract original name safer way
                        // Format was: temp-files/TIMESTAMP_Filename
                        const originalName = fileInfo.name || fileInfo.path.split('/').pop()?.split('_').slice(1).join('_') || 'file';
                        const permanentFileName = `${orderFolder}/${Date.now()}_${originalName}`;
                        const permanentFileRef = bucket.file(permanentFileName);

                        if (await tempFileRef.exists().then(r => r[0])) {
                            await tempFileRef.copy(permanentFileRef);
                            await tempFileRef.delete();
                            await permanentFileRef.makePublic();
                            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${permanentFileName}`;
                            fileLinksHtml += `<li><a href="${publicUrl}">${originalName}</a></li>`;
                        }
                    } catch (err) {
                        console.error('File copy error', err);
                    }
                }
            }

            // Send email to Client
            const mailOptionsClient = {
                from: process.env.EMAIL_ADMIN,
                to: cartData.mailClient,
                subject: "Confirmation de votre commande - Traduction en Arabe",
                html: `
                  <h1>Merci pour votre commande !</h1>
                  <p>Votre paiement a été validé.</p>
                  <h2>Détails:</h2>
                  <ul>
                    <li>Pages: ${cartData.numberOfPages}</li>
                    <li>Documents: ${cartData.numberOfDocuments}</li>
                    <li>Type: ${cartData.legalization || 'Standard'}</li>
                    <li>Livraison: ${cartData.deliveryMethod}</li>
                    <li>Total: ${cartData.totalPrice} €</li>
                  </ul>
                  <p>Nous allons traiter votre demande dans les plus brefs délais.</p>
                `
            };
            await transporter.sendMail(mailOptionsClient);

            // Send email to Admin
            const mailOptionsAdmin = {
                from: process.env.EMAIL_ADMIN,
                to: process.env.EMAIL_ADMIN,
                subject: `Nouvelle Commande (Payée) - ${cartData.mailClient}`,
                html: `
                  <h1>Nouvelle Commande Reçue</h1>
                  <p>Client: ${cartData.mailClient}</p>
                  <p>Montant: ${cartData.totalPrice} €</p>
                  <p>Session Stripe: ${session.id}</p>
                  <h2>Détails:</h2>
                  <ul>
                    <li>Pages: ${cartData.numberOfPages}</li>
                    <li>Documents: ${cartData.numberOfDocuments}</li>
                    <li>Commentaire: ${cartData.comment}</li>
                  </ul>
                  <h2>Fichiers:</h2>
                  <ul>${fileLinksHtml || "Aucun fichier (ou erreur lien)"}</ul>
                `
            };
            await transporter.sendMail(mailOptionsAdmin);

            // Sauvegarder la commande dans Firebase Realtime Database
            try {
                const db = firebaseAdmin.database();
                await db.ref(`orders/${session.id}`).set({
                    id: session.id,
                    mailClient: cartData.mailClient,
                    numberOfPages: cartData.numberOfPages,
                    numberOfDocuments: cartData.numberOfDocuments,
                    deliveryMethod: cartData.deliveryMethod,
                    legalization: cartData.legalization || 'Standard',
                    totalPrice: cartData.totalPrice,
                    status: 'paid',
                    createdAt: new Date().toISOString(),
                    comment: cartData.comment || '',
                    files: files.map((f: any) => ({
                        name: f.name,
                        // On utilise l'URL publique générée plus haut ou on construit l'URL
                        url: f.url || `https://storage.googleapis.com/${firebaseAdmin.storage().bucket().name}/order-files/${session.id}/${f.name}`
                    })),
                    stripeSessionId: session.id
                });
            } catch (dbError) {
                console.error("Erreur lors de la sauvegarde de la commande en DB:", dbError);
                // On continue quand même car l'email a été envoyé
            }

            // Clear cart and redirect
            const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/confirmation`);
            response.cookies.set('cart', JSON.stringify([]), { maxAge: 0 });
            return response;
        } else {
            return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
