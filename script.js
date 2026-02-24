/* ========================================
   Alpha Lansing - Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Navigation scroll effect ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  });

  // ---- Mobile menu toggle ----
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav__links');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('nav__mobile-toggle--open');
    navLinks.classList.toggle('nav__links--open');
    document.body.style.overflow = navLinks.classList.contains('nav__links--open') ? 'hidden' : '';
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('nav__mobile-toggle--open');
      navLinks.classList.remove('nav__links--open');
      document.body.style.overflow = '';
    });
  });

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('faq__item--open');

      // Close all
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('faq__item--open'));

      // Open clicked (if it wasn't already open)
      if (!isOpen) {
        item.classList.add('faq__item--open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ---- Add Child functionality ----
  const childrenList = document.getElementById('children-list');
  const addChildBtn = document.getElementById('add-child-btn');
  let childCount = 1;
  const maxChildren = 5;

  addChildBtn.addEventListener('click', () => {
    if (childCount >= maxChildren) return;
    childCount++;

    const childDiv = document.createElement('div');
    childDiv.className = 'signup__child';
    childDiv.setAttribute('data-child', childCount);
    childDiv.innerHTML = `
      <div class="signup__child-header">
        <span>Child ${childCount}</span>
        <button type="button" class="signup__child-remove" data-remove="${childCount}">Remove</button>
      </div>
      <div class="signup__child-fields">
        <div class="signup__field">
          <label>Grade (Fall 2026)</label>
          <select name="child${childCount}_grade">
            <option value="">Select grade</option>
            <option value="K">Kindergarten</option>
            <option value="1">1st Grade</option>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
          </select>
        </div>
        <div class="signup__field">
          <label>Current School Type</label>
          <div class="signup__radio-group">
            <label class="signup__radio"><input type="radio" name="child${childCount}_school" value="Public"> Public</label>
            <label class="signup__radio"><input type="radio" name="child${childCount}_school" value="Private"> Private</label>
            <label class="signup__radio"><input type="radio" name="child${childCount}_school" value="Homeschool"> Homeschool</label>
            <label class="signup__radio"><input type="radio" name="child${childCount}_school" value="Other"> Other</label>
          </div>
        </div>
      </div>
    `;

    childrenList.appendChild(childDiv);

    if (childCount >= maxChildren) {
      addChildBtn.style.display = 'none';
    }
  });

  // Remove child handler (delegated)
  childrenList.addEventListener('click', (e) => {
    if (e.target.classList.contains('signup__child-remove')) {
      const childEl = e.target.closest('.signup__child');
      childEl.remove();
      childCount--;
      if (childCount < maxChildren) {
        addChildBtn.style.display = '';
      }
      // Re-number remaining children
      document.querySelectorAll('.signup__child').forEach((child, i) => {
        child.querySelector('.signup__child-header span').textContent = `Child ${i + 1}`;
      });
    }
  });

  // ---- Form Submission ----
  // Using Google Apps Script as the backend (same pattern as alphasouthbayla.org)
  // REPLACE THIS URL with your actual Google Apps Script web app URL
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

  const form = document.getElementById('interest-form');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = submitBtn.querySelector('.signup__submit-text');
  const submitLoading = submitBtn.querySelector('.signup__submit-loading');
  const formSuccess = document.getElementById('form-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Gather children data into an array
    data.children = [];
    document.querySelectorAll('.signup__child').forEach((child, i) => {
      const idx = i + 1;
      const grade = child.querySelector(`select[name="child${idx}_grade"]`)?.value
                 || child.querySelector('select')?.value || '';
      const schoolRadio = child.querySelector(`input[name="child${idx}_school"]:checked`)
                       || child.querySelector('input[type="radio"]:checked');
      const school = schoolRadio ? schoolRadio.value : '';
      if (grade || school) {
        data.children.push({ grade, school });
      }
    });

    // Show loading state
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline';

    try {
      if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
        // Demo mode - simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Real submission
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      // Show success
      form.style.display = 'none';
      formSuccess.style.display = 'block';

      // Scroll to success message
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (err) {
      console.error('Form submission error:', err);
      alert('Something went wrong. Please try again or join our Facebook group directly.');
      submitBtn.disabled = false;
      submitText.style.display = 'inline';
      submitLoading.style.display = 'none';
    }
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---- Animate elements on scroll ----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards and sections
  document.querySelectorAll('.what-is__card, .results__card, .schedule__item, .faq__item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Add animate-in styles
  const style = document.createElement('style');
  style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
});
