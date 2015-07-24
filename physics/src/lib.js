const loop = (callback) => {
  var next = true;

  const tick = (t) => {
    callback();
    if (next) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  return () => next = false;
};

// Do something `n` times, calling `a2b` with index.
// Results are collected into an array.
const times = (n, a2b) => {
  const results = [];
  for (var i = 0; i < n; i++) {
    results.push(a2b(i));
  };
  return results;
};

const reducekv = (object, next, value) => {
  var keys = Object.keys(object);
  for (var i = 0; i < keys.length; i++)
    value = next(value, keys[i], object[keys[i]]);
  return value;
};

const set = (o, k, v) => {
  o[k] = v;
  return o;
};

const mix = (a, b) => reducekv(b, set, a);

// Set attributes on an element.
const attr = (element, k, v) => {
  if (v) {
    element.setAttribute(k, v);
  } else {
    element.removeAttribute(k);
  }
  return element;
};

const attrs = (element, attributes) =>
  reducekv(attributes, attr, element);

// Mutate element styles, returning element.
const style = (element, styles) => mix(element.style, styles);

const classname = (element, name, isSet) => {
  if (isSet) {
    element.classList.add(name);
  } else {
    element.classList.remove(name);
  }
  return element;
}

const classnames = (element, classset) =>
  reducekv(classset, classname, element);

// @TODO memoization
const id = (x) => document.getElementById(x);

const px = (n) => n + 'px';

// Create and append an element to parent. Returns an element.
const el = (parent, kind, id, classset) => {
  const child = document.createElement(kind);
  attr(child, 'id', id);
  if (classset) classnames(child, classset);
  parent.appendChild(child);
  return child;
};

const on = (element, event, callback) => {
  element.addEventListener(event, callback);
  return () => element.removeEventListener(event, callback);
};

const pos = (element, l, t) => style(element, {
  left: Math.floor(l) + 'px',
  top: Math.floor(t) + 'px'
});

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
