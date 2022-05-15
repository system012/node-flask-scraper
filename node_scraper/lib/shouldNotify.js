export const shouldNotify = (product, price) =>
    price <= product.threshold && !product.notifiedPrices.includes(price);