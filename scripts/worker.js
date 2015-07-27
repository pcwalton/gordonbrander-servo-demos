"use strict";

var particles = function particles() {
  var physics = new Physics();
  physics.integrator = new Verlet();

  var mouseRepulsion = new Attraction();
  mouseRepulsion.setRadius(200);
  mouseRepulsion.strength = -1000;

  var mouseAttraction = new Attraction();
  mouseAttraction.strength = 200;
};