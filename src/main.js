import './style.css';
import './counter.js';

// Force close all modals on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  });
});
// ============================================
// 📧 Form Validation (FIXED)
// ============================================
const form = document.getElementById("subscribeForm");

if (form) {
  const emailInput = document.getElementById("email");
  const errorMsg = document.getElementById("emailError");  // ✅ Fixed ID
  const successMsg = document.getElementById("success");   // ✅ Now matches HTML

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Reset states
    errorMsg.classList.add("hidden");
    successMsg.classList.add("hidden");
    errorMsg.textContent = "";

    // Validation
    if (!email) {
      showError("Email address is required");
      return;
    }

    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address");
      return;
    }

    // Success state
    emailInput.removeAttribute("aria-invalid");
    emailInput.setAttribute("aria-invalid", "false");
    successMsg.classList.remove("hidden");
    
    // Log subscription (in production, this would call an API)
    console.log("Subscription successful:", email);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      form.reset();
      successMsg.classList.add("hidden");
    }, 3000);
  });

  // Real-time validation on blur
  emailInput.addEventListener("blur", () => {
    const email = emailInput.value.trim();
    if (email && !emailRegex.test(email)) {
      showError("Please enter a valid email address");
    }
  });

  // Clear error on input
  emailInput.addEventListener("input", () => {
    if (!errorMsg.classList.contains("hidden")) {
      errorMsg.classList.add("hidden");
      emailInput.removeAttribute("aria-invalid");
    }
  });

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
    emailInput.setAttribute("aria-invalid", "true");
    emailInput.focus();
  }
}

// ============================================
// 🌗 Dark Mode Toggle
// ============================================
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

// Initialize theme from cookie or system preference
function initializeTheme() {
  const savedTheme = getCookie("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    root.classList.add("dark");
    updateThemeButton(true);
  } else {
    root.classList.remove("dark");
    updateThemeButton(false);
  }
}

// Toggle theme
themeToggle?.addEventListener("click", () => {
  const isDark = root.classList.toggle("dark");
  updateThemeButton(isDark);
  
  // Save preference in cookie (session-based)
  setCookie("theme", isDark ? "dark" : "light", 365);
  
  // Announce to screen readers
  const announcement = isDark ? "Dark mode enabled" : "Light mode enabled";
  announceToScreenReader(announcement);
});

function updateThemeButton(isDark) {
  if (!themeToggle) return;
  
  themeToggle.setAttribute('aria-pressed', isDark);
  themeToggle.setAttribute('aria-label', 
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

// Initialize on load
initializeTheme();

// ============================================
// 📱 Mobile Menu Toggle
// ============================================
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    
    menu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', isHidden);
    menuBtn.textContent = isHidden ? '✕' : '☰';
    
    // Prevent body scroll when menu is open on mobile
    if (isHidden) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !menu.contains(e.target)) {
      if (!menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
        document.body.style.overflow = '';
      }
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = '☰';
      document.body.style.overflow = '';
      menuBtn.focus();
    }
  });
}

// ============================================
// 📂 Accordion Component
// ============================================
const accordionButtons = document.querySelectorAll('.accordion-btn');

accordionButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const panelId = btn.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    
    // Toggle panel
    btn.setAttribute('aria-expanded', !isExpanded);
    panel?.classList.toggle('hidden');
    
    // Update button text/icon
    const icon = btn.querySelector('.accordion-icon');
    if (icon) {
      icon.textContent = isExpanded ? '▼' : '▲';
    }
  });

  // Keyboard support
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// ============================================
// 🔲 Modal Component (FIXED)
// ============================================
const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
const modals = document.querySelectorAll('[data-modal]');

// Set up triggers to open modals
modalTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const modalId = trigger.getAttribute('data-modal-trigger');
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    
    if (modal) {
      openModal(modal);
    }
  });
});

// Set up close buttons for all modals
modals.forEach(modal => {
  // Close button click
  const closeButtons = modal.querySelectorAll('[data-modal-close]');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modal);
    });
  });
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Global escape key handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModal = document.querySelector('.modal-overlay:not(.hidden)');
    if (openModal) {
      closeModal(openModal);
    }
  }
});

function openModal(modal) {
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus first focusable element
  const focusableElements = modal.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
  
  // Trap focus inside modal
  trapFocus(modal);
}

function closeModal(modal) {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  // Return focus to trigger button
  const triggerId = modal.getAttribute('data-modal');
  const trigger = document.querySelector(`[data-modal-trigger="${triggerId}"]`);
  trigger?.focus();
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// ============================================
// 📑 Tabs Component (NEW)
// ============================================
const tabLists = document.querySelectorAll('[role="tablist"]');

tabLists.forEach(tabList => {
  const tabs = tabList.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');
  
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateTab(tab, tabs, panels);
    });
    
    // Keyboard navigation
    tab.addEventListener('keydown', (e) => {
      const currentIndex = Array.from(tabs).indexOf(tab);
      
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          const nextTab = tabs[currentIndex + 1] || tabs[0];
          activateTab(nextTab, tabs, panels);
          nextTab.focus();
          break;
          
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          const prevTab = tabs[currentIndex - 1] || tabs[tabs.length - 1];
          activateTab(prevTab, tabs, panels);
          prevTab.focus();
          break;
          
        case 'Home':
          e.preventDefault();
          activateTab(tabs[0], tabs, panels);
          tabs[0].focus();
          break;
          
        case 'End':
          e.preventDefault();
          const lastTab = tabs[tabs.length - 1];
          activateTab(lastTab, tabs, panels);
          lastTab.focus();
          break;
      }
    });
  });
});

function activateTab(activeTab, allTabs, allPanels) {
  // Deactivate all tabs
  allTabs.forEach(tab => {
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');
    tab.classList.remove('border-harvest-600', 'text-harvest-600');
    tab.classList.add('text-gray-500', 'border-transparent');
  });
  
  // Activate clicked tab
  activeTab.setAttribute('aria-selected', 'true');
  activeTab.setAttribute('tabindex', '0');
  activeTab.classList.add('border-harvest-600', 'text-harvest-600');
  activeTab.classList.remove('text-gray-500', 'border-transparent');
  
  // Show corresponding panel
  const targetPanelId = activeTab.getAttribute('aria-controls');
  
  allPanels.forEach(panel => {
    if (panel.id === targetPanelId) {
      panel.classList.remove('hidden');
      panel.setAttribute('tabindex', '0');
    } else {
      panel.classList.add('hidden');
      panel.setAttribute('tabindex', '-1');
    }
  });
}

// ============================================
// 🍪 Cookie Utilities (for theme persistence)
// ============================================
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// ============================================
// ♿ Accessibility Helpers
// ============================================
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ============================================
// 🎯 Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Set focus to target for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
});

// ============================================
// 📊 Performance: Lazy Loading Images
// ============================================
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// ============================================
// 🎨 Add animation classes on scroll (optional enhancement)
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements with data-animate attribute
document.querySelectorAll('[data-animate]').forEach(el => {
  observer.observe(el);
});

console.log('🌱 Urban Harvest - Application initialized successfully');

const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {

    // Reset all tabs
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('border-harvest-600', 'text-harvest-600');
      t.classList.add('border-transparent');
    });

    // Hide all panels
    panels.forEach(panel => {
      panel.classList.add('hidden');
    });

    // Activate clicked tab
    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('border-harvest-600', 'text-harvest-600');

    const panelId = tab.getAttribute('aria-controls');
    document.getElementById(panelId).classList.remove('hidden');
  });
});


