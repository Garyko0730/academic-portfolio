const staticRoutes = new Set(['/', '/projects', '/papers', '/blog', '/about']);

function getCurrentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function resolveRoute(path) {
  if (path.startsWith('/projects/')) {
    return { page: 'project-detail', params: { slug: path.slice('/projects/'.length) } };
  }

  if (path.startsWith('/blog/')) {
    return { page: 'blog-detail', params: { slug: path.slice('/blog/'.length) } };
  }

  if (staticRoutes.has(path)) {
    return { page: path === '/' ? 'home' : path.slice(1), params: {} };
  }

  return { page: 'not-found', params: {} };
}

export function initRouter(renderPage) {
  function handleRoute() {
    const { page, params } = resolveRoute(getCurrentPath());
    renderPage(page, params);
  }

  window.navigateTo = (path = '/') => {
    window.location.hash = `#${path}`;
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
