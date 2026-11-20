(() => {
  const images = [...document.querySelectorAll('.post-page-content figure img')]
    .filter(image => !image.closest('a, button'));
  if (!images.length || typeof HTMLDialogElement === 'undefined' ||
      typeof HTMLDialogElement.prototype.showModal !== 'function') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'post-image-dialog';
  dialog.setAttribute('aria-label', 'Enlarged image');
  const enlarged = document.createElement('img');
  const close = document.createElement('button');
  close.className = 'post-image-close';
  close.type = 'button';
  close.textContent = '×';
  close.setAttribute('aria-label', 'Close enlarged image');
  dialog.append(enlarged, close);
  document.body.append(dialog);

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  for (const image of images) {
    const media = image.closest('picture') || image;
    const trigger = document.createElement('button');
    trigger.className = 'post-image-expand';
    trigger.type = 'button';
    trigger.setAttribute('aria-label', image.alt ? `Enlarge image: ${image.alt}` : 'Enlarge image');
    trigger.setAttribute('aria-haspopup', 'dialog');
    media.before(trigger);
    trigger.append(media);
    trigger.addEventListener('click', () => {
      enlarged.alt = image.alt;
      enlarged.src = image.currentSrc || image.src;
      dialog.showModal();
    });
  }
})();

(() => {
  const diagrams = Array.from(document.querySelectorAll('.mermaid')).map((element, index) => ({
    element,
    id: `mermaid-${index}`,
    source: element.textContent.trim()
  }));
  if (!diagrams.length) return;

  const loadMermaid = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
    script.async = true;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.append(script);
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'mermaid-dialog';
  const header = document.createElement('div');
  header.className = 'mermaid-dialog-header';
  const close = document.createElement('button');
  close.className = 'mermaid-dialog-close';
  close.type = 'button';
  close.textContent = 'Close';
  const dialogContent = document.createElement('div');
  dialogContent.className = 'mermaid-dialog-content';
  header.append(close);
  dialog.append(header, dialogContent);
  document.body.append(dialog);

  const expand = diagram => {
    const svg = diagram.element.querySelector('svg');
    if (!svg) return;
    dialogContent.replaceChildren(svg.cloneNode(true));
    dialog.showModal();
  };
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  diagrams.forEach(diagram => {
    const button = document.createElement('button');
    button.className = 'mermaid-expand';
    button.type = 'button';
    button.textContent = 'Expand diagram';
    button.addEventListener('click', () => expand(diagram));
    diagram.element.after(button);
  });

  const render = async () => {
    await loadMermaid;
    const dark = document.documentElement.dataset.theme === 'dark';
    window.mermaid.initialize({
      startOnLoad: false,
      theme: dark ? 'dark' : 'default',
      themeVariables: dark ? { darkMode: true } : {}
    });
    for (const diagram of diagrams) {
      const { svg, bindFunctions } = await window.mermaid.render(diagram.id, diagram.source);
      diagram.element.innerHTML = svg;
      bindFunctions?.(diagram.element);
    }
  };

  render();
  window.addEventListener('codemade-themechange', render);
})();
