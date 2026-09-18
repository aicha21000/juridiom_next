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

      const fileLinks = order.files?.
        map((f) => `<li><a href="${f.url}" target="_blank">${f.name}</a></li>`)
        .join('') || '';
      const html = `
        <p>Bonjour ${order.mailClient},</p>
        <p>Votre commande ${orderId} est maintenant en cours de traitement.</p>
        <p>Voici les liens de suivi des fichiers :</p>
        <ul>${fileLinks}</ul>
        <p>Merci pour votre confiance.</p>
      `;
      const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: order.mailClient,
        subject: `Suivi de votre commande ${orderId}`,
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
