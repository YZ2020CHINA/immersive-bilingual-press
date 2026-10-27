/**
 * 沉浸式双语译林 v2.0 - 弹窗控制脚本 (Popup)
 * 核心特性：
 * 1. 一级功能图标导航 + 二级设置子菜单切换
 * 2. 四种插件界面语言实时国际化 (简体中文 zh-CN / 繁體中文 zh-TW / English en / 日本語 ja)
 * 3. 双视觉风格切换：复古报刊书籍 (retro-paper) 与 液态玻璃 (liquid-glass)
 * 4. 双翻译引擎切换：本地大模型 (Ollama / OpenAI 兼容服务) 与 Google 在线翻译
 */

const UI_I18N = {
  "zh-CN": {
    edition: "VOL. II · EDITION v2.0",
    logoBadge: "译",
    appTitle: "沉浸式双语译林",
    statusChecking: "检测中...",
    statusGoogleReady: "Google 在线就绪",
    statusLocalOnline: count => `本地已连接 (${count})`,
    statusLocalOffline: "本地未连接",
    btnStartTranslate: "开启整页双语对照",
    btnRestoreOriginal: "还原网页原文",
    navSectionLabel: "功能与设置中心",
    navTitleTranslate: "语种与引擎",
    navTitleAppearance: "外观与语言",
    navSubControls: "划词 · 悬停 · 悬浮球",
    navTitleControls: "交互与快捷键",
    navTitleGuide: "指南与关于",
    navSubGuide: "说明书 · Azhou v2.0",
    backMain: "返回主菜单",
    panelTitleTranslate: "语种与翻译引擎",
    labelLangDirection: "翻译语种方向",
    tagLangDirection: "支持中译日/英等互译",
    labelSourceLang: "源语言",
    labelTargetLang: "目标语言",
    labelEngineSelect: "翻译引擎选择",
    btnEngineOllama: "🦙 本地大模型",
    btnEngineGoogle: "🌐 Google 在线翻译",
    labelLocalModel: "本地已安装模型",
    btnRefreshText: "刷新列表",
    customModelPlaceholder: "输入其他本地模型 (如 qwen2.5:7b, deepseek-r1)",
    addModelBtn: "添加并使用",
    labelCustomHost: "本地 API 地址",
    saveHostBtn: "保存地址",
    modelHintDefault: "支持 Ollama 任意模型及 OpenAI 兼容本地接口",
    modelHintCurrent: m => `当前使用：<code>${m}</code>`,
    modelHintSwitched: m => `已切换至模型：<code>${m}</code>`,
    modelHintAdded: m => `已添加并启用本地模型：<code>${m}</code>`,
    modelHintEmptyErr: "请输入有效的本地模型名称（如 qwen2.5:7b 或 llama3）",
    refreshPageAlert: "提示：请先按 F5 刷新一次当前网页即可生效！",
    noModelDetected: "暂无已检测模型（可在下方手动添加）",
    readingModels: "正在读取本地模型...",
    googleReadyDesc: "✓ 已启用免配置 Google 在线神经网络翻译，无需启动本地 Ollama 服务即可高速互译全部语种。",
    helpBoxTitle: "💡 未检测到本地服务？",
    helpBoxList: `
      <li>可直接点击上方切换为 <b>「🌐 Google 在线翻译」</b> 立即使用；</li>
      <li>若使用本地模型，请确认已启动 <b>Ollama</b>，或在输入框直接填写您本地已安装的任意模型名（如 <code>qwen2.5:7b</code>、<code>llama3.2</code>、<code>gemma3:4b</code>）。</li>
    `,
    panelTitleAppearance: "外观风格与界面语言",
    labelUiTheme: "UI 视觉风格",
    tagUiTheme: "网页与弹窗同步生效",
    btnThemeRetro: "📜 复古报刊书籍",
    btnThemeLiquid: "🫧 液态玻璃",
    themeNameRetro: "复古书报",
    themeNameLiquid: "液态玻璃",
    themeDescHint: "切换后，插件主界面图标、网页双语段落块、划词气泡及悬浮球将同步切换为对应风格。",
    labelUiLang: "插件界面语言 (UI Language)",
    panelTitleControls: "交互与快捷开关",
    swTitleSelection: "🖋️ 鼠标划词翻译",
    swDescSelection: "选中网页任意词句浮现“译”按钮，点击弹出可拖拽翻译卡片",
    swTitleAltHover: "⌨️ Alt 悬停段落翻译",
    swDescAltHover: "鼠标指针悬停在段落上按一下 Alt 键，即刻单独翻译或还原该段",
    swTitleBall: "🔖 页面右侧悬浮球",
    swDescBall: "在网页右侧边缘常驻“译”书签/胶囊，随时一键切换整页双语",
    panelTitleGuide: "使用指南与关于",
    guideSectionTitle: "📖 核心功能使用说明",
    guideListHtml: `
      <li><b>整页双语对照</b>：点击主菜单大按钮、右侧悬浮球或按快捷键 <code>Alt + A</code> 开启；再次点击粉红色「还原网页原文」按钮即可一键恢复。</li>
      <li><b>鼠标划词翻译</b>：用鼠标选中任意外文或中文词句，点击旁侧弹出的「译」图标查看实时流式译文。</li>
      <li><b>Alt 悬停单段快译</b>：将鼠标指向任意段落并按一下 <code>Alt</code> 键，即可单独翻译或还原该段落。</li>
      <li><b>双引擎与本地多模型</b>：在「语种与引擎」中可自由切换<b>本地大模型</b>（支持手动输入添加任意 Ollama / OpenAI 兼容模型）或免配置的 <b>Google 在线翻译</b>。</li>
    `,
    authorHeading: "👨‍💻 关于我｜Azhou 独立游戏开发者 / AI 爱好者",
    engineShortGoogle: "Google 在线",
    engineShortLocal: "本地模型",
    uiLangShort: "简中",
    tagCustom: "✦ 自定义 ",
    tagRec: "★ 推荐 ",
    langNames: {
      "auto": "自动检测",
      "zh-CN": "简体中文",
      "zh-TW": "繁體中文",
      "en": "英语",
      "ja": "日语",
      "ko": "韩语",
      "fr": "法语",
      "de": "德语",
      "es": "西班牙语",
      "ru": "俄语",
      "pt": "葡萄牙语",
      "ar": "阿拉伯语"
    }
  },
  "zh-TW": {
    edition: "VOL. II · EDITION v2.0",
    logoBadge: "譯",
    appTitle: "沉浸式雙語譯林",
    statusChecking: "檢測中...",
    statusGoogleReady: "Google 線上就緒",
    statusLocalOnline: count => `本地已連線 (${count})`,
    statusLocalOffline: "本地未連線",
    btnStartTranslate: "開啟整頁雙語對照",
    btnRestoreOriginal: "還原網頁原文",
    navSectionLabel: "功能與設定中心",
    navTitleTranslate: "語種與引擎",
    navTitleAppearance: "外觀與語言",
    navSubControls: "劃詞 · 懸停 · 懸浮球",
    navTitleControls: "互動與快捷鍵",
    navTitleGuide: "指南與關於",
    navSubGuide: "說明書 · Azhou v2.0",
    backMain: "返回主選單",
    panelTitleTranslate: "語種與翻譯引擎",
    labelLangDirection: "翻譯語種方向",
    tagLangDirection: "支援中譯日/英等互譯",
    labelSourceLang: "來源語言",
    labelTargetLang: "目標語言",
    labelEngineSelect: "翻譯引擎選擇",
    btnEngineOllama: "🦙 本地大模型",
    btnEngineGoogle: "🌐 Google 線上翻譯",
    labelLocalModel: "本地已安裝模型",
    btnRefreshText: "重新整理",
    customModelPlaceholder: "輸入其他本地模型 (如 qwen2.5:7b, deepseek-r1)",
    addModelBtn: "新增並使用",
    labelCustomHost: "本地 API 位址",
    saveHostBtn: "儲存位址",
    modelHintDefault: "支援 Ollama 任意模型及 OpenAI 相容本地介面",
    modelHintCurrent: m => `目前使用：<code>${m}</code>`,
    modelHintSwitched: m => `已切換至模型：<code>${m}</code>`,
    modelHintAdded: m => `已新增並啟用本地模型：<code>${m}</code>`,
    modelHintEmptyErr: "請輸入有效的本地模型名稱（如 qwen2.5:7b 或 llama3）",
    refreshPageAlert: "提示：請先按 F5 重新整理一次目前網頁即可生效！",
    noModelDetected: "暫無已檢測模型（可在下方手動新增）",
    readingModels: "正在讀取本地模型...",
    googleReadyDesc: "✓ 已啟用免設定 Google 線上神經網路翻譯，無需啟動本地 Ollama 服務即可高速互譯全部語種。",
    helpBoxTitle: "💡 未檢測到本地服務？",
    helpBoxList: `
      <li>可直接點擊上方切換為 <b>「🌐 Google 線上翻譯」</b> 立即使用；</li>
      <li>若使用本地模型，請確認已啟動 <b>Ollama</b>，或在輸入框直接填寫您本地已安裝的任意模型名（如 <code>qwen2.5:7b</code>、<code>llama3.2</code>、<code>gemma3:4b</code>）。</li>
    `,
    panelTitleAppearance: "外觀風格與介面語言",
    labelUiTheme: "UI 視覺風格",
    tagUiTheme: "網頁與彈窗同步生效",
    btnThemeRetro: "📜 復古報刊書籍",
    btnThemeLiquid: "🫧 液態玻璃",
    themeNameRetro: "復古書報",
    themeNameLiquid: "液態玻璃",
    themeDescHint: "切換後，外掛主介面圖示、網頁雙語段落塊、劃詞氣泡及懸浮球將同步切換為對應風格。",
    labelUiLang: "外掛介面語言 (UI Language)",
    panelTitleControls: "互動與快捷開關",
    swTitleSelection: "🖋️ 滑鼠劃詞翻譯",
    swDescSelection: "選取網頁任意詞句浮現「譯」按鈕，點擊彈出可拖曳翻譯卡片",
    swTitleAltHover: "⌨️ Alt 懸停段落翻譯",
    swDescAltHover: "滑鼠游標懸停在段落上按一下 Alt 鍵，即刻單獨翻譯或還原該段",
    swTitleBall: "🔖 頁面右側懸浮球",
    swDescBall: "在網頁右側邊緣常駐「譯」書籤/膠囊，隨時一鍵切換整頁雙語",
    panelTitleGuide: "使用指南與關於",
    guideSectionTitle: "📖 核心功能使用說明",
    guideListHtml: `
      <li><b>整頁雙語對照</b>：點擊主選單大按鈕、右側懸浮球或按快捷鍵 <code>Alt + A</code> 開啟；再次點擊粉紅色「還原網頁原文」按鈕即可一鍵恢復。</li>
      <li><b>滑鼠劃詞翻譯</b>：用滑鼠選取任意外文或中文詞句，點擊旁側彈出的「譯」圖示查看即時串流譯文。</li>
      <li><b>Alt 懸停單段快譯</b>：將滑鼠指向任意段落並按一下 <code>Alt</code> 鍵，即可單獨翻譯或還原該段落。</li>
      <li><b>雙引擎與本地多模型</b>：在「語種與引擎」中可自由切換<b>本地大模型</b>（支援手動輸入新增任意 Ollama / OpenAI 相容模型）或免設定的 <b>Google 線上翻譯</b>。</li>
    `,
    authorHeading: "👨‍💻 關於我｜Azhou 獨立遊戲開發者 / AI 愛好者",
    engineShortGoogle: "Google 線上",
    engineShortLocal: "本地模型",
    uiLangShort: "繁中",
    tagCustom: "✦ 自訂 ",
    tagRec: "★ 推薦 ",
    langNames: {
      "auto": "自動檢測",
      "zh-CN": "簡體中文",
      "zh-TW": "繁體中文",
      "en": "英語",
      "ja": "日語",
      "ko": "韓語",
      "fr": "法語",
      "de": "德語",
      "es": "西班牙語",
      "ru": "俄語",
      "pt": "葡萄牙語",
      "ar": "阿拉伯語"
    }
  },
  "en": {
    edition: "VOL. II · EDITION v2.0",
    logoBadge: "Tr",
    appTitle: "Immersive Bilingual Press",
    statusChecking: "Checking...",
    statusGoogleReady: "Google Ready",
    statusLocalOnline: count => `Local Connected (${count})`,
    statusLocalOffline: "Local Offline",
    btnStartTranslate: "Translate Full Page",
    btnRestoreOriginal: "Restore Original Page",
    navSectionLabel: "Settings & Guide Hub",
    navTitleTranslate: "Languages & Engine",
    navTitleAppearance: "Style & UI Language",
    navSubControls: "Select · Alt · Float Ball",
    navTitleControls: "Shortcuts & Controls",
    navTitleGuide: "Guide & About",
    navSubGuide: "Manual · Azhou v2.0",
    backMain: "Back to Menu",
    panelTitleTranslate: "Languages & Engine",
    labelLangDirection: "Language Pair",
    tagLangDirection: "Any-to-Any Translation",
    labelSourceLang: "Source",
    labelTargetLang: "Target",
    labelEngineSelect: "Translation Engine",
    btnEngineOllama: "🦙 Local LLM (Ollama)",
    btnEngineGoogle: "🌐 Google Translate",
    labelLocalModel: "Installed Local Models",
    btnRefreshText: "Refresh",
    customModelPlaceholder: "Add custom model (e.g. qwen2.5:7b, deepseek-r1)",
    addModelBtn: "Add & Use",
    labelCustomHost: "Local API Host",
    saveHostBtn: "Save Host",
    modelHintDefault: "Supports any Ollama model & OpenAI-compatible local endpoints",
    modelHintCurrent: m => `Active model: <code>${m}</code>`,
    modelHintSwitched: m => `Switched to: <code>${m}</code>`,
    modelHintAdded: m => `Added & activated: <code>${m}</code>`,
    modelHintEmptyErr: "Please enter a valid model name (e.g. qwen2.5:7b or llama3)",
    refreshPageAlert: "Tip: Please press F5 to refresh the current tab once!",
    noModelDetected: "No models detected (add below)",
    readingModels: "Loading local models...",
    googleReadyDesc: "✓ Zero-config Google Neural Machine Translation is active. Fast multi-language translation without running local Ollama.",
    helpBoxTitle: "💡 Local service not detected?",
    helpBoxList: `
      <li>Switch to <b>"🌐 Google Translate"</b> above for instant online translation;</li>
      <li>For local LLMs, make sure <b>Ollama</b> is running, or type any installed model name (e.g. <code>qwen2.5:7b</code>, <code>llama3.2</code>, <code>gemma3:4b</code>).</li>
    `,
    panelTitleAppearance: "Theme & UI Language",
    labelUiTheme: "Visual Style",
    tagUiTheme: "Applies to Popup & Webpage",
    btnThemeRetro: "📜 Vintage Press",
    btnThemeLiquid: "🫧 Liquid Glass",
    themeNameRetro: "Vintage Press",
    themeNameLiquid: "Liquid Glass",
    themeDescHint: "Switching style updates menu icons, webpage bilingual blocks, popups, and the floating button in real time.",
    labelUiLang: "Extension UI Language",
    panelTitleControls: "Interaction & Shortcuts",
    swTitleSelection: "🖋️ Text Selection Translate",
    swDescSelection: "Select any text on webpage to show quick translate button & draggable card",
    swTitleAltHover: "⌨️ Alt + Hover Paragraph",
    swDescAltHover: "Hover over a paragraph and press Alt to translate or restore it individually",
    swTitleBall: "🔖 Floating Side Button",
    swDescBall: "Pin a quick toggle badge on the right edge of webpages",
    panelTitleGuide: "User Guide & About",
    guideSectionTitle: "📖 Feature Guide",
    guideListHtml: `
      <li><b>Full-Page Bilingual</b>: Click the main button, side floating badge, or press <code>Alt + A</code>. Click the pink "Restore Original Page" button to revert anytime.</li>
      <li><b>Selection Popup</b>: Highlight any phrase and click the pop-up badge for streaming translation.</li>
      <li><b>Alt Hover Translate</b>: Point at any paragraph and press <code>Alt</code> to toggle translation for that block.</li>
      <li><b>Dual Engines & Custom Models</b>: Switch between <b>Local LLM</b> (add any Ollama / OpenAI-compatible model) and <b>Google Translate</b> in "Languages & Engine".</li>
    `,
    authorHeading: "👨‍💻 About Me｜Azhou Indie Game Dev / AI Enthusiast",
    engineShortGoogle: "Google Online",
    engineShortLocal: "Local LLM",
    uiLangShort: "EN",
    tagCustom: "✦ Custom ",
    tagRec: "★ Recommended ",
    langNames: {
      "auto": "Auto Detect",
      "zh-CN": "Simplified Chinese",
      "zh-TW": "Traditional Chinese",
      "en": "English",
      "ja": "Japanese",
      "ko": "Korean",
      "fr": "French",
      "de": "German",
      "es": "Spanish",
      "ru": "Russian",
      "pt": "Portuguese",
      "ar": "Arabic"
    }
  },
  "ja": {
    edition: "VOL. II · EDITION v2.0",
    logoBadge: "訳",
    appTitle: "没入型対訳プレス",
    statusChecking: "確認中...",
    statusGoogleReady: "Google 翻訳準備完了",
    statusLocalOnline: count => `ローカル接続済 (${count})`,
    statusLocalOffline: "ローカル未接続",
    btnStartTranslate: "ページ全体の対訳を開始",
    btnRestoreOriginal: "元のページに戻す",
    navSectionLabel: "機能・設定メニュー",
    navTitleTranslate: "言語とエンジン",
    navTitleAppearance: "外観と表示言語",
    navSubControls: "選択・Alt・フローティング",
    navTitleControls: "操作とショートカット",
    navTitleGuide: "使い方と開発者情報",
    navSubGuide: "ガイド · Azhou v2.0",
    backMain: "メインへ戻る",
    panelTitleTranslate: "翻訳言語とエンジン",
    labelLangDirection: "翻訳言語ペア",
    tagLangDirection: "多言語間の相互翻訳に対応",
    labelSourceLang: "原文の言語",
    labelTargetLang: "翻訳先の言語",
    labelEngineSelect: "翻訳エンジン",
    btnEngineOllama: "🦙 ローカル LLM",
    btnEngineGoogle: "🌐 Google オンライン翻訳",
    labelLocalModel: "ローカルモデル一覧",
    btnRefreshText: "リスト更新",
    customModelPlaceholder: "モデル名を入力 (例: qwen2.5:7b, deepseek-r1)",
    addModelBtn: "追加して使用",
    labelCustomHost: "ローカル API アドレス",
    saveHostBtn: "保存",
    modelHintDefault: "Ollama の全モデルおよび OpenAI 互換ローカル API に対応",
    modelHintCurrent: m => `使用中モデル：<code>${m}</code>`,
    modelHintSwitched: m => `モデル切替完了：<code>${m}</code>`,
    modelHintAdded: m => `ローカルモデルを追加しました：<code>${m}</code>`,
    modelHintEmptyErr: "有効なモデル名を入力してください（例: qwen2.5:7b）",
    refreshPageAlert: "ヒント：現在のページを F5 キーで一度再読み込みしてください！",
    noModelDetected: "モデル未検出（下から手動追加可能）",
    readingModels: "ローカルモデルを読み込み中...",
    googleReadyDesc: "✓ 設定不要の Google ニューラル翻訳が有効です。Ollama を起動せずに全言語を高速翻訳できます。",
    helpBoxTitle: "💡 ローカルサービスが見つかりませんか？",
    helpBoxList: `
      <li>上の<b>「🌐 Google オンライン翻訳」</b>に切り替えるとすぐに翻訳できます。</li>
      <li>ローカルモデルを使う場合は <b>Ollama</b> を起動するか、インストール済みのモデル名（<code>qwen2.5:7b</code>、<code>gemma3:4b</code> など）を直接入力して追加してください。</li>
    `,
    panelTitleAppearance: "外観テーマと表示言語",
    labelUiTheme: "UI ビジュアルスタイル",
    tagUiTheme: "ポップアップとページに即時反映",
    btnThemeRetro: "📜 レトロ新聞・書籍",
    btnThemeLiquid: "🫧 リキッドガラス",
    themeNameRetro: "レトロ書報",
    themeNameLiquid: "リキッドガラス",
    themeDescHint: "テーマを切り替えると、メニューアイコン、ページ内の対訳ブロック、ポップアップが同期して変化します。",
    labelUiLang: "拡張機能の表示言語 (UI Language)",
    panelTitleControls: "インタラクション設定",
    swTitleSelection: "🖋️ テキスト選択翻訳",
    swDescSelection: "文字を選択すると「訳」アイコンが表示され、ポップアップで対訳を表示",
    swTitleAltHover: "⌨️ Alt ホバー段落翻訳",
    swDescAltHover: "段落にカーソルを合わせて Alt キーを押すと、その段落だけを翻訳/復元",
    swTitleBall: "🔖 画面右端のフローティング球",
    swDescBall: "画面右端に「訳」バッジを表示し、ワンクリックでページ対訳を切替",
    panelTitleGuide: "使い方ガイドと開発者情報",
    guideSectionTitle: "📖 主な機能の使い方",
    guideListHtml: `
      <li><b>ページ全体の対訳</b>：メインボタン、右端バッジ、または <code>Alt + A</code> で開始。ピンク色の「元のページに戻す」ボタンでいつでも復元できます。</li>
      <li><b>選択テキスト翻訳</b>：ページ上の語句をドラッグ選択し、「訳」ボタンを押すとストリーミング翻訳カードが表示されます。</li>
      <li><b>Alt ホバー段落翻訳</b>：段落にマウスを乗せて <code>Alt</code> キーを押すと、段落単位で素早く翻訳・復元できます。</li>
      <li><b>デュアルエンジン対応</b>：「言語とエンジン」から<b>ローカル LLM</b>（任意の Ollama モデル追加対応）と <b>Google 翻訳</b>を自在に切り替えられます。</li>
    `,
    authorHeading: "👨‍💻 開発者について｜Azhou インディーゲーム開発者 / AI 愛好家",
    engineShortGoogle: "Google 翻訳",
    engineShortLocal: "ローカル LLM",
    uiLangShort: "日本語",
    tagCustom: "✦ カスタム ",
    tagRec: "★ 推奨 ",
    langNames: {
      "auto": "自動検出",
      "zh-CN": "簡体字中国語",
      "zh-TW": "繁体字中国語",
      "en": "英語",
      "ja": "日本語",
      "ko": "韓国語",
      "fr": "フランス語",
      "de": "ドイツ語",
      "es": "スペイン語",
      "ru": "ロシア語",
      "pt": "ポルトガル語",
      "ar": "アラビア語"
    }
  }
};

