(function () {
  var btn = document.getElementById('sp-theme');
  var KEY = 'krk2-doc-theme';
  function label(mode) {
    if (!btn) return;
    var nextMode = mode === 'dark' ? 'light' : 'dark';
    btn.textContent = btn.getAttribute('data-label-' + nextMode) ||
      (nextMode === 'light' ? '☀ Light mode' : '🌙 Dark mode');
  }
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
  var copies = {"en": {"search": "Search documentation", "print": "Print / Save PDF", "top": "Back to top", "home": "Home", "language": "Language home", "light": "Light mode", "dark": "Dark mode", "contents": "Table of contents", "breadcrumbs": "Page navigation", "menu": "Navigation menu", "expand": "Expand section", "collapse": "Collapse section", "search_error_title": "Search index loading failed", "search_error_message": "Reload the page to try again.", "credits": "Built with <a href=\"https://www.sphinx-doc.org/\">Sphinx</a> using a <a href=\"https://github.com/readthedocs/sphinx_rtd_theme\">theme</a> provided by <a href=\"https://readthedocs.org\">Read the Docs</a>."}, "cn": {"search": "搜索文档", "print": "打印 / 保存为 PDF", "top": "返回顶部", "home": "首页", "language": "语言首页", "light": "浅色模式", "dark": "深色模式", "contents": "文档目录", "breadcrumbs": "页面导航", "menu": "移动版导航菜单", "expand": "展开章节", "collapse": "收起章节", "search_error_title": "搜索索引加载失败", "search_error_message": "请刷新页面后重试。", "credits": "使用 <a href=\"https://www.sphinx-doc.org/\">Sphinx</a> 构建，<a href=\"https://github.com/readthedocs/sphinx_rtd_theme\">主题</a>由 <a href=\"https://readthedocs.org\">Read the Docs</a> 提供。"}, "tw": {"search": "搜尋文件", "print": "列印 / 儲存為 PDF", "top": "回到頂端", "home": "首頁", "language": "語言首頁", "light": "淺色模式", "dark": "深色模式", "contents": "文件目錄", "breadcrumbs": "頁面導覽", "menu": "行動版導覽選單", "expand": "展開章節", "collapse": "收合章節", "search_error_title": "搜尋索引載入失敗", "search_error_message": "請重新整理頁面後再試。", "credits": "使用 <a href=\"https://www.sphinx-doc.org/\">Sphinx</a> 建置，<a href=\"https://github.com/readthedocs/sphinx_rtd_theme\">佈景主題</a>由 <a href=\"https://readthedocs.org\">Read the Docs</a> 提供。"}, "de": {"search": "Dokumentation durchsuchen", "print": "Drucken / als PDF speichern", "top": "Nach oben", "home": "Startseite", "language": "Sprachauswahl", "light": "Heller Modus", "dark": "Dunkler Modus", "contents": "Inhaltsverzeichnis", "breadcrumbs": "Seitennavigation", "menu": "Navigationsmenü", "expand": "Abschnitt aufklappen", "collapse": "Abschnitt zuklappen", "search_error_title": "Fehler beim Laden des Suchindex", "search_error_message": "Laden Sie die Seite neu und versuchen Sie es erneut.", "credits": "Erstellt mit <a href=\"https://www.sphinx-doc.org/\">Sphinx</a> und dem von <a href=\"https://readthedocs.org\">Read the Docs</a> bereitgestellten <a href=\"https://github.com/readthedocs/sphinx_rtd_theme\">Theme</a>."}, "fr": {"search": "Rechercher dans la documentation", "print": "Imprimer / enregistrer en PDF", "top": "Retour en haut", "home": "Accueil", "language": "Choix de la langue", "light": "Mode clair", "dark": "Mode sombre", "contents": "Table des matières", "breadcrumbs": "Navigation des pages", "menu": "Menu de navigation", "expand": "Développer la section", "collapse": "Réduire la section", "search_error_title": "Erreur de chargement de l’index", "search_error_message": "Rechargez la page pour réessayer.", "credits": "Généré avec <a href=\"https://www.sphinx-doc.org/\">Sphinx</a> et le <a href=\"https://github.com/readthedocs/sphinx_rtd_theme\">thème</a> fourni par <a href=\"https://readthedocs.org\">Read the Docs</a>."}, "ja": {"search": "ドキュメントを検索", "print": "印刷 / PDF に保存", "top": "ページ先頭へ", "home": "ホーム", "language": "言語選択", "light": "ライトモード", "dark": "ダークモード", "contents": "目次", "breadcrumbs": "ページナビゲーション", "menu": "モバイルナビゲーションメニュー", "expand": "セクションを展開", "collapse": "セクションを折りたたむ", "search_error_title": "検索インデックスの読み込みエラー", "search_error_message": "ページを再読み込みして、もう一度お試しください。", "credits": "<a href=\"https://www.sphinx-doc.org/\">Sphinx</a> で構築し、<a href=\"https://readthedocs.org\">Read the Docs</a> の<a href=\"https://github.com/readthedocs/sphinx_rtd_theme\">テーマ</a>を使用しています。"}, "ko": {"search": "문서 검색", "print": "인쇄 / PDF로 저장", "top": "맨 위로", "home": "홈", "language": "언어 선택", "light": "라이트 모드", "dark": "다크 모드", "contents": "목차", "breadcrumbs": "이동 경로", "menu": "모바일 탐색 메뉴", "expand": "섹션 펼치기", "collapse": "섹션 접기", "search_error_title": "검색 색인 로드 오류", "search_error_message": "페이지를 새로고침한 후 다시 시도해 주세요.", "credits": "<a href=\"https://www.sphinx-doc.org/\">Sphinx</a>로 제작되었으며, <a href=\"https://readthedocs.org\">Read the Docs</a>에서 제공하는 <a href=\"https://github.com/readthedocs/sphinx_rtd_theme\">테마</a>를 사용합니다."}, "ru": {"search": "Поиск по документации", "print": "Печать / сохранение в PDF", "top": "Наверх", "home": "Главная", "language": "Выбор языка", "light": "Светлая тема", "dark": "Тёмная тема", "contents": "Оглавление", "breadcrumbs": "Навигация по страницам", "menu": "Меню мобильной навигации", "expand": "Развернуть раздел", "collapse": "Свернуть раздел", "search_error_title": "Ошибка загрузки поискового индекса", "search_error_message": "Обновите страницу и повторите попытку.", "credits": "Создано с помощью <a href=\"https://www.sphinx-doc.org/\">Sphinx</a>. Используется <a href=\"https://github.com/readthedocs/sphinx_rtd_theme\">тема</a> от <a href=\"https://readthedocs.org\">Read the Docs</a>."}};
  var tags = {"en": "en", "cn": "zh-CN", "tw": "zh-TW", "de": "de", "fr": "fr", "ja": "ja", "ko": "ko", "ru": "ru"};
  var locale = null;
  if (!locale) {
    var tag = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    locale = Object.keys(tags).find(function (key) { return tags[key].toLowerCase() === tag; }) || tag;
  }
  if (!copies[locale]) { locale = 'en'; }
  function text(id, value) {
    var node = document.getElementById(id);
    if (node) { node.textContent = value; }
  }
  function syncToc() {
    var copy = copies[locale];
    Array.prototype.forEach.call(document.querySelectorAll('.toctree-expand'), function (button) {
      var item = button.closest('li');
      if (!item) { return; }
      var open = item.classList.contains('current') || item.classList.contains('nav-search-open');
      var expanded = String(open);
      var label = open ? copy.collapse : copy.expand;
      if (button.getAttribute('aria-expanded') !== expanded) { button.setAttribute('aria-expanded', expanded); }
      if (button.getAttribute('aria-label') !== label) {
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
      }
      if (button.getAttribute('type') !== 'button') { button.setAttribute('type', 'button'); }
    });
  }
  function apply(lang) {
    locale = copies[lang] ? lang : 'en';
    var copy = copies[locale];
    document.documentElement.setAttribute('lang', tags[locale]);
    var search = document.getElementById('sp-search') || document.querySelector('.wy-side-nav-search input[type="text"]');
    if (search) { search.setAttribute('placeholder', copy.search); search.setAttribute('aria-label', copy.search); }
    text('sp-print', copy.print);
    text('sp-home', '⌂ ' + copy.language);
    var framework = document.getElementById('sp-framework');
    if (framework) { framework.innerHTML = copy.credits; }
    var top = document.getElementById('sp-top');
    if (top) { top.setAttribute('title', copy.top); top.setAttribute('aria-label', copy.top); }
    var theme = document.getElementById('sp-theme');
    if (theme) {
      theme.setAttribute('data-label-light', '☀ ' + copy.light);
      theme.setAttribute('data-label-dark', '🌙 ' + copy.dark);
      theme.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀ ' + copy.light : '🌙 ' + copy.dark;
    }
    Array.prototype.forEach.call(document.querySelectorAll('.wy-nav-top, .krk-nav-toggle'), function (node) {
      node.setAttribute('aria-label', copy.menu);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.wy-menu-vertical[role="navigation"]'), function (node) {
      node.setAttribute('aria-label', copy.contents);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.wy-breadcrumbs .icon-home'), function (node) {
      node.setAttribute('aria-label', copy.home);
    });
    var breadcrumbs = document.querySelector('.wy-breadcrumbs');
    if (breadcrumbs && breadcrumbs.parentElement.getAttribute('role') === 'navigation') {
      breadcrumbs.parentElement.setAttribute('aria-label', copy.breadcrumbs);
    }
    syncToc();
    return copy;
  }
  window.__krk2SetUi = apply;
  window.__krk2GetUi = function () { return copies[locale]; };
  window.__krk2SyncToc = syncToc;
  apply(locale);
  var side = document.querySelector('.wy-nav-side');
  if (side && window.MutationObserver) {
    var observer = new window.MutationObserver(syncToc);
    observer.observe(side, { childList: true, subtree: true });
  }
  document.addEventListener('DOMContentLoaded', function () { apply(locale); });
  document.addEventListener('click', function (event) {
    if (event.target.closest('.toctree-expand')) { window.setTimeout(syncToc, 0); }
  }, true);
})();

