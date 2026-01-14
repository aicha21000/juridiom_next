import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_PRIVATE || '');

export async function POST(req: Request) {
    try {
        const { items, cart } = await req.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: "Items invalides" }, { status: 400 });
        }

        const cartData = cart[0] || {};
        const metadata = {
            cart: JSON.stringify({
                numberOfPages: cartData.numberOfPages,
                numberOfDocuments: cartData.numberOfDocuments,
                deliveryMethod: cartData.deliveryMethod,
                mailClient: cartData.mailClient,
                legalization: cartData.legalization,
                totalPrice: cartData.totalPrice,
                comment: cartData.comment || ''
            }),
            timestamp: Date.now().toString()
        };

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/cart`,
            metadata: metadata,
            payment_intent_data: {
                metadata: metadata,
                description: `Commande de traduction - ${cartData.numberOfPages || 0} pages`
            }
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error: any) {
        console.error('Erreur lors de la création de la session:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