// DOM 引用
const mainView = document.getElementById("main-view");
const subPanels = document.querySelectorAll(".sub-panel");
const navCards = document.querySelectorAll(".nav-icon-card");
const backButtons = document.querySelectorAll("[data-back-main]");

const statusPill = document.getElementById("status-pill");
const subtitleText = document.getElementById("subtitle-text");
const togglePageBtn = document.getElementById("toggle-page-btn");
const toggleBtnText = document.getElementById("toggle-btn-text");
const currentSummaryPill = document.getElementById("current-summary-pill");

const themeSwitcher = document.getElementById("theme-switcher");
const uiLangSwitcher = document.getElementById("ui-lang-switcher");
const engineSwitcher = document.getElementById("engine-switcher");
const ollamaPanel = document.getElementById("ollama-panel");
const googlePanel = document.getElementById("google-panel");

const sourceLangSelect = document.getElementById("source-lang-select");
const targetLangSelect = document.getElementById("target-lang-select");
const swapLangBtn = document.getElementById("swap-lang-btn");

const modelSelect = document.getElementById("model-select");
const refreshModelsBtn = document.getElementById("refresh-models-btn");
const customModelInput = document.getElementById("custom-model-input");
const addModelBtn = document.getElementById("add-model-btn");

const ollamaHostInput = document.getElementById("ollama-host-input");
const saveHostBtn = document.getElementById("save-host-btn");
const hostDisplay = document.getElementById("host-display");

