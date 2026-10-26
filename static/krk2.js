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

  (function () {
    var burger = document.querySelector('.krk-nav-toggle');
    var side = document.querySelector('.wy-nav-side');
    var wrap = document.querySelector('.wy-nav-content-wrap');
    if (!burger || !side) { return; }
    var mobile = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;

    function rememberChapter() {
      var button = document.querySelector('.lang-switch button.active');
      if (!button) { return; }
      var lang = button.getAttribute('data-switch');
      var current = document.querySelector(
        '.lang-nav[data-lang="' + lang + '"] li.current[data-page]'
      );
      if (current) {
        window.__krk2LastPage = current.getAttribute('data-page');
      }
    }
    function sync() {
      var open = side.classList.contains('shift');
      burger.setAttribute('aria-expanded', String(open));
      side.inert = !!(mobile && mobile.matches && !open);
    }
    function close(returnFocus) {
      side.classList.remove('shift');
      if (wrap) { wrap.classList.remove('shift'); }
      sync();
      if (returnFocus) { burger.focus(); }
    }
    function open() {
      rememberChapter();
      side.classList.add('shift');
      if (wrap) { wrap.classList.add('shift'); }
      sync();
      var first = side.querySelector('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (first) { first.focus(); }
    }
    function onViewportChange() {
      if (mobile && !mobile.matches && side.classList.contains('shift')) {
        close(false);
      } else {
        sync();
      }
    }
    burger.addEventListener('click', function (e) {
      e.preventDefault();
      if (side.classList.contains('shift')) { close(false); }
      else { open(); }
    });
    side.addEventListener('click', function (e) {
      var el = e.target;
      while (el && el !== side && !(el.tagName === 'A')) { el = el.parentElement; }
      if (el && el.tagName === 'A') { close(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && side.classList.contains('shift')) {
        e.preventDefault();
        close(true);
      }
    });
    if (mobile) {
      if (mobile.addEventListener) { mobile.addEventListener('change', onViewportChange); }
      else if (mobile.addListener) { mobile.addListener(onViewportChange); }
    }
    window.__krk2CloseMenu = close;
    sync();
  })();
