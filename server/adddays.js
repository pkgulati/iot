var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var isleap = function(year) {
  if (year % 100 == 0) {
    return year % 400 == 0;
  } else {
    return year % 4 == 0;
  }
};

var daysinmonth = function(month, year) {
  if (month == 2) {
    return days[month - 1] + (isleap(year) ? 1 : 0);
  } else {
    return days[month - 1];
  }
};

var d1 = 1;
var m1 = 2;
var y1 = 2001;

d1 = d1 - 365 ;

var md = daysinmonth(m1, y1);
while (d1 > md) {
  d1 = d1 - md;
  m1++;
  if (m1 > 12) {
    m1 = 1;
    y1++;
  }
  md = daysinmonth(m1, y1);
}

while (d1 < 1) {
    m1--;
    if (m1 < 1) {
        m1 = 12;
        y1--;
    }
    md = daysinmonth(m1, y1);
    d1 = d1 + md;
  }

console.log(d1, m1, y1);

