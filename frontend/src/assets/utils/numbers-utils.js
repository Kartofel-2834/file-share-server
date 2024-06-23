export const leadingZero = num => num < 10 ? `0${num}` : num;

export function formatFileSize(sizeInBytes = 0, fractionLen = 1) {    
    const mb = roundTo(sizeInBytes / (1024 ** 2), fractionLen);

    if (mb > 1) {
        return `${mb} Mb`;
    }

    const kb = roundTo(sizeInBytes / 1024, fractionLen);
    
    if (kb > 1) {
        return `${kb} Kb`;
    }

    return `${sizeInBytes} bytes`;
}

export function roundTo(someNumber, fractionLen = 1) {
    const divider = 10 ** fractionLen; 

    return Math.floor(someNumber * divider) / divider;
}

export function splitThousands(val) {
    if (isNaN(val)) {
        return val;
    }

    val = Math.floor(Number(val));
    const prefix = val < 0 ? '-' : '';

    return prefix + val
        .toString()
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function roundToMillions(num, accuracy = 1) {
    if (num === undefined || num === null) {
        return '';
    }

    return (Number(num) / 1000000).toFixed(accuracy);
}

export function onlyNumbers(val) {
    return val
        .toString()
        .replace(/\D/g, '');
}

export function onlyLetters(val) {
    return val
        .toString()
        .replace(/[^a-zA-Z ]+/g, '');
}

export function prettyPhone(rawPhoneNumber) {
    return onlyNumbers(rawPhoneNumber).replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
}
