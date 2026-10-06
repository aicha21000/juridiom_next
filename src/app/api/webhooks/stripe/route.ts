import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_PRIVATE || '');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS
    }
});

const LEGALIZATION_LABELS: Record<string, string> = {
    none: "Aucune légalisation",
    mairie: "Mairie",
    chamberOfCommerce: "Chambre de commerce",
    foreignAffairs: "Ministère des Affaires étrangères",
    consulate: "Consulat et ambassade",
};

const DELIVERY_LABELS: Record<string, string> = {
    email: "Email",
    standard: "Livraison standard",
    priority: "Livraison prioritaire",
    international: "Livraison à l'étranger",
    dhl: "Livraison DHL",
};

export async function POST(req: Request) {
    if (!endpointSecret) {
        console.error("Missing STRIPE_WEBHOOK_SECRET");
        return NextResponse.json({ error: 'Webhook secret missing' }, { status: 400 });
    }

    const payload = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            const db = firebaseAdmin.database();
            
            // Check if order already exists (to avoid duplicates if /payment-success already ran)
            const orderRef = db.ref(`orders/${session.id}`);
            const snapshot = await orderRef.once('value');
            if (snapshot.exists() && snapshot.val().status === 'paid') {
                return NextResponse.json({ received: true }); // Already processed
            }

            let cartData: any = null;
            if (session.metadata?.cart) {
                cartData = JSON.parse(session.metadata.cart);
            }

            if (!cartData) {
                console.error("Webhook: Missing cart data in metadata");
                return NextResponse.json({ error: 'Cart data missing' }, { status: 400 });
            }

            const shortOrderId = String(Date.now()).slice(-10);
            const clientEmail = cartData.mailClient || session.customer_details?.email || 'Non renseigné';

            const clientSessionId = session.metadata?.clientSessionId;
            let finalFiles: any[] = [];
            let fileLinksHtml = "";

            if (clientSessionId) {
                const tempSessionSnap = await db.ref(`temp_sessions/${clientSessionId}`).once('value');
                if (tempSessionSnap.exists() && tempSessionSnap.val().files) {
                    const tempFiles = tempSessionSnap.val().files;
                    const bucket = firebaseAdmin.storage().bucket();
                    const orderFolder = `order-files/${session.id}`;

                    for (const fileInfo of tempFiles) {
                        try {
                            const tempFileRef = bucket.file(fileInfo.path);
                            const originalName = fileInfo.name || fileInfo.path.split('/').pop()?.split('_').slice(1).join('_') || 'file';
                            const permanentFileName = `${orderFolder}/${Date.now()}_${originalName}`;
                            const permanentFileRef = bucket.file(permanentFileName);

                            if (await tempFileRef.exists().then(r => r[0])) {
                                await tempFileRef.copy(permanentFileRef);
                                await permanentFileRef.makePublic();
                                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${permanentFileName}`;
                                finalFiles.push({ name: originalName, url: publicUrl, path: permanentFileName });
                                fileLinksHtml += `<li><a href="${publicUrl}">${originalName}</a></li>`;
                            }
                        } catch (err) {
                            console.error('Webhook file copy error', err);
                        }
                    }
                }
            }

            // Sauvegarder en DB
            await orderRef.set({
                id: session.id,
                orderNumber: shortOrderId,
                mailClient: clientEmail,
                numberOfPages: cartData.numberOfPages || 0,
                numberOfDocuments: cartData.numberOfDocuments || 0,
                deliveryMethod: cartData.deliveryMethod || 'Non renseigné',
                legalization: cartData.legalization || 'Standard',
                totalPrice: cartData.totalPrice || 0,
                status: 'paid',
                createdAt: new Date().toISOString(),
                comment: cartData.comment || '',
                files: finalFiles, 
                stripeSessionId: session.id
            });

            // Envoi email Admin
            const mailOptionsAdmin = {
                from: process.env.EMAIL_ADMIN,
                to: process.env.EMAIL_ADMIN,
                subject: `Nouvelle Commande (Payée via Webhook) - ${clientEmail}`,
                html: `
                  <h1>Nouvelle Commande Reçue</h1>
                  <p>Client: ${clientEmail}</p>
                  <p>Montant: ${cartData.totalPrice} €</p>
                  <p>Session Stripe: ${session.id}</p>
                  <h2>Détails:</h2>
                  <ul>
                    <li>Pages: ${cartData.numberOfPages}</li>
                    <li>Documents: ${cartData.numberOfDocuments}</li>
                    <li>Commentaire: ${cartData.comment}</li>
                  </ul>
                  <p>Attention: Cette commande a été interceptée par le Webhook (le client a probablement fermé son navigateur avant la fin de la redirection). Les fichiers ne sont potentiellement pas attachés automatiquement.</p>
                `,
            };
            await transporter.sendMail(mailOptionsAdmin);

            // Envoi email Client
            const mailOptionsClient = {
                from: process.env.EMAIL_ADMIN,
                to: clientEmail,
                subject: `🎉 Confirmation de votre commande #${shortOrderId} - Traduction en Arabe`,
                html: `
                  <div style="background:#f0f9ff;padding:20px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;color:#333;">
                    <h1 style="color:#2563eb;">🎉 Merci pour votre commande #${shortOrderId} !</h1>
                    <p>✅ Votre paiement a bien été validé.</p>
                    <h2 style="color:#2563eb;">📦 Détails :</h2>
                    <ul>
                      <li>📄 Pages : ${cartData.numberOfPages}</li>
                      <li>📂 Documents : ${cartData.numberOfDocuments}</li>
                      <li>🛠️ Type : ${LEGALIZATION_LABELS[cartData.legalization as string] || cartData.legalization || 'Standard'}</li>
                      <li>🚚 Livraison : ${DELIVERY_LABELS[cartData.deliveryMethod as string] || cartData.deliveryMethod}</li>
                      <li>💶 Total : ${cartData.totalPrice} €</li>
                    </ul>
                    <p>🔧 Nous allons traiter votre demande dans les plus brefs délais.</p>
                    <p>🔗 <a href="${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?orderId=${session.id}" style="color:#2563eb; text-decoration:underline;">Voir votre commande #${shortOrderId}</a></p>
                  </div>
                `,
            };
            await transporter.sendMail(mailOptionsClient);

        } catch (dbError) {
            console.error("Webhook: Erreur traitement commande:", dbError);
        }
    }

    return NextResponse.json({ received: true });
}
