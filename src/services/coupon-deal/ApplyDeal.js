function applyDeal(price, deal) {
    if (!deal) return price;

    if (deal.discountType === 'PERCENTAGE') {
        return price - (price * deal.discountValue) / 100;
    }

    return price - deal.discountValue;
}

module.exports = applyDeal;