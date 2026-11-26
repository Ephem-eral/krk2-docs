/* KRK Reader — progressive enhancements, no dependencies. */
(function () {
  "use strict";
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  var ui = window.KRK_UI || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(tpl, vars) { return String(tpl || "").replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; }); }

  /* Cross-fade a DOM change when supported. A transition interrupted by a quick second
     click rejects its promises; that is expected, so swallow it instead of logging an error. */
  function withTransition(apply) {
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) { apply(); return; }
    var vt = document.startViewTransition(apply);
    ["ready", "finished", "updateCallbackDone"].forEach(function (k) { if (vt[k]) vt[k].catch(function () {}); });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* Search-page status strings. Several Sphinx catalogs are empty for these, and the
     German/French plural rule returns a boolean, so `ngettext` came back undefined and
     the search page threw "Cannot read properties of undefined (reading 'replace')". */
  (function patchSearchStrings() {
    var D;
    try { D = typeof Documentation !== "undefined" ? Documentation : null; } catch (e) { D = null; } // eslint-disable-line no-undef
    if (!D || !ui.s_results) return;
    var T = D.TRANSLATIONS || (D.TRANSLATIONS = {});
    T["Search Results"] = ui.s_results;
    T["Searching"] = ui.s_searching;
    T["Preparing search..."] = ui.s_preparing;
    T["Search finished, found one page matching the search query."] = [ui.s_found_one, ui.s_found_many];
    T["Your search did not match any documents. Please make sure that all words are spelled correctly and that you've selected enough categories."] = ui.s_none;
    D.ngettext = function (singular, plural, n) {
      var t = T[singular];
      if (Array.isArray(t) && t[n === 1 ? 0 : 1]) return t[n === 1 ? 0 : 1];
      if (typeof t === "string" && t) return t;
      return n === 1 ? singular : plural;
    };
  })();

  /* Sphinx declares `Search` with const: it is a global binding, not a window property. */
  function sphinxSearch() {
    try { return typeof Search !== "undefined" ? Search : null; } catch (e) { return null; } // eslint-disable-line no-undef
  }

  /* Chinese full-text search: the index was segmented by jieba, but the query box is not.
     Re-segment Han runs in the query by forward maximum matching against the index terms. */
  if (typeof window.splitQuery === "function" && /\blang-(cn|tw)\b/.test(document.body ? document.body.className : root.innerHTML.slice(0, 400))) {
    var origSplit = window.splitQuery;
    window.splitQuery = function (query) {
      var S = sphinxSearch();
      var idx = S && S._index;
      var parts = origSplit(query);
      if (!idx) return parts;
      var has = function (w) { return Object.prototype.hasOwnProperty.call(idx.terms, w) || Object.prototype.hasOwnProperty.call(idx.titleterms, w); };
      var out = [];
      parts.forEach(function (part) {
        if (!/[㐀-鿿]/.test(part) || has(part)) { out.push(part); return; }
        part.split(/([㐀-鿿]+)/).forEach(function (chunk) {
          if (!chunk) return;
          if (!/[㐀-鿿]/.test(chunk)) { out.push(chunk); return; }
          var i = 0;
          while (i < chunk.length) {
            var found = false;
            for (var len = Math.min(8, chunk.length - i); len >= 2; len--) {
              var w = chunk.substr(i, len);
              if (has(w)) { out.push(w); i += len; found = true; break; }
            }
            if (!found) { if (has(chunk.charAt(i))) out.push(chunk.charAt(i)); i += 1; }
          }
        });
      });
      /* question words ("如何导出线材") would otherwise have to match too */
      var STOP = /^(如何|怎么|怎样|怎麼|怎樣|什么|什麼|为什么|為什麼|哪里|哪裡|哪个|哪個|是否|可以|能否|的|了|吗|嗎|呢|吧)$/;
      var kept = out.filter(function (w) { return !STOP.test(w); });
      if (kept.length) out = kept;
      return out.length ? out : parts;
    };
  }

  /* Korean: the index also holds every word without its trailing particle (conf/search_ko.py);
     strip the same particles from query words that are not indexed as typed. */
  if (typeof window.splitQuery === "function" && document.body && /\blang-ko\b/.test(document.body.className)) {
    var KO_PARTICLES = ["에서부터", "으로부터", "이라고", "에게서", "한테서", "으로는", "으로도", "에서는", "에서도",
      "에서", "에게", "한테", "으로", "부터", "까지", "처럼", "보다", "이나", "이랑", "하고", "에는", "에도", "로는", "로도", "만큼",
      "은", "는", "이", "가", "을", "를", "의", "에", "로", "와", "과", "도", "만", "나", "랑"];
    var koSplit = window.splitQuery;
    window.splitQuery = function (query) {
      var S = sphinxSearch();
      var idx = S && S._index;
      return koSplit(query).map(function (w) {
        if (!idx || !/[가-힣]/.test(w)) return w;
        /* pages containing the term in the body or in a title */
        var docsOf = function (t) {
          var out = [];
          [idx.terms, idx.titleterms].forEach(function (table) {
            if (!Object.prototype.hasOwnProperty.call(table, t)) return;
            var v = table[t];
            (Array.isArray(v) ? v : [v]).forEach(function (d) { if (out.indexOf(d) === -1) out.push(d); });
          });
          return out;
        };
        var own = docsOf(w);
        /* Use the stem only when it strictly covers more pages than the word as typed
           (플레이스홀더를 → 플레이스홀더). A noun that merely ends in a particle-like
           syllable (매크로) keeps its own spelling, whose entry already includes 매크로를 etc. */
        for (var i = 0; i < KO_PARTICLES.length; i++) {
          var p = KO_PARTICLES[i];
          if (w.length - p.length >= 2 && w.slice(-p.length) === p) {
            var stem = w.slice(0, -p.length);
            var stemDocs = docsOf(stem);
            if (!stemDocs.length) continue;
            var covers = own.every(function (d) { return stemDocs.indexOf(d) !== -1; });
            if (!own.length || (covers && stemDocs.length > own.length)) return stem;
          }
        }
        return w;
      });
    };
  }

  ready(function () {
    var body = $(".body");

    /* ------------------------------------------------------------ theme */
    var themeBtn = $(".theme-toggle");
    if (themeBtn) themeBtn.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      var apply = function () { root.dataset.theme = next; };
      withTransition(apply);
      store.set("krk-theme", next);
    });

    /* ------------------------------------------- visual style (op / modern) */
    var styleBtn = $(".style-toggle");
    if (styleBtn) styleBtn.addEventListener("click", function () {
      var next = root.dataset.style === "op" ? "modern" : "op";
      var apply = function () { root.dataset.style = next; };
      withTransition(apply);
      store.set("krk-style", next);
    });

    /* ------------------------------- pixel mosaics (seeded, one per page) */
    function rng(seedText) {
      var h = 1779033703 ^ seedText.length;
      for (var i = 0; i < seedText.length; i++) { h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
      var a = h >>> 0;
      return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    var BLUES = ["#1c3dd8", "#2447e6", "#13299f", "#0c1b74", "#3355ff", "#1f36b8"];
    var REDS = ["#e3164f", "#ff2d6a", "#b20f3d", "#ff5c8a"];
    var GRAYS = ["#111113", "#2a2a2d", "#4b4b4f", "#7d7d80", "#b5b5b2", "#d8d8d5"];
    function pick(r, list) { return list[Math.floor(r() * list.length)]; }
    function buildMosaic(el, idx) {
      var cols = parseInt(el.dataset.cols || "30", 10), rows = parseInt(el.dataset.rows || "10", 10);
      var hero = el.classList.contains("op-mosaic-hero");
      var r = rng(location.pathname + "#" + idx);
      var redX = .2 + r() * .6, redY = .25 + r() * .5;                 /* where the crimson blob sits */
      var out = [];
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var nx = (x + .5) / cols - .5, ny = (y + .5) / rows - .5;
          var d, p, color;
          if (hero) {
            /* a solid band behind the title that frays only at its two ends */
            d = Math.abs(nx) * 2;
            p = Math.abs(ny) < .38 ? (d < .78 ? 1 : 1.9 - d * 1.15) : (d < .5 ? .35 : 0);
          } else {
            /* header strip: dense on the right, dissolving towards the label */
            p = (nx + .5) * 1.35 - .15 + (r() - .5) * .25;
          }
          if (r() > p) continue;
          var rd = Math.hypot(((x + .5) / cols) - redX, ((y + .5) / rows) - redY);
          var roll = r();
          if (rd < .1 && roll < .75) color = pick(r, REDS);
          else if (p >= 1 || roll < .9) color = pick(r, BLUES);
          else color = pick(r, GRAYS.slice(2));
          out.push('<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + color + '"/>');
        }
      }
      /* one or two scan lines */
      for (var s = 0; s < (hero ? 2 : 1); s++) {
        var sy = Math.floor(r() * rows) + .35, sx = Math.floor(r() * cols * .6);
        out.push('<rect x="' + sx + '" y="' + sy + '" width="' + Math.floor(3 + r() * cols * .35) + '" height=".18" fill="' + pick(r, REDS) + '"/>');
      }
      el.innerHTML = '<svg viewBox="0 0 ' + cols + " " + rows + '" preserveAspectRatio="none" shape-rendering="crispEdges">' + out.join("") + "</svg>";
    }
    $$(".op-mosaic").forEach(buildMosaic);

    /* ------------------------- home hero: line-art 60% keyboard (OPERATION) */
    var kb = $(".op-keyboard");
    if (kb) {
      var ROWS = [
        [["Esc", 1, "red"], "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", ["Back", 2]],
        [["Tab", 1.5], "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", ["\\", 1.5]],
        [["Caps", 1.75], "A", "S", "D", "F", "G", "H", "J", ["K", 1, "blue"], "L", ";", "'", ["Enter", 2.25]],
        [["Shift", 2.25], "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", ["Shift", 2.75]],
        [["Ctrl", 1.25], ["Win", 1.25], ["Alt", 1.25], ["", 6.25], ["Alt", 1.25], ["Fn", 1.25], ["Menu", 1.25], ["Ctrl", 1.25]]
      ];
      var U = 44, PAD = 14, svg = [];
      var width = 15 * U + PAD * 2, height = 5 * U + PAD * 2;
      svg.push('<rect class="kb-case" x="1" y="1" width="' + (width - 2) + '" height="' + (height - 2) + '" rx="12"/>');
      ROWS.forEach(function (row, ri) {
        var x = PAD;
        row.forEach(function (key) {
          var k = typeof key === "string" ? [key, 1] : key;
          var label = k[0], w = k[1], tone = k[2] || "";
          if (ri === 1 && label === "R") tone = "blue";
          var kx = x + 2, ky = PAD + ri * U + 2, kw = w * U - 4, kh = U - 4;
          svg.push('<g class="kb-key ' + tone + '">' +
            '<rect class="kb-skirt" x="' + kx + '" y="' + ky + '" width="' + kw + '" height="' + kh + '" rx="5"/>' +
            '<rect class="kb-top" x="' + (kx + 4) + '" y="' + (ky + 3) + '" width="' + (kw - 8) + '" height="' + (kh - 10) + '" rx="4"/>' +
            (label ? '<text x="' + (kx + 9) + '" y="' + (ky + 16) + '">' + esc(label) + "</text>" : "") +
            "</g>");
          x += w * U;
        });
      });
      kb.innerHTML = '<svg viewBox="0 0 ' + width + " " + height + '" role="presentation">' + svg.join("") + "</svg>";
    }

    /* ------------------------------------------------- font size (-2…2) */
    $$("[data-font-step]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cur = parseInt(root.dataset.font || "0", 10);
        var next = Math.max(-2, Math.min(2, cur + parseInt(btn.dataset.fontStep, 10)));
        if (next === 0) delete root.dataset.font; else root.dataset.font = String(next);
        store.set("krk-font", String(next));
      });
    });

    /* ---------------------------------------------------- language menu */
    var langMenu = $(".lang-menu");
    document.addEventListener("click", function (e) {
      if (langMenu && langMenu.open && !langMenu.contains(e.target)) langMenu.open = false;
    });

    /* ----------------------------------------------- mobile nav drawer */
    var navBtn = $(".nav-toggle");
    var scrim = $(".scrim");
    function setNav(open) {
      document.body.classList.toggle("nav-open", open);
      if (navBtn) navBtn.setAttribute("aria-expanded", String(open));
      if (scrim) scrim.hidden = !open;
    }
    if (navBtn) navBtn.addEventListener("click", function () { setNav(!document.body.classList.contains("nav-open")); });
    if (scrim) scrim.addEventListener("click", function () { setNav(false); });
    /* keep the current chapter visible in the sidebar without scrolling the page */
    var sidebar = $(".sidebar");
    var current = $(".sidebar a.current");
    if (sidebar && current) {
      var top = current.getBoundingClientRect().top - sidebar.getBoundingClientRect().top + sidebar.scrollTop;
      if (top > sidebar.clientHeight * 0.7) sidebar.scrollTop = top - sidebar.clientHeight / 2;
    }

    /* ------------------------------------- keyboard shortcuts → keycaps */
    var KEY_RE = /\b((?:ctrl|shift|alt|cmd|super)[ \t]*\+[ \t]*)+(?:numpad[ \t]?\d|f\d{1,2}(?![a-z0-9])|[a-z0-9](?![a-z0-9]))|\bF12\b/gi;
    function keyName(k) {
      k = k.trim();
      var lower = k.toLowerCase();
      if (lower === "ctrl" || lower === "shift" || lower === "alt" || lower === "cmd" || lower === "super") return lower.charAt(0).toUpperCase() + lower.slice(1);
      if (/^numpad/i.test(k)) return "Numpad " + k.replace(/\D/g, "");
      return k.toUpperCase();
    }
    function renderKeys(text) {
      return '<span class="keys">' + text.split(/[ \t]*\+[ \t]*/).map(function (k) { return "<kbd>" + esc(keyName(k)) + "</kbd>"; }).join('<span class="plus">+</span>') + "</span>";
    }
    if (body) {
      var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          if (!n.nodeValue || !/[+]|F12/i.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
          var p = n.parentNode;
          while (p && p !== body) {
            if (/^(CODE|PRE|KBD|A|SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
            p = p.parentNode;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (n) {
        var text = n.nodeValue;
        KEY_RE.lastIndex = 0;
        if (!KEY_RE.test(text)) return;
        KEY_RE.lastIndex = 0;
        var html = esc(text).replace(KEY_RE, function (m) { return renderKeys(m); });
        var span = document.createElement("span");
        span.innerHTML = html;
        var frag = document.createDocumentFragment();
        while (span.firstChild) frag.appendChild(span.firstChild);
        n.parentNode.replaceChild(frag, n);
      });
    }

    /* ------------------------------------------------------ reading time */
    var rt = $(".read-time");
    if (rt && body) {
      var text = body.textContent || "";
      var cjk = (text.match(/[぀-ヿ㐀-鿿가-힯]/g) || []).length;
      var words = (text.replace(/[぀-ヿ㐀-鿿가-힯]/g, " ").match(/[A-Za-zÀ-ÿĀ-žА-яЁё0-9]+/g) || []).length;
      var mins = Math.max(1, Math.round(cjk / 420 + words / 230 + $$("img", body).length * 0.1));
      rt.textContent = fmt(ui.min_read, { n: mins });
      rt.hidden = false;
    }

    /* ----------------------------------- tables: wrapper + board list */
    $$(".body table.docutils").forEach(function (table) {
      var wrap = document.createElement("div");
      wrap.className = "table-wrap";
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
      $$("tbody tr", table).forEach(function (tr) {
        var cells = Array.prototype.slice.call(tr.children);
        var filled = cells.filter(function (td) { return td.textContent.trim() !== ""; });
        if (!filled.length) tr.classList.add("empty-row");
        else if (cells.length > 2 && filled.length === 1 && filled[0] === cells[0]) tr.classList.add("group-row");
      });
    });

    /* ------------------------------------------------- copy section link */
    var toast = $(".toast"), toastTimer;
    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg; toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.hidden = true; }, 1600);
    }
    $$(".body a.headerlink").forEach(function (a) {
      a.title = ui.copy_link || a.title;
      a.addEventListener("click", function (e) {
        var url = location.origin + location.pathname + a.getAttribute("href");
        if (navigator.clipboard && window.isSecureContext) {
          e.preventDefault();
          navigator.clipboard.writeText(url).then(function () {
            history.replaceState(null, "", a.getAttribute("href"));
            showToast(ui.copied || "Copied");
          });
        }
      });
    });

    /* ---------------------------------------------------------- lightbox */
    var box = $(".lightbox");
    var boxImg = box && $("img", box);
    function closeLightbox() {
      if (box && !box.hidden) { box.hidden = true; boxImg.removeAttribute("src"); document.body.style.overflow = ""; }
    }
    $$(".body img").forEach(function (img) {
      if (img.closest("a")) { img.classList.add("no-zoom"); return; }
      img.title = ui.zoom_hint || "";
      img.addEventListener("click", function () {
        if (!box) return;
        boxImg.src = img.currentSrc || img.src;
        boxImg.alt = img.alt || "";
        box.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });
    if (box) box.addEventListener("click", closeLightbox);

    /* ---------------------------------------------- command palette (⌘K) */
    var palette = $(".palette");
    var pInput = palette && $("input", palette);
    var pList = palette && $(".palette-list", palette);
    var entries = null, loading = false, results = [], sel = 0;
    var ICON_PAGE = '<svg viewBox="0 0 24 24"><path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4M9.5 12h6M9.5 15.5h6"/></svg>';
    var ICON_HASH = '<svg viewBox="0 0 24 24"><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/></svg>';
    var ICON_SEARCH = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>';

    function buildEntries(idx) {
      var groups = window.KRK_GROUPS || {};
      var order = Object.keys(groups);
      var list = [];
      idx.docnames.forEach(function (doc, i) {
        if (doc === "search" || doc === "genindex") return;
        list.push({ kind: "page", title: idx.titles[i], doc: doc, href: doc + ".html", sub: groups[doc] || "", rank: doc === "index" ? -1 : order.indexOf(doc) });
      });
      list.sort(function (a, b) { return a.rank - b.rank; });
      var titles = idx.alltitles || {};
      Object.keys(titles).forEach(function (t) {
        titles[t].forEach(function (pair) {
          var di = pair[0], anchor = pair[1];
          if (!anchor) return;
          var doc = idx.docnames[di];
          if (doc === "search") return;
          list.push({ kind: "section", title: t, doc: doc, href: doc + ".html#" + anchor, sub: idx.titles[di] });
        });
      });
      return list;
    }
    function loadIndex(cb) {
      if (entries) return cb();
      var S = sphinxSearch();
      if (S) {
        /* search page: Sphinx loads the index itself; wait for it */
        (function wait(n) {
          if (S._index) { entries = buildEntries(S._index); cb(); }
          else if (n < 100) setTimeout(function () { wait(n + 1); }, 50);
        })(0);
        return;
      }
      if (loading) return;
      loading = true;
      window.Search = {
        setIndex: function (idx) { entries = buildEntries(idx); cb(); }
      };
      var s = document.createElement("script");
      s.src = window.KRK_INDEX_URL || "searchindex.js";
      s.onerror = function () {
        /* drop the stub so the next open retries the download instead of waiting for it */
        loading = false;
        try { delete window.Search; } catch (e) { window.Search = undefined; }
        s.remove();
        if (pList && palette && !palette.hidden) pList.innerHTML = '<li class="empty" role="presentation">' + esc(ui.palette_empty) + "</li>";
      };
      document.head.appendChild(s);
    }
    function highlight(text, q) {
      if (!q) return esc(text);
      var i = text.toLowerCase().indexOf(q);
      if (i < 0) return esc(text);
      return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
    }
    function search(qRaw) {
      var q = qRaw.trim().toLowerCase();
      if (!entries) return [];
      if (!q) return entries.filter(function (e) { return e.kind === "page"; });
      var scored = [];
      entries.forEach(function (e) {
        var t = e.title.toLowerCase();
        var i = t.indexOf(q);
        if (i < 0) return;
        var s = (e.kind === "page" ? 0 : 10) + (i === 0 ? 0 : /[\s(（·\-]/.test(t.charAt(i - 1)) ? 1 : 2);
        scored.push({ e: e, s: s });
      });
      scored.sort(function (a, b) { return a.s - b.s; });
      var pages = scored.filter(function (x) { return x.e.kind === "page"; }).slice(0, 8);
      var secs = scored.filter(function (x) { return x.e.kind === "section"; }).slice(0, 25);
      return pages.concat(secs).map(function (x) { return x.e; });
    }
    function render() {
      if (!pList) return;
      var qRaw = pInput.value.trim();
      var q = qRaw.toLowerCase();
      results = search(qRaw);
      var html = "", lastKind = null;
      results.forEach(function (e, i) {
        if (e.kind !== lastKind) {
          html += '<li class="group-label" role="presentation">' + esc(e.kind === "page" ? ui.pages : ui.sections) + "</li>";
          lastKind = e.kind;
        }
        html += '<li role="presentation"><a role="option" href="' + esc(e.href) + '" data-i="' + i + '"><span class="pi">' + (e.kind === "page" ? ICON_PAGE : ICON_HASH) +
          '</span><span class="pt"><b>' + highlight(e.title, q) + "</b>" + (e.sub ? "<small>" + esc(e.sub) + "</small>" : "") + "</span></a></li>";
      });
      if (qRaw) {
        if (!results.length) html += '<li class="empty" role="presentation">' + esc(ui.palette_empty) + "</li>";
        results.push({ kind: "full", href: (window.KRK_SEARCH_URL || "search.html") + "?q=" + encodeURIComponent(qRaw) });
        html += '<li role="presentation"><a role="option" href="' + esc(results[results.length - 1].href) + '" data-i="' + (results.length - 1) + '"><span class="pi">' + ICON_SEARCH +
          '</span><span class="pt"><b>' + esc(fmt(ui.palette_fulltext, { q: qRaw })) + "</b></span></a></li>";
      }
      pList.innerHTML = html;
      sel = 0;
      mark();
    }
    function mark() {
      $$("a[role=option]", pList).forEach(function (a) {
        var on = Number(a.dataset.i) === sel;
        a.setAttribute("aria-selected", on ? "true" : "false");
        if (on) a.scrollIntoView({ block: "nearest" });
      });
    }
    function openPalette(initial) {
      if (!palette) return;
      palette.hidden = false;
      document.body.style.overflow = "hidden";
      pInput.value = initial || "";
      pInput.focus();
      pList.innerHTML = "";
      loadIndex(render);
    }
    function closePalette() {
      if (palette && !palette.hidden) { palette.hidden = true; document.body.style.overflow = ""; }
    }
    if (palette) {
      palette.addEventListener("mousedown", function (e) { if (e.target === palette) closePalette(); });
      pInput.addEventListener("input", function () { if (entries) render(); });
      pInput.addEventListener("keydown", function (e) {
        var n = $$("a[role=option]", pList).length;
        if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(n, 1); mark(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + n) % Math.max(n, 1); mark(); }
        else if (e.key === "Enter") {
          e.preventDefault();
          var a = $('a[data-i="' + sel + '"]', pList);
          if (a) location.href = a.getAttribute("href");
          else if (pInput.value.trim()) location.href = (window.KRK_SEARCH_URL || "search.html") + "?q=" + encodeURIComponent(pInput.value.trim());
        }
      });
      pList.addEventListener("mousemove", function (e) {
        var a = e.target.closest("a[role=option]");
        if (a && Number(a.dataset.i) !== sel) { sel = Number(a.dataset.i); mark(); }
      });
      pList.addEventListener("click", function (e) {
        var a = e.target.closest("a[role=option]");
        if (a && a.getAttribute("href").indexOf("#") > -1 && a.pathname === location.pathname) closePalette();
      });
    }
    var trigger = $(".search-trigger");
    if (trigger) trigger.addEventListener("click", function (e) { e.preventDefault(); openPalette(); });

    /* ------------------------------------------------- global shortcuts */
    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      var typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (palette && !palette.hidden) closePalette(); else openPalette();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        openPalette();
      } else if (e.key === "Escape") {
        closePalette();
        closeLightbox();
        setNav(false);
        if (langMenu) langMenu.open = false;
      }
    });

    /* ------------------------------------- reading progress, to-top */
    var bar = $(".progress span");
    var toTop = $(".to-top");
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    var ticking = false;
    function onScroll() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var y = window.scrollY;
      if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
      if (toTop) toTop.hidden = y < window.innerHeight * 0.8;
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    /* --------------------------------------------- page TOC scroll-spy */
    var tocLinks = $$(".page-toc a[href^='#']").filter(function (a) { return a.getAttribute("href").length > 1; });
    if (tocLinks.length) {
      var byId = {}, targets = [];
      tocLinks.forEach(function (a) {
        var el = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
        if (el) { byId[el.id] = a; targets.push(el); }
      });
      var spyTick = false;
      var setActive = function () {
        var active = targets[0] || null;
        for (var i = 0; i < targets.length; i++) {
          if (targets[i].getBoundingClientRect().top < window.innerHeight * 0.3) active = targets[i];
        }
        tocLinks.forEach(function (a) { a.classList.remove("active"); });
        if (active && byId[active.id]) byId[active.id].classList.add("active");
        spyTick = false;
      };
      window.addEventListener("scroll", function () { if (!spyTick) { spyTick = true; requestAnimationFrame(setActive); } }, { passive: true });
      setActive();
    }
  });
})();