const modelHint = document.getElementById("model-hint");
const helpBox = document.getElementById("help-box");

const swSelection = document.getElementById("sw-selection");
const swAltHover = document.getElementById("sw-alt-hover");
const swFloatingBall = document.getElementById("sw-floating-ball");

let isCurrentTabTranslated = false;
let cachedModels = [];

let currentConfig = {
  translateEngine: "ollama",
  ollamaHost: "http://localhost:11434",
  selectedModel: "",
  customModels: [],
  sourceLang: "auto",
  targetLang: "zh-CN",
  uiTheme: "retro-paper",
  uiLang: "zh-CN",
  enableSelection: true,
  enableAltHover: true,
  enableFloatingBall: true
};

function t() {
  return UI_I18N[currentConfig.uiLang] || UI_I18N["zh-CN"];
}

function formatSize(bytes) {
  if (!bytes || isNaN(bytes)) return "";
  const gb = bytes / (1024 * 1024 * 1024);
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

// ==================== 1. 一级/二级视图导航 ====================
function openSubPanel(panelId) {
  mainView.classList.add("hidden");
  subPanels.forEach(p => {
    p.classList.toggle("hidden", p.id !== panelId);
  });
}

function returnToMainView() {
  subPanels.forEach(p => p.classList.add("hidden"));
  mainView.classList.remove("hidden");
  updateMainViewSummaries();
}

navCards.forEach(card => {
  card.addEventListener("click", () => {
    const targetId = card.dataset.targetPanel;
    if (targetId) openSubPanel(targetId);
  });
});

backButtons.forEach(btn => {
  btn.addEventListener("click", returnToMainView);
});

// ==================== 2. 初始化与多语言 UI 渲染 ====================
async function initPopup() {
  const cfg = await chrome.storage.local.get(Object.keys(currentConfig));
  currentConfig = { ...currentConfig, ...cfg };

  applyThemeUI(currentConfig.uiTheme || "retro-paper");
  applyUiLanguage(currentConfig.uiLang || "zh-CN");

  sourceLangSelect.value = currentConfig.sourceLang || "auto";
  targetLangSelect.value = currentConfig.targetLang || "zh-CN";

  applyEngineUI(currentConfig.translateEngine || "ollama");

  const hostVal = currentConfig.ollamaHost || "http://localhost:11434";
  ollamaHostInput.value = hostVal;
  hostDisplay.textContent = hostVal;

  swSelection.checked = currentConfig.enableSelection !== false;
  swAltHover.checked = currentConfig.enableAltHover !== false;
  swFloatingBall.checked = currentConfig.enableFloatingBall !== false;

  updateMainViewSummaries();

  // 查询当前网页是否处于整页双语状态
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_STATE" }, res => {
        if (!chrome.runtime.lastError && res) {
          isCurrentTabTranslated = Boolean(res.isPageTranslated);
          updatePrimaryButtonUI(isCurrentTabTranslated);
        }
      });
    }
  } catch (_) {}

  if (currentConfig.translateEngine === "google") {
    statusPill.className = "status-pill online";
    statusPill.textContent = t().statusGoogleReady;
    helpBox.classList.add("hidden");
    loadLocalModels(true);
  } else {
    await loadLocalModels(false);
  }
}

