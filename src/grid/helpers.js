import { parse, parseISO } from 'date-fns';
import { format } from 'date-fns';

export const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const numericFormatter = new Intl.NumberFormat('en-US', {});

import moment from 'moment';

export const checkFocus = (element, func) => {
  let isFocused = null;
  document.addEventListener('click', (event) => {
    let targetElement = event.target;
    do {
      if (targetElement === element) {
        if (isFocused !== true) {
          func(true);
          isFocused = true;
        }
        return;
      }
      targetElement = targetElement.parentNode;
    } while (targetElement);
    if (isFocused !== false) {
      func(false);
      isFocused = false;
    }
  });
};

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
}

export const cellValueParser = (column, row, value, fromInput) => {
  //console.log(column, row, value, fromInput)
  if (column.formatter) {
    return column.formatter({ value, row, column, fromInput, reverse: true });
  }
  if (!value && value !== 0 && value !== false) {
    return value;
  }
  if (!column.type || column.type === 'text') {
    return value;
  }
  if (column.type === 'date') {
    if (fromInput) {
      // eslint-disable-next-line no-param-reassign
      var valueDate = parse(value, 'yyyy-MM-dd', new Date());
      if(column.format) {
        value = format(valueDate, column.format);
      } else {
        value = valueDate;
        
      }
    } else {
      console.log("no input")
    }
  } else if (column.type === 'datetime') {
    if (fromInput) {
      // eslint-disable-next-line no-param-reassign
      value = parseISO(value);
    }
  } else if (column.type === 'boolean') {
    // eslint-disable-next-line no-param-reassign
    value = ['y', 'yes', 'true', 't', 'si', 's', '1'].indexOf(value.toLowerCase()) >= 0;
  } else if (column.type === 'currency' || column.type === 'numeric' || column.type === 'percent') {
    const separators = currencyFormatter.format(111111.11).replace(/1/g, '').split('').reverse();
    const decimalSepparator = separators[0];
    // eslint-disable-next-line no-restricted-globals
    const clearValue = +value.split('').filter(val => !isNaN(+val) || val === decimalSepparator).join('');
    // eslint-disable-next-line no-param-reassign
    value = value.startsWith('-') ? clearValue * -1 : clearValue;
  }
  // eslint-disable-next-line no-restricted-globals
  /*if (isNaN(value)) {
    console.log('nnnnn')
    console.log(value);
    throw new Error('Invalid value');
  }*/
  return value;
};


export const parseCellDateTime = (value, column, format) => {
  // eslint-disable-next-line no-param-reassign
  value = parse(value, column.format || format, new Date());
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(value)) {
    throw new Error(`Invalid date format ${format}`);
  }
  return value;
};

export const sameDates = (date1, date2) => {
  if (!date1 && date2) return false;
  if (date1 && !date2) return false;
  if (!date1 && !date2) return true;
  return date1.getFullYear() === date2.getFullYear()
  && date1.getMonth() === date2.getMonth()
  && date1.getDate() === date2.getDate()
  && date1.getHours() === date2.getHours()
  && date1.getMinutes() === date2.getMinutes();
};
