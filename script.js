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

    // CHANGE THIS to your deployed worker URL after deploying higher-love-api
    const API_URL = 'https://higher-love-api.james-d13.workers.dev/apply';

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

      // Collect form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        if (key === 'resonance') {
          if (!data[key]) data[key] = [];
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });

      // Show loading state
      submitBtn.textContent = 'SUBMITTING...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';

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