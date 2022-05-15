export function sleep(minWait, maxWait) {
    const timeout = getRandomNumber(minWait, maxWait)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}