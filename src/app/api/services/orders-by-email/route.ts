import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/lib/models/Order';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ message: "L'e-mail est requis." }, { status: 400 });
    }

    try {
        await dbConnect();
        const orders = await Order.find({ "services.mailClient": email }).sort({ createdAt: -1 });
        if (orders.length === 0) {
            return NextResponse.json({ message: "Aucune commande trouvée pour cet e-mail." }, { status: 404 });
        }
        return NextResponse.json({ orders });
    } catch (error: any) {
        console.error("❌ Erreur lors de la récupération des commandes :", error);
        return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 });
    }
}
