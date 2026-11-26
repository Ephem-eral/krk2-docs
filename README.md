# Keyboard Render Kit 2 · Documentation in 8 languages

Unofficial multi-language reader edition of the
[Keyboard Render Kit 2](https://keyboardrenderkit.readthedocs.io/) (v2.0.1)
documentation, a Blender kit for rendering keyboards and keycap colorways.

**Read it online: <https://ephem-eral.github.io/krk2-docs/>**

非官方的 Keyboard Render Kit 2（v2.0.1）多语言阅读版文档。KRK2 是一套用 Blender 渲染键盘与键帽配色的工具包。

## Languages · 语言

| Language | Start reading | Translation status |
| --- | --- | --- |
| English | [en](https://ephem-eral.github.io/krk2-docs/en/) | Original text |
| 简体中文 | [cn](https://ephem-eral.github.io/krk2-docs/cn/) | Hand-proofread |
| 繁體中文 | [tw](https://ephem-eral.github.io/krk2-docs/tw/) | Converted from Simplified Chinese, with Taiwan terminology |
| Deutsch | [de](https://ephem-eral.github.io/krk2-docs/de/) | Machine-translated draft with editorial fixes |
| Français | [fr](https://ephem-eral.github.io/krk2-docs/fr/) | Machine-translated draft with editorial fixes |
| 日本語 | [ja](https://ephem-eral.github.io/krk2-docs/ja/) | Awaiting native-speaker review |
| 한국어 | [ko](https://ephem-eral.github.io/krk2-docs/ko/) | Awaiting native-speaker review |
| Русский | [ru](https://ephem-eral.github.io/krk2-docs/ru/) | Awaiting native-speaker review |

Every edition is checked against the English structure (headings, images,
links, shortcuts), but none has had a full native-speaker review yet.
Corrections are very welcome — please
[open an issue](https://github.com/Ephem-eral/krk2-docs/issues) with the page
and the sentence.

所有译文都与英文原文做过结构对照，但还没有经过完整的母语审校。发现翻译问题欢迎[提交 Issue](https://github.com/Ephem-eral/krk2-docs/issues)，注明页面和原句即可。

## Features · 功能

- Chapter navigation and an on-page outline that follows your scroll position
- <kbd>Ctrl</kbd> <kbd>K</kbd> (or <kbd>/</kbd>) quick-jump to any chapter or section
- Full-text search, with word segmentation for Chinese and particle handling for Korean
- Keyboard shortcuts in the text rendered as keycaps; click any screenshot to enlarge
- Light and dark modes, adjustable text size, and two visual styles
- Switch language on any page and stay on the same chapter

## Repository contents · 仓库内容

This repository holds only the generated GitHub Pages site; the source and
build scripts are kept separately. Please don't edit the HTML here directly.

- `index.html` — language picker (remembers the language you last read)
- `en/ cn/ tw/ de/ fr/ ja/ ko/ ru/` — one folder per language, one page per chapter
- `_images/` — screenshots shared by all languages

Chapter URLs are the same as in earlier versions of this site. The old
single-page build (`single/`) is no longer published.

## Credits & licence · 致谢与授权

Documentation content and screenshots © 2022 ImperfectLink — all rights
reserved, mirrored here non-commercially. Translations and the reader theme by
[E3e](https://github.com/Ephem-eral), MIT. Bundled Sphinx code keeps its own
licences. See [LICENSE](LICENSE) for details.

This is a community project and is not affiliated with ImperfectLink or Blender.
