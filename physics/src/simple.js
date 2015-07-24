const bodyEl = document.querySelector('body');

// Create new particle element and particle object.
const createParticle = () => {
  // Init element with some basic styles.
  const element = el(bodyEl, 'div', '', {particle: true});
};

// Create a bunch of particles
const particles = times(1000, createParticle);
