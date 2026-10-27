/**
 * Ollama & Google 沉浸式翻译 - 后台服务脚本 (Manifest V3 Service Worker)
 * 核心功能：
 * 1. 多语言互译支持（自动检测 + 12 种常见语言自由互译，彻底修复中文译日语/英语等不翻译的问题）
 * 2. 双翻译引擎切换：本地大模型 (Ollama / OpenAI 兼容接口) + 在线 Google 翻译 (免 Key 高速接口)
 * 3. 本地任意模型兼容修复：
 *    - 支持手动添加/输入任意自定义模型名（如 qwen2.5、deepseek-r1、llama3、mistral、sakura 等）并持久化保存，不被自动探测覆盖
 *    - 自动兼容 /api/chat -> /api/generate -> /v1/chat/completions 三种本地推理接口
 *    - 深度清理 DeepSeek-R1 / QwQ 等推理模型的 <think> 思考块与角色前缀复读
 */

const DEFAULT_SETTINGS = {
  translateEngine: "ollama", // "ollama" | "google"
  ollamaHost: "http://localhost:11434",
  selectedModel: "",
  customModels: [],
  sourceLang: "auto",
  targetLang: "zh-CN",
  uiTheme: "retro-paper", // "retro-paper" | "liquid-glass"
  uiLang: "zh-CN", // "zh-CN" | "zh-TW" | "en" | "ja"
  enableSelection: true,
  enableAltHover: true,
  enableFloatingBall: true
};

// 支持的语言元数据表
const LANGUAGE_MAP = {
  "auto": {
    name: "自动检测 (Auto)",
    enName: "Auto Detect",
    googleCode: "auto",
    promptName: "自动识别的源语言",
    scriptHint: ""
  },
  "zh-CN": {
    name: "简体中文",
    enName: "Simplified Chinese",
    googleCode: "zh-CN",
    promptName: "简体中文 (Simplified Chinese)",
    scriptHint: "必须使用规范的现代简体中文汉字输出。"
  },
  "zh-TW": {
    name: "繁體中文",
    enName: "Traditional Chinese",
    googleCode: "zh-TW",
    promptName: "繁體中文 (Traditional Chinese)",
    scriptHint: "必須使用道地的台灣/香港正體中文（繁體字）輸出，切勿混用簡體字。"
  },
  "en": {
    name: "英语 (English)",
    enName: "English",
    googleCode: "en",
    promptName: "英语 (English)",
    scriptHint: "You MUST output ONLY in natural, idiomatic English."
  },
  "ja": {
    name: "日语 (日本語)",
    enName: "Japanese",
    googleCode: "ja",
    promptName: "日语 (Japanese / 日本語)",
    scriptHint: "必ず自然な日本語（漢字・ひらがな・カタカナを適切に混ぜた日本語の文体）に翻訳して出力してください。中国語のまま出力することは絶対に禁止です。"
  },
  "ko": {
    name: "韩语 (한국어)",
    enName: "Korean",
    googleCode: "ko",
    promptName: "韩语 (Korean / 한국어)",
    scriptHint: "반드시 자연스러운 한국어(한글)로 번역하여 출력하세요. 원문(중국어 등)을 그대로 출력하지 마세요."
  },
  "fr": {
    name: "法语 (Français)",
    enName: "French",
    googleCode: "fr",
    promptName: "法语 (French / Français)",
    scriptHint: "Vous devez traduire et répondre uniquement en français naturel."
  },
  "de": {
    name: "德语 (Deutsch)",
    enName: "German",
    googleCode: "de",
    promptName: "德语 (German / Deutsch)",
    scriptHint: "Sie müssen ausschließlich in natürlichem Deutsch übersetzen und antworten."
  },
  "es": {
    name: "西班牙语 (Español)",
    enName: "Spanish",
    googleCode: "es",
    promptName: "西班牙语 (Spanish / Español)",
    scriptHint: "Debes traducir y responder únicamente en español natural."
  },
  "ru": {
    name: "俄语 (Русский)",
    enName: "Russian",
    googleCode: "ru",
    promptName: "俄语 (Russian / Русский)",
    scriptHint: "Вы должны переводить и отвечать исключительно на естественном русском языке."
  },
  "pt": {
    name: "葡萄牙语 (Português)",
    enName: "Portuguese",
    googleCode: "pt",
    promptName: "葡萄牙语 (Portuguese / Português)",
    scriptHint: "Você deve traduzir e responder exclusivamente em português natural."
  },
  "ar": {
    name: "阿拉伯语 (العربية)",
    enName: "Arabic",
    googleCode: "ar",
    promptName: "阿拉伯语 (Arabic / العربية)",
    scriptHint: "يجب عليك الترجمة والرد باللغة العربية الفصحى الطبيعية فقط."
  }
};

