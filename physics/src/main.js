const containerEl = document.getElementById('container');

const COLORS = {
  magenta: '#f27',
  green: '#ad3',
  blue: '#6de',
  // purple: '#a8f',
  // yellow: '#ed7'
}

const getRandomKey = (o) => {
  const keys = Object.keys(o);
  const i = Math.floor(Math.random() * keys.length);
  return keys[i];
}

const getRandomValue = (o) => o[getRandomKey(o)];

// I guess we don't have window.innerWidth?
const WIDTH = 1000;
const HEIGHT = 1000;

// Create a physics instance which uses the Verlet integration method
const physics = new Physics();
physics.integrator = new Verlet();

const mouseRepulsion = new Attraction();
mouseRepulsion.setRadius(200);
mouseRepulsion.strength = -1000;

const mouseAttraction = new Attraction();
mouseAttraction.strength = 200;

const collision = new Collision();

// Create new particle element and particle object.
const createParticle = (x, y) => {
  const particle = new Particle(Math.random());
  particle.setRadius(particle.mass * 10);

  const position = new Vector(x, y);
  particle.moveTo(position);

  collision.pool.push(particle);

  particle.behaviours.push(mouseAttraction, mouseRepulsion, collision);

  // Init element with some basic styles.
  const element = el(containerEl, 'div', particle.id, {particle: true});
  style(element, {
    background: getRandomValue(COLORS),
    left: px(x),
    top: px(y),
    width: px(particle.radius * 2),
    height: px(particle.radius * 2)
  });

  return particle;
};

// Create a bunch of particles
const particles = times(1500, _ =>
  createParticle(random(0, WIDTH - 10), random(0, HEIGHT - 10)));

physics.particles = particles;

// @note Servo does not bubble events or dispatch to `window` or `document` yet.
// Set listeners directly on element (in this case, `containerEl`).
on(containerEl, 'mousemove', (event) => {
  mouseAttraction.target.x = event.clientX;
  mouseAttraction.target.y = event.clientY;
  mouseRepulsion.target.x = event.clientX;
  mouseRepulsion.target.y = event.clientY;  
});

loop(() => {
  // Advance physics simulation.
  physics.step();

  physics.particles.forEach(particle => {
    pos(id(particle.id), particle.pos.x, particle.pos.y);
  });
});