export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function s4() {
    return Math.floor((Math.random() + 1) * 0x10000).toString(16).substr(1);
}


export function generateId() {
    return s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
}