// 初始化默认配置
chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
  const merged = { ...DEFAULT_SETTINGS, ...stored };
  if (!Array.isArray(merged.customModels)) {
    merged.customModels = [];
  }
  await chrome.storage.local.set(merged);
  fetchAndSelectBestModel(merged.ollamaHost, merged.selectedModel, merged.customModels).catch(() => {});
});

/**
 * 智能选择默认本地模型：
 * 1. 如果用户已经手动选定或输入了自定义模型，严格保留用户的选择（修复切换其他模型失效的 Bug）
 * 2. 若未选择，则优先推荐 gemma3:4b / gemma4 / qwen / llama 等模型
 */
function pickPreferredModel(models, currentSelected, customModels = []) {
  const apiNames = Array.isArray(models) ? models.map(m => m.name || m.model).filter(Boolean) : [];
  const allKnownNames = Array.from(new Set([...apiNames, ...(Array.isArray(customModels) ? customModels : [])]));

  if (currentSelected && currentSelected.trim()) {
    const trimmed = currentSelected.trim();
    if (allKnownNames.includes(trimmed)) {
      return trimmed;
    }
    const matchedWithLatest = allKnownNames.find(
      n => n.toLowerCase() === trimmed.toLowerCase() || n.toLowerCase() === `${trimmed.toLowerCase()}:latest`
    );
    if (matchedWithLatest) return matchedWithLatest;
    return trimmed;
  }

  if (allKnownNames.length === 0) return "";

  const priorityMatchers = [
    n => n.toLowerCase() === "gemma3:4b",
    n => n.toLowerCase().startsWith("gemma3:4b"),
    n => n.toLowerCase() === "gemma4:latest" || n.toLowerCase() === "gemma4",
    n => n.toLowerCase().startsWith("gemma4"),
    n => n.toLowerCase().includes("gemma3"),
    n => n.toLowerCase().includes("gemma"),
    n => n.toLowerCase().includes("qwen"),
    n => n.toLowerCase().includes("deepseek"),
    n => n.toLowerCase().includes("llama")
  ];

  for (const matcher of priorityMatchers) {
    const found = allKnownNames.find(matcher);
    if (found) return found;
  }

  return allKnownNames[0];
}

/**
 * 调用 Ollama /api/tags 或兼容的 /v1/models 读取本地模型列表，并合并用户手动添加的本地模型
 */
