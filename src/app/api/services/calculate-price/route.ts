import { NextResponse } from 'next/server';
import { calculateOrderPrice } from '../../../../utils/pricing';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { numberOfPages, deliveryMethod, legalization, numberOfDocuments, documentType, urgency } = body;

        const breakdown = calculateOrderPrice({
            documentType,
            numberOfPages: Number(numberOfPages) || 1,
            numberOfDocuments: Number(numberOfDocuments) || 1,
            deliveryMethod: deliveryMethod || 'email',
            legalization: legalization || 'none',
            urgency: urgency || 'standard'
        });

        return NextResponse.json({
            totalPrice: breakdown.totalPrice,
            breakdown
        });
    } catch (err) {
        console.error("❌ Erreur dans /calculate-price :", err);
        return NextResponse.json({ message: "Erreur lors du calcul du prix." }, { status: 500 });
    }
}
