// src/app/api/services/update-order-status/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { Order } from '@/services/firebase';

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    }

    const orderRef = firebaseAdmin.database().ref(`orders/${orderId}`);
    const snapshot = await orderRef.once('value');
    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const order: Order = snapshot.val();

    // Update status in DB
    await orderRef.update({ status });

    // If status is processing, send tracking email to client
    if (status === 'processing') {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : true,
        auth: {
          user: process.env.EMAIL_ADMIN,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.verify();

      const displayOrderId = order.orderNumber || orderId;
      const fileLinks = order.files?.
        map((f) => `<li><a href="${f.url}" target="_blank">${f.name}</a></li>`)
        .join('') || '';
      const html = `
        <div style="background:#f0f9ff;padding:20px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;color:#333;">
          <h1 style="color:#2563eb;">🔄 Votre commande est en cours de traitement !</h1>
          <p>Bonjour ${order.mailClient},</p>
          <p>Votre commande <strong>#${displayOrderId}</strong> est maintenant prise en charge par notre équipe.</p>
          ${fileLinks ? `<h2 style="color:#2563eb;">📎 Vos fichiers :</h2><ul>${fileLinks}</ul>` : ''}
          <p>🔔 Nous vous contacterons dès que la traduction sera prête.</p>
          <p>Merci pour votre confiance. 🙏</p>
        </div>
      `;
      const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: order.mailClient,
        subject: `🔄 Commande #${displayOrderId} en cours de traitement`,
        html,
      };
      try {
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.error('Error sending tracking email:', mailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in update-order-status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