function applyUiLanguage(langCode) {
  currentConfig.uiLang = UI_I18N[langCode] ? langCode : "zh-CN";
  const dict = t();

  // 更新按钮选中态
  const langBtns = uiLangSwitcher.querySelectorAll(".lang-chip-btn");
  langBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.uilangVal === currentConfig.uiLang);
  });

  // 头部与主视图文案
  document.getElementById("masthead-edition").textContent = dict.edition;
  document.getElementById("logo-badge-text").textContent = dict.logoBadge;
  document.getElementById("app-title").textContent = dict.appTitle;
  document.getElementById("nav-section-label").textContent = dict.navSectionLabel;

  document.getElementById("nav-title-translate").textContent = dict.navTitleTranslate;
  document.getElementById("nav-title-appearance").textContent = dict.navTitleAppearance;
  document.getElementById("nav-title-controls").textContent = dict.navTitleControls;
  document.getElementById("nav-sub-controls").textContent = dict.navSubControls;
  document.getElementById("nav-title-guide").textContent = dict.navTitleGuide;
  document.getElementById("nav-sub-guide").textContent = dict.navSubGuide;

  document.querySelectorAll(".i18n-back").forEach(el => {
    el.textContent = dict.backMain;
  });

  // 二级面板 1：语种与引擎
  document.getElementById("panel-title-translate").textContent = dict.panelTitleTranslate;
  document.getElementById("label-lang-direction").textContent = dict.labelLangDirection;
  document.getElementById("tag-lang-direction").textContent = dict.tagLangDirection;
  document.getElementById("label-source-lang").textContent = dict.labelSourceLang;
  document.getElementById("label-target-lang").textContent = dict.labelTargetLang;
  document.getElementById("label-engine-select").textContent = dict.labelEngineSelect;
  document.getElementById("btn-engine-ollama").textContent = dict.btnEngineOllama;
  document.getElementById("btn-engine-google").textContent = dict.btnEngineGoogle;
  document.getElementById("label-local-model").textContent = dict.labelLocalModel;
  document.getElementById("btn-refresh-text").textContent = dict.btnRefreshText;
  customModelInput.placeholder = dict.customModelPlaceholder;
  addModelBtn.textContent = dict.addModelBtn;
  document.getElementById("label-custom-host").textContent = dict.labelCustomHost;
  saveHostBtn.textContent = dict.saveHostBtn;
  document.getElementById("google-ready-desc").textContent = dict.googleReadyDesc;
  document.getElementById("help-box-title").textContent = dict.helpBoxTitle;
  document.getElementById("help-box-list").innerHTML = dict.helpBoxList;

  // 更新源语言与目标语言下拉框选项显示文字
  Array.from(sourceLangSelect.options).forEach(opt => {
    if (dict.langNames[opt.value]) {
      opt.textContent = dict.langNames[opt.value];
    }
  });
  Array.from(targetLangSelect.options).forEach(opt => {
    if (dict.langNames[opt.value]) {
      opt.textContent = dict.langNames[opt.value];
    }
  });

  // 二级面板 2：外观与语言（严格命名“液态玻璃”）
  document.getElementById("panel-title-appearance").textContent = dict.panelTitleAppearance;
  document.getElementById("label-ui-theme").textContent = dict.labelUiTheme;
  document.getElementById("tag-ui-theme").textContent = dict.tagUiTheme;
  document.getElementById("btn-theme-retro").textContent = dict.btnThemeRetro;
  document.getElementById("btn-theme-liquid").textContent = dict.btnThemeLiquid;
  document.getElementById("theme-desc-hint").textContent = dict.themeDescHint;
  document.getElementById("label-ui-lang").textContent = dict.labelUiLang;

  // 二级面板 3：交互与快捷键
  document.getElementById("panel-title-controls").textContent = dict.panelTitleControls;
  document.getElementById("sw-title-selection").textContent = dict.swTitleSelection;
  document.getElementById("sw-desc-selection").textContent = dict.swDescSelection;
  document.getElementById("sw-title-althover").textContent = dict.swTitleAltHover;
  document.getElementById("sw-desc-althover").textContent = dict.swDescAltHover;
  document.getElementById("sw-title-ball").textContent = dict.swTitleBall;
  document.getElementById("sw-desc-ball").textContent = dict.swDescBall;

  // 二级面板 4：使用指南与关于我
  document.getElementById("panel-title-guide").textContent = dict.panelTitleGuide;
  document.getElementById("guide-section-title").textContent = dict.guideSectionTitle;
  document.getElementById("guide-list-content").innerHTML = dict.guideListHtml;
  document.getElementById("author-heading").textContent = dict.authorHeading;

  updatePrimaryButtonUI(isCurrentTabTranslated);
  updateMainViewSummaries();
  if (cachedModels.length > 0) {
    renderModelOptions(cachedModels, currentConfig.selectedModel);
  }
}

