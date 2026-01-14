import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS
    }
});

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: "Tous les champs sont requis." }, { status: 400 });
        }

        const mailOptions = {
            from: process.env.EMAIL_ADMIN,
            to: process.env.EMAIL_ADMIN,
            subject: `Nouveau message de contact de ${name}`,
            text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: "Votre message a été envoyé avec succès." });
    } catch (error: any) {
        console.error("❌ Erreur lors de l'envoi du message de contact :", error);
        return NextResponse.json({ message: "Erreur lors de l'envoi du message." }, { status: 500 });
    }
}
