export function getRandomNumber(minWait, maxWait) {
    return Math.floor(Math.random() * (maxWait - minWait) + minWait);
}