function applyThemeUI(theme) {
  document.body.setAttribute("data-theme", theme);
  const buttons = themeSwitcher.querySelectorAll(".seg-btn");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.themeVal === theme);
  });
  updateMainViewSummaries();
}

function applyEngineUI(engine) {
  const buttons = engineSwitcher.querySelectorAll(".seg-btn");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.engineVal === engine);
  });

  if (engine === "google") {
    ollamaPanel.classList.add("hidden");
    googlePanel.classList.remove("hidden");
    statusPill.className = "status-pill online";
    statusPill.textContent = t().statusGoogleReady;
    helpBox.classList.add("hidden");
  } else {
    ollamaPanel.classList.remove("hidden");
    googlePanel.classList.add("hidden");
  }
  updateMainViewSummaries();
}

function updateMainViewSummaries() {
  const dict = t();
  const srcName = dict.langNames[sourceLangSelect.value] || dict.langNames["auto"];
  const tgtName = dict.langNames[targetLangSelect.value] || dict.langNames["zh-CN"];
  const engineLabel =
    currentConfig.translateEngine === "google"
      ? dict.engineShortGoogle
      : currentConfig.selectedModel || dict.engineShortLocal;

  subtitleText.textContent = `${srcName} ➔ ${tgtName} · ${engineLabel}`;

  const navSubTranslate = document.getElementById("nav-sub-translate");
  if (navSubTranslate) {
    navSubTranslate.textContent = `${srcName} ➔ ${tgtName}`;
  }

  const themeName =
    currentConfig.uiTheme === "liquid-glass" ? dict.themeNameLiquid : dict.themeNameRetro;
  const navSubAppearance = document.getElementById("nav-sub-appearance");
  if (navSubAppearance) {
    navSubAppearance.textContent = `${themeName} · ${dict.uiLangShort}`;
  }

  if (currentSummaryPill) {
    currentSummaryPill.textContent = `${themeName} · ${engineLabel}`;
  }
}

