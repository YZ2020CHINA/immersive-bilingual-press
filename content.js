/**
 * Ollama & Google 沉浸式翻译 v2.0 - 网页端核心交互脚本 (Content Script)
 * 支持：
 * 1. 多语种智能识别与过滤（彻底修复中文网页翻日语/英语等被跳过不翻译的问题，以及日文汉字被误判为中文的问题）
 * 2. 双翻译引擎联动（本地 Ollama / 自定义模型 + Google 在线翻译）
 * 3. 双 UI 视觉主题实时切换（复古报纸书籍风格 retro-paper / 液态玻璃风格 liquid-glass）
 * 4. 插件 4 种界面语言同步（简体中文 zh-CN / 繁體中文 zh-TW / English en / 日本語 ja）
 * 5. 整页段落双语对照、鼠标划词翻译、Alt 悬停段落翻译、右侧悬浮球与 Alt+A 快捷键
 */

(() => {
  if (window.__OIT_INITIALIZED__) return;
  window.__OIT_INITIALIZED__ = true;

  const CONTENT_I18N = {
    "zh-CN": {
      badge: "译",
      activePrefix: "还原·",
      popupBrand: "沉浸式译林",
      copy: "复制",
      copied: "已复制",
      close: "关闭",
      thinking: "正在潜心译介...",
      translatingWith: (engine, tgt) => `正在使用 ${engine} 译为 ${tgt}...`,
      errorPrefix: "翻译出错：",
      googleName: "Google 翻译",
      localDefault: "本地大模型",
      ballTooltip: "点击开启/还原整页双语翻译 (快捷键 Alt + A)",
      langLabels: {
        "auto": "自动",
        "zh-CN": "简中",
        "zh-TW": "繁中",
        "en": "英语",
        "ja": "日语",
        "ko": "韩语",
        "fr": "法语",
        "de": "德语",
        "es": "西语",
        "ru": "俄语",
        "pt": "葡语",
        "ar": "阿语"
      }
    },
    "zh-TW": {
      badge: "譯",
      activePrefix: "還原·",
      popupBrand: "沉浸式譯林",
      copy: "複製",
      copied: "已複製",
      close: "關閉",
      thinking: "正在潛心譯介...",
      translatingWith: (engine, tgt) => `正在使用 ${engine} 譯為 ${tgt}...`,
      errorPrefix: "翻譯出錯：",
      googleName: "Google 翻譯",
      localDefault: "本地大模型",
      ballTooltip: "點擊開啟/還原整頁雙語翻譯 (快捷鍵 Alt + A)",
      langLabels: {
        "auto": "自動",
        "zh-CN": "簡中",
        "zh-TW": "繁中",
        "en": "英語",
        "ja": "日語",
        "ko": "韓語",
        "fr": "法語",
        "de": "德語",
        "es": "西語",
        "ru": "俄語",
        "pt": "葡語",
        "ar": "阿語"
      }
    },
    "en": {
      badge: "Tr",
      activePrefix: "Restore·",
      popupBrand: "Immersive Press",
      copy: "Copy",
      copied: "Copied",
      close: "Close",
      thinking: "Translating...",
      translatingWith: (engine, tgt) => `Translating into ${tgt} via ${engine}...`,
      errorPrefix: "Error: ",
      googleName: "Google Translate",
      localDefault: "Local LLM",
      ballTooltip: "Toggle full-page bilingual translation (Alt + A)",
      langLabels: {
        "auto": "Auto",
        "zh-CN": "ZH-CN",
        "zh-TW": "ZH-TW",
        "en": "EN",
        "ja": "JA",
        "ko": "KO",
        "fr": "FR",
        "de": "DE",
        "es": "ES",
        "ru": "RU",
        "pt": "PT",
        "ar": "AR"
      }
    },
    "ja": {
      badge: "訳",
      activePrefix: "復元·",
      popupBrand: "没入型対訳",
      copy: "コピー",
      copied: "完了",
      close: "閉じる",
      thinking: "翻訳中...",
      translatingWith: (engine, tgt) => `${engine} で ${tgt} に翻訳中...`,
      errorPrefix: "翻訳エラー：",
      googleName: "Google 翻訳",
      localDefault: "ローカル LLM",
      ballTooltip: "ページ全体の対訳を切替 (Alt + A)",
      langLabels: {
        "auto": "自動",
        "zh-CN": "簡体中",
        "zh-TW": "繁体中",
        "en": "英語",
        "ja": "日本語",
        "ko": "韓国語",
        "fr": "仏語",
        "de": "独語",
        "es": "西語",
        "ru": "露語",
        "pt": "葡語",
        "ar": "アラビア語"
      }
    }
  };

  let settings = {
    translateEngine: "ollama",
    selectedModel: "",
    sourceLang: "auto",
    targetLang: "zh-CN",
    uiTheme: "retro-paper",
    uiLang: "zh-CN",
    enableSelection: true,
    enableAltHover: true,
    enableFloatingBall: true
  };

  let isPageTranslated = false;
  let port = null;
  let reqCounter = 0;
  const pendingCallbacks = new Map();

  let activeCount = 0;
  const translationQueue = [];
  let intersectionObserver = null;

  let currentHoveredBlock = null;
  let altHoverTimer = null;

  let selectionBtn = null;
  let selectionPopup = null;
  let currentSelectionText = "";
  let currentSelectionReqId = null;

  let floatingBall = null;

  function i18n() {
    return CONTENT_I18N[settings.uiLang] || CONTENT_I18N["zh-CN"];
  }

  function getMaxConcurrent() {
    return settings.translateEngine === "google" ? 5 : 2;
  }

  chrome.storage.local.get(Object.keys(settings), stored => {
    settings = { ...settings, ...stored };
    applyThemeToInjectedElements();
    updateFloatingBallVisibility();
    updateFloatingBallState();
  });

  chrome.storage.onChanged.addListener(changes => {
    let engineOrLangChanged = false;
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key in settings && newValue !== undefined) {
        if (
          (key === "targetLang" || key === "sourceLang" || key === "translateEngine" || key === "selectedModel") &&
          settings[key] !== newValue
        ) {
          engineOrLangChanged = true;
        }
        settings[key] = newValue;
      }
    }
    applyThemeToInjectedElements();
    updateFloatingBallVisibility();
    updateFloatingBallState();

    if (engineOrLangChanged && isPageTranslated) {
      stopPageTranslation();
      startPageTranslation();
    }
  });

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "TOGGLE_PAGE_TRANSLATE") {
      togglePageTranslation();
      sendResponse({ isPageTranslated });
      return true;
    }
    if (msg.type === "GET_PAGE_STATE") {
      sendResponse({ isPageTranslated });
      return true;
    }
    if (msg.type === "RETRANSLATE_PAGE") {
      if (isPageTranslated) {
        stopPageTranslation();
      }
      startPageTranslation();
      sendResponse({ isPageTranslated: true });
      return true;
    }
  });

  function applyThemeToInjectedElements() {
    const theme = settings.uiTheme || "retro-paper";
    document.documentElement.setAttribute("data-oit-theme", theme);

    const nodes = document.querySelectorAll(
      ".oit-bilingual-block, #oit-selection-btn, #oit-selection-popup, #oit-floating-ball"
    );
    nodes.forEach(node => {
      node.setAttribute("data-oit-theme", theme);
    });
  }

  function getPort() {
    if (port) return port;
    port = chrome.runtime.connect({ name: "ollama-translate-stream" });

    port.onMessage.addListener(msg => {
      const cb = pendingCallbacks.get(msg.requestId);
      if (!cb) return;

      if (msg.type === "CHUNK") {
        cb.onChunk && cb.onChunk(msg.fullText, msg.model);
      } else if (msg.type === "DONE") {
        pendingCallbacks.delete(msg.requestId);
        cb.onDone && cb.onDone(msg.fullText, msg.model);
      } else if (msg.type === "ERROR") {
        pendingCallbacks.delete(msg.requestId);
        cb.onError && cb.onError(msg.error);
      }
    });

    port.onDisconnect.addListener(() => {
      port = null;
      for (const [, cb] of pendingCallbacks) {
        cb.onError && cb.onError("Connection closed");
      }
      pendingCallbacks.clear();
    });

    return port;
  }

  function requestStreamingTranslation(text, { onChunk, onDone, onError }) {
    const requestId = `req_${Date.now()}_${++reqCounter}`;
    const activePort = getPort();
    pendingCallbacks.set(requestId, { onChunk, onDone, onError });
    activePort.postMessage({
      action: "TRANSLATE",
      requestId,
      text,
      translateEngine: settings.translateEngine,
      sourceLang: settings.sourceLang,
      targetLang: settings.targetLang
    });
    return requestId;
  }

  function cancelStreamingRequest(requestId) {
    if (!requestId) return;
    pendingCallbacks.delete(requestId);
    if (port) {
      try {
        port.postMessage({ action: "CANCEL", requestId });
      } catch (_) {}
    }
  }

  function shouldTranslateText(text, force = false) {
    if (!text) return false;
    const trimmed = text.replace(/\s+/g, " ").trim();
    if (trimmed.length < (force ? 1 : 2)) return false;

    if (/^[0-9\s\p{P}\p{S}]+$/u.test(trimmed)) return false;
    if (/^https?:\/\/\S+$/i.test(trimmed)) return false;

    if (force) return true;

    const noSpace = trimmed.replace(/\s+/g, "");
    const totalChars = noSpace.length;
    if (totalChars === 0) return false;

    const targetLang = settings.targetLang || "zh-CN";
    const sourceLang = settings.sourceLang || "auto";

    if (sourceLang !== "auto" && sourceLang !== targetLang) {
      return true;
    }

    const hanChars = (noSpace.match(/[\u4e00-\u9fa5]/g) || []).length;
    const kanaChars = (noSpace.match(/[\u3040-\u30ff]/g) || []).length;
    const hangulChars = (noSpace.match(/[\uac00-\ud7af\u1100-\u11ff]/g) || []).length;

    if (targetLang === "zh-CN" || targetLang === "zh-TW") {
      if (kanaChars === 0 && hanChars / totalChars > 0.72) {
        return false;
      }
      return true;
    }

    if (targetLang === "ja") {
      if (kanaChars / totalChars > 0.35) {
        return false;
      }
      return true;
    }

    if (targetLang === "ko") {
      if (hangulChars / totalChars > 0.6) {
        return false;
      }
      return true;
    }

    return true;
  }

  function extractOriginalText(el) {
    if (!el) return "";
    const clone = el.cloneNode(true);
    const injected = clone.querySelectorAll(
      ".oit-bilingual-block, #oit-selection-btn, #oit-selection-popup"
    );
    injected.forEach(node => node.remove());
    return (clone.innerText || clone.textContent || "").replace(/\s+/g, " ").trim();
  }

  function collectTranslatableBlocks() {
    const selector = "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dd, td";
    const candidates = Array.from(document.querySelectorAll(selector));
    const validBlocks = [];

    const skipTags = new Set([
      "SCRIPT",
      "STYLE",
      "CODE",
      "PRE",
      "SVG",
      "NOSCRIPT",
      "TEXTAREA",
      "INPUT",
      "SELECT",
      "BUTTON"
    ]);

    for (const el of candidates) {
      if (
        el.closest(
          "#oit-selection-popup, #oit-floating-ball, nav, footer, pre, code, [contenteditable='true']"
        )
      ) {
        continue;
      }
      if (skipTags.has(el.tagName)) continue;

      if (el.querySelector("p, h1, h2, h3, h4, h5, h6, li, blockquote")) {
        continue;
      }

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const text = extractOriginalText(el);
      if (!shouldTranslateText(text, false)) continue;

      validBlocks.push(el);
    }

    return validBlocks;
  }

  function getEngineDisplayName() {
    const dict = i18n();
    if (settings.translateEngine === "google") {
      return dict.googleName;
    }
    return settings.selectedModel || dict.localDefault;
  }

  function translateBlockElement(el, prioritize = false) {
    if (!el || el.dataset.oitState === "translated" || el.dataset.oitState === "translating") {
      return;
    }

    const sourceText = extractOriginalText(el);
    if (!shouldTranslateText(sourceText, prioritize)) return;

    el.dataset.oitState = "queued";

    const transNode = document.createElement("div");
    transNode.className = "oit-bilingual-block oit-loading-hint";
    transNode.setAttribute("data-oit-theme", settings.uiTheme || "retro-paper");
    if (/^H[1-6]$/.test(el.tagName)) {
      transNode.classList.add("oit-bilingual-inline");
    }

    const dict = i18n();
    const tgtLabel = dict.langLabels[settings.targetLang] || settings.targetLang;
    transNode.textContent = dict.translatingWith(getEngineDisplayName(), tgtLabel);
    el.appendChild(transNode);

    const task = () => {
      if (!document.body.contains(transNode)) {
        activeCount = Math.max(0, activeCount - 1);
        processNextInQueue();
        return;
      }

      el.dataset.oitState = "translating";
      transNode.classList.remove("oit-loading-hint");
      transNode.classList.add("oit-streaming-cursor");
      transNode.textContent = "";

      const reqId = requestStreamingTranslation(sourceText, {
        onChunk: fullText => {
          transNode.textContent = fullText || "...";
        },
        onDone: fullText => {
          transNode.classList.remove("oit-streaming-cursor");
          transNode.textContent = fullText || sourceText;
          el.dataset.oitState = "translated";
          delete el.dataset.oitReqId;
          activeCount = Math.max(0, activeCount - 1);
          processNextInQueue();
        },
        onError: errMsg => {
          transNode.classList.remove("oit-streaming-cursor");
          transNode.classList.add("oit-error-text");
          transNode.textContent = `${i18n().errorPrefix}${errMsg}`;
          el.dataset.oitState = "error";
          delete el.dataset.oitReqId;
          activeCount = Math.max(0, activeCount - 1);
          processNextInQueue();
        }
      });

      el.dataset.oitReqId = reqId;
    };

    if (prioritize) {
      translationQueue.unshift({ el, transNode, run: task });
    } else {
      translationQueue.push({ el, transNode, run: task });
    }

    processNextInQueue();
  }

  function processNextInQueue() {
    const maxConcurrent = getMaxConcurrent();
    while (activeCount < maxConcurrent && translationQueue.length > 0) {
      const item = translationQueue.shift();
      if (!item || !document.body.contains(item.el)) continue;
      activeCount++;
      item.run();
    }
  }

  function removeBlockTranslation(el) {
    if (!el) return;
    if (el.dataset.oitReqId) {
      cancelStreamingRequest(el.dataset.oitReqId);
      delete el.dataset.oitReqId;
    }
    const blocks = el.querySelectorAll(":scope > .oit-bilingual-block");
    blocks.forEach(b => b.remove());
    delete el.dataset.oitState;
  }

  function startPageTranslation() {
    isPageTranslated = true;
    updateFloatingBallState();

    const blocks = collectTranslatableBlocks();
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }

    intersectionObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersectionObserver.unobserve(entry.target);
            translateBlockElement(entry.target, false);
          }
        }
      },
      { rootMargin: "260px 0px 260px 0px", threshold: 0.01 }
    );

    blocks.forEach(block => {
      if (!block.dataset.oitState) {
        intersectionObserver.observe(block);
      }
    });
  }

  function stopPageTranslation() {
    isPageTranslated = false;
    updateFloatingBallState();

    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }

    translationQueue.length = 0;
    activeCount = 0;

    if (port) {
      try {
        port.postMessage({ action: "CANCEL_ALL" });
      } catch (_) {}
    }
    pendingCallbacks.clear();

    document.querySelectorAll(".oit-bilingual-block").forEach(node => node.remove());
    document.querySelectorAll("[data-oit-state]").forEach(el => {
      delete el.dataset.oitState;
      delete el.dataset.oitReqId;
    });
  }

  function togglePageTranslation() {
    if (isPageTranslated) {
      stopPageTranslation();
    } else {
      startPageTranslation();
    }
  }

  // ==================== 2. 快捷键与 Alt 悬停段落翻译 ====================

  function findClosestParagraphBlock(target) {
    if (!target || !(target instanceof Element)) return null;
    if (target.closest("#oit-selection-popup, #oit-selection-btn, #oit-floating-ball")) return null;
    return target.closest("p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dd, td");
  }

  document.addEventListener(
    "mousemove",
    e => {
      const block = findClosestParagraphBlock(e.target);
      if (block !== currentHoveredBlock) {
        if (currentHoveredBlock) {
          currentHoveredBlock.classList.remove("oit-hover-target");
        }
        currentHoveredBlock = block;
        if (e.altKey && settings.enableAltHover && currentHoveredBlock) {
          currentHoveredBlock.classList.add("oit-hover-target");
          scheduleAltHoverTranslate(currentHoveredBlock);
        }
      }
    },
    { passive: true }
  );

  function scheduleAltHoverTranslate(block) {
    clearTimeout(altHoverTimer);
    altHoverTimer = setTimeout(() => {
      if (block && block === currentHoveredBlock) {
        if (block.dataset.oitState === "translated" || block.dataset.oitState === "translating") {
          removeBlockTranslation(block);
        } else {
          translateBlockElement(block, true);
        }
        block.classList.remove("oit-hover-target");
      }
    }, 220);
  }

  document.addEventListener("keydown", e => {
    if (e.altKey && (e.key === "a" || e.key === "A")) {
      e.preventDefault();
      togglePageTranslation();
      return;
    }

    if (
      settings.enableAltHover &&
      e.key === "Alt" &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.metaKey &&
      currentHoveredBlock
    ) {
      currentHoveredBlock.classList.add("oit-hover-target");
      scheduleAltHoverTranslate(currentHoveredBlock);
    }
  });

  document.addEventListener("keyup", e => {
    if (e.key === "Alt") {
      clearTimeout(altHoverTimer);
      if (currentHoveredBlock) {
        currentHoveredBlock.classList.remove("oit-hover-target");
      }
    }
  });

  // ==================== 3. 鼠标划词翻译 ====================

  function removeSelectionUI() {
    if (selectionBtn) {
      selectionBtn.remove();
      selectionBtn = null;
    }
  }

  function closeSelectionPopup() {
    if (currentSelectionReqId) {
      cancelStreamingRequest(currentSelectionReqId);
      currentSelectionReqId = null;
    }
    if (selectionPopup) {
      selectionPopup.remove();
      selectionPopup = null;
    }
  }

  document.addEventListener("mouseup", e => {
    if (!settings.enableSelection) return;
    if (
      e.target &&
      e.target.closest &&
      e.target.closest("#oit-selection-popup, #oit-selection-btn, #oit-floating-ball")
    ) {
      return;
    }

    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : "";

      if (!text || text.length < 1 || !shouldTranslateText(text, true)) {
        removeSelectionUI();
        return;
      }

      currentSelectionText = text;
      showSelectionButton(e.clientX, e.clientY);
    }, 10);
  });

  document.addEventListener("mousedown", e => {
    if (
      e.target &&
      e.target.closest &&
      e.target.closest("#oit-selection-popup, #oit-selection-btn")
    ) {
      return;
    }
    removeSelectionUI();
    if (selectionPopup && !selectionPopup.contains(e.target)) {
      closeSelectionPopup();
    }
  });

  function showSelectionButton(clientX, clientY) {
    removeSelectionUI();
    const dict = i18n();
    selectionBtn = document.createElement("div");
    selectionBtn.id = "oit-selection-btn";
    selectionBtn.setAttribute("data-oit-theme", settings.uiTheme || "retro-paper");
    selectionBtn.title = `${dict.langLabels[settings.sourceLang] || "Auto"} ➔ ${
      dict.langLabels[settings.targetLang] || "ZH"
    }`;
    selectionBtn.textContent = dict.badge;

    const left = Math.min(window.innerWidth - 44, Math.max(12, clientX + 10));
    const top = Math.min(window.innerHeight - 44, Math.max(12, clientY + 12));
    selectionBtn.style.left = `${left}px`;
    selectionBtn.style.top = `${top}px`;

    selectionBtn.addEventListener("click", e => {
      e.stopPropagation();
      const textToTranslate = currentSelectionText;
      removeSelectionUI();
      openSelectionTranslationPopup(left, top, textToTranslate);
    });

    document.body.appendChild(selectionBtn);
  }

  function openSelectionTranslationPopup(x, y, sourceText) {
    closeSelectionPopup();
    const dict = i18n();

    selectionPopup = document.createElement("div");
    selectionPopup.id = "oit-selection-popup";
    selectionPopup.setAttribute("data-oit-theme", settings.uiTheme || "retro-paper");

    const popupLeft = Math.min(window.innerWidth - 368, Math.max(12, x));
    const popupTop = Math.min(window.innerHeight - 240, Math.max(12, y));
    selectionPopup.style.left = `${popupLeft}px`;
    selectionPopup.style.top = `${popupTop}px`;

    const engineBadge = getEngineDisplayName();
    const langPairLabel = `${dict.langLabels[settings.sourceLang] || "Auto"} ➔ ${
      dict.langLabels[settings.targetLang] || "ZH"
    }`;

    selectionPopup.innerHTML = `
      <div class="oit-popup-header">
        <div class="oit-popup-title">
          <span class="oit-popup-brand">${escapeHtml(dict.popupBrand)}</span>
          <span class="oit-lang-pill">${escapeHtml(langPairLabel)}</span>
          <span class="oit-model-pill" id="oit-popup-model">${escapeHtml(engineBadge)}</span>
        </div>
        <div class="oit-popup-actions">
          <button class="oit-icon-btn" id="oit-copy-btn" title="${escapeHtml(dict.copy)}">${escapeHtml(dict.copy)}</button>
          <button class="oit-icon-btn" id="oit-close-btn" title="${escapeHtml(dict.close)}">✕</button>
        </div>
      </div>
      <div class="oit-popup-body oit-streaming-cursor" id="oit-popup-content">${escapeHtml(dict.thinking)}</div>
    `;

    document.body.appendChild(selectionPopup);

    const contentEl = selectionPopup.querySelector("#oit-popup-content");
    const modelEl = selectionPopup.querySelector("#oit-popup-model");
    const copyBtn = selectionPopup.querySelector("#oit-copy-btn");
    const closeBtn = selectionPopup.querySelector("#oit-close-btn");

    closeBtn.addEventListener("click", closeSelectionPopup);
    copyBtn.addEventListener("click", () => {
      const txt = contentEl.textContent || "";
      navigator.clipboard.writeText(txt).then(() => {
        copyBtn.textContent = i18n().copied;
        setTimeout(() => {
          if (copyBtn) copyBtn.textContent = i18n().copy;
        }, 1200);
      });
    });

    makeDraggable(selectionPopup, selectionPopup.querySelector(".oit-popup-header"));

    currentSelectionReqId = requestStreamingTranslation(sourceText, {
      onChunk: (fullText, usedModel) => {
        if (usedModel && modelEl) modelEl.textContent = usedModel;
        contentEl.textContent = fullText || "...";
      },
      onDone: (fullText, usedModel) => {
        if (usedModel && modelEl) modelEl.textContent = usedModel;
        contentEl.classList.remove("oit-streaming-cursor");
        contentEl.textContent = fullText || sourceText;
        currentSelectionReqId = null;
      },
      onError: errMsg => {
        contentEl.classList.remove("oit-streaming-cursor");
        contentEl.classList.add("oit-error-text");
        contentEl.textContent = `${i18n().errorPrefix}${errMsg}`;
        currentSelectionReqId = null;
      }
    });
  }

  function makeDraggable(box, handle) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let origLeft = 0;
    let origTop = 0;

    handle.addEventListener("mousedown", e => {
      if (e.target.tagName === "BUTTON") return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parseInt(box.style.left, 10) || 0;
      origTop = parseInt(box.style.top, 10) || 0;
      e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const nx = Math.min(window.innerWidth - 60, Math.max(6, origLeft + (e.clientX - startX)));
      const ny = Math.min(window.innerHeight - 40, Math.max(6, origTop + (e.clientY - startY)));
      box.style.left = `${nx}px`;
      box.style.top = `${ny}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  // ==================== 4. 右侧悬浮球 ====================

  function createFloatingBall() {
    if (floatingBall) return;
    const dict = i18n();
    floatingBall = document.createElement("div");
    floatingBall.id = "oit-floating-ball";
    floatingBall.setAttribute("data-oit-theme", settings.uiTheme || "retro-paper");
    floatingBall.title = dict.ballTooltip;
    floatingBall.innerHTML = `<span class="oit-ball-dot"></span><span class="oit-ball-label">${escapeHtml(dict.badge)}</span>`;

    floatingBall.addEventListener("click", () => {
      togglePageTranslation();
    });

    document.body.appendChild(floatingBall);
    updateFloatingBallState();
  }

  function updateFloatingBallVisibility() {
    if (settings.enableFloatingBall) {
      createFloatingBall();
      if (floatingBall) {
        floatingBall.setAttribute("data-oit-theme", settings.uiTheme || "retro-paper");
        floatingBall.style.display = "flex";
      }
    } else if (floatingBall) {
      floatingBall.style.display = "none";
    }
  }

  function updateFloatingBallState() {
    if (!floatingBall) return;
    const dict = i18n();
    floatingBall.setAttribute("data-oit-theme", settings.uiTheme || "retro-paper");
    floatingBall.title = dict.ballTooltip;
    const label = floatingBall.querySelector(".oit-ball-label");
    const tgtShort = dict.langLabels[settings.targetLang] || settings.targetLang;
    if (isPageTranslated) {
      floatingBall.classList.add("oit-active");
      if (label) label.textContent = `${dict.activePrefix}${tgtShort}`;
    } else {
      floatingBall.classList.remove("oit-active");
      if (label) label.textContent = dict.badge;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();