/*
©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
*/

// date parse module.

var OEUtils = OEUtils || {};

OEUtils.DateUtils = {
  months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
};

OEUtils.DateUtils.utcDateFormatter = (function () {

  var locale = navigator.language;
  return Intl.DateTimeFormat(locale, {
    timeZone: 'UTC'
  });
})();

OEUtils.DateUtils.parse = function (date, inputFormat) {
  if (typeof date === 'undefined' || date.length < 4) {
    return;
  }
  inputFormat = (inputFormat && inputFormat.toUpperCase()) || 'UK';
  if (inputFormat.indexOf('DD') > inputFormat.indexOf('MM')) {
    inputFormat = 'US';
  }

  var resultDate;
  var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  // separators with date string;
  var separator = '-';

  //replacing all special characters with '-'; and if it contains month name then replace with standard integer value;
  date = date.toLowerCase();
  OEUtils.DateUtils.months.forEach(function (d) {
    if (date.indexOf(d) > -1) {
      date = date.replace(d, months.indexOf(d) + 1);
    }
  });
  date = date.replace(/[^0-9]/g, separator);

  //check if the date is with or without delimiter.
  var withSeperator = (date.indexOf(separator) > -1);

  //if the date is without delimiter then it may be containing some alphabets.
  var isNan = (function (d) {
    return isNaN(d);
  })(date);

  var length = date.length;
  var day = '';
  var month = '';
  var year = '';
  var dateString = '';

  // for US based date format.
  if (inputFormat === 'US') {
    // without any delimiter.
    if (!withSeperator && !isNan) {
      switch (length) {
        // if the length of date is 4 then first letter will be cosidered as month, second for day and rest two for year.
        case 4:
          {
            day = '0' + date.slice(1, 2);
            month = '0' + date.slice(0, 1);
            year = parseInt(date.slice(2, 4)) >= 70 ? '19' + date.slice(2, 4) : '20' + date.slice(2, 4);
            dateString = day + month + year;
            resultDate = setDate(dateString);
            break;
          }

        // if the length of date is 5 or 7 then last two or four letters will be considered as year and first three letters will be checked against month and day eligibility. In case of confusion undefined will be returned.
        case 5:
        case 7:

          if (length === 5) {
            year = parseInt(date.slice(3, 5)) >= 70 ? '19' + date.slice(3, 5) : '20' + date.slice(3, 5);
          } else {
            year = date.slice(3, 7);
          }
          day = '00';
          month = '00';
          var a = parseInt(date.slice(0, 1));
          var b = parseInt(date.slice(1, 2));
          var c = parseInt(date.slice(2, 3));
          var nextTwo = parseInt(date.slice(1, 3));

          if (a >= 2 || (c === 0 && a !== 0) || b > 2) {
            month = '0' + date.slice(0, 1);
            day = date.slice(1, 3);
          } else if (a === 0) {
            month = date.slice(0, 2);
            day = '0' + date.slice(2, 3);
          } else if (a <= 3 && a !== 0 && b === 1 && c <= 2) {
            //conflict = true;
            break;
          } else {
            //conflict = true;
            break;
          }

          dateString = day + month + year;
          resultDate = setDate(dateString);
          break;

        // if the length of date is 6 then first two letters will be cosidered as month, next two for day and rest two for year.
        case 6:
          day = date.slice(2, 4);
          month = date.slice(0, 2);
          year = parseInt(date.slice(4, 6)) >= 70 ? '19' + date.slice(4, 6) : '20' + date.slice(4, 6);
          dateString = day + month + year;
          resultDate = setDate(dateString);
          break;

        // if the length of date is 8 then first two letters will be cosidered as month, next two for day and rest four for year.L
        case 8:
          dateString = date.slice(2, 4) + date.slice(0, 2) + date.slice(4, 8);
          resultDate = setDate(dateString);
          break;

        default:
          break;
      }
    } else if (withSeperator && isNan) {
      var dateArray = split(date, separator);
      var temp = dateArray[0];
      dateArray[0] = dateArray[1];
      dateArray[1] = temp;
      resultDate = setDate(dateArray.join(''));
    }
  } else {
    // for non-US based dates.
    if (!withSeperator && !isNan) {
      switch (length) {
        // if the length of date is 4 then first letter will be considered as day, second for month and rest two for year.
        case 4:
          day = '0' + date.slice(0, 1);
          month = '0' + date.slice(1, 2);
          // if year is of length 2 then add a prefix of 19 if greater than 70 and add 20 if less than 70.
          year = parseInt(date.slice(2, 4)) >= 70 ? '19' + date.slice(2, 4) : '20' + date.slice(2, 4);
          dateString = day + month + year;
          resultDate = setDate(dateString);
          break;

        // if the length of date is 5 or 7 then last two or four letters will be cosidered as year and first three letters will be checked against month and day eligibility. In case of confusion undefined will be returned.
        case 5:
        case 7:
          dateString = '';
          year = '';
          if (length === 5) {
            year = parseInt(date.slice(3, 5)) >= 70 ? '19' + date.slice(3, 5) : '20' + date.slice(3, 5);
          } else if (length === 7) {
            year = date.slice(3, 7);
          }
          day = '00';
          month = '00';
          a = parseInt(date.slice(0, 1));
          b = parseInt(date.slice(1, 2));
          c = parseInt(date.slice(2, 3));
          nextTwo = parseInt(date.slice(1, 3));

          if (a >= 4) {
            day = '0' + date.slice(0, 1);
            month = date.slice(1, 3);
          } else if (c === 0) {
            day = '0' + date.slice(0, 1);
            month = date.slice(1, 3);
          } else if (a <= 3 && a !== 0 && b === 1 && c <= 2) {
            //conflict = true;
            break;
          } else if (nextTwo > 12 || (a >= 0 && b >= 0 && c >= 1)) {
            day = date.slice(0, 2);
            month = '0' + date.slice(2, 3);
          } else {
            //conflict = true;
            break;
          }

          dateString = day + month + year;
          resultDate = setDate(dateString);
          break;
        // if the length of date is 6 then first two letters will be cosidered as day, next two for month and rest two for year.
        case 6:
          day = date.slice(0, 2);
          month = date.slice(2, 4);
          // if year is of length 2 then add a prefix of 19 if greater than 70 and add 20 if less than 70.
          year = parseInt(date.slice(4, 6)) >= 70 ? '19' + date.slice(4, 6) : '20' + date.slice(4, 6);
          dateString = day + month + year;
          resultDate = setDate(dateString);
          break;

        // if the length of date is 8 then first two letters will be cosidered as day, next two for month and rest four for year.
        case 8:
          dateString = date.slice(0, 2) + date.slice(2, 4) + date.slice(4, 8);
          resultDate = setDate(dateString);
          break;

        default:
          break;
      }
    } else if (withSeperator && isNan) {
      // split the date with proper delimiter.
      dateArray = split(date, separator);

      // set the date according to the given day,month and year.
      resultDate = setDate(dateArray.join(''));
    }
  }

  //return parsed date object with appropriate date value.
  return resultDate;
};

