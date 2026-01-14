// backend/utils/calculatePrice.js
const calculatePrice = (numberOfPages, deliveryMethod, legalization, numberOfDocuments = 1) => {
    const basePricePerPage = 30.00;

    const deliveryCosts = {
        email: 0,
        standard: 10,
        priority: 15,
        international: 20,
        dhl: 100,
    };

    const legalizationCosts = {
        none: 0,
        mairie: 20,
        chamberOfCommerce: 50,
        foreignAffairs: 40,
        consulate: 60,
    };

    const basePrice = numberOfPages * basePricePerPage;

    const baseDeliveryCost = deliveryCosts[deliveryMethod] || 0;
    const extraDeliveryCost = numberOfPages * 2;
    const totalDeliveryCost = baseDeliveryCost + extraDeliveryCost;

    const legalizationCost = (legalizationCosts[legalization] || 0) * numberOfDocuments;

    return basePrice + totalDeliveryCost + legalizationCost;
};

module.exports = calculatePrice;

