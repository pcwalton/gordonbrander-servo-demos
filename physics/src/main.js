const containerEl = document.getElementById('container');

const COLORS = {
  magenta: '#f27',
  green: '#ad3',
  blue: '#6de',
}

// I guess we don't have window.innerWidth?
const WIDTH = 1000;
const HEIGHT = 1000;
const NUM_PARTICLES = 1500;

const stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms, 2: mb
style(stats.domElement, {right: px(0), top: px(0)});
containerEl.appendChild(stats.domElement);

// Create a physics instance which uses the Verlet integration method
const physics = new Physics();
physics.integrator = new Verlet();

const mouseRepulsion = new Attraction();
mouseRepulsion.setRadius(200);
mouseRepulsion.strength = -1000;

const mouseAttraction = new Attraction();
mouseAttraction.strength = 200;

// Create new particle element and particle object.
const createParticle = (x, y) => {
  const particle = new Particle(Math.random());
  particle.setRadius(particle.mass * 10);

  const position = new Vector(x, y);
  particle.moveTo(position);

  particle.behaviours.push(mouseAttraction, mouseRepulsion);

  // Init element with some basic styles.
  const element = el(containerEl, 'div', particle.id, {particle: true});
  style(element, {
    background: getRandomValue(COLORS),
    transform: translate3d(px(x), px(y), px(0)),
    width: px(particle.radius * 2),
    height: px(particle.radius * 2)
  });

  return particle;
};

// Create a bunch of particles
const particles = times(NUM_PARTICLES, _ =>
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
  stats.begin();

  // Advance physics simulation.
  physics.step();

  physics.particles.forEach(particle => {
    pos3d(id(particle.id), particle.pos.x, particle.pos.y, -1 * particle.vel.magSq());
  });

  stats.end();
});