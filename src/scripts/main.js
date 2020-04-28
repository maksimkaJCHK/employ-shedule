import $ from 'jquery';
import Cal from './modules/cal';
import Logic from './modules/logic';
import detectTouch from './modules/detectTouch.js';
import './libraries/jquery.mCustomScrollbar.concat.min.js';

let holiday = [
  new Date(2020, 0, 1),
  new Date(2020, 0, 2),
  new Date(2020, 0, 3),
  new Date(2020, 0, 6),
  new Date(2020, 0, 7),
  new Date(2020, 0, 8),
  new Date(2020, 1, 24),
  new Date(2020, 2, 9),
  new Date(2020, 4, 1),
  new Date(2020, 4, 4),
  new Date(2020, 4, 5),
  new Date(2020, 4, 11),
  new Date(2020, 5, 12),
  new Date(2020, 10, 4),
];

let scrollParam = {
  theme: 'styleScrollTheme',
  autoHideScrollbar: false,
  scrollButtons:{
    enable: false,
    scrollAmount: '10px'
  },
  mouseWheel:{
    scrollAmount: '100px'
  },
  keyboard: {
    scrollAmount: '10px'
  },
  contentTouchScroll: true,
  scrollInertia: 1000,
  scrollEasing: "easeOut",
}

let cal = new Cal(2020, holiday);
cal.buildCal();

if($('.employ-step-1 .employ-ov').length) {
  $('.employ-step-1 .employ-ov').mCustomScrollbar({
    ...scrollParam
  });
}

if($('.employ-step-3 .employ-ov').length) {
  let scrollOvCal = $('.employ-cal-col.isActive').eq(0).position().top;
  $('.employ-step-3 .employ-ov').mCustomScrollbar({
    ...scrollParam,
    setTop: (scrollOvCal-100+'px')
  });
}

let isToush = detectTouch();
if(isToush) {
  let calcHBlock = function() {
    $('.employ-step-1').css('height', $('#employFix').height());
    $('.employ-step-3').css('height', $('#employFix').height());
    $('.employ-step-2').css('min-height', $('#employFix').height());
  }
  $('body').append("<div class='employ-fix' id='employFix'>&nbsp;</div>");
  calcHBlock();
  $(window).on('resize orientationchange', function() {
    calcHBlock();
  });
}

let logic = new Logic(2020, holiday);
logic.init();