import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  if (number == null || number === '') return ''; // Handle null or empty input gracefully
  
  // Convert the number to a string and split it into integer and fractional parts
  const [integerPart, fractionalPart] = number.toFixed(2).split('.');
  
  // Use a regular expression to format the integer part in the Indian style
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/(\d)(?=(\d{2})+\d{3},)/g, '$1,');

  // Combine the formatted integer part with the fractional part
  return `${formattedIntegerPart}.${fractionalPart}`;
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
