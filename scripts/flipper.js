'use strict';

loop(function (frames) {
  if (frames % 100 === 0) getJson('json.json').then(function (json) {
    return console.log(json);
  });
});