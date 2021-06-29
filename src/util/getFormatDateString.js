function formatDateNumber(date, length) {
  return date.toString().padStart(length || 2, '0');
}

function getFormatDateString(inputDate) {
  const date = inputDate || new Date();
  return formatDateNumber(date.getFullYear(), 4) + '-' +
    formatDateNumber(date.getMonth() + 1) + '-' +
    formatDateNumber(date.getDate()) + ' ' +
    formatDateNumber(date.getHours()) + ':' +
    formatDateNumber(date.getMinutes()) + ':' +
    formatDateNumber(date.getSeconds());
}

export default getFormatDateString;
