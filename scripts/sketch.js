'use strict';

var on = function on(element, event, callback) {
  element.addEventListener(event, callback);
  return element;
};

var off = function off(element, event, callback) {
  element.addEventListener(event, callback);
  return element;
};

// Bind an event handler for a list of events to an element.
/*
Usage:

  const off = events(el, {
    mousedown(event) {
      ...
    },
    mouseup(event) {
      ...
    }
  });
*/
var events = function events(element, _events) {
  reducekv(_events, on, element);
  // Call this function to detach listeners
  return function () {
    return reducekv(_events, off, element);
  };
};

var subset = function subset(object, keys) {
  return keys.reduce(function (out, key) {
    return object[key] != null ? set(object, key, object[key]) : out;
  }, {});
};

var EVENTS = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseleave', 'mouseout', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];

// A component that calls a draw function every animationFrame.
var sketch = function sketch(element, options) {
  // Bind all events
  var off = events(element, subset(options, EVENTS));

  // Loop draw
  var halt = loop(function (t) {
    return option.draw(element, t);
  });

  // Return teardown function.
  return function () {
    halt();
    off();
  };
};