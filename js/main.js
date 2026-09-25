/**
 * Dr. Adrian Cartier, PhD — Executive Portfolio Interactions
 * Native Vanilla JS implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initBioTabs();
  initTimelineFilter();
  initMetricsCounter();
  initCopyEmail();
  initContactModal();
  initActiveNavHighlight();
});

/* --------------------------------------------------------------------------
   Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;

  // Saved theme or preference
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

/* --------------------------------------------------------------------------
   Executive Bio Tab Switcher
   -------------------------------------------------------------------------- */
function initBioTabs() {
  const tabBtns = document.querySelectorAll('.bio-tab-btn');
  const panels = document.querySelectorAll('.bio-content-panel');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Career Timeline Category Filter
   -------------------------------------------------------------------------- */
function initTimelineFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      timelineItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category') || '';
        if (category === 'all' || itemCategories.includes(category)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Interactive Metrics Counter on Scroll
   -------------------------------------------------------------------------- */
function initMetricsCounter() {
  const counterElements = document.querySelectorAll('.metric-number[data-count]');
  if (!counterElements.length) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => observer.observe(el));
}

function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-count'));
  const prefix = element.getAttribute('data-prefix') || '';
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 1800; // ms
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  
  let frame = 0;
  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const currentCount = Math.round(target * easeOutQuad(progress));
    
    element.textContent = `${prefix}${currentCount}${suffix}`;
    
    if (frame === totalFrames) {
      clearInterval(counter);
      element.textContent = `${prefix}${target}${suffix}`;
    }
  }, frameRate);
}

function easeOutQuad(t) {
  return t * (2 - t);
}

/* --------------------------------------------------------------------------
   Copy Email to Clipboard
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('contactEmailText');

  if (!copyBtn || !emailText) return;

  copyBtn.addEventListener('click', () => {
    const textToCopy = emailText.textContent.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = '#10b981';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
      }, 2000);
    }).catch(err => {
      console.error('Copy failed', err);
    });
  });
}

/* --------------------------------------------------------------------------
   Contact Modal Window
   -------------------------------------------------------------------------- */
function initContactModal() {
  const modal = document.getElementById('contactModal');
  const openBtns = document.querySelectorAll('.open-contact-modal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   Active Navigation Link Highlight
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
