import $ from 'jquery';

export default function detectTouch() {
  let isTouch = ('ontouchstart' in document.documentElement);
  return isTouch;
}