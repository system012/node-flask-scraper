export function saveNotifiedPrices(product, price) {
    product.notifiedPrices.push(price);
    product.save();
}