import $ from 'jquery';

export default class Cal {
  constructor(year = 2020, holidayArr) {
    this.year = year;
    this.nameMonth = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    this.holiday = [
      ...holidayArr
    ]
  }
  dayInMonth(year, numbMonth) {
    let date = new Date(year, numbMonth + 1, 0);
    return date.getDate();
  }
  preBuildDay(numbMonth) {
    let count = 1;
    let firstDate = new Date(this.year, numbMonth, 1);
    let stopCount = firstDate.getDay() == 0 ? 7 : firstDate.getDay();
    let bCal = '';
    let iClass = 'employ-cal-item ';
    while(count < stopCount) {
      bCal += `<div class="${iClass}">&nbsp;</div>`;
      count++;
    }
    return bCal;
  }
  buildDay(numbMonth) {
    let count = 1;
    let dayInMonth = this.dayInMonth(this.year, numbMonth);
    let bCal = '';
    let holiday = this.holiday.map(el => el.getTime());
    let curDate = new Date();
    curDate = curDate.setHours(0, 0, 0, 0);

    while(count <= dayInMonth) {
      let iClass = 'employ-cal-item ';
      let countDate = new Date(this.year, numbMonth, count);
      let lastYear = new Date((this.year-1), 11, 31);
      let calcDay = (countDate.getTime() - lastYear.getTime()) / 86400000;
      if(countDate.getDay() == 0 || countDate.getDay() == 6 ) {
        iClass += 'output ';
      }
      if(countDate.getDay() == 0) {
        iClass += 'sunday ';
      }
      if(holiday.indexOf(countDate.getTime()) != -1 ) {
        iClass += 'holiday ';
      }
      if(curDate == countDate.getTime()) {
        iClass += 'curDate ';
      }
      if(curDate > countDate.getTime()) {
        iClass += 'noActive ';
      }
      if((curDate <= countDate.getTime() && countDate.getDay() != 0) && (curDate <= countDate.getTime() && countDate.getDay() != 6) && (curDate <= countDate.getTime() && holiday.indexOf(countDate.getTime()) == -1 )) {
        iClass += 'choice ';
      }
      bCal += `<div class="${iClass}" data-day="${countDate.getTime()}" id="employ-day-${calcDay}">
        <div>${countDate.getDate()}</div>
      </div>`;
      count++;
    }
    return bCal;
  }
  buildCalMonth(count) {
    let curDate = new Date();
    let curMonth = curDate.getMonth();
    let sDate = new Date(this.year, count);
    let sMonth = sDate.getMonth();
    let calClass;
    if(sMonth < curMonth) {
      calClass = 'dasabled'
    } else {
      calClass = 'isActive'
    }
    let bCal = `<div class="employ-cal-col ${calClass}">
    <div class="employ-cal-h">${this.nameMonth[count]}</div>
    <div class="employ-cal-year">${this.year}</div>
    <div class="employ-cal">
      ${this.preBuildDay(count) + this.buildDay(count)}
    </div></div>`;
    $('#employCalc').append(bCal);
  }
  buildCal() {
    for(let i = 0; i < 12; i++) {
      this.buildCalMonth(i);
    }
  }
}