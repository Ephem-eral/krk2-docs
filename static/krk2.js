(function () {
  var btn = document.getElementById('sp-theme');
  var KEY = 'krk2-doc-theme';
  function label(mode) { if (btn) { btn.textContent = mode === 'dark' ? '☀ Light / 淺色' : '🌙 Dark / 深色'; } }
  function apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    label(mode);
    try { window.localStorage.setItem(KEY, mode); } catch (e) {}
  }
  label(document.documentElement.getAttribute('data-theme') || 'light');
  if (btn) {
    btn.addEventListener('click', function () {
      apply(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }
})();
