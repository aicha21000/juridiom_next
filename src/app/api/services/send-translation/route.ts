import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { firebaseAdmin } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const orderId = formData.get('orderId') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File | null;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId requis' }, { status: 400 });
    }

    // Récupérer la commande depuis Firebase
    const orderRef = firebaseAdmin.database().ref(`orders/${orderId}`);
    const snapshot = await orderRef.once('value');
    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }
    const order = snapshot.val();
    const displayOrderId = order.orderNumber || orderId;
    const clientEmail = order.mailClient;

    if (!clientEmail) {
      return NextResponse.json({ error: 'Email client introuvable' }, { status: 400 });
    }

    // Préparer le transporteur
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Préparer la pièce jointe si un fichier est fourni
    const attachments: any[] = [];
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    const defaultMessage = `Bonjour,\n\nNous avons le plaisir de vous faire parvenir votre traduction pour la commande #${displayOrderId}.\n\nNous espérons que ce travail vous donnera entière satisfaction. N'hésitez pas à nous contacter si vous avez la moindre question.\n\nMerci de votre confiance et à bientôt !\n\nCordialement,\nAicha Salhi`;

    const finalMessage = message || defaultMessage;

    const html = `
      <div style="background:#f0f9ff;padding:24px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;color:#333;max-width:600px;">
        <h1 style="color:#2563eb;">✅ Votre traduction est prête !</h1>
        <p>Bonjour,</p>
        <p>Votre commande <strong>#${displayOrderId}</strong> est terminée. Veuillez trouver ci-joint votre traduction.</p>
        <div style="background:#fff;border-left:4px solid #2563eb;padding:16px;margin:16px 0;border-radius:4px;">
          ${finalMessage.replace(/\n/g, '<br/>')}
        </div>
        <p>📧 Pour toute question, répondez à cet email.</p>
        <p style="color:#6b7280;font-size:12px;margin-top:24px;">© Traduction en Arabe — traductionenarabe.fr</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_ADMIN,
      to: clientEmail,
      subject: `✅ Votre traduction #${displayOrderId} est prête`,
      html,
      attachments,
    });

    // Mettre à jour le statut à "completed"
    await orderRef.update({ status: 'completed' });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur send-translation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
