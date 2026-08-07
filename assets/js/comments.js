(() => {
  const config = window.COMMENTS_CONFIG;
  const container = document.getElementById(config?.containerId);
  if (!config || !container) return;

  const commentsUrl = config.urlOverride || 'https://comments.codemade.net';
  let iframe;

  const load = () => {
    config.theme = document.documentElement.dataset.theme;
    const slug = config.slug.split('/').map(encodeURIComponent).join('/');
    const title = config.title ? `&title=${encodeURIComponent(config.title)}` : '';
    iframe = document.createElement('iframe');
    iframe.src = `${commentsUrl}/comments/${encodeURIComponent(config.tenant)}/${slug}?theme=${encodeURIComponent(config.theme)}${title}`;
    iframe.title = 'Comments';
    iframe.loading = 'lazy';
    iframe.allow = 'local-network-access';
    iframe.style.cssText = 'border-radius: 8px; border: none; width: 100%; height: 400px; overflow: hidden;';
    container.replaceChildren(iframe);
  };

  window.addEventListener('codemade-themechange', () => {
    load();
  });

  window.addEventListener('message', event => {
    if (event.source !== iframe?.contentWindow || event.origin !== commentsUrl) return;
    if (typeof event.data !== 'object' || typeof event.data.height !== 'number') return;
    iframe.style.height = `${event.data.height}px`;
  });

  load();
})();