async function fetchAndSelectBestModel(
  host = "http://localhost:11434",
  currentSelected = "",
  customModels = []
) {
  const cleanHost = (host || "http://localhost:11434").trim().replace(/\/+$/, "");
  const endpoints = [cleanHost];
  if (cleanHost.includes("localhost")) {
    endpoints.push(cleanHost.replace("localhost", "127.0.0.1"));
  } else if (cleanHost.includes("127.0.0.1")) {
    endpoints.push(cleanHost.replace("127.0.0.1", "localhost"));
  }

  let lastError = null;
  for (const baseUrl of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      let rawModels = [];
      let connectedOk = false;

      try {
        const res = await fetch(`${baseUrl}/api/tags`, {
          method: "GET",
          signal: controller.signal
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.models)) {
            rawModels = data.models.map(m => ({
              name: m.name || m.model,
              size: m.size || 0,
              source: "ollama"
            })).filter(m => m.name);
            connectedOk = true;
          }
        } else {
          lastError = new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
      } catch (e) {
        lastError = e;
      }

      if (!connectedOk) {
        const v1Res = await fetch(`${baseUrl}/v1/models`, {
          method: "GET",
          signal: controller.signal
        });
        if (v1Res.ok) {
          const v1Data = await v1Res.json();
          if (Array.isArray(v1Data.data)) {
            rawModels = v1Data.data.map(m => ({
              name: m.id,
              size: 0,
              source: "openai-compat"
            })).filter(m => m.name);
            connectedOk = true;
          }
        }
      }

      clearTimeout(timeoutId);

      if (!connectedOk) {
        throw lastError || new Error("未响应 /api/tags 或 /v1/models");
      }

      const existingNames = new Set(rawModels.map(m => m.name));
      const validCustom = Array.isArray(customModels) ? customModels : [];
      for (const cm of validCustom) {
        if (cm && !existingNames.has(cm)) {
          rawModels.push({ name: cm, size: 0, isCustom: true });
          existingNames.add(cm);
        }
      }

      const bestModel = pickPreferredModel(rawModels, currentSelected, validCustom);

      rawModels.sort((a, b) => {
        const score = item => {
          const lower = item.name.toLowerCase();
          if (item.isCustom) return 110;
          if (lower.startsWith("gemma3:4b")) return 100;
          if (lower.startsWith("gemma4")) return 95;
          if (lower.includes("gemma")) return 85;
          if (lower.includes("qwen")) return 80;
          return 10;
        };
        return score(b) - score(a);
      });

      const updates = { ollamaHost: baseUrl };
      if (!currentSelected && bestModel) {
        updates.selectedModel = bestModel;
      }
      await chrome.storage.local.set(updates);

      return {
        ok: true,
        host: baseUrl,
        models: rawModels,
        selectedModel: currentSelected || bestModel
      };
    } catch (err) {
      lastError = err;
    }
  }

  const fallbackModels = (Array.isArray(customModels) ? customModels : []).map(name => ({
    name,
    size: 0,
    isCustom: true
  }));

  return {
    ok: false,
    error: lastError ? lastError.message : "无法连接到本地模型服务",
    models: fallbackModels,
    selectedModel: currentSelected || (fallbackModels[0] ? fallbackModels[0].name : "")
  };
}

// 监听来自 Popup 或 Content Script 的一次性请求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_MODELS") {
    chrome.storage.local.get(["ollamaHost", "selectedModel", "customModels"]).then(cfg => {
      const host = message.ollamaHost || cfg.ollamaHost || DEFAULT_SETTINGS.ollamaHost;
      const selected = message.selectedModel !== undefined ? message.selectedModel : cfg.selectedModel;
      const customModels = Array.isArray(cfg.customModels) ? cfg.customModels : [];
      fetchAndSelectBestModel(host, selected, customModels).then(sendResponse);
    });
    return true;
  }

  if (message.type === "ADD_CUSTOM_MODEL") {
    const newModel = (message.modelName || "").trim();
    if (!newModel) {
      sendResponse({ ok: false, error: "模型名称不能为空" });
      return true;
    }
    chrome.storage.local.get(["customModels", "ollamaHost"]).then(async cfg => {
      const list = Array.isArray(cfg.customModels) ? cfg.customModels : [];
      if (!list.includes(newModel)) {
        list.unshift(newModel);
      }
      await chrome.storage.local.set({
        customModels: list,
        selectedModel: newModel
      });
      const result = await fetchAndSelectBestModel(cfg.ollamaHost || DEFAULT_SETTINGS.ollamaHost, newModel, list);
      sendResponse({
        ...result,
        selectedModel: newModel,
        customModels: list
      });
    });
    return true;
  }
});

/**
 * 过滤推理模型可能输出的 <think>...</think>、<thought>...</thought> 标签及多余前缀
 */
