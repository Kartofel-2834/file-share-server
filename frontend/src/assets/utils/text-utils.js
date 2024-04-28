export function plural(num, postfixes) {
    if (!num && isNaN(num)) {
        return '';
    }

    const cases = [2, 0, 1, 1, 1, 2];
    return postfixes[num % 100 > 4 && num % 100 < 20 ? 2 : cases[Math.min(num % 10, 5)]];
}

export function toCamelCase(str) {
    let result = str.split('-').filter(word => word.length);
    result = result.map((word, index) => index ? word[0].toUpperCase() + word.slice(1) : word);

    return result.join('');
}
