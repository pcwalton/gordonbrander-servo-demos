'use strict';

var containerEl = id('container');
var fpsEl = id('fps');

var COLORS = {
  magenta: '#f27',
  green: '#ad3',
  blue: '#6de'
};

// I guess we don't have window.innerWidth?
var WIDTH = 1000;
var HEIGHT = 1000;
var NUM_PARTICLES = 1500;

// Create a physics instance which uses the Verlet integration method
var physics = new Physics();
physics.integrator = new Verlet();

var mouseRepulsion = new Attraction();
mouseRepulsion.setRadius(200);
mouseRepulsion.strength = -1000;

var mouseAttraction = new Attraction();
mouseAttraction.strength = 200;

var updateForce = function updateForce(x, y) {
  mouseAttraction.target.x = x;
  mouseAttraction.target.y = y;
  mouseRepulsion.target.x = x;
  mouseRepulsion.target.y = y;
};

// Create new particle element and particle object.
var createParticle = function createParticle(x, y) {
  var particle = new Particle(0.1);
  particle.setRadius(random(1, 5));

  var position = new Vector(x, y);
  particle.moveTo(position);

  particle.behaviours.push(mouseAttraction, mouseRepulsion);

  // Init element with some basic styles.
  var element = el(containerEl, 'div', particle.id, { particle: true });
  style(element, {
    background: getRandomValue(COLORS),
    left: px(x),
    top: px(y),
    width: px(particle.radius * 2),
    height: px(particle.radius * 2)
  });

  return particle;
};

sketch({
  element: containerEl,

  setup: function setup() {
    // Create a bunch of particles
    var particles = times(NUM_PARTICLES, function (_) {
      return createParticle(random(0, WIDTH - 10), random(0, HEIGHT - 10));
    });
    physics.particles = particles;

    // Set force to random location to begin with.
    updateForce(random(0, WIDTH - 10), random(0, HEIGHT - 10));
  },

  draw: function draw(t) {
    // Advance physics simulation.
    physics.step();

    physics.particles.forEach(function (particle) {
      pos2d(id(particle.id), particle.pos.x, particle.pos.y);
    });

    text(fpsEl, fps(t, performance.now()));
  },

  // @note Servo does not bubble events or dispatch to `window` or `document` yet.
  // Set listeners directly on element (in this case, `containerEl`).
  mousemove: function mousemove(event) {
    updateForce(event.clientX, event.clientY);
  },

  mousedown: function mousedown(event) {
    mouseRepulsion.setRadius(300);
  },

  mouseup: function mouseup(event) {
    mouseRepulsion.setRadius(200);
  }
});