OEUtils.DateUtils.format = function (date, format) {
  if (!format) {
    return date;
  }
  if (!date) {
    return '';
  } else if (typeof date === 'number') {
    date = new Date(date);
  } else if (typeof date === 'string') {
    date = new Date(date);
  }
  if (format === 'l') {
    format = 'MM/DD/YYYY';
  }
  return format.replace(/([a-zA-Z]+)/g, function ($1) {
    return getFormat(date, $1);
  });
};

function getFormat(date, format) {
  var abbreviatedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var days = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var abbreviatedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var formats = ["D", "DD", "M", "MM", "MMM", "MMMM", "Y", "YY", "YYYY", "ddd", "dddd"];

  switch (format) {
    case "D":
      return date.getUTCDate();
    case "DD":
      var d = date.getUTCDate();
      return d < 10 ? '0' + d : d;
    case "M":
      return date.getUTCMonth() + 1;
    case "MM":
      var m = date.getUTCMonth() + 1;
      return m < 10 ? '0' + m : m;
    case "MMM":
      return abbreviatedMonths[date.getUTCMonth()];
    case "MMMM":
      return months[date.getUTCMonth()];
    case "Y":
      return date.getUTCFullYear();
    case "YY":
      return date.getUTCFullYear().toString().slice(2, 4);
    case "YYYY":
      return date.getUTCFullYear();
    case "ddd":
    case "DDD":
      return abbreviatedDays[date.getUTCDay()];
    case "dddd":
    case "DDDD":
      return days[date.getUTCDay()];
	default:
	  return '';
  }
}

// setdate sets the date. Accepts 8 character string in ddmmyyyy
function setDate(date) {
  var result;
  if (date && date.length === 8 && !isNaN(date)) {
    var day = parseInt(date.slice(0, 2));
    var month = parseInt(date.slice(2, 4)) - 1;
    var year = parseInt(date.slice(4, 8));

    if (month >= 0 && month <= 11 && day > 0 && day <= 31) {

      //UTC
      result = new Date(Date.UTC(year, month, day));

      //if date is more than number of days in month, the month is incremented.
      if (result.getUTCMonth() !== month || result.getUTCFullYear() !== year) {
        result = undefined;
      }
    }
  }

  //return dateObject .
  return result;
}

// This function will return an array of values which can be interpreted as values of day,month and year for a given date.
function split(date, separator) {
  var dateArray = [];
  dateArray = date.split(separator);

  //if year is in beginning
  if (dateArray[0].length === 4 && dateArray[2].length !== 4) {
    dateArray[1] = dateArray[1] && dateArray[1].length === 1 ? '0' + dateArray[1] : dateArray[1];
    dateArray[2] = dateArray[2] && dateArray[2].length === 1 ? '0' + dateArray[2] : dateArray[2];
    var temp = dateArray[0];
    dateArray[0] = dateArray[2];
    dateArray[2] = temp;
  } else {
    dateArray[0] = dateArray[0] && dateArray[0].length === 1 ? '0' + dateArray[0] : dateArray[0];
    dateArray[1] = dateArray[1] && dateArray[1].length === 1 ? '0' + dateArray[1] : dateArray[1];

    // if year is of length 2 then add a prefix of 19 if greater than 70 and add 20 if less than 70.
    dateArray[2] = (dateArray[2] && dateArray[2].length === 2) ? (parseInt(dateArray[2]) >= 70 ? '19' + dateArray[2] : '20' + dateArray[2]) : dateArray[2];
  }
  return dateArray;
}