function stripThinkingAndMeta(text) {
  if (!text) return "";
  let cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<thought>[\s\S]*?<\/thought>/gi, "")
    .replace(/◁think▷[\s\S]*?◁\/think▷/gi, "");

  const openTags = ["<think>", "<thought>", "◁think▷"];
  for (const tag of openTags) {
    const openIdx = cleaned.toLowerCase().indexOf(tag.toLowerCase());
    if (openIdx !== -1) {
      cleaned = cleaned.slice(0, openIdx);
    }
  }

  cleaned = cleaned.replace(/^(译文|翻译结果|翻译|Translation|Translated text|Here is the translation)\s*[:：]\s*/i, "");
  return cleaned.trimStart();
}

/**
 * 判断译文是否与原文几乎完全相同（用于检测中文译日语/外语时本地模型“直接照抄原文”的 Bug）
 */
function isUnchangedOutput(sourceText, translatedText, targetLang) {
  const s = (sourceText || "").replace(/\s+/g, "").trim();
  const t = (translatedText || "").replace(/\s+/g, "").trim();
  if (!s || !t) return true;
  if (s.length >= 4 && s === t) return true;

  if (targetLang === "ja" && s.length >= 4) {
    const sourceHasKana = /[\u3040-\u30ff]/.test(s);
    const targetHasKana = /[\u3040-\u30ff]/.test(t);
    const sourceHasHan = /[\u4e00-\u9faf]/.test(s);
    if (sourceHasHan && !sourceHasKana && !targetHasKana && s.slice(0, 4) === t.slice(0, 4)) {
      return true;
    }
  }

  if (targetLang === "ko" && s.length >= 3) {
    const targetHasHangul = /[\uac00-\ud7af\u1100-\u11ff]/.test(t);
    const sourceHasHan = /[\u4e00-\u9faf]/.test(s);
    if (sourceHasHan && !targetHasHangul) {
      return true;
    }
  }

  return false;
}

/**
 * 构建多语种互译专用 Prompt
 */
