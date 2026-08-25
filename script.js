gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector('.progress span');
const glow = document.querySelector('.cursor-glow');

window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.width = `${h > 0 ? Math.max(0, Math.min(100, (scrollY / h) * 100)) : 0}%`;
}, { passive: true });

if (glow && !reduce) {
  window.addEventListener('pointermove', e => {
    gsap.to(glow, { x: e.clientX, y: e.clientY, duration: .55, ease: 'power3.out' });
  }, { passive: true });
}

if (!reduce) {
  gsap.to('.hero-symbol', { y: -12, rotation: 1.2, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.r1', { rotation: 360, duration: 42, repeat: -1, ease: 'none' });
  gsap.to('.r2', { rotation: -360, duration: 58, repeat: -1, ease: 'none' });
  gsap.to('.trail-a', { x: -34, opacity: .16, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.trail-b', { x: -62, opacity: .09, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.trail-c', { x: -95, opacity: .05, duration: 4.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  gsap.to('.hero-copy', { y: -70, opacity: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
  gsap.to('.hero-symbol-wrap', { y: 85, scale: 1.08, rotation: 3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });

  const reveals = [
    ['.manifesto-lead', { x: -90, opacity: 0, filter: 'blur(8px)' }],
    ['.manifesto-body', { x: 90, opacity: 0, filter: 'blur(8px)' }],
    ['.project-wrap', { y: 100, scale: .94, opacity: 0, filter: 'blur(12px)' }],
    ['.invite-wrap', { y: 80, scale: .96, opacity: 0, filter: 'blur(10px)' }],
    ['.final-copy', { x: -90, opacity: 0 }]
  ];
  reveals.forEach(([target, from]) => {
    gsap.from(target, { ...from, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: target, start: 'top 84%', once: true } });
  });

  gsap.utils.toArray('.process-card').forEach((card, i) => {
    gsap.from(card, { y: 70, rotationX: 7, scale: .97, opacity: 0, duration: .9, delay: i * .06, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
  });

  gsap.to('.motion-word', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  gsap.to('.manifesto-orbit span:nth-child(1)', { xPercent: 16, yPercent: -8, rotation: 7, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  gsap.to('.manifesto-orbit span:nth-child(2)', { xPercent: -18, yPercent: 9, rotation: -8, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });

  gsap.utils.toArray('.tunnel-x').forEach((el, i) => {
    gsap.fromTo(el, { scale: .8 + i * .08, rotation: -5 + i * 2, opacity: .02 }, { scale: 1.16 + i * .08, rotation: 5 - i * 2, opacity: .08 - i * .01, ease: 'none', scrollTrigger: { trigger: '.project', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  });

  gsap.to('.redacted span', { boxShadow: '0 0 32px rgba(255,77,0,.48)', repeat: -1, yoyo: true, duration: 1.7, stagger: .09 });
  gsap.to('.p1', { rotation: 360, duration: 42, repeat: -1, ease: 'none' });
  gsap.to('.p2', { rotation: -360, duration: 34, repeat: -1, ease: 'none' });
  gsap.to('.p3', { rotation: 360, duration: 24, repeat: -1, ease: 'none' });
  gsap.to('.portal', { y: -55, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.invite', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  gsap.to('.final-x', { xPercent: -10, rotation: 4, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
}

const form = document.querySelector('#earlyForm');
const msg = document.querySelector('#formMessage');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email) return;
    localStorage.setItem('ignyxx_early_access_email', email);
    if (msg) msg.textContent = "You're in. Watch your inbox — 001 won't stay hidden forever.";
    form.reset();
    if (msg && !reduce) gsap.fromTo(msg, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .5 });
  });
}

window.addEventListener('load', () => ScrollTrigger.refresh());
