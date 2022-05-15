export const logger = (info) => {
    const now = new Date();

    console.log(`[${now.toLocaleString()}]`, info)
}
