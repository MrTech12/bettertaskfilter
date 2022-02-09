type Format = 'short' | 'long';

export function getDutchDateTime(format: Format): string {
    let formatOptions: Intl.DateTimeFormatOptions = {};
    if (format == 'short') {
        formatOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    } else if (format == 'long') {
        formatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    }
    return new Date().toLocaleString('nl-NL', formatOptions);
};