(() => {
  const key = 'codemade-theme';
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const preferences = ['light', 'dark'];
  const icons = { light: '☀️', dark: '🌙' };

  const apply = preference => {
    const changed = root.dataset.theme !== preference;
    root.dataset.themePreference = preference;
    root.dataset.theme = preference;
    if (toggle) {
      const label = `Theme: ${preference[0].toUpperCase()}${preference.slice(1)}`;
      toggle.textContent = icons[preference];
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
    }
    if (changed) {
      window.dispatchEvent(new CustomEvent('codemade-themechange', {
        detail: { preference, theme: preference }
      }));
    }
  };

  apply(root.dataset.themePreference || 'light');
  toggle?.addEventListener('click', () => {
    const current = root.dataset.themePreference || 'light';
    const preference = preferences[(preferences.indexOf(current) + 1) % preferences.length];
    try { localStorage.setItem(key, preference); } catch (error) {}
    apply(preference);
  });
})();
