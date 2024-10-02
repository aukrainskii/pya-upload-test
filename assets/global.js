"use strict";

function debounce(fn, wait) {
  var _this = this;
  let t;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(t);
    t = setTimeout(() => fn.apply(_this, args), wait);
  };
}
if (typeof window.Shopify == 'undefined') {
  window.Shopify = {};
}
function showFullReview(elem) {
  if (!elem.parentNode.hasAttribute("data-full-text")) return;
  elem.parentNode.innerHTML = elem.parentNode.getAttribute("data-full-text");
}
function findHeadingById(id) {
  const heading = document.getElementById(id);
  if (heading) {
    return heading;
  }
  return null;
}
let subscribers = {};
function subscribe(eventName, callback) {
  if (subscribers[eventName] === undefined) {
    subscribers[eventName] = [];
  }
  subscribers[eventName] = [...subscribers[eventName], callback];
  return function unsubscribe() {
    subscribers[eventName] = subscribers[eventName].filter(cb => {
      return cb !== callback;
    });
  };
}
function publish(eventName, data) {
  if (subscribers[eventName]) {
    subscribers[eventName].forEach(callback => {
      callback(data);
    });
  }
}