function updatePrimaryButtonUI(isTranslated) {
  isCurrentTabTranslated = Boolean(isTranslated);
  const dict = t();
  if (isCurrentTabTranslated) {
    togglePageBtn.classList.add("active");
    toggleBtnText.textContent = dict.btnRestoreOriginal;
  } else {
    togglePageBtn.classList.remove("active");
    toggleBtnText.textContent = dict.btnStartTranslate;
  }
}

// ==================== 3. 读取本地模型列表 ====================
async function loadLocalModels(silent = false) {
  const dict = t();
  if (!silent) {
    statusPill.className = "status-pill checking";
    statusPill.textContent = dict.statusChecking;
    modelSelect.innerHTML = `<option value="">${escapeHtml(dict.readingModels)}</option>`;
  }

  chrome.runtime.sendMessage(
    {
      type: "FETCH_MODELS",
      ollamaHost: currentConfig.ollamaHost,
      selectedModel: currentConfig.selectedModel
    },
    response => {
      if (chrome.runtime.lastError || !response) {
        if (!silent) {
          statusPill.className = "status-pill offline";
          statusPill.textContent = t().statusLocalOffline;
          modelSelect.innerHTML = `<option value="">${escapeHtml(t().noModelDetected)}</option>`;
          helpBox.classList.remove("hidden");
        }
        return;
      }

      const { ok, models = [], selectedModel } = response;
      cachedModels = models;

      if (!silent) {
        if (ok) {
          statusPill.className = "status-pill online";
          statusPill.textContent = t().statusLocalOnline(models.length);
          helpBox.classList.add("hidden");
        } else {
          statusPill.className = "status-pill offline";
          statusPill.textContent = t().statusLocalOffline;
          helpBox.classList.remove("hidden");
        }
      }

      renderModelOptions(models, selectedModel);
      updateMainViewSummaries();
    }
  );
}