(function () {
  function markers(root) {
    return [root].concat(Array.prototype.slice.call(
      root.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, table')
    ));
  }
  function endTop(points, index, root) {
    var start = points[index].getBoundingClientRect().top;
    for (var next = index + 1; next < points.length; next++) {
      var top = points[next].getBoundingClientRect().top;
      if (top > start) { return top; }
    }
    return root.getBoundingClientRect().bottom;
  }
  function capture(root) {
    if (!root) { return null; }
    var points = markers(root);
    var index = 0;
    points.forEach(function (point, i) {
      var top = point.getBoundingClientRect().top;
      if (top <= 0 && top >= points[index].getBoundingClientRect().top) { index = i; }
    });
    var start = points[index].getBoundingClientRect().top;
    var rect = root.getBoundingClientRect();
    return { index: index, count: points.length, tag: points[index].tagName,
      progress: -start / Math.max(1, endTop(points, index, root) - start),
      pageProgress: -rect.top / Math.max(1, rect.height) };
  }
  function restore(root, position) {
    if (!root || !position || !Number.isFinite(position.progress) || !Number.isFinite(position.pageProgress)) { return; }
    var points = markers(root);
    var point = points[position.index];
    var top;
    if (points.length === position.count && point && point.tagName === position.tag) {
      var start = point.getBoundingClientRect().top;
      top = start + position.progress * Math.max(1, endTop(points, position.index, root) - start);
    } else {
      var rect = root.getBoundingClientRect();
      top = rect.top + position.pageProgress * rect.height;
    }
    // A layout correction must override the document's smooth-scroll CSS.
    window.scrollTo({ top: window.scrollY + top, behavior: 'instant' });
  }
  function settle(callback) {
    var cancelled = false;
    var inputs = ['pointerdown', 'touchstart', 'wheel', 'keydown'];
    var awaitingLoad = document.readyState !== 'complete';
    var pending = 1 + Number(awaitingLoad) + Number(!!document.fonts);
    function cancel() {
      cancelled = true;
      inputs.forEach(function (name) { window.removeEventListener(name, cancel); });
      window.removeEventListener('load', complete);
    }
    function run() { if (!cancelled) { callback(); } }
    function complete() {
      run();
      pending--;
      if (!pending) { cancel(); }
    }
    inputs.forEach(function (name) {
      window.addEventListener(name, cancel, { once: true, passive: true });
    });
    run();
    window.requestAnimationFrame(complete);
    if (awaitingLoad) { window.addEventListener('load', complete, { once: true }); }
    if (document.fonts) { document.fonts.ready.then(complete, complete); }
    return cancel;
  }
  window.__krk2Reading = { capture: capture, restore: restore, settle: settle };
})();

