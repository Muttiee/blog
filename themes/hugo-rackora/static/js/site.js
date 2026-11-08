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
    const dark = document.documentElement.dataset.theme === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    themeIcon?.setAttribute('href', dark ? '#i-sun' : '#i-moon');
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

  const searchButton = $('#search-button');
  const searchDialog = $('#search-dialog');
  const searchInput = $('#search-input');
  const searchResults = $('#search-results');
  let searchItems;
  searchButton?.addEventListener('click', async () => {
    searchDialog.showModal();
    searchInput.focus();
    if (searchItems) return;
    try {
      const response = await fetch(searchDialog.dataset.indexUrl);
      if (!response.ok) throw new Error('Search index unavailable');
      searchItems = await response.json();
    } catch (_) {
      searchItems = [];
      searchResults.textContent = '搜索暂时不可用。';
    }
  });
  $('#search-close')?.addEventListener('click', () => searchDialog.close());
  searchInput?.addEventListener('input', () => {
    if (!searchItems) return;
    const query = searchInput.value.trim().toLocaleLowerCase();
    searchResults.replaceChildren();
    if (!query) {
      searchResults.textContent = '输入关键词开始搜索。';
      return;
    }
    const matches = searchItems.filter(item => `${item.title} ${item.summary}`.toLocaleLowerCase().includes(query)).slice(0, 12);
    if (!matches.length) {
      searchResults.textContent = '没有找到相关文章。';
      return;
    }
    for (const item of matches) {
      const link = document.createElement('a');
      const summary = document.createElement('small');
      link.href = item.url;
      link.textContent = item.title;
      summary.textContent = item.summary;
      link.append(summary);
      searchResults.append(link);
    }
  });

  document.querySelectorAll('[data-tabs]').forEach(group => {
    const buttons = [...group.querySelectorAll('[role="tab"]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(item => {
        const selected = item === button;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(item.dataset.tabTarget);
        if (panel) panel.hidden = !selected;
      });
    }));
  });

  document.addEventListener('click', async event => {
    const control = event.target.closest('[data-code-action]');
    if (!control) return;
    const block = control.closest('[data-code-block]');
    if (!block) return;
    const action = control.dataset.codeAction;
    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(block.querySelector('[data-code-source]')?.textContent || '');
        control.title = control.dataset.labelCopied || '已复制';
        control.setAttribute('aria-label', control.title);
      } catch (_) {
        control.title = '复制失败';
      }
    } else if (action === 'toggle-collapse' || action === 'expand') {
      const content = block.querySelector('.code-block-content');
      const shouldExpand = action === 'expand' || block.dataset.collapsed === 'true';
      block.dataset.collapsed = String(!shouldExpand);
      if (content) content.style.maxHeight = shouldExpand ? '' : `${block.dataset.collapsedHeight || 120}px`;
      const toggle = block.querySelector('[data-code-action="toggle-collapse"]');
      toggle?.setAttribute('aria-expanded', String(shouldExpand));
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
