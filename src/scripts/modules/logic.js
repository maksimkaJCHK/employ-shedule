import $ from 'jquery';

export default class Logic {
  constructor(year = 2020, holiday) {
    let transformHoliday = holiday.map(el => el.getTime());
    let curDate = new Date();
    curDate.setHours(0, 0, 0, 0);

    this.year = year;
    this.buildCalObj = [];
    this.tempObj = [];
    this.repaintObj = [];
    this.curDate = curDate;
    this.calcVacationkDay = 0;
    this.startPoint = null;
    this.stopPoint = null;
    this.idItem = null;
    this.holiday = transformHoliday;
    this.errorsText = [
      'До начала отпуска менее 3х дней. Можно не успеть рассчитать и выплатить отпускные.',
      'Отпуск менее 14 дней.',
      'Отпуск длиннее, чем остаток дней.'
    ];
    this.errors = {
      vacationBefore: null,
      vacationLess: null,
      vacationLonger: null,
    };

    this.calcDay = this.calcDay.bind(this);
    this.paintActiveDay = this.paintActiveDay.bind(this);
    this.paintOfArray = this.paintOfArray.bind(this);
    this.afterPaint = this.afterPaint.bind(this);
    this.buildChoseBut = this.buildChoseBut.bind(this);
    this.choseButTemplate  = this.choseButTemplate.bind(this);
  }
  closePopup() {
    $('#employPop').fadeOut();
    $('#employWrap').css('left', '0');
  }
  moveBlock(x) {
    $('#employWrap').stop().animate({left: x}, 300);
  }
  calcDay(x) {
    let curTime = new Date(Number(x));
    let lastYear = new Date((this.year - 1), 11, 31);
    return (curTime.getTime() - lastYear.getTime()) / 86400000;
  }
  clearActiveDay() {
    $('#employCalc .vacation.first').removeClass('first');
    $('#employCalc .vacation.last').removeClass('last');
    $('#employCalc .vacation').removeClass('vacation');
  }
  paintActiveDay(startPoint, stopPoint) {
    for(let i = startPoint, count = 0; i <= stopPoint; i++, count++) {
      let dayClass = 'vacation';
      if(count == 0) {
        dayClass += ' first';
      }
      if(i == stopPoint) {
        dayClass += ' last';
      }
      let item = $(`#employ-day-${i}`);
      item.addClass(dayClass);
    }
  }

  paintOfArray(x) {
    x.map((el) => {
      let startPoint = this.calcDay(el.start);
      let stopPoint = this.calcDay(el.stop);
      this.paintActiveDay(startPoint, stopPoint);
    });
    this.buildCalObj = x;
  }

  choseButTemplate(x = 'Выберите дату', y = 'Выберите дату', z = null) {
    let temp = `
      <div class="employ-chose-item start ${z}">
        <div class="employ-chose-title">
          Дата начала отпуска
        </div>
        <div class="employ-chose-date">
          ${x}
        </div>
      </div>
      <div class="employ-chose-item end ${z}">
        <div class="employ-chose-title">
          Дата конца отпуска
        </div>
        <div class="employ-chose-date">
          ${y}
        </div>
      </div>
    `;
    return temp;
  }

  buildChoseBut(start, stop, curDate) {
    let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let startD = new Date(Number(start));
    let stopD = new Date(Number(stop));
    let curD = new Date(curDate);
    let choseButTemplate = this.choseButTemplate;
    let classBut = '';

    let startDate = startD.getDate();
    let stopDate = stopD.getDate();

    let startMonth = startD.getMonth();
    let stoptMonth = stopD.getMonth();

    let startYear = startD.getFullYear();
    let stopYear = stopD.getFullYear();

    if(startD < curD) {
      classBut = ' noActive';
    }
    let buildBut = choseButTemplate(`${startDate} ${months[startMonth]} ${startYear}`, `${stopDate} ${months[stoptMonth]} ${stopYear}`, `${classBut}`);

    $('#employChose').append(buildBut);
  }

  afterPaint() {
    let curDate = this.curDate;
    let buildChoseBut = this.buildChoseBut;
    let calcVacationkDay = this.calcVacationkDay;
    let calcDay = this.calcDay;
    let holiday = this.holiday;
    let choseButTemplate  = this.choseButTemplate;
    let dt = new Date((this.year - 1), 11, 31);
    let errorsText = this.errorsText;
    let errors = this.errors;
    calcVacationkDay = 0;
    errors.vacationBefore = null;
    errors.vacationLess = null;
    errors.vacationLonger = null;
    $('#employChose').html('');
    this.buildCalObj.map((el) => {
      let start = calcDay(el.start);
      let stop = calcDay(el.stop);
      let cDate = calcDay(curDate);
      let iDate = calcDay(el.time);
      let dayInPeriod = 0;
      if(cDate == iDate && (start - cDate) < 3) {
        errors.vacationBefore = errorsText[0];
      }

      for(let i = start, day = start; i <= stop; i++, day++) {
        let transM = day*86400000 + dt.getTime();
        if(holiday.indexOf(transM) == -1) {
          calcVacationkDay++;
          dayInPeriod++;
        }
      }
      if(dayInPeriod < 14 && el.time >= curDate) {
        errors.vacationLess = errorsText[1];
      }
      if(calcVacationkDay > 28 && el.time >= curDate) {
        errors.vacationLonger = errorsText[2];
      }

      buildChoseBut(el.start, el.stop, curDate);
    });

    if(errors.vacationBefore || errors.vacationLess || errors.vacationLonger) {

      let vacationBefore = errors.vacationBefore ? `<div class="employ-errors-title">${errors.vacationBefore}</div>` : '';
      let vacationLess = errors.vacationLess ? `<div class="employ-errors-title">${errors.vacationLess}</div>` : '';
      let vacationLonger = errors.vacationLonger ? `<div class="employ-errors-title">${errors.vacationLonger}</div>` : '';
      $('#employErrors').removeClass('disabled').html(vacationBefore + vacationLonger + vacationLess );
    } else {
      $('#employErrors').addClass('disabled');
    }

    if(calcVacationkDay < 28) {
      let emptyBut = choseButTemplate();
      $('#employChose').append(emptyBut);
    }
    $('.employ-chose-day span').html(calcVacationkDay);
  }