function buildTranslationMessages(text, sourceLang = "auto", targetLang = "zh-CN", strictRetry = false) {
  const srcMeta = LANGUAGE_MAP[sourceLang] || LANGUAGE_MAP["auto"];
  const tgtMeta = LANGUAGE_MAP[targetLang] || LANGUAGE_MAP["zh-CN"];

  const srcDesc = sourceLang === "auto" ? "自动检测的源语言文本" : `${srcMeta.promptName}文本`;
  const tgtDesc = tgtMeta.promptName;

  const systemPrompt =
    `你是一个顶尖的多语种沉浸式网页翻译引擎。你的唯一任务是将用户提供的【${srcDesc}】准确、地道、自然地翻译为【${tgtDesc}】。\n` +
    `请严格遵守以下铁律：\n` +
    `1. 无论用户输入的是中文、英文、日文还是任何其他语言，都必须将其完整翻译为目标语言【${tgtDesc}】！绝对禁止原样照抄或复读原文！\n` +
    `2. ${tgtMeta.scriptHint}\n` +
    `3. 只输出翻译后的【${tgtDesc}】译文正文，严禁输出任何解释、思考过程、前缀（如“译文：”）、引号或寒暄；\n` +
    `4. 保留专有名词、代码标识符、URL 与原有的段落语气。`;

  const userContent = strictRetry
    ? `请务必将以下文本翻译为【${tgtDesc}】（注意：切勿返回原文，必须使用${tgtDesc}表达）：\n\n${text.trim()}`
    : `Translate the following text into ${tgtMeta.enName} (${tgtDesc}). Output ONLY the translated ${tgtMeta.enName} text:\n\n${text.trim()}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent }
  ];
}

/**
 * 在线 Google 翻译实现
 */
async function translateWithGoogle(text, sourceLang = "auto", targetLang = "zh-CN", signal) {
  const sl = (LANGUAGE_MAP[sourceLang] && LANGUAGE_MAP[sourceLang].googleCode) || "auto";
  const tl = (LANGUAGE_MAP[targetLang] && LANGUAGE_MAP[targetLang].googleCode) || "zh-CN";

  const url1 =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}` +
    `&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text.trim())}`;

  try {
    const res = await fetch(url1, {
      method: "GET",
      signal
    });
    if (!res.ok) {
      throw new Error(`Google 翻译 HTTP ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0]
        .map(seg => (Array.isArray(seg) && seg[0] ? seg[0] : ""))
        .join("");
      if (translated) return translated;
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    const url2 =
      `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${encodeURIComponent(sl)}` +
      `&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(text.trim())}`;
    const res2 = await fetch(url2, { method: "GET", signal });
    if (!res2.ok) {
      throw new Error(`Google 在线翻译连接失败 (${res2.status})，请检查网络`);
    }
    const data2 = await res2.json();
    if (Array.isArray(data2)) {
      if (typeof data2[0] === "string") return data2[0];
      if (Array.isArray(data2[0]) && typeof data2[0][0] === "string") return data2[0][0];
    } else if (data2 && Array.isArray(data2.sentences)) {
      return data2.sentences.map(s => s.trans || "").join("");
    }
    throw err;
  }

  throw new Error("Google 翻译未返回有效译文");
}

/**
 * 调用本地大模型流式翻译
 */
async function streamLocalModelTranslation({
  host,
  model,
  text,
  sourceLang,
  targetLang,
  strictRetry = false,
  signal,
  onProgress
}) {
  const messages = buildTranslationMessages(text, sourceLang, targetLang, strictRetry);

  let response = null;
  let mode = "ollama-chat";

  try {
    response = await fetch(`${host}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: true,
        options: {
          temperature: strictRetry ? 0.35 : 0.2
        },
        messages
      }),
      signal
    });
  } catch (networkErr) {
    if (networkErr.name === "AbortError") throw networkErr;
    response = null;
  }

  if (!response || !response.ok) {
    const status = response ? response.status : 0;
    let errText = "";
    if (response) {
      errText = await response.text().catch(() => "");
    }

    const promptFlat = `${messages[0].content}\n\n${messages[1].content}`;

    try {
      const genRes = await fetch(`${host}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt: promptFlat,
          stream: true,
          options: { temperature: 0.2 }
        }),
        signal
      });
      if (genRes.ok) {
        response = genRes;
        mode = "ollama-generate";
      }
    } catch (e) {
      if (e.name === "AbortError") throw e;
    }

    if (!response || !response.ok) {
      try {
        const v1Res = await fetch(`${host}/v1/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            stream: true,
            temperature: 0.2,
            messages
          }),
          signal
        });
        if (v1Res.ok) {
          response = v1Res;
          mode = "openai-sse";
        }
      } catch (e) {
        if (e.name === "AbortError") throw e;
      }
    }

    if (!response || !response.ok) {
      throw new Error(
        `本地模型 [${model}] 响应异常 (HTTP ${status || "连接失败"}): ${
          errText || "请确认模型名称已在本地拉取 (ollama list) 且服务正在运行"
        }`
      );
    }
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let rawAccumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (mode === "openai-sse") {
        if (!trimmed.startsWith("data:")) continue;
        const dataStr = trimmed.replace(/^data:\s*/, "");
        if (dataStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(dataStr);
          const delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
          const piece = (delta && delta.content) || "";
          if (piece) {
            rawAccumulated += piece;
            const cleanText = stripThinkingAndMeta(rawAccumulated);
            onProgress(cleanText);
          }
        } catch (_) {}
      } else {
        try {
          const parsed = JSON.parse(trimmed);
          const piece =
            (parsed.message && parsed.message.content) ||
            parsed.response ||
            "";
          if (piece) {
            rawAccumulated += piece;
            const cleanText = stripThinkingAndMeta(rawAccumulated);
            onProgress(cleanText);
          }
        } catch (_) {}
      }
    }
  }

  if (buffer.trim() && mode !== "openai-sse") {
    try {
      const parsed = JSON.parse(buffer.trim());
      const piece = (parsed.message && parsed.message.content) || parsed.response || "";
      if (piece) rawAccumulated += piece;
    } catch (_) {}
  }

  return stripThinkingAndMeta(rawAccumulated).trim();
}

/**
 * 处理流式翻译长连接 (chrome.runtime.onConnect)
 */