function renderModelOptions(models, selectedModel) {
  const dict = t();
  modelSelect.innerHTML = "";

  if (!models || models.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = dict.noModelDetected;
    modelSelect.appendChild(opt);
    return;
  }

  for (const m of models) {
    const opt = document.createElement("option");
    opt.value = m.name;
    const sizeStr = formatSize(m.size);
    const isGemma = m.name.toLowerCase().includes("gemma");
    const prefix = m.isCustom ? dict.tagCustom : isGemma ? dict.tagRec : "";
    opt.textContent = `${prefix}${m.name}${sizeStr ? ` (${sizeStr})` : ""}`;
    if (m.name === selectedModel) {
      opt.selected = true;
    }
    modelSelect.appendChild(opt);
  }

  if (selectedModel) {
    currentConfig.selectedModel = selectedModel;
    modelHint.innerHTML = dict.modelHintCurrent(escapeHtml(selectedModel));
  }
}

// ==================== 4. 事件绑定 ====================

// 4.1 主题切换（复古报刊书籍 vs 液态玻璃）
themeSwitcher.addEventListener("click", async e => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  const theme = btn.dataset.themeVal;
  if (!theme) return;
  currentConfig.uiTheme = theme;
  applyThemeUI(theme);
  await chrome.storage.local.set({ uiTheme: theme });
});

