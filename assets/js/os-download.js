// Points a download button at the right file for the visitor's OS.
// The button's href starts as the GitHub release page, which stays the
// fallback if the OS is unknown (phones, tablets) or GitHub can't be reached.
(() => {
  const buttons = document.querySelectorAll("[data-os-download]");
  if (!buttons.length) return;

  const names = { windows: "Windows", macos: "macOS", linux: "Linux" };

  const detectOs = () => {
    const ua = navigator.userAgent;
    const platform = (navigator.userAgentData?.platform || navigator.platform || "").toLowerCase();
    // Phones and tablets can't run the desktop builds. iPads report a Mac platform.
    if (/android|iphone|ipad|ipod/i.test(ua)) return null;
    if (platform.startsWith("mac") && navigator.maxTouchPoints > 1) return null;
    if (platform.startsWith("win") || /windows/i.test(ua)) return "windows";
    if (platform.startsWith("mac") || /mac os x/i.test(ua)) return "macos";
    if (platform.includes("linux") || /linux|x11/i.test(ua)) return "linux";
    return null;
  };

  // Release file names include the version, so look them up rather than
  // hard-coding them. Cached for the session to go easy on GitHub's rate limit.
  const latestAssets = async (repo) => {
    const key = `codemade-release:${repo}`;
    try {
      const cached = JSON.parse(sessionStorage.getItem(key));
      if (cached) return cached;
    } catch {}
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
    const { assets } = await response.json();
    const list = assets.map((asset) => ({ name: asset.name, url: asset.browser_download_url }));
    try {
      sessionStorage.setItem(key, JSON.stringify(list));
    } catch {}
    return list;
  };

  const os = detectOs();
  if (!os) return;

  for (const button of buttons) {
    const { repo, osLabel } = button.dataset;
    const pattern = button.dataset[`asset${os[0].toUpperCase()}${os.slice(1)}`];
    if (!repo || !pattern) continue;
    button.textContent = (osLabel || "Download for {os}").replace("{os}", names[os]);
    latestAssets(repo)
      .then((assets) => {
        const asset = assets.find((a) => new RegExp(pattern, "i").test(a.name));
        if (asset) button.href = asset.url;
      })
      .catch(() => {});
  }
})();