chrome.runtime.onConnect.addListener(port => {
  if (port.name !== "ollama-translate-stream") return;

  const activeControllers = new Map();

  port.onDisconnect.addListener(() => {
    for (const ctrl of activeControllers.values()) {
      ctrl.abort();
    }
    activeControllers.clear();
  });

  port.onMessage.addListener(async msg => {
    if (msg.action === "CANCEL" && msg.requestId) {
      const ctrl = activeControllers.get(msg.requestId);
      if (ctrl) {
        ctrl.abort();
        activeControllers.delete(msg.requestId);
      }
      return;
    }

    if (msg.action === "CANCEL_ALL") {
      for (const ctrl of activeControllers.values()) {
        ctrl.abort();
      }
      activeControllers.clear();
      return;
    }

    if (msg.action !== "TRANSLATE") return;

    const { requestId, text } = msg;
    if (!text || !text.trim()) {
      try {
        port.postMessage({ type: "DONE", requestId, fullText: "" });
      } catch (_) {}
      return;
    }

    const controller = new AbortController();
    activeControllers.set(requestId, controller);

    try {
      const cfg = await chrome.storage.local.get([
        "translateEngine",
        "ollamaHost",
        "selectedModel",
        "customModels",
        "sourceLang",
        "targetLang"
      ]);

      const engine = msg.translateEngine || cfg.translateEngine || DEFAULT_SETTINGS.translateEngine;
      const sourceLang = msg.sourceLang || cfg.sourceLang || DEFAULT_SETTINGS.sourceLang;
      const targetLang = msg.targetLang || cfg.targetLang || DEFAULT_SETTINGS.targetLang;

      if (engine === "google") {
        const engineLabel = "Google Translate";
        port.postMessage({
          type: "CHUNK",
          requestId,
          model: engineLabel,
          fullText: "..."
        });

        const googleResult = await translateWithGoogle(
          text,
          sourceLang,
          targetLang,
          controller.signal
        );

        port.postMessage({
          type: "DONE",
          requestId,
          model: engineLabel,
          fullText: googleResult
        });
        activeControllers.delete(requestId);
        return;
      }

      let host = (cfg.ollamaHost || DEFAULT_SETTINGS.ollamaHost).trim().replace(/\/+$/, "");
      let model = (cfg.selectedModel || "").trim();
      const customModels = Array.isArray(cfg.customModels) ? cfg.customModels : [];

      if (!model) {
        const check = await fetchAndSelectBestModel(host, "", customModels);
        if (!check.ok || !check.selectedModel) {
          throw new Error("未检测到本地模型，请启动 Ollama、手动添加模型名，或切换至「Google 在线翻译」");
        }
        model = check.selectedModel;
        host = check.host || host;
      }

      let finalClean = await streamLocalModelTranslation({
        host,
        model,
        text,
        sourceLang,
        targetLang,
        strictRetry: false,
        signal: controller.signal,
        onProgress: cleanText => {
          port.postMessage({
            type: "CHUNK",
            requestId,
            model,
            fullText: cleanText
          });
        }
      });

      if (isUnchangedOutput(text, finalClean, targetLang)) {
        finalClean = await streamLocalModelTranslation({
          host,
          model,
          text,
          sourceLang,
          targetLang,
          strictRetry: true,
          signal: controller.signal,
          onProgress: cleanText => {
            port.postMessage({
              type: "CHUNK",
              requestId,
              model,
              fullText: cleanText
            });
          }
        });

        if (isUnchangedOutput(text, finalClean, targetLang)) {
          try {
            const fallbackGoogle = await translateWithGoogle(
              text,
              sourceLang,
              targetLang,
              controller.signal
            );
            if (fallbackGoogle) {
              finalClean = fallbackGoogle;
            }
          } catch (_) {}
        }
      }

      port.postMessage({
        type: "DONE",
        requestId,
        model,
        fullText: finalClean || text
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        try {
          port.postMessage({
            type: "ERROR",
            requestId,
            error: err.message || "翻译请求失败"
          });
        } catch (_) {}
      }
    } finally {
      activeControllers.delete(requestId);
    }
  });
});