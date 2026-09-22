# Keyboard Render Kit 2 — multi-language documentation

Unofficial single-page builds of the Keyboard Render Kit 2 documentation (v2.0.1) in six languages.

Open **`index.html`** (or the GitHub Pages URL) and pick a language.

| Page | Language |
|---|---|
| `KRK2-docs-multilingual.html` | All six languages, switchable in the page |
| `KRK2-docs-en.html` | English (upstream text, build warnings fixed) |
| `KRK2-docs-cn.html` | 简体中文 |
| `KRK2-docs-tw.html` | 繁體中文（台灣用語） |
| `KRK2-docs-ja.html` | 日本語 |
| `KRK2-docs-ko.html` | 한국어 |
| `KRK2-docs-ru.html` | Русский |

Each page is a single HTML document containing all 33 chapters:

* sidebar with chapters, sections and the theme's `+/−` expanders
* sidebar search filters the table of contents
* scroll highlights the chapter you are reading
* "print / save as PDF" in the breadcrumb (print CSS paginates per chapter)
* switching language keeps you in the same chapter

`images/` and `fonts/` are shared by all pages and referenced with relative paths, so the folder has to be
served as a whole.

## Hosting on GitHub Pages

1. Push this folder to a repository (branch `main`).
2. Repository → Settings → Pages → Source: *Deploy from a branch*, Branch: `main` / `/ (root)`.
3. The site appears at `https://<user>.github.io/<repo>/` within a minute.

`.nojekyll` is included so GitHub Pages serves the files without running Jekyll.

## Content

Documentation content © 2022 ImperfectLink (Keyboard Render Kit 2 v2.0.1). This is an unofficial
multi-language build; the English text is the upstream documentation, the Chinese versions were
proof-read by hand, and the Japanese / Korean / Russian versions are machine translations with
terminology and structure review.