(function () {
  var root = document.querySelector('.document [itemprop="articleBody"]');
  var reading = window.__krk2Reading;
  if (!root || !reading) { return; }
  var KEY = 'krk2-doc-reading';
  window.__krk2CaptureReading = function () { return reading.capture(root); };
  Array.prototype.forEach.call(document.querySelectorAll('.lang-switch a[href]'), function (link) {
    link.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) { return; }
      if (link.classList.contains('active')) {
        event.preventDefault();
        if (window.__krk2CloseMenu) { window.__krk2CloseMenu(false); }
        return;
      }
      var target = new URL(link.href, window.location.href);
      if (target.pathname.split('/').pop() !== window.location.pathname.split('/').pop()) { return; }
      var position = window.__krk2MenuReading || reading.capture(root);
      try {
        window.sessionStorage.setItem(KEY, JSON.stringify({ path: target.pathname, position: position, saved: Date.now() }));
      } catch (e) {}
    });
  });
  try {
    var saved = JSON.parse(window.sessionStorage.getItem(KEY));
    window.sessionStorage.removeItem(KEY);
    if (saved && saved.path === window.location.pathname && Date.now() - saved.saved < 60000) {
      reading.settle(function () { reading.restore(root, saved.position); });
    }
  } catch (e) {}
})();

  (function () {
    var burger = document.querySelector('.krk-nav-toggle');
    var side = document.querySelector('.wy-nav-side');
    var wrap = document.querySelector('.wy-nav-content-wrap');
    if (!burger || !side) { return; }
    var mobile = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;
    var savedScroll = null;
    function sync() {
      var open = side.classList.contains('shift');
      burger.setAttribute('aria-expanded', String(open));
      side.inert = !!(mobile && mobile.matches && !open);
    }
    function close(returnFocus) {
      var wasOpen = side.classList.contains('shift');
      var focusedInSide = side.contains(document.activeElement);
      side.classList.remove('shift');
      if (wrap) { wrap.classList.remove('shift'); }
      sync();
      if (returnFocus || (side.inert && focusedInSide)) { burger.focus({ preventScroll: true }); }
      if (wasOpen && savedScroll !== null) {
        window.scrollTo({ top: savedScroll, behavior: 'instant' });
      }
      savedScroll = null;
      window.__krk2MenuReading = null;
    }
    function open() {
      savedScroll = window.scrollY;
      window.__krk2MenuReading = window.__krk2CaptureReading ? window.__krk2CaptureReading() : null;
      side.classList.add('shift');
      if (wrap) { wrap.classList.add('shift'); }
      sync();
      var first = side.querySelector('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (first) { first.focus({ preventScroll: true }); }
    }
    function onViewportChange() {
      close(false);
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
