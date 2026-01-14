import { NextResponse } from 'next/server';

const BASE_PRICE_PER_PAGE = 30;

const DELIVERY_METHODS = [
    { id: "email", name: "Email", price: 0 },
    { id: "standard", name: "Livraison standard", price: 10 },
    { id: "priority", name: "Livraison prioritaire", price: 15 },
    { id: "international", name: "Livraison à l'étranger", price: 20 },
    { id: "dhl", name: "Livraison DHL", price: 100 }
];

const LEGALIZATION_TYPES = [
    { id: "none", name: "Aucune légalisation", price: 0 },
    { id: "mairie", name: "Mairie", price: 20 },
    { id: "chamberOfCommerce", name: "Chambre de commerce", price: 50 },
    { id: "foreignAffairs", name: "Ministère des Affaires étrangères", price: 40 },
    { id: "consulate", name: "Consulat et ambassade", price: 80 }
];

export async function GET() {
    return NextResponse.json({
        basePricePerPage: BASE_PRICE_PER_PAGE,
        deliveryMethods: DELIVERY_METHODS,
        legalizationTypes: LEGALIZATION_TYPES
    });
}
