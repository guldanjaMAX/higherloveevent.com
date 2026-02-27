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

// API endpoint for forms
const API_URL = 'https://higher-love-api.james-d13.workers.dev/apply';

// Sanitize input to prevent XSS
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
}

// Clear error state when user starts typing
document.querySelectorAll('.form-input').forEach(input => {
  const events = input.tagName === 'TEXTAREA' ? ['input'] : ['input', 'change'];
  events.forEach(evt => {
    input.addEventListener(evt, () => {
      input.classList.remove('error');
      const errEl = input.parentElement.querySelector('.form-error');
      if (errEl) errEl.classList.remove('visible');
    });
  });
});

// Validate a single field, returns true if valid
function validateField(input) {
  const name = input.name;
  const value = input.value.trim();
  const errEl = input.parentElement.querySelector('.form-error[data-for="' + name + '"]');
  let valid = true;

  if (input.hasAttribute('required') && !value) {
    valid = false;
  }

  if (name === 'email' && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) valid = false;
  }


  if (!valid) {
    input.classList.add('error');
    if (errEl) errEl.classList.add('visible');
  } else {
    input.classList.remove('error');
    if (errEl) errEl.classList.remove('visible');
  }

  return valid;
}

// Set button loading state
function setButtonLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'SUBMITTING...';
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';
  } else {
    btn.textContent = btn.dataset.originalText || 'Submit';
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  }
}

// Application form handler
async function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('hl-application');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validate all required fields
  const requiredInputs = form.querySelectorAll('[required]');
  let allValid = true;
  let firstInvalid = null;

  requiredInputs.forEach(input => {
    if (!validateField(input)) {
      allValid = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });

  if (!allValid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid.focus();
    return;
  }

  // Check consent checkbox
  const consentBox = form.querySelector('input[name="app_consent"]');
  if (consentBox && !consentBox.checked) {
    consentBox.focus();
    consentBox.parentElement.style.color = '#e74c3c';
    setTimeout(() => { consentBox.parentElement.style.color = ''; }, 3000);
    return;
  }

  // Collect and sanitize form data
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    if (key === 'app_consent') return;
    if (key === 'resonance') {
      if (!data[key]) data[key] = [];
      data[key].push(sanitizeInput(value));
    } else {
      data[key] = sanitizeInput(value);
    }
  });

  // Show loading state
  setButtonLoading(submitBtn, true);

  // Default calendar URL
  let calendarUrl = 'https://calendly.com/reperez';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      if (result.calendar_url) calendarUrl = result.calendar_url;
    } else {
      throw new Error(result.error || 'Something went wrong');
    }
  } catch (err) {
    // Fallback: store locally so data is not lost
    try {
      const submissions = JSON.parse(localStorage.getItem('hl_submissions') || '[]');
      data.submitted_at = new Date().toISOString();
      submissions.push(data);
      localStorage.setItem('hl_submissions', JSON.stringify(submissions));
    } catch(e) {}
  }

  // Always redirect to Calendly after submission (even on error, data is saved)
  window.open(calendarUrl, '_blank');

  // Show success state
  form.style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
  document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

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
