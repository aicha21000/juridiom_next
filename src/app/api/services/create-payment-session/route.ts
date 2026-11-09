import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateOrderPrice } from '../../../../utils/pricing';

const stripe = new Stripe(process.env.STRIPE_PRIVATE || '');

export async function POST(req: Request) {
    try {
        const { cart, sessionId } = await req.json();

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ error: "Panier vide ou invalide" }, { status: 400 });
        }

        const cartData = cart[0];

        // 🛡️ SÉCURITÉ SERVEUR : Recalcul strict et infalsifiable du montant officiel
        const breakdown = calculateOrderPrice({
            documentType: cartData.documentType,
            numberOfPages: Number(cartData.numberOfPages) || 1,
            numberOfDocuments: Number(cartData.numberOfDocuments) || 1,
            deliveryMethod: cartData.deliveryMethod,
            legalization: cartData.legalization,
            urgency: cartData.urgency
        });

        // Construction des line_items Stripe certifiés par le serveur
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `Traduction assermentée – ${breakdown.documentName}`,
                        description: breakdown.isFlatRate
                            ? `Forfait officiel (${breakdown.numberOfPages} page)`
                            : `${breakdown.numberOfPages} page(s) à ${breakdown.unitPricePerPage} €/page (combinaison Arabe ⇄ Français)`
                    },
                    unit_amount: Math.round(breakdown.translationPrice * 100)
                },
                quantity: 1
            }
        ];

        // Ligne de livraison si payante
        if (breakdown.deliveryPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `Frais d'expédition – ${breakdown.deliveryName}`,
                        description: "Envoi postal sécurisé avec suivi"
                    },
                    unit_amount: Math.round(breakdown.deliveryPrice * 100)
                },
                quantity: 1
            });
        }

        // Ligne de légalisation si payante
        if (breakdown.legalizationPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `Formalités de légalisation – ${breakdown.legalizationName}`,
                        description: `Pour ${breakdown.numberOfDocuments} document(s)`
                    },
                    unit_amount: Math.round(breakdown.legalizationPrice * 100)
                },
                quantity: 1
            });
        }

        // Ligne d'urgence si sélectionnée
        if (breakdown.urgencyPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: "Option Urgence Express",
                        description: "Traitement prioritaire le jour même (< 12h)"
                    },
                    unit_amount: Math.round(breakdown.urgencyPrice * 100)
                },
                quantity: 1
            });
        }

        const metadata = {
            cart: JSON.stringify({
                numberOfPages: breakdown.numberOfPages,
                numberOfDocuments: breakdown.numberOfDocuments,
                deliveryMethod: breakdown.deliveryMethod,
                mailClient: cartData.mailClient,
                legalization: breakdown.legalization,
                totalPrice: breakdown.totalPrice, // Montant certifié par le serveur
                documentType: breakdown.documentType,
                urgency: breakdown.urgency,
                comment: cartData.comment || ''
            }),
            timestamp: Date.now().toString(),
            clientSessionId: cartData.sessionId || sessionId || ''
        };

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traductionenarabe.fr';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: cartData.mailClient || undefined,
            line_items: lineItems,
            mode: 'payment',
            success_url: `${siteUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/panier`,
            metadata: metadata,
            payment_intent_data: {
                metadata: metadata,
                description: `Traduction assermentée – ${breakdown.documentName} (${breakdown.numberOfPages} p.) - ${cartData.mailClient || 'Client'}`
            }
        });

        return NextResponse.json({ id: session.id, url: session.url, verifiedTotal: breakdown.totalPrice });
    } catch (error: any) {
        console.error('Erreur lors de la création de la session Stripe:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
