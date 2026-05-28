document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // NAVBAR LOGIC
  // -------------------------
  const ctaWrapper = document.querySelector('[data-navbar-target="ctaWrapper"]');
  const mobileMenu = document.querySelector('[data-navbar-target="mobileMenu"]');
  const menuIcon = document.querySelector('[data-navbar-target="menuIcon"]');
  const closeIcon = document.querySelector('[data-navbar-target="closeIcon"]');
  
  const pathToId = {
    '/about': 'about',
    '/directions': 'directions',
    '/events': 'events',
    '/contacts': 'contacts',
    '/join': 'recruit-form'
  };

  // Scroll to path on load
  const handleScrollToPath = () => {
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      const targetId = pathToId[window.location.pathname];
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  };
  handleScrollToPath();

  // Scroll intercept for CTA button
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      if (ctaWrapper) {
        ctaWrapper.style.opacity = '1';
        ctaWrapper.style.pointerEvents = 'auto';
      }
    } else {
      if (ctaWrapper) {
        ctaWrapper.style.opacity = '0';
        ctaWrapper.style.pointerEvents = 'none';
      }
    }
  });

  // Scroll to top (logo click)
  document.querySelectorAll('[data-action="click->navbar#scrollToTop"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, '', '/');
    });
  });

  // Mobile menu toggle
  const toggleMenu = () => {
    if(mobileMenu && menuIcon && closeIcon) {
      mobileMenu.classList.toggle('hidden');
      menuIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    }
  };

  document.querySelectorAll('[data-action="click->navbar#toggle"]').forEach(el => {
    el.addEventListener('click', toggleMenu);
  });

  // Smooth scroll links
  document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/')) {
        const id = pathToId[href];
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, '', href);
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
              toggleMenu();
            }
          }
        }
      }
    });
  });

  // -------------------------
  // CARD LOGIC (Accordion)
  // -------------------------
  document.querySelectorAll('[data-action="click->card#toggle"]').forEach(button => {
    button.addEventListener('click', (e) => {
      const targetName = e.currentTarget.getAttribute('data-card-target');
      const contentTarget = document.querySelector(`[data-card-target="${targetName}Content"]`);
      const iconTarget = e.currentTarget.querySelector('svg');
      
      if (contentTarget && iconTarget) {
        if (!contentTarget.style.maxHeight || contentTarget.style.maxHeight === '0px') {
          contentTarget.style.maxHeight = contentTarget.scrollHeight + 'px';
          iconTarget.style.transform = 'rotate(180deg)';
        } else {
          contentTarget.style.maxHeight = '0px';
          iconTarget.style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  // -------------------------
  // MODAL LOGIC
  // -------------------------
  document.querySelectorAll('[data-action="click->modal#close"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('successModal');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    });
  });

  // -------------------------
  // FORM LOGIC
  // -------------------------
  const form = document.getElementById('applicationForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Honeypot spam check
      const botField = document.getElementById('bot_field');
      if (botField && botField.value !== "") {
        console.warn("Spam detected. Silently ignoring.");
        const modal = document.getElementById('successModal');
        if (modal) {
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        }
        form.reset();
        return; // exit early without sending data
      }

      const data = {
        fullName: document.getElementById('fullName').value,
        age: document.getElementById('age').value,
        phone: document.getElementById('phone').value,
        telegram: document.getElementById('telegram').value,
        instagram: document.getElementById('instagram').value || '',
        direction: document.getElementById('direction').value,
        experience: document.getElementById('experience').value || ''
      };

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Відправка...";

        const webhookUrl = "https://script.google.com/macros/s/AKfycbztHwfpUGui12TC-o2z0ldyxzIrwLR_w6DoysF7GHzJwEO9EGq8UpVJcb5NNKQCOY6ssA/exec";
        
        await fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(data)
        });

        const modal = document.getElementById('successModal');
        if (modal) {
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        }
        form.reset();

      } catch (error) {
        console.error("Помилка відправки:", error);
        alert("Виникла помилка під час відправки. Спробуйте ще раз пізніше.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }
});
