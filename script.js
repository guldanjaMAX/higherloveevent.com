// Navbar scroll behavior
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Fade-in on scroll (with immediate visibility for above-the-fold elements)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-in').forEach(el => {
  // If element is already in viewport on page load, show it immediately
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add('visible');
  }
  observer.observe(el);
});

// Hero ember particles
(function() {
  var field = document.getElementById('ember-field');
  if (!field) return;
  var colors = ['#D4A544', '#C47B2B', '#E8963E', '#A07F56'];
  for (var i = 0; i < 20; i++) {
    var p = document.createElement('div');
    p.className = 'ember-particle';
    var size = (1.5 + Math.random() * 3) + 'px';
    p.style.left = (40 + Math.random() * 55) + '%';
    p.style.bottom = (-5 + Math.random() * 20) + '%';
    p.style.width = size;
    p.style.height = size;
    p.style.animationDuration = (4 + Math.random() * 6) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    field.appendChild(p);
  }
})();

// Cookie consent banner
(function() {
  if (localStorage.getItem('hl_cookie_consent')) return;

  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = '<div class="cookie-inner">' +
    '<p>We use minimal cookies to ensure this site functions properly. By continuing to browse, you accept our use of cookies. See our <a href="/privacy.html">Privacy Policy</a> for details.</p>' +
    '<div class="cookie-actions">' +
    '<button id="cookie-accept" class="cookie-btn cookie-btn-accept">Accept</button>' +
    '<button id="cookie-decline" class="cookie-btn cookie-btn-decline">Decline</button>' +
    '</div></div>';
  document.body.appendChild(banner);

  document.getElementById('cookie-accept').addEventListener('click', function() {
    localStorage.setItem('hl_cookie_consent', 'accepted');
    banner.classList.add('cookie-hidden');
    setTimeout(function() { banner.remove(); }, 400);
  });

  document.getElementById('cookie-decline').addEventListener('click', function() {
    localStorage.setItem('hl_cookie_consent', 'declined');
    banner.classList.add('cookie-hidden');
    setTimeout(function() { banner.remove(); }, 400);
  });
})();
