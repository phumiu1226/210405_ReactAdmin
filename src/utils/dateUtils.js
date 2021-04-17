

export function dateFormatter(date) {
    if (!date) return '';
    let datetime = new Date(date);
    return datetime.getDate() + '/' + (datetime.getMonth() + 1) + '/' + datetime.getFullYear() + ' ' + datetime.getHours() + ':'
        + datetime.getMinutes() + ':' + datetime.getSeconds();
}