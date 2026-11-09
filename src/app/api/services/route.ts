import { NextResponse } from 'next/server';
import { DELIVERY_OPTIONS, LEGALIZATION_OPTIONS, URGENCY_OPTIONS, DOCUMENT_TYPES } from '../../../utils/pricing';

export async function GET() {
    return NextResponse.json({
        basePricePerPage: 30,
        deliveryMethods: DELIVERY_OPTIONS,
        legalizationTypes: LEGALIZATION_OPTIONS,
        urgencyOptions: URGENCY_OPTIONS,
        documentTypes: DOCUMENT_TYPES
    });
}
