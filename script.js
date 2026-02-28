// Navbar scroll behavior
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

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
