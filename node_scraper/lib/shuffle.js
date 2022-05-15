export function shuffle(unshuffled) {// Randomizza l'ordine dei prodotti da controllare, una misura (un poco) efficace contro sistemi anti-bot.
    return unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
