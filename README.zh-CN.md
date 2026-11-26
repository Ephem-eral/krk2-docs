[English](README.md) | **简体中文**

# Keyboard Render Kit 2 · 8 种语言文档

非官方的 [Keyboard Render Kit 2](https://keyboardrenderkit.readthedocs.io/)（v2.0.1）多语言阅读版文档。KRK2 是一套用 Blender 渲染键盘与键帽配色的工具包。

**在线阅读：<https://ephem-eral.github.io/krk2-docs/>**

## 语言

| 语言 | 开始阅读 | 翻译状态 |
| --- | --- | --- |
| English | [en](https://ephem-eral.github.io/krk2-docs/en/) | 原文 |
| 简体中文 | [cn](https://ephem-eral.github.io/krk2-docs/cn/) | 人工校对 |
| 繁體中文 | [tw](https://ephem-eral.github.io/krk2-docs/tw/) | 由简体转换，并按台湾用语调整 |
| Deutsch | [de](https://ephem-eral.github.io/krk2-docs/de/) | 机器翻译初稿，经过人工修订 |
| Français | [fr](https://ephem-eral.github.io/krk2-docs/fr/) | 机器翻译初稿，经过人工修订 |
| 日本語 | [ja](https://ephem-eral.github.io/krk2-docs/ja/) | 待母语审校 |
| 한국어 | [ko](https://ephem-eral.github.io/krk2-docs/ko/) | 待母语审校 |
| Русский | [ru](https://ephem-eral.github.io/krk2-docs/ru/) | 待母语审校 |

所有译文都与英文原文做过结构对照（标题、图片、链接、快捷键），但还没有经过完整的母语审校。发现翻译问题欢迎[提交 Issue](https://github.com/Ephem-eral/krk2-docs/issues)，注明页面和原句即可。

## 功能

- 章节导航，以及随滚动高亮的本页目录
- 按 <kbd>Ctrl</kbd> <kbd>K</kbd>（或 <kbd>/</kbd>）快速跳转到任意章节或小节
- 全文搜索：中文支持分词，韩文能识别助词
- 正文中的快捷键显示为键帽样式，截图可点击放大
- 浅色和深色模式、可调字号、两种视觉风格
- 在任意页面切换语言，并停留在同一章节

## 仓库内容

本仓库只存放生成好的 GitHub Pages 网站，源码和构建脚本单独保存。请不要直接修改这里的 HTML。

- `index.html`：语言选择页，会记住你上次阅读的语言
- `en/ cn/ tw/ de/ fr/ ja/ ko/ ru/`：每种语言一个文件夹，每章一个页面
- `_images/`：所有语言共用的截图

章节网址与旧版网站保持一致。旧版的单页版（`single/`）已不再发布。

## AI 协作说明

阅读版由 E3e 与 Anthropic 的 AI 助手 [Claude](https://www.anthropic.com/claude)（通过 Claude Code）协作完成。方向、设计取舍和每一次修改的确认由 E3e 负责，Claude 负责以下具体工作：

- **译文核查**：对照英文原文检查 8 种语言，修正发现的错误（例如日、韩、俄三种语言把行号起点方向译反，以及日、韩、俄、德文中误译的术语）。此前的译文并非 Claude 所译。
- **阅读版主题**：页面模板、两套视觉风格（`reader.css`、`style-op.css`）和 `reader.js`，包括导航、本页目录、快速跳转面板、快捷键键帽、截图放大、深浅色模式。
- **搜索**：中文领域词典与查询分词、韩文助词处理，以及 8 种语言的搜索提示文案。
- **构建与发布**：多语言构建脚本、截图转 WebP、缓存版本号、测试和代码审查中发现的问题修复，以及本仓库、README 和 LICENSE 的整理。

## 致谢与授权

文档内容和截图 © 2022 ImperfectLink，保留所有权利，本仓库为非商业镜像。翻译和阅读版主题由 [E3e](https://github.com/Ephem-eral) 制作，采用 MIT 授权。随附的 Sphinx 代码沿用各自的开源授权。详见 [LICENSE](LICENSE)。

本项目为社区作品，与 ImperfectLink 及 Blender 官方无关。
