# KRK2 documentation · multi-page, 8 languages

Keyboard Render Kit 2 (v2.0.1) documentation in eight languages, published with
GitHub Pages. Each chapter is its own HTML page, like the original Read the Docs
site.

- `index.html` — language cover
- `en/ cn/ tw/ de/ fr/ ja/ ko/ ru/` — one folder per language, one page per chapter
- `single/index.html` — the single-page build (all languages in one file)
- `static/` — shared theme assets, light-green theme and dark mode
- `images/`, `fonts/` — shared images and fonts

## Maintenance notes

This repository contains generated GitHub Pages output. The editable source and
build scripts live in the sibling `KeyboardRenderKit-main` project; do not edit
the HTML pages directly. `sources/` is a generated, per-language snapshot used
by the “View source” links and is refreshed during each build.

The font files appear both in `fonts/` and `static/css/fonts/` intentionally:
the single-page bundle and the Sphinx multi-page theme use different relative
paths. Removing either copy can break one of the two site layouts.

> **More languages may be added in the future.** / 后续可能上线更多语言 · 後續可能上線更多語言

Unofficial multi-language build by [E3e](https://github.com/Ephem-eral).
Documentation content © 2022 ImperfectLink — see [LICENSE](LICENSE).
