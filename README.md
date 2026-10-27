# 沉浸式双语译林 · Immersive Bilingual Press `v2.0`

**简体中文** | **繁體中文** | **English** | **日本語**

---

## 🇨🇳 简体中文说明

**沉浸式双语译林 (Immersive Bilingual Press) v2.0** 是一款基于 Chrome / Edge Manifest V3 标准开发的开源双语网页对照翻译扩展。支持**本地大模型 (Ollama / OpenAI 兼容接口)** 与**在线 Google 翻译**双引擎无缝切换，内置**「复古报刊书籍」**与**「液态玻璃」**两套精雕细琢的视觉主题，并提供**简体中文、繁體中文、English、日本語**四种插件界面语言。

### ✨ v2.0 核心特性

| 功能特性 | 详细说明 |
| :--- | :--- |
| **🌍 多语种自由互译** | 支持源语言自动检测及简中、繁中、英、日、韩、法、德、西、俄、葡、阿等 12 种语言任意互译，内置 `⇄` 一键互换与跨语种防复读校验（彻底解决中文译日语等场景不翻译的问题）。 |
| **⚡ 本地大模型 + Google 双引擎** | 既可调用本地 [Ollama](https://ollama.com/) 或 OpenAI 兼容服务（LM Studio / vLLM / llama.cpp），支持**手动输入添加任意本地模型**（如 `gemma3:4b`、`gemma4`、`qwen2.5:7b`、`deepseek-r1` 等）并自动过滤 `<think>` 思考标签；也可一键切换至免 API Key 的 **Google 在线神经网络翻译**。 |
| **📜 复古报刊书籍 & 🫧 液态玻璃双主题** | 默认采用米黄色纸质颗粒纹理、衬线印刷字体与古典双线边框的**「复古报刊书籍」**排版；同时提供多层高斯磨砂、流光折射与胶囊交互的**「液态玻璃」**主题。「还原网页原文」按钮采用与各主题饱和度色调和谐呼应的专属粉红配色。 |
| **🧭 极简一级图标矩阵 + 二级菜单** | 一级主面板仅保留核心双语开关与 4 枚随主题变换风格的定制矢量图标（复古雕版印章 SVG / 液态折射高光 SVG），所有详细配置收纳于流畅的二级子菜单中。 |
| **🗣️ 四国插件界面语言** | 插件内置**简体中文、繁體中文、English、日本語**界面切换，弹窗与网页内划词卡片、悬浮书签实时同步。 |

### 🚀 快速安装与使用指南

1. 下载并解压发布包 `ollama-immersive-translate.zip`。
2. 在浏览器地址栏打开扩展管理页：
   - **Chrome**：`chrome://extensions/`
   - **Edge**：`edge://extensions/`
3. 开启右上角或左侧的 **「开发者模式 (Developer mode)」**。
4. 点击 **「加载已解压的扩展程序 (Load unpacked)」**，选择包含 `manifest.json` 的文件夹即可完成安装。
5. **三种翻译交互方式**：
   - **整页双语对照**：点击插件主按钮、网页右侧悬浮球或按下快捷键 `Alt + A` 开启整页双语；再次点击粉红色**「还原网页原文」**按钮即可恢复原文。
   - **鼠标划词翻译**：选中网页任意词句，点击旁侧浮现的「译」图标弹出可拖拽流式译文卡片。
   - **Alt 悬停段落快译**：将鼠标指针悬停在任意网页段落上，按一下键盘 `Alt` 键即可单独翻译或还原该段落。

### 👨‍💻 关于我｜Azhou 独立游戏开发者 / AI 爱好者

- **Steam 主页**：[https://store.steampowered.com/curator/46288084](https://store.steampowered.com/curator/46288084)
- **GitHub 主页**：[https://github.com/YZ2020CHINA](https://github.com/YZ2020CHINA)
- **Bilibili**：[https://space.bilibili.com/404919238](https://space.bilibili.com/404919238)
- **YouTube**：[https://www.youtube.com/@ams-studio](https://www.youtube.com/@ams-studio)
- **X (Twitter)**：[https://x.com/johnvauk](https://x.com/johnvauk)

---

## 🇹🇼 繁體中文說明

**沉浸式雙語譯林 (Immersive Bilingual Press) v2.0** 是一款基於 Chrome / Edge Manifest V3 標準開發的雙語網頁對照翻譯擴充功能。支援**本地大型語言模型 (Ollama / OpenAI 相容介面)** 與**線上 Google 翻譯**雙引擎自由切換，內建**「復古報刊書籍」**與**「液態玻璃」**兩套主題風格，並支援**簡體中文、繁體中文、English、日本語**四種介面語言。

### ✨ v2.0 核心亮點

| 功能模組 | 詳細說明 |
| :--- | :--- |
| **🌍 多語種自由互譯** | 支援自動檢測來源語言及簡中、繁中、英、日、韓、法、德、西、俄、葡、阿等 12 種語言任意互譯，內建 `⇄` 一鍵互換與跨語種防複讀校驗。 |
| **⚡ 本地大模型 + Google 雙引擎** | 支援自動讀取本地 [Ollama](https://ollama.com/) 模型或**手動輸入新增任意本地模型**（如 `gemma3:4b`、`qwen2.5:7b`、`deepseek-r1` 等），自動相容 `/api/chat`、`/api/generate` 與 `/v1/chat/completions`；亦可一鍵切換為免設定的 **Google 線上翻譯**。 |
| **📜 復古報刊書籍 & 🫧 液態玻璃雙主題** | 預設採用米黃紙質顆粒紋理與襯線印刷字體的**「復古報刊書籍」**排版，亦可切換為高透磨砂與流光折射的**「液態玻璃」**風格。「還原網頁原文」按鈕採用與各主題飽和度色調契合的粉紅色系。 |
| **🧭 一級圖示導覽 + 二級設定選單** | 一級頁面僅呈現核心開關與 4 枚隨整體 UI 風格切換的專屬向量圖示，所有進階設定均收納於二級選單。 |

### 👨‍💻 關於我｜Azhou 獨立遊戲開發者 / AI 愛好者

- **Steam 主頁**：[https://store.steampowered.com/curator/46288084](https://store.steampowered.com/curator/46288084)
- **GitHub 主頁**：[https://github.com/YZ2020CHINA](https://github.com/YZ2020CHINA)
- **Bilibili**：[https://space.bilibili.com/404919238](https://space.bilibili.com/404919238)
- **YouTube**：[https://www.youtube.com/@ams-studio](https://www.youtube.com/@ams-studio)
- **X (Twitter)**：[https://x.com/johnvauk](https://x.com/johnvauk)

---

## 🇺🇸 English Documentation

**Immersive Bilingual Press (`v2.0`)** is a zero-build Chrome / Edge Manifest V3 browser extension for side-by-side bilingual webpage translation, text selection popups, and `Alt`-hover paragraph translation. It combines **Local LLMs (Ollama / OpenAI-compatible APIs)** and **Online Google Translate**, crafted with two distinct visual themes: **Vintage Press (Retro Newspaper & Book)** and **Liquid Glass**.

### ✨ Key Features in v2.0

| Feature | Description |
| :--- | :--- |
| **🌍 Multi-Language Any-to-Any Translation** | Translate seamlessly between 12+ languages (Simplified Chinese, Traditional Chinese, English, Japanese, Korean, French, German, Spanish, Russian, Portuguese, Arabic) with Auto-Detect and one-click language swap (`⇄`). |
| **⚡ Dual Engine: Local LLM + Google Translate** | Run completely locally via [Ollama](https://ollama.com/) (`/api/chat`, `/api/generate`, or OpenAI-compatible `/v1/chat/completions`), manually add any custom local model (`qwen2.5`, `deepseek-r1`, `llama3`, `gemma3:4b`, `gemma4`), or switch to zero-config **Google Translate** anytime. |
| **📜 Vintage Press & 🫧 Liquid Glass Themes** | Choose between **Vintage Press** (warm cream paper texture, classic serif typography, double-rule editorial borders) and **Liquid Glass** (frosted glass blur, ambient light orbs, specular highlights). The "Restore Original Page" button uses a theme-harmonized rose-pink palette. |
| **🧭 Clean 2-Level Menu Architecture** | The Level-1 main view stays clean with the primary action button and a 2×2 grid of theme-adaptive custom SVG icons, while detailed settings live neatly inside Level-2 sub-menus. |
| **🗣️ 4 UI Languages** | Full interface localization in **简体中文**, **繁體中文**, **English**, and **日本語**. |

### 👨‍💻 About the Developer｜Azhou Indie Game Developer / AI Enthusiast

- **Steam Curator**：[https://store.steampowered.com/curator/46288084](https://store.steampowered.com/curator/46288084)
- **GitHub**：[https://github.com/YZ2020CHINA](https://github.com/YZ2020CHINA)
- **Bilibili**：[https://space.bilibili.com/404919238](https://space.bilibili.com/404919238)
- **YouTube**：[https://www.youtube.com/@ams-studio](https://www.youtube.com/@ams-studio)
- **X (Twitter)**：[https://x.com/johnvauk](https://x.com/johnvauk)

---

## 🇯🇵 日本語ドキュメント

**没入型対訳プレス (Immersive Bilingual Press) `v2.0`** は、Chrome / Edge (Manifest V3) に対応したWebページ二言語対訳・選択テキスト翻訳拡張機能です。**ローカル LLM (Ollama / OpenAI 互換 API)** と **Google オンライン翻訳**のデュアルエンジンを搭載し、**「レトロ新聞・書籍」**と**「リキッドガラス」**の2種類のビジュアルテーマ、さらに**簡体字中国語・繁体字中国語・英語・日本語**の4言語UI切り替えに対応しています。

### ✨ v2.0 の主な特徴

| 機能 | 詳細 |
| :--- | :--- |
| **🌍 多言語間の相互翻訳** | 自動検出および中国語（簡体字・繁体字）、日本語、英語、韓国語、フランス語、ドイツ語、スペイン語、ロシア語、ポルトガル語、アラビア語間の相互翻訳に対応。中国語から日本語への翻訳も自然かつ正確に出力します。 |
| **⚡ ローカル LLM + Google 翻訳のデュアルエンジン** | [Ollama](https://ollama.com/) の自動検出に加え、任意のローカルモデル（`gemma3:4b`、`qwen2.5:7b`、`deepseek-r1` など）の手動追加に対応。推論モデルの `<think>` タグも自動除去します。設定不要の **Google オンライン翻訳**へのワンクリック切り替えも可能です。 |
| **📜 レトロ新聞・書籍 & 🫧 リキッドガラスの2大テーマ** | クリーム色の紙質テクスチャと明朝体・セリフ体活字を用いた**「レトロ新聞・書籍」**スタイルと、透明感あふれるブラー効果と光の屈折を表現した**「リキッドガラス」**スタイルを搭載。「元のページに戻す」ボタンは各テーマの彩度・色調に調和したピンク配色を採用しています。 |
| **🧭 2階層メニューとテーマ連動アイコン** | メイン画面には翻訳開始ボタンとテーマごとにデザインされた4つの機能アイコンのみを配置し、詳細設定はすべてサブメニューに整理しました。 |

### 👨‍💻 開発者について｜Azhou インディーゲーム開発者 / AI 愛好家

- **Steam ページ**：[https://store.steampowered.com/curator/46288084](https://store.steampowered.com/curator/46288084)
- **GitHub**：[https://github.com/YZ2020CHINA](https://github.com/YZ2020CHINA)
- **Bilibili**：[https://space.bilibili.com/404919238](https://space.bilibili.com/404919238)
- **YouTube**：[https://www.youtube.com/@ams-studio](https://www.youtube.com/@ams-studio)
- **X (Twitter)**：[https://x.com/johnvauk](https://x.com/johnvauk)
