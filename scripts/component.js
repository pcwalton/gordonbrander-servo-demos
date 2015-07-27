'use strict';

var EVENTS = ['click', 'mousedown', 'mouseup', 'mousemove', 'mouseleave', 'mouseout', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];

var Component = function Component(options) {
  return function (element) {
    // Bind event handler to element
    var off = onAny(element, EVENTS, function (event) {
      if (options[event.type]) options[event.type](event);
    });

    // Return teardown function.
    return function () {
      halt();
      off();
    };
  };
};

var draw = function draw(component) {
  if (component.setup) requestAnimationFrame(component.setup);
  return loop(component.draw);
};