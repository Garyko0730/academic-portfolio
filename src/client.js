import './styles/main.css';

const THEME_STORAGE_KEY = 'portfolio-theme';

function applySavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    return;
  }

  document.documentElement.classList.add('dark');
}

function initThemeToggle() {
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');

    localStorage.setItem(
      THEME_STORAGE_KEY,
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  });
}

function initMobileMenu() {
  const menu = document.querySelector('[data-mobile-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const openIcon = document.querySelector('[data-menu-icon="open"]');
  const closeIcon = document.querySelector('[data-menu-icon="close"]');

  if (!menu || !menuToggle) return;

  const syncMenuState = (isOpen) => {
    menu.classList.toggle('hidden', !isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    openIcon?.classList.toggle('hidden', isOpen);
    closeIcon?.classList.toggle('hidden', !isOpen);
  };

  syncMenuState(false);

  menuToggle.addEventListener('click', () => {
    syncMenuState(menu.classList.contains('hidden'));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => syncMenuState(false));
  });
}

// 首屏内容已经是静态 HTML，客户端只做渐进增强。
function initRevealElements() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    revealElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((element) => observer.observe(element));
}

applySavedTheme();

window.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initRevealElements();
});
