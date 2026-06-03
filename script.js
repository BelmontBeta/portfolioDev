/* ========================================
   TYPED EFFECT
======================================== */
const typedEl = document.getElementById('typed');
const phrases = [
  'Desenvolvedor de Bots Discord',
  'Entusiasta de AI',
  'Arquiteto de Soluções',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
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
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
  toggleScrollTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
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
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========================================
   REVEAL ON SCROLL (INTERSECTION OBSERVER)
======================================== */
const revealEls = document.querySelectorAll(
  '.about-text, .about-card-wrapper, .skill-card, .project-card, .contact-info, .contact-form, .stat'
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
   COUNTER ANIMATION (ABOUT STATS)
======================================== */
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1500;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current);
        }, stepTime);

        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(num => counterObserver.observe(num));

/* ========================================
   CONTACT FORM — FORMSUBMIT (SOLUÇÃO DEFINITIVA)
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

    // Se algum campo vazio, bloqueia
    if (!name || !email || !subject || !message) {
      e.preventDefault();
      return;
    }

    // Mostra loading mas NÃO faz preventDefault
    // Deixa o form submeter normalmente para o FormSubmit
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';

    // O form vai submeter sozinho após isso
  });
}

/* ========================================
   AVATAR — DIAGNÓSTICO E FALLBACK
======================================== */
const avatarImg = document.getElementById('avatar-img');
const avatarInitials = document.getElementById('avatar-initials');

if (avatarImg) {
  avatarImg.addEventListener('load', () => {
    console.log('%c✅ Foto carregada com sucesso!', 'color: #00d4aa; font-weight: bold;');
  });

  avatarImg.addEventListener('error', () => {
    console.warn('⚠️ Foto não encontrada. Verifique:');
    console.warn('   → Caminho atual:', avatarImg.src);
    console.warn('   → A pasta assets/img/ existe?');
    console.warn('   → O nome do arquivo está correto (incluindo extensão)?');

    // Esconde a imagem e mostra as iniciais
    avatarImg.style.display = 'none';
    if (avatarInitials) {
      avatarInitials.style.display = 'flex';
    }
  });

  // Força verificação caso a imagem já tenha falhado antes do listener
  if (avatarImg.complete && avatarImg.naturalWidth === 0) {
    avatarImg.dispatchEvent(new Event('error'));
  }
}

/* ========================================
   DETECTA RETORNO APÓS ENVIO DO FORMULÁRIO
======================================== */
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get('enviado') === 'true') {
  // Rola até o formulário
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    setTimeout(() => {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  // Mostra mensagem de sucesso
  const formSuccess = document.getElementById('form-success');
  if (formSuccess) {
    formSuccess.style.display = 'flex';
    setTimeout(() => {
      formSuccess.style.display = 'none';

      // Limpa o parâmetro da URL sem recarregar a página
      const url = new URL(window.location.href);
      url.searchParams.delete('enviado');
      window.history.replaceState({}, document.title, url.toString());
    }, 5000);
  }
}

/* ========================================
   FLOATING BADGES — TILT NO HOVER
======================================== */
const avatarWrapper = document.querySelector('.avatar-wrapper');

if (avatarWrapper) {
  avatarWrapper.addEventListener('mousemove', (e) => {
    const rect = avatarWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 15;
    const rotateY = (x / rect.width) * 15;

    avatarWrapper.style.transform =
      `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  avatarWrapper.addEventListener('mouseleave', () => {
    avatarWrapper.style.transition = 'transform 0.5s ease';
    avatarWrapper.style.transform =
      'perspective(600px) rotateX(0deg) rotateY(0deg)';
    setTimeout(() => {
      avatarWrapper.style.transition = '';
    }, 500);
  });
}

/* ========================================
   PROJECT CARDS — TILT SUAVE
======================================== */
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform =
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.4s ease';
    card.style.transform =
      'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    setTimeout(() => {
      card.style.transition = '';
    }, 400);
  });
});

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
    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ========================================
   SKILL CARDS — TOOLTIP DINÂMICO
======================================== */
skillCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    const name = card.querySelector('.skill-name').textContent;
    const level = card.querySelector('.skill-fill').getAttribute('data-level');
    card.setAttribute('title', `${name} — ${level}% de proficiência`);
  });
});

/* ========================================
   NAVBAR — FECHAR AO CLICAR FORA (MOBILE)
======================================== */
document.addEventListener('click', (e) => {
  const isNavbar = navbar.contains(e.target);
  if (!isNavbar && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  }
});

/* ========================================
   HIGHLIGHT ATIVO NA NAVBAR — INIT
======================================== */
updateActiveLink();

/* ========================================
   CURSOR PERSONALIZADO (OPCIONAL)
======================================== */
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
cursor.style.cssText = `
  position: fixed;
  width: 10px;
  height: 10px;
  background: #6c63ff;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.15s ease, opacity 0.3s ease;
  mix-blend-mode: difference;
`;

const cursorOuter = document.createElement('div');
cursorOuter.classList.add('custom-cursor-outer');
cursorOuter.style.cssText = `
  position: fixed;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(108, 99, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transition: transform 0.35s ease, left 0.1s ease, top 0.1s ease;
`;

document.body.appendChild(cursor);
document.body.appendChild(cursorOuter);

// Só ativa em desktop
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX - 5}px`;
    cursor.style.top = `${e.clientY - 5}px`;
    cursorOuter.style.left = `${e.clientX - 18}px`;
    cursorOuter.style.top = `${e.clientY - 18}px`;
  });

  document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursorOuter.style.transform = 'scale(1.5)';
      cursorOuter.style.borderColor = 'rgba(108, 99, 255, 0.9)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursorOuter.style.transform = 'scale(1)';
      cursorOuter.style.borderColor = 'rgba(108, 99, 255, 0.5)';
    });
  });
}

/* ========================================
   PARTICLES DE FUNDO (LEVE)
======================================== */
function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 8;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(108, 99, 255, ${Math.random() * 0.4 + 0.1});
      border-radius: 50%;
      left: ${x}%;
      bottom: -10px;
      pointer-events: none;
      animation: floatParticle ${duration}s ${delay}s infinite ease-in-out;
      z-index: 0;
    `;

    hero.appendChild(particle);
  }

  // Injeta o keyframe de partícula dinamicamente
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes floatParticle {
        0%   { transform: translateY(0) scale(1); opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 0.5; }
        100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

createParticles();

/* ========================================
   FORM SUCCESS — ESTILO DINÂMICO
======================================== */
if (formSuccess) {
  formSuccess.style.cssText += `
    display: none;
    align-items: center;
    gap: 10px;
  `;
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
