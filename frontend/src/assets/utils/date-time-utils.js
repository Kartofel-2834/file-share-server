// Constants
import { weekDays, months } from '@/assets/constants/date-constants';

// Utils
import { leadingZero } from '@/assets/utils/numbers-utils';

export const dayByIndex = (index, short) => {
    const { list, shortList } = weekDays;

    return short ? shortList[index] : list[index];
};

export const monthByIndex = (index, short, plural) => {
    const { list, pluralList, shortList } = months;

    if (short) {
        return shortList[index];
    }

    return plural ? pluralList[index] : list[index];
};

export const isValidDate = date => !isNaN(Date.parse(date));

export const formatDateTime = (date, pattern) => {
    if (!date) {
        return '';
    }

    const d = isValidDate(date) ? new Date(date) : new Date();

    const params = {
        // Date
        $d: leadingZero(d.getDate()), // Day of the month, 2 digits with leading zeros. // '01' to '31'
        $j: d.getDate(), // Day of the month without leading zeros. // '1' to '31'

        // Days of the week
        $D: dayByIndex(d.getDay(), true), // Day of the week, textual, 3 letters. // 'Пн', 'Вт'
        $l: dayByIndex(d.getDay()), // Day of the week, textual, long. // 'Пятница'

        // Month
        $m: leadingZero(d.getMonth() + 1), // Month, 2 digits with leading zeros. // '01' to '12'
        $n: d.getMonth() + 1, // Month without leading zeros. // '1' to '12'
        $M: monthByIndex(d.getMonth(), true), // Month, textual, 3 letters. // 'Янв'
        $b: monthByIndex(d.getMonth(), true).toLowerCase(), // Month, textual, 3 letters, lowercase. // 'янв'
        $F: monthByIndex(d.getMonth()), // Month, textual, long. // 'Январь'
        $E: monthByIndex(d.getMonth(), false, true), // Month, plural, long. // 'Января'
        $e: monthByIndex(d.getMonth(), false, true).toLowerCase(), // Month, plural, long, lowercase // 'января'

        // Year
        $y: d.getFullYear(), // Year, 4 digits. // 1993

        // Time
        // Hours
        $g: Math.floor(d.getHours() / 2), // Hour, 12-hour format without leading zeros. // '1' to '12'
        $G: d.getHours(), // Hour, 24-hour format without leading zeros. // '0' to '23'
        $h: leadingZero(Math.floor(d.getHours() / 2)), // Hour, 12-hour format. // '01' to '12'
        $H: leadingZero(d.getHours()), // Hour, 24-hour format. // '01' to '23'

        // Minutes
        $i: d.getMinutes(), // Minutes, without leading zeros. // '1' to '59'
        $I: leadingZero(d.getMinutes()), // Minutes. // '01' to '59'

        // Seconds
        $s: d.getSeconds(), // Seconds, without leading zeros. // '1' to '59'
        $S: leadingZero(d.getSeconds()), // Seconds. // '1' to '59'
    };

    const symbols = pattern.match(/[$][a-zA-Z]/gm);
    let result = pattern;

    symbols.forEach(s => {
        result = result.replace(s, params[s]);
    });

    return result;
};

export const toDate = value => {
    const result = new Date(value);
    return isNaN(result.getTime()) ? new Date() : result;
};

export const formatHours = hoursCount => {
    if (isNaN(hoursCount)) {
        return '00:00';
    }

    const hours = Math.floor(Number(hoursCount));
    const minutes = Math.round((Number(hoursCount) - hours) * 60);

    return `${leadingZero(hours)}:${leadingZero(minutes)}`;
};

export const formatSeconds = secondsCount => {
    if (isNaN(secondsCount)) {
        return '00:00';
    }

    const minutes = Math.floor(secondsCount / 60);
    const seconds = secondsCount - (minutes * 60);

    return `${leadingZero(minutes)}:${leadingZero(seconds)}`;
};

// Переводит время from -> to, в зависимости от кол-ва единиц времени
// Пример 1: 12800 сек. -> 3 ч. | Пример 2: 10 сек. -> 10 сек.
export const trimTime = (count = 0, from = 'seconds', to = 'years') => {
    const time = {
        seconds: {
            count: 0,
            limit: 60,
            plural: ['секунда', 'секунды', 'секунд'],
            label: 'сек.',
        },

        minutes: {
            count: 0,
            limit: 60,
            plural: ['минута', 'минуты', 'минут'],
            label: 'мин.',
        },

        hours: {
            count: 0,
            limit: 24,
            plural: ['час', 'часа', 'часов'],
            label: 'ч.',
        },

        days: {
            count: 0,
            limit: 31,
            plural: ['день', 'дня', 'дней'],
            label: 'д.',
        },

        months: {
            count: 0,
            limit: 12,
            plural: ['месяц', 'месяца', 'месяцев'],
            label: 'мес.',
        },

        years: {
            count: 0,
            limit: NaN,
            plural: ['год', 'года', 'лет'],
            label: 'г.',
        },
    };

    const timeUnits = Object.keys(time);
    const startIndex = timeUnits.indexOf(from);
    const endIndex = timeUnits.indexOf(to);

    if (
        startIndex < 0 ||
        endIndex < 0 ||
        startIndex > endIndex ||
        isNaN(count) ||
        count < 0
    ) {
        return null;
    }

    time[from].count = count;

    for (let index = startIndex; index <= endIndex; index++) {
        const unit = timeUnits[index];
        const { count, limit } = time[unit];

        if (isNaN(limit) || count < limit) {
            return time[unit];
        }

        const nextUnit = timeUnits[index + 1];
        time[nextUnit].count = Math.floor(count / limit);
    }

    time[to].count = time[to]?.count || 1;
    return time[to];
};
