// Skribbl.io Word Helper Bookmarklet Script (refined)
//
// 1) Host this file somewhere public (GitHub Pages, gist raw, etc.)
// 2) Bookmarklet URL example:
// javascript:(()=>{const s=document.createElement('script');s.src='https://YOUR_HOST/skribbl-helper.js?'+Date.now();document.head.appendChild(s);})();
//
// This helper fetches the canonical skribbl word list from:
// https://gist.github.com/mvark/9e0682c62d75625441f6ded366245203
(function skribblWordHelper() {
  'use strict';

  const UI_ID = 'skribbl-word-helper-ui';
  const STYLE_ID = 'skribbl-word-helper-style';
  const WORDS_CACHE_KEY = 'skribblWordHelper.words.v1';
  const CACHE_TS_KEY = 'skribblWordHelper.words.ts.v1';
  const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

  const WORD_SOURCES = [
    'https://gist.githubusercontent.com/mvark/9e0682c62d75625441f6ded366245203/raw/skribblio-word-list',
    'https://gist.githubusercontent.com/mvark/9e0682c62d75625441f6ded366245203/raw',
    'https://gist.github.com/mvark/9e0682c62d75625441f6ded366245203/raw'
  ];

  const state = {
    words: [],
    wordsReady: false,
    loading: false,
    lastPattern: '',
    autoRefreshTimer: null,
    maxResults: 150
  };

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z\s_-]/g, '')
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizePatternFromRaw(raw) {
    const source = String(raw || '').replace(/\u00a0/g, ' ');
    let out = '';

    for (const ch of source) {
      const lower = ch.toLowerCase();
      if (/[a-z]/.test(lower)) {
        out += lower;
        continue;
      }

      if (/[_*\-•·‒–—―]/.test(ch)) {
        out += '_';
        continue;
      }

      if (/\s/.test(ch)) {
        out += ' ';
      }
    }

    return out.replace(/\s+/g, ' ').trim();
  }

  function removeUI() {
    const oldUI = document.getElementById(UI_ID);
    if (oldUI) oldUI.remove();
    const oldStyle = document.getElementById(STYLE_ID);
    if (oldStyle) oldStyle.remove();
  }

  function ensureStyles() {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${UI_ID} {
        position: fixed;
        top: 12px;
        right: 12px;
        z-index: 2147483647;
        width: min(400px, 94vw);
        max-height: 94vh;
        overflow: auto;
        border: 1px solid #27315f;
        border-radius: 14px;
        background: linear-gradient(180deg, #141b35, #0f1427);
        color: #edf1ff;
        box-shadow: 0 18px 40px rgba(0,0,0,.45);
        font: 13px/1.4 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        padding: 12px;
      }
      #${UI_ID} * { box-sizing: border-box; }
      #${UI_ID} h2 {
        margin: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
      }
      #${UI_ID} .muted { color: #a8b0d3; font-size: 12px; }
      #${UI_ID} .section { margin-top: 10px; }
      #${UI_ID} .controls { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
      #${UI_ID} button {
        border: 0;
        border-radius: 8px;
        padding: 9px;
        cursor: pointer;
        color: #fff;
        font-weight: 600;
        background: #364aa8;
      }
      #${UI_ID} button.secondary { background: #2a335f; }
      #${UI_ID} button:disabled { opacity: .55; cursor: not-allowed; }
      #${UI_ID} .status {
        margin-top: 10px;
        font-size: 12px;
        white-space: pre-line;
        color: #b7c0e4;
      }
      #${UI_ID} .pattern {
        margin-top: 10px;
        border: 1px solid #2f3a73;
        border-radius: 8px;
        padding: 8px;
        background: #0d1224;
      }
      #${UI_ID} .list {
        margin-top: 10px;
        display: grid;
        gap: 6px;
      }
      #${UI_ID} .item {
        border: 1px solid #2a366f;
        border-radius: 8px;
        padding: 7px 9px;
        background: #111834;
        cursor: pointer;
      }
      #${UI_ID} .item:hover { transform: translateX(2px); }
      #${UI_ID} .item small { color: #9ba7d9; }
      #${UI_ID} input[type='number'] {
        width: 100%;
        background: #0e1430;
        border: 1px solid #2f3a73;
        color: #edf1ff;
        border-radius: 8px;
        padding: 8px;
      }
    `;
    document.head.appendChild(style);
  }

  function setStatus(message, isError = false) {
    const el = document.querySelector(`#${UI_ID} .status`);
    if (!el) return;
    el.textContent = message;
    el.style.color = isError ? '#ff9fb1' : '#b7c0e4';
  }

  function parseWordsFromText(raw) {
    return Array.from(
      new Set(
        raw
          .split(/\r?\n/)
          .map((line) => normalizeText(line))
          .filter(Boolean)
      )
    );
  }

  function saveCache(words) {
    try {
      localStorage.setItem(WORDS_CACHE_KEY, JSON.stringify(words));
      localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
    } catch (_) {
      // ignore localStorage quota/privacy mode errors
    }
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(WORDS_CACHE_KEY);
      const ts = Number(localStorage.getItem(CACHE_TS_KEY) || 0);
      if (!raw || !ts || Date.now() - ts > CACHE_TTL_MS) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  async function fetchWordList() {
    if (state.loading) return;
    state.loading = true;
    setStatus('Loading word list...');

    const cached = loadCache();
    if (cached) {
      state.words = cached;
      state.wordsReady = true;
      setStatus(`Loaded ${cached.length} words from cache.`);
      renderMatches();
    }

    let lastError = null;
    for (const url of WORD_SOURCES) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const words = parseWordsFromText(text);
        if (words.length < 1000) throw new Error('Word list looked too small.');

        state.words = words;
        state.wordsReady = true;
        saveCache(words);
        setStatus(`Loaded ${words.length} words from gist.`);
        renderMatches();
        state.loading = false;
        return;
      } catch (err) {
        lastError = err;
      }
    }

    state.loading = false;
    if (!state.wordsReady) {
      setStatus(`Failed to load words: ${lastError ? lastError.message : 'unknown error'}`, true);
    } else {
      setStatus(`Using cached words. Refresh failed: ${lastError ? lastError.message : 'unknown error'}`, true);
    }
  }

  function readPatternCandidate(el) {
    const raw = String(el.textContent || '');
    const txt = normalizePatternFromRaw(raw);
    if (!txt) return null;

    const hasUnderscoreStyle = /[_*\-•·‒–—―]/.test(raw);
    const mostlyLettersSpacesUnderscores = /^[a-z\s_]+$/.test(txt.replace(/_/g, '_'));
    if (!hasUnderscoreStyle && !mostlyLettersSpacesUnderscores) return null;

    const compact = txt.replace(/\s+/g, ' ').trim();
    if (!compact) return null;

    const words = compact.split(' ');
    if (!words.every((w) => /^_+$/.test(w) || /^[a-z_]+$/.test(w))) return null;

    return compact;
  }

  function getCluePattern() {
    const selectors = [
      '#currentWord',
      '[id*="current"][id*="word"]',
      '[class*="current"][class*="word"]',
      '.guessWord',
      '.word',
      '.wordContainer',
      '.word__container',
      '.currentWord',
      '.hints',
      '.hints__container',
      '[class*="hint"]',
      '[class*="word"]',
      '[id*="word"]',
      '.current-word',
      '.hud .word'
    ];

    for (const selector of selectors) {
      const nodes = document.querySelectorAll(selector);
      for (const node of nodes) {
        const candidate = readPatternCandidate(node);
        if (candidate && candidate.includes('_')) return candidate;
      }
    }

    // Fallback: scan common visible text containers in case classes/ids changed.
    const all = document.querySelectorAll('div,span,p,strong,b,em,li,td,h1,h2,h3,h4');
    for (const node of all) {
      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') continue;

      const candidate = readPatternCandidate(node);
      if (candidate && candidate.includes('_')) return candidate;
    }

    // Last-resort fallback: parse body text lines for placeholder-like mask tokens.
    const lines = (document.body && document.body.innerText ? document.body.innerText : '')
      .split(/\r?\n/)
      .map((line) => normalizePatternFromRaw(line))
      .filter(Boolean);

    for (const line of lines) {
      const words = line.split(' ');
      if (words.length > 4) continue;
      if (!line.includes('_')) continue;
      if (line.length < 2 || line.length > 30) continue;
      if (words.every((w) => /^_+$/.test(w) || /^[a-z_]+$/.test(w))) {
        return line;
      }
    }

    return null;
  }

  function patternToRegex(pattern) {
    const cleaned = normalizePatternFromRaw(pattern)
      .replace(/\s+/g, ' ')
      .trim();

    const escaped = cleaned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexBody = escaped
      .replace(/\_/g, '[a-z]')
      .replace(/\s/g, '\\s');

    return new RegExp(`^${regexBody}$`);
  }

  function scoreWord(word, pattern) {
    // Prefer words that match already-revealed letters at the beginning of each token
    const wordParts = word.split(' ');
    const patternParts = pattern.split(' ');
    let score = 0;

    for (let i = 0; i < Math.min(wordParts.length, patternParts.length); i += 1) {
      const wp = wordParts[i];
      const pp = patternParts[i];
      for (let j = 0; j < Math.min(wp.length, pp.length); j += 1) {
        if (/[a-z]/.test(pp[j]) && wp[j] === pp[j]) score += 3;
      }
      if (wp[0] === pp[0] && /[a-z]/.test(pp[0])) score += 2;
    }

    // Slight preference for commonly shorter words
    score -= Math.max(0, word.length - 14) * 0.1;
    return score;
  }

  function matchWords(pattern) {
    if (!state.wordsReady || !pattern) return [];

    const normalizedPattern = normalizePatternFromRaw(pattern);
    const regex = patternToRegex(normalizedPattern);
    const patternParts = normalizedPattern.split(' ');

    const matches = [];

    for (const word of state.words) {
      const w = normalizeText(word);
      if (!w) continue;

      const wParts = w.split(' ');
      if (wParts.length !== patternParts.length) continue;

      let sameLengths = true;
      for (let i = 0; i < wParts.length; i += 1) {
        if (wParts[i].length !== patternParts[i].length) {
          sameLengths = false;
          break;
        }
      }
      if (!sameLengths) continue;

      if (regex.test(w)) {
        matches.push({ word: w, score: scoreWord(w, normalizedPattern) });
      }
    }

    matches.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
    return matches.slice(0, state.maxResults);
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`Copied: ${value}`);
    } catch (_) {
      setStatus(`Could not copy automatically. Word: ${value}`, true);
    }
  }

  function renderMatches() {
    const listEl = document.querySelector(`#${UI_ID} .list`);
    const patternEl = document.querySelector(`#${UI_ID} .pattern`);
    if (!listEl || !patternEl) return;

    const pattern = getCluePattern();
    state.lastPattern = pattern || '';

    if (!pattern) {
      patternEl.innerHTML = '<strong>Pattern:</strong> not found';
      listEl.innerHTML = '<div class="muted">Could not detect the clue pattern yet. Start a round and click Refresh.</div>';
      return;
    }

    const matches = matchWords(pattern);
    patternEl.innerHTML = `<strong>Pattern:</strong> ${pattern}<br><span class="muted">Matches: ${matches.length}${state.wordsReady ? '' : ' (word list still loading...)'}</span>`;

    if (!matches.length) {
      listEl.innerHTML = '<div class="muted">No matches yet. Wait for more letters or adjust max results.</div>';
      return;
    }

    listEl.innerHTML = '';
    for (const match of matches) {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `<div><strong>${match.word}</strong></div><small>click to copy</small>`;
      item.addEventListener('click', () => copyText(match.word));
      listEl.appendChild(item);
    }
  }

  function startAutoRefresh() {
    stopAutoRefresh();
    state.autoRefreshTimer = window.setInterval(renderMatches, 1500);
  }

  function stopAutoRefresh() {
    if (state.autoRefreshTimer) {
      clearInterval(state.autoRefreshTimer);
      state.autoRefreshTimer = null;
    }
  }

  function buildUI() {
    removeUI();
    ensureStyles();

    const root = document.createElement('div');
    root.id = UI_ID;
    root.innerHTML = `
      <h2>
        🎯 Skribbl Word Helper
        <button id="${UI_ID}-close" class="secondary" style="padding:4px 8px">✕</button>
      </h2>
      <div class="muted section">Uses the mvark gist word list and live clue pattern matching.</div>
      <div class="controls">
        <button id="${UI_ID}-refresh">Refresh Pattern</button>
        <button id="${UI_ID}-reload" class="secondary">Reload Word List</button>
      </div>
      <div class="section">
        <label class="muted" for="${UI_ID}-max">Max results</label>
        <input id="${UI_ID}-max" type="number" min="10" max="500" value="150" />
      </div>
      <div class="pattern"></div>
      <div class="status">Initializing...</div>
      <div class="list"></div>
    `;

    document.body.appendChild(root);
    positionUI(root);
    window.addEventListener('resize', () => positionUI(root));

    document.getElementById(`${UI_ID}-close`).addEventListener('click', () => {
      stopAutoRefresh();
      removeUI();
    });

    document.getElementById(`${UI_ID}-refresh`).addEventListener('click', renderMatches);

    document.getElementById(`${UI_ID}-reload`).addEventListener('click', async () => {
      try {
        localStorage.removeItem(WORDS_CACHE_KEY);
        localStorage.removeItem(CACHE_TS_KEY);
      } catch (_) {
        // ignore
      }
      state.wordsReady = false;
      state.words = [];
      await fetchWordList();
      renderMatches();
    });

    document.getElementById(`${UI_ID}-max`).addEventListener('change', (event) => {
      const value = Number(event.target.value);
      state.maxResults = Number.isFinite(value) ? Math.min(500, Math.max(10, value)) : 150;
      event.target.value = String(state.maxResults);
      renderMatches();
    });

    startAutoRefresh();
    fetchWordList().then(renderMatches);
  }

  function positionUI(root) {
    if (!root || !document.body.contains(root)) return;

    const chat = document.querySelector('#boxMessages, .chat, [id*="chat"], [class*="chat"]');
    if (chat) {
      const rect = chat.getBoundingClientRect();
      const panelWidth = Math.min(400, Math.floor(window.innerWidth * 0.94));
      const left = Math.max(8, rect.left - panelWidth - 8);
      const top = Math.max(8, rect.top);

      root.style.left = `${left}px`;
      root.style.top = `${top}px`;
      root.style.right = 'auto';
      return;
    }

    root.style.top = '12px';
    root.style.right = '12px';
    root.style.left = 'auto';
  }

  buildUI();
})();
