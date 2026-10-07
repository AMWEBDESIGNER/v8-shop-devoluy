document.body.classList.add('loading');
addEventListener('load', () => setTimeout(() => {
  document.querySelector('.boot').classList.add('done');
  document.body.classList.remove('loading');
}, 650));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => isIntersecting && target.classList.add('on'));
}, { threshold: .13 });
document.querySelectorAll('.reveal,.image-in,.line-reveal').forEach((el) => observer.observe(el));

const html = document.documentElement;
const buttons = document.querySelectorAll('[data-season]');
buttons.forEach((button) => button.addEventListener('click', () => {
  buttons.forEach((b) => b.classList.remove('active'));
  button.classList.add('active');
  html.dataset.season = button.dataset.season;
  const summer = button.dataset.season === 'summer';
  document.querySelector('#gear-label').textContent = summer ? 'VTT / FATBIKE' : 'SKI / SNOW';
  document.querySelector('#terrain-label').textContent = summer ? 'BIKE PARK DÉVOLUY' : '100 KM DE PISTES';
}));

const cursor = document.querySelector('.crosshair');
addEventListener('pointermove', (e) => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; });
document.querySelectorAll('a,button,.range-card').forEach((el) => {
  el.addEventListener('pointerenter', () => cursor.classList.add('hot'));
  el.addEventListener('pointerleave', () => cursor.classList.remove('hot'));
});

const machine = document.querySelector('[data-tilt]');
addEventListener('pointermove', (e) => {
  if (matchMedia('(pointer: coarse)').matches) return;
  const x = (e.clientX / innerWidth - .5) * 16;
  const y = (e.clientY / innerHeight - .5) * -14;
  machine.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
});

addEventListener('scroll', () => {
  document.querySelectorAll('.photo-panel img,.workshop-photo img,.shop-gallery img').forEach((img) => {
    const r = img.parentElement.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) img.style.transform = `scale(1.06) translateY(${r.top * -.018}px)`;
  });
}, { passive: true });

const canvas = document.querySelector('#trail');
const ctx = canvas.getContext('2d');
let points = [];
function size() {
  canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
addEventListener('resize', size); size();
addEventListener('pointermove', (e) => points.push({ x:e.clientX, y:e.clientY, life:1 }));
function draw() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  const color = getComputedStyle(html).getPropertyValue('--active').trim();
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  if (points.length > 1) { ctx.beginPath(); ctx.moveTo(points[0].x,points[0].y); points.forEach(p => { ctx.lineTo(p.x,p.y); p.life -= .025; }); ctx.globalAlpha = Math.max(0,points[0].life); ctx.stroke(); ctx.globalAlpha = 1; }
  points = points.filter(p => p.life > 0).slice(-30);
  requestAnimationFrame(draw);
}
draw();
