// Fade-in on scroll
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.15 };

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('show');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));


// === Particle Background ===
const canvas = document.getElementById("bg-particles");
const ctx = canvas.getContext("2d");
let particlesArray = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const mouse = { x: null, y: null, radius: 150 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - distance) / mouse.radius;
        this.x += Math.cos(angle) * force * 4;
        this.y += Math.sin(angle) * force * 4;
      }
    }
  }
  draw() {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  const numParticles = 150;
  for (let i = 0; i < numParticles; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    particlesArray.push(new Particle(x, y));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// === 3D Card Tilt Effect (All .card elements) ===
document.querySelectorAll('.card').forEach($card => {
  let bounds;

  function rotateToMouse(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2
    };
    const distance = Math.sqrt(center.x**2 + center.y**2);

    $card.style.transform = `
      scale3d(1.07, 1.07, 1.07)
      rotate3d(
        ${center.y / 100},
        ${-center.x / 100},
        0,
        ${Math.log(distance) * 2}deg
      )
    `;

    $card.querySelector('.glow').style.backgroundImage = `
      radial-gradient(
        circle at
        ${center.x * 2 + bounds.width/2}px
        ${center.y * 2 + bounds.height/2}px,
        #ffffff55,
        #0000000f
      )
    `;
  }

  $card.addEventListener('mouseenter', () => {
    bounds = $card.getBoundingClientRect();
    document.addEventListener('mousemove', rotateToMouse);
  });

  $card.addEventListener('mouseleave', () => {
    document.removeEventListener('mousemove', rotateToMouse);
    $card.style.transform = '';
    $card.querySelector('.glow').style.backgroundImage = '';
  });
});


// === Scroll to Top Button ===
const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("visible");
  } else {
    scrollToTopBtn.classList.remove("visible");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {
  const emailInput = contactForm.querySelector('#email');
  const emailValue = emailInput.value.trim();

  // Simple regex for email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(emailValue)) {
    e.preventDefault(); // stop form submission
    alert('Please enter a valid email address.');
    emailInput.focus();
  }
});

const $aboutCard = document.querySelector('.about-card');
let aboutBounds;

function rotateAboutCard(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const leftX = mouseX - aboutBounds.x;
  const topY = mouseY - aboutBounds.y;
  const center = {
    x: leftX - aboutBounds.width / 2,
    y: topY - aboutBounds.height / 2
  };
  const distance = Math.sqrt(center.x**2 + center.y**2);

  $aboutCard.style.transform = `
    scale3d(1.07, 1.07, 1.07)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 2}deg
    )
  `;

  $aboutCard.querySelector('.glow').style.backgroundImage = `
    radial-gradient(
      circle at
      ${center.x * 2 + aboutBounds.width/2}px
      ${center.y * 2 + aboutBounds.height/2}px,
      #ffffff55,
      #0000000f
    )
  `;
}

$aboutCard.addEventListener('mouseenter', () => {
  aboutBounds = $aboutCard.getBoundingClientRect();
  document.addEventListener('mousemove', rotateAboutCard);
});

$aboutCard.addEventListener('mouseleave', () => {
  document.removeEventListener('mousemove', rotateAboutCard);
  $aboutCard.style.transform = '';
});
