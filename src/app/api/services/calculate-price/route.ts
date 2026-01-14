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

const calculatePrice = (numberOfPages: number, deliveryMethod: string, legalization: string, numberOfDocuments = 1) => {
    const deliveryPrice = DELIVERY_METHODS.find(method => method.id === deliveryMethod)?.price || 0;
    const legalizationPrice = LEGALIZATION_TYPES.find(type => type.id === legalization)?.price || 0;
    return (BASE_PRICE_PER_PAGE * numberOfPages + deliveryPrice + (legalizationPrice * numberOfDocuments));
};

export async function POST(req: Request) {
    try {
        const { numberOfPages, deliveryMethod, legalization, numberOfDocuments } = await req.json();

        if (!numberOfPages || isNaN(numberOfPages) || numberOfPages <= 0) {
            return NextResponse.json({ message: "Le nombre de pages doit être valide." }, { status: 400 });
        }

        if (!deliveryMethod || !legalization) {
            return NextResponse.json({ message: "Veuillez choisir une méthode de livraison et une légalisation." }, { status: 400 });
        }

        const totalPrice = calculatePrice(numberOfPages, deliveryMethod, legalization, numberOfDocuments || 1);
        return NextResponse.json({ totalPrice });
    } catch (err) {
        console.error("❌ Erreur dans /calculate-price :", err);
        return NextResponse.json({ message: "Erreur lors du calcul du prix." }, { status: 500 });
    }
}