  init() {
    let {moveBlock, buildCalObj, afterPaint, startPoint, stopPoint, clearActiveDay, paintOfArray, tempObj, curDate, calcDay, repaintObj, calcVacationkDay, closePopup, idItem} = this;
    $('#combackStep-1').on('click', function() {
      moveBlock('0');
    });
    $('.employ-chose').on('click', '.employ-chose-item', function() {
      if(!$(this).hasClass('noActive')) {
        let scrollOvCal = $('.employ-cal-col.isActive').eq(0).position().top;
        $('.employ-step-3 .employ-ov').mCustomScrollbar("scrollTo", scrollOvCal);
        moveBlock('-200%');
      }
    });
    $('#combackStep-2').on('click', function() {
      stopPoint = null;
      startPoint = null;
      moveBlock('-100%');
    });
    $('#saveDay').on('click', function() {
      let self = $(this);
      if(!self.hasClass('disabled')) {
        buildCalObj = [
          ...tempObj
        ];
        repaintObj = [
          ...tempObj
        ];
        tempObj = [];
        $(this).addClass('disabled');
        startPoint = null,
        stopPoint = null;
        $('#issueVacation').removeClass('disabled');
        afterPaint();
      }
      return false;
    });
    $('#issueVacation').on('click', function() {
      let self = $(this);
      if(!self.hasClass('disabled')) {
        $('#employPop').fadeIn();
        let newAttr = JSON.stringify(buildCalObj);
        calcVacationkDay = $('.employ-chose-day span').text();
        $(`#employList [data-id="${idItem}"]`).attr({'data-vacation': newAttr, 'data-day': calcVacationkDay}).find('.employ-list-numb').html(calcVacationkDay);
        $('#issueVacation, #saveDay').addClass('disabled');
        console.log(newAttr);
        
        setTimeout(closePopup, 10000);
      }
      return false;
    });
    $('.employ-cal .choice, .employ-cal .sunday').on('click', function() {
      let self = $(this);
      let examplePaint;

      let isDiap = repaintObj.filter((el) => {
        let startD = calcDay(el.start);
        let stopD = calcDay(el.stop);
        let cDiap = calcDay(self.data('day'));
        if(cDiap >= startD && cDiap <= stopD) {
          return el;
        }
      });

      if(isDiap.length) {
        let cDiap = calcDay(self.data('day'));

        let examplePaint = repaintObj.filter((el) => {
          let startD = calcDay(el.start);
          let stopD = calcDay(el.stop);
          if(cDiap >= startD && cDiap <= stopD) {
            return false;
          } else {
            return el;
          }
        });

        clearActiveDay();
        repaintObj = [...examplePaint];
        paintOfArray(repaintObj);
        tempObj = [...repaintObj];
        $('#saveDay').removeClass('disabled');
        startPoint = null;
        stopPoint = null;
        return false;
      }
      if(!self.hasClass('sunday') || startPoint) {

        tempObj = [];
        stopPoint = (stopPoint != self.data('day') && startPoint && startPoint != self.data('day'))
          ? self.data('day')
          : null;
        if(!stopPoint) {
          startPoint = (startPoint != self.data('day') && !stopPoint)
            ? self.data('day')
            : null;
        }
        if(startPoint) {
          $('#saveDay').removeClass('disabled');
        } else {
          $('#saveDay').addClass('disabled');
        }

        if(startPoint && !stopPoint) {
          clearActiveDay();
          examplePaint = [
            ...repaintObj,
            {
              start: startPoint,
              stop: startPoint,
              time: curDate.getTime()
            }
          ];
          tempObj = [
            ...repaintObj,
            {
              start: startPoint,
              stop: startPoint,
              time: curDate.getTime()
            }
          ];
          paintOfArray(examplePaint);
        }

        if(!startPoint) {
          clearActiveDay();
          examplePaint = [
            ...repaintObj
          ];
          tempObj = [
            ...repaintObj
          ];
        }

        if(startPoint && stopPoint) {
          clearActiveDay();
          if(stopPoint < startPoint) {
            [startPoint, stopPoint] = [stopPoint, startPoint];
          }
          examplePaint = [
            ...repaintObj,
            {
              start: startPoint,
              stop: stopPoint,
              time: curDate.getTime()
            }
          ];
          tempObj = [
            ...repaintObj,
            {
              start: startPoint,
              stop: stopPoint,
              time: curDate.getTime()
            }
          ];
          paintOfArray(examplePaint);
          startPoint = null;
          stopPoint = null;
        }
      }
    });
    $('.employ-list li').on('click', function() {
      let self = $(this);
      let name = self.find('.exploy-list-name').text();
      let vacationObj = JSON.parse(self.attr('data-vacation'));

      buildCalObj = vacationObj;
      repaintObj = vacationObj;
      clearActiveDay();
      paintOfArray(buildCalObj);
      afterPaint();
      $('.employ-step-name').html(name);
      idItem = self.data('id');
      $('#issueVacation, #saveDay').addClass('disabled');
      moveBlock('-100%');
    });
  }
}