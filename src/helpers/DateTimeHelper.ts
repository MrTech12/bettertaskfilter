type Format = 'short' | 'long';

export function getDutchDateTime(format: Format): string {
    let formatOptions: Intl.DateTimeFormatOptions = {};
    if (format == 'short') {
        formatOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    } 
    if (format == 'long') {
        formatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    }
    return new Date().toLocaleString('nl-NL', formatOptions);
};