// 4.2 插件界面语言切换（简体 / 繁体 / English / 日本語）
uiLangSwitcher.addEventListener("click", async e => {
  const btn = e.target.closest(".lang-chip-btn");
  if (!btn) return;
  const newLang = btn.dataset.uilangVal;
  if (!newLang) return;
  applyUiLanguage(newLang);
  await chrome.storage.local.set({ uiLang: newLang });
});

// 4.3 翻译引擎切换
engineSwitcher.addEventListener("click", async e => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  const engine = btn.dataset.engineVal;
  if (!engine) return;
  currentConfig.translateEngine = engine;
  applyEngineUI(engine);
  await chrome.storage.local.set({ translateEngine: engine });
  if (engine === "ollama") {
    loadLocalModels(false);
  }
});

// 4.4 源语言 & 目标语言切换
sourceLangSelect.addEventListener("change", async () => {
  currentConfig.sourceLang = sourceLangSelect.value;
  updateMainViewSummaries();
  await chrome.storage.local.set({ sourceLang: currentConfig.sourceLang });
});

targetLangSelect.addEventListener("change", async () => {
  currentConfig.targetLang = targetLangSelect.value;
  updateMainViewSummaries();
  await chrome.storage.local.set({ targetLang: currentConfig.targetLang });
});

swapLangBtn.addEventListener("click", async () => {
  const src = sourceLangSelect.value;
  const tgt = targetLangSelect.value;

  const newSrc = tgt;
  const newTgt = src === "auto" ? (tgt === "zh-CN" ? "en" : "zh-CN") : src;

  sourceLangSelect.value = newSrc;
  targetLangSelect.value = newTgt;
  currentConfig.sourceLang = newSrc;
  currentConfig.targetLang = newTgt;
  updateMainViewSummaries();

  await chrome.storage.local.set({
    sourceLang: newSrc,
    targetLang: newTgt
  });
});

// 4.5 切换本地模型
modelSelect.addEventListener("change", async () => {
  const chosen = modelSelect.value;
  if (chosen) {
    currentConfig.selectedModel = chosen;
    await chrome.storage.local.set({ selectedModel: chosen });
    modelHint.innerHTML = t().modelHintSwitched(escapeHtml(chosen));
    updateMainViewSummaries();
  }
});

refreshModelsBtn.addEventListener("click", () => {
  loadLocalModels(false);
});

// 4.6 手动添加本地其他模型
async function handleAddCustomModel() {
  const name = (customModelInput.value || "").trim();
  if (!name) {
    modelHint.innerHTML = `<span style="color:#b91c1c;">${escapeHtml(t().modelHintEmptyErr)}</span>`;
    return;
  }

  chrome.runtime.sendMessage(
    { type: "ADD_CUSTOM_MODEL", modelName: name },
    response => {
      if (response && response.selectedModel) {
        customModelInput.value = "";
        currentConfig.selectedModel = response.selectedModel;
        cachedModels = response.models || [{ name, isCustom: true }];
        renderModelOptions(cachedModels, response.selectedModel);
        modelHint.innerHTML = t().modelHintAdded(escapeHtml(response.selectedModel));
        updateMainViewSummaries();
      }
    }
  );
}

addModelBtn.addEventListener("click", handleAddCustomModel);
customModelInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleAddCustomModel();
  }
});

// 4.7 保存自定义本地 API 地址
saveHostBtn.addEventListener("click", async () => {
  const rawHost = (ollamaHostInput.value || "http://localhost:11434").trim().replace(/\/+$/, "");
  currentConfig.ollamaHost = rawHost;
  hostDisplay.textContent = rawHost;
  await chrome.storage.local.set({ ollamaHost: rawHost });
  loadLocalModels(false);
});

// 4.8 交互开关
swSelection.addEventListener("change", () => {
  chrome.storage.local.set({ enableSelection: swSelection.checked });
});

swAltHover.addEventListener("change", () => {
  chrome.storage.local.set({ enableAltHover: swAltHover.checked });
});

swFloatingBall.addEventListener("change", () => {
  chrome.storage.local.set({ enableFloatingBall: swFloatingBall.checked });
});

// 4.9 开启/还原整页双语对照
togglePageBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_PAGE_TRANSLATE" }, res => {
    if (chrome.runtime.lastError) {
      openSubPanel("panel-translate");
      modelHint.innerHTML = `<span style="color:#b91c1c;">${escapeHtml(t().refreshPageAlert)}</span>`;
      return;
    }
    if (res) {
      updatePrimaryButtonUI(res.isPageTranslated);
      window.close();
    }
  });
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", initPopup);