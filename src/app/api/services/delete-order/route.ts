// src/app/api/services/delete-order/route.ts
import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const orderRef = firebaseAdmin.database().ref(`orders/${orderId}`);
    const snapshot = await orderRef.once('value');
    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const order = snapshot.val();

    // Delete files from Cloud Storage if any
    if (order.files && order.files.length > 0) {
      const bucket = firebaseAdmin.storage().bucket();
      const prefix = `order-files/${orderId}/`;
      try {
        const [files] = await bucket.getFiles({ prefix });
        const deletePromises = files.map((file) => file.delete());
        await Promise.all(deletePromises);
      } catch (fsErr) {
        console.error('Error deleting order files from storage:', fsErr);
      }
    }

    // Delete the order entry in Realtime DB
    await orderRef.remove();

    // Optional: send a cancellation email to client
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : true,
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS,
      },
    });
    try {
      await transporter.verify();
      const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: order.mailClient,
        subject: `Votre commande ${orderId} a été supprimée`,
        html: `<p>Bonjour ${order.mailClient},</p><p>Nous vous informons que votre commande a été supprimée par l'administrateur.</p>`,
      };
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error('Error sending deletion email:', mailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete-order endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
