(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const themeButton = $('#theme-button');
  const themeIcon = $('#theme-button use');
  try {
    if (localStorage.getItem('rackora-static-theme') === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    }
  } catch (_) { /* Local storage can be unavailable. */ }

  function updateThemeIcon() {
    themeIcon?.setAttribute('href', document.documentElement.dataset.theme === 'dark' ? '#i-sun' : '#i-moon');
  }
  updateThemeIcon();
  themeButton?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('rackora-static-theme', next); } catch (_) { /* Ignore storage errors. */ }
    updateThemeIcon();
  });

  const menuButton = $('#menu-button');
  const nav = $('#main-nav');
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav?.addEventListener('click', event => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  });

  const article = $('#article-body');
  if (!article) return;
  const progress = $('#reading-progress');
  const progressBar = $('#reading-progress span');
  const tocLinks = [...document.querySelectorAll('.toc a')];
  progress.hidden = false;
  function updateReadingState() {
    const page = document.documentElement;
    const total = page.scrollHeight - page.clientHeight;
    progressBar.style.width = `${total > 0 ? Math.min(100, Math.max(0, scrollY / total * 100)) : 100}%`;
    let active = null;
    for (const link of tocLinks) {
      const id = decodeURIComponent(link.hash.slice(1));
      const heading = document.getElementById(id);
      if (heading && heading.getBoundingClientRect().top <= 130) active = link;
    }
    tocLinks.forEach(link => link.classList.toggle('active', link === active));
  }
  addEventListener('scroll', updateReadingState, { passive: true });
  addEventListener('resize', updateReadingState);
  updateReadingState();

  const tocButton = $('#toc-button');
  const tocDialog = $('#toc-dialog');
  const tocResults = $('#toc-results');
  if (tocButton && tocDialog && tocResults) {
    for (const link of tocLinks) {
      const copy = document.createElement('a');
      copy.href = link.href;
      copy.textContent = link.textContent;
      tocResults.append(copy);
    }
    tocButton.addEventListener('click', () => tocDialog.showModal());
    $('#toc-close')?.addEventListener('click', () => tocDialog.close());
    tocResults.addEventListener('click', event => {
      if (event.target.closest('a')) tocDialog.close();
    });
  }
})();
