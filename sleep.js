function sleep(ms) {
    return new Promise(reflect => setTimeout(reflect, ms));
}

async function delayAndDo(f, delay) {
    await sleep(delay);
}

export {sleep, delayAndDo};