const newSelector = "span.a-declarative > a > span.a-size-base.a-color-price";
const newUsedSelector = "#olp_feature_div > div.a-section.a-spacing-small.a-spacing-top-small > span > a > span.a-size-base.a-color-price";
const usedSelector = "#buyNew_noncbb > span";
const titleSelector = "#productTitle";
const alternateTitle = "title";

export function extractPrice(page, productsLength, count) {
    const usedPriceText = page(usedSelector).text();
    const newUsedPriceText = page(newUsedSelector).text();
    const newPriceText = page(newSelector).text();
    const priceText = newUsedPriceText || usedPriceText || newPriceText; // il primo che risulta vero andrà assegnato a priceText
    const title = page(titleSelector).text().trim() || page(alternateTitle).text().trim();
    
    logger(`stiamo controllando il prodotto ${title}, ${count}/${productsLength}`)
    logger({ priceText, newUsedPriceText, usedPriceText, newPriceText });
    
    if (!priceText) {
        if (page("body").text().includes("robot")) logger("Bloccato dal captcha!")
        logger(`Nessun prezzo trovato. \n`);
        return undefined;
    };
    return Number(priceText.split(',')[0].split(".").join(""));
};