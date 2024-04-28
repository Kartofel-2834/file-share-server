import { gsap } from 'gsap/dist/gsap.js';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin.js';

gsap.registerPlugin(ScrollToPlugin);

export function lockBody() {
    console.warn('lockBody устарел, используйте disablePageScroll. Документация: https://github.com/FL3NKEY/scroll-lock/blob/master/README.RU.md');
}

export function unlockBody() {
    console.warn('unlockBody устарел, используйте enablePageScroll. Документация: https://github.com/FL3NKEY/scroll-lock/blob/master/README.RU.md');
}

export function scrollTo(id = false, offset = 0, force = false) {
    const target = document.getElementById(id || '__nuxt');

    if (target) {
        const position = target.getBoundingClientRect().top + window.pageYOffset;

        if (force) {
            window.scroll({
                top: position - offset,
                left: 0,
                behavior: 'instant',
            });
        } else {
            gsap.to(window, {
                duration: .5,
                scrollTo:
                    { y: position, offsetY: offset },
            });
        }
    }
}

export function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        // eslint-disable-next-line consistent-this
        const context = this;
        const args = arguments;

        function later() {
            timeout = null;

            if (!immediate) {
                func.apply(context, args);
            }
        }

        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
}

/* eslint-disable */
export function simpleEquality(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function getRange(from = 0, to = 1, step = 0.1, roundTo = 2) {
    const result = [];
    const rounder = Math.pow(10, roundTo);

    for (let i = from; i < to; i += step) {
        result.push(Math.round(i * rounder) / rounder);
    }

    if (!result.length || result[result.length - 1] !== to) {
        result.push(to);
    }

    return result;
};

export function changesCounter(current, prev) {
    // Если операнды массивы, то кол-во изменений === кол-во несовпадающих элем.
    if (Array.isArray(prev) || Array.isArray(current)) {
        if (!Array.isArray(current)) {
            return prev.length;
        }

        if (!Array.isArray(prev)) {
            return current.length;
        }

        let coincidences = 0;

        for (const element of prev) {
            coincidences += current.find(v => simpleEquality(v, element)) ? 1 : 0;
        }

        return current.length - coincidences;
    }

    // Если это не объекты, то мы их просто сравниваем
    if (
        (typeof prev !== 'object' && typeof current !== 'object') ||
        (!current && !prev)
    ) {
        return Number(!simpleEquality(current, prev));
    }

    // Если операнды объекты, то применяем рекурсию на каждое их свойство
    let result = 0;

    const currentUpdated = current || {};
    const prevUpdated = prev || {};
    const iterableObject = Object.keys(currentUpdated) > Object.keys(prevUpdated) ?
        currentUpdated :
        prevUpdated;

    for (const property in iterableObject) {
        result += changesCounter(currentUpdated[property], prevUpdated[property]);
    }

    return result
}

export function cleanPhone(prettyPhoneNumber) {
    return prettyPhoneNumber.replace(/ |-|\(|\)|_/g, '');
}
/* eslint-enable */
