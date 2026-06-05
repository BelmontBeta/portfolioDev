/* ========================================
   TYPED EFFECT
======================================== */
const typedEl = document.getElementById('typed');
const phrases = [
  'Desenvolvedor Back End',
  'Estudante de Ciência da Computação',
  'Entusiasta de IA',
  'Aspirante a Engenheiro de Software',
  'Desenvolvedor de Bots para Discord'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  if (!typedEl) return;

  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

type();

/* ========================================
   NAVBAR — SCROLL & MOBILE
======================================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  updateActiveLink();
  toggleScrollTop();
});

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
}

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    if (!hamburger || !navLinks) return;
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ========================================
   ACTIVE LINK ON SCROLL
======================================== */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ========================================
   SCROLL TOP BUTTON
======================================== */
const scrollTopBtn = document.getElementById('scroll-top');

function toggleScrollTop() {
  if (!scrollTopBtn) return;
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========================================
   REVEAL ON SCROLL (INTERSECTION OBSERVER)
======================================== */
const revealEls = document.querySelectorAll(
  '.about-text, .about-card-wrapper, .skill-card, .under-construction, .contact-info, .contact-form, .stat'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ========================================
   SKILL BARS ANIMATION
======================================== */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const level = fill.getAttribute('data-level');
        fill.style.width = `${level}%`;
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.3 }
);

skillFills.forEach(fill => skillObserver.observe(fill));

/* ========================================
   SKILL FILTER
======================================== */
const filterBtns = document.querySelectorAll('.skill-filter');
const skillCards = document.querySelectorAll('.skill-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    skillCards.forEach((card, i) => {
      const category = card.getAttribute('data-category');
      const show = filter === 'all' || category === filter;

      card.style.transition = `opacity 0.3s ease ${i * 40}ms, transform 0.3s ease ${i * 40}ms`;

      if (show) {
        card.classList.remove('hidden');
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.classList.add('hidden');
        }, 300);
      }
    });

    // Reativa as barras de skill visíveis após o filtro
    setTimeout(() => {
      document.querySelectorAll('.skill-card:not(.hidden) .skill-fill').forEach(fill => {
        const level = fill.getAttribute('data-level');
        fill.style.width = `${level}%`;
      });
    }, 350);
  });
});

/* ========================================
   CONTACT FORM — SUBMISSÃO SIMPLES
   (deixa o FormSubmit cuidar do envio)
======================================== */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnLoading = document.getElementById('btn-loading');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      e.preventDefault();
      return;
    }

    // Mostra loading, mas deixa o form submeter normalmente
    if (submitBtn && btnText && btnLoading) {
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-flex';
    }
  });
}

/* ========================================
   SMOOTH SCROLL — LINKS INTERNOS
======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ========================================
   AVATAR — DIAGNÓSTICO E FALLBACK (console)
======================================== */
const avatarImg = document.getElementById('avatar-img');
const avatarInitials = document.getElementById('avatar-initials');

if (avatarImg) {
  avatarImg.addEventListener('load', () => {
    console.log('%c✅ Foto carregada com sucesso!', 'color: #00d4aa; font-weight: bold;');
  });

  avatarImg.addEventListener('error', () => {
    console.warn('⚠️ Foto não encontrada. Verifique o caminho:', avatarImg.src);
    avatarImg.style.display = 'none';
    if (avatarInitials) {
      avatarInitials.style.display = 'flex';
    }
  });

  if (avatarImg.complete && avatarImg.naturalWidth === 0) {
    avatarImg.dispatchEvent(new Event('error'));
  }
}

/* ========================================
   LOG DE INICIALIZAÇÃO
======================================== */
console.log(
  '%c🚀 Portfólio carregado com sucesso!',
  'color: #6c63ff; font-size: 14px; font-weight: bold;'
);
console.log(
  '%c💼 Desenvolvido por Caio Belmont',
  'color: #00d4aa; font-size: 12px;'
);