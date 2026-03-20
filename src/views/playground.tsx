import { Layout } from "@/views/layout";

const pageStyles = `
.console {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  height: calc(100vh - 64px - 96px);
  min-height: 500px;
}

/* ── Sidebar ── */
.sidebar {
  background: var(--bg-surface);
  border-right: 1px solid var(--border-hairline);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
  gap: 16px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-tertiary);
  font-weight: 500;
}

.sidebar .input,
.sidebar select.input {
  font-size: 12px;
  padding: 7px 12px;
}

.sidebar textarea.input {
  font-size: 12px;
  padding: 7px 12px;
  resize: vertical;
  min-height: 64px;
  line-height: 1.5;
  font-family: var(--font-ui);
}

.sidebar select.input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23756550'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
  cursor: pointer;
}

/* Temperature slider */
.temp-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.temp-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  background: var(--border-hairline);
  outline: none;
  cursor: pointer;
}

.temp-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--gold-base);
  border: none;
  cursor: pointer;
}

.temp-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--gold-base);
  border: none;
  border-radius: 0;
  cursor: pointer;
}

.temp-slider::-webkit-slider-runnable-track {
  height: 3px;
  background: linear-gradient(to right, var(--gold-dim), var(--gold-base));
}

.temp-value {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--gold-base);
  min-width: 24px;
  text-align: right;
}

/* Toggle row */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}

.toggle-label {
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
}

.toggle-switch {
  position: relative;
  width: 32px;
  height: 16px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  position: absolute;
  inset: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--border-hairline);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.toggle-track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 10px;
  height: 10px;
  background: var(--text-tertiary);
  transition: transform 0.2s ease, background 0.2s ease;
}

.toggle-switch input:checked + .toggle-track {
  background: rgba(212, 180, 122, 0.15);
  border-color: var(--gold-dim);
}

.toggle-switch input:checked + .toggle-track::after {
  transform: translateX(16px);
  background: var(--gold-base);
}

/* API type toggle buttons */
.api-toggle {
  display: flex;
  border: 1px solid var(--border-hairline);
  overflow: hidden;
}

.api-toggle-btn {
  flex: 1;
  padding: 6px 8px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;
}

.api-toggle-btn:first-child {
  border-right: 1px solid var(--border-hairline);
}

.api-toggle-btn:hover {
  color: var(--text-secondary);
  background: rgba(212, 180, 122, 0.03);
}

.api-toggle-btn.active {
  color: var(--gold-base);
  background: rgba(212, 180, 122, 0.08);
}

.sidebar-spacer {
  flex: 1;
}

.routing-info {
  font-size: 10px;
  color: var(--text-tertiary);
  padding-top: 12px;
  border-top: 1px solid var(--border-hairline);
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

/* ── Chat area ── */
.chat-area {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--bg-deep);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid var(--border-hairline);
}

.chat-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  color: var(--text-tertiary);
  font-size: 13px;
}

.chat-empty-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}

/* Message bubbles */
.msg {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.msg-user {
  align-self: flex-end;
}

.msg-assistant {
  align-self: flex-start;
}

.msg-user .msg-bubble {
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg-assistant .msg-bubble {
  background: transparent;
  padding: 12px 16px;
  border: 1px solid var(--border-hairline);
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg-model-label {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 13px;
  color: var(--gold-base);
  letter-spacing: 0.02em;
  padding-left: 4px;
}

/* Streaming cursor */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.stream-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  background: var(--gold-base);
  animation: blink 0.8s ease-in-out infinite;
  vertical-align: text-bottom;
  margin-left: 2px;
}

/* JSON response */
.response-json {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.6;
  padding: 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-hairline);
  max-height: 60vh;
  overflow: auto;
}

.response-json .json-key { color: var(--gold-base); }
.response-json .json-string { color: var(--text-secondary); }
.response-json .json-number { color: var(--gold-bright); }
.response-json .json-bool { color: var(--accent-error); }
.response-json .json-null { color: var(--text-tertiary); }

/* Meta bar */
.meta-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-hairline);
  margin-top: 8px;
}

.meta-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
}

.meta-tag strong {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-weight: 500;
}

/* Error card */
.error-card {
  background: rgba(163, 91, 76, 0.08);
  border: 1px solid rgba(163, 91, 76, 0.3);
  padding: 16px;
}

.error-card-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-error);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.error-card-body {
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono);
  color: var(--accent-error);
  opacity: 0.85;
}

/* Loading */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-tertiary);
  font-size: 12px;
  padding: 12px 16px;
}

.loading-dot {
  width: 4px;
  height: 4px;
  background: var(--gold-base);
  animation: pulse 1s ease-in-out infinite;
}

.loading-dot:nth-child(2) { animation-delay: 0.2s; }
.loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

/* Chat input */
.chat-input-area {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 16px 32px 20px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-hairline);
}

.chat-input-area textarea {
  flex: 1;
  background: var(--bg-elevated);
  border: 1px solid var(--border-hairline);
  color: var(--text-primary);
  padding: 10px 14px;
  font-family: var(--font-ui);
  font-size: 13px;
  line-height: 1.5;
  resize: none;
  min-height: 42px;
  max-height: 160px;
  transition: border-color 0.2s ease;
  outline: none;
}

.chat-input-area textarea:focus {
  border-color: var(--border-focus);
}

.chat-input-area textarea::placeholder {
  color: var(--text-tertiary);
}

.send-btn {
  padding: 10px 24px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--bg-deep);
  background: var(--gold-dim);
  border: 1px solid var(--gold-base);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.send-btn:hover {
  background: var(--gold-muted);
}

.send-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.send-btn.cancel {
  background: rgba(163, 91, 76, 0.15);
  border-color: var(--accent-error);
  color: var(--accent-error);
}

.send-btn.cancel:hover {
  background: rgba(163, 91, 76, 0.25);
}

/* Raw JSON in sidebar */
.raw-json-area {
  display: none;
}

.raw-json-area textarea {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-hairline);
  color: var(--text-primary);
  padding: 8px 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  resize: vertical;
  min-height: 200px;
  outline: none;
  transition: border-color 0.2s ease;
}

.raw-json-area textarea:focus {
  border-color: var(--border-focus);
}

/* Placeholder response */
.response-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-size: 12px;
  padding: 2rem;
  text-align: center;
}

/* Responses API fields */
#responsesFields { display: none; }

/* Divider */
.sidebar-divider {
  height: 1px;
  background: var(--border-hairline);
  margin: 4px 0;
}

/* Override main-content for full-bleed console */
.main-content {
  padding: 0 !important;
  max-width: 100% !important;
}

@media (max-width: 768px) {
  .console {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border-hairline);
    max-height: 50vh;
    overflow-y: auto;
  }

  .chat-area {
    min-height: 60vh;
  }

  .chat-messages {
    padding: 16px;
  }

  .chat-input-area {
    padding: 12px 16px 16px;
  }

  .msg {
    max-width: 90%;
  }
}
`;

const pageScript = `
let currentApiType = 'chat';
let isRawMode = false;
let isLoading = false;
let abortController = null;
let models = [];

// DOM refs
const apiTypeBtns = document.querySelectorAll('.api-type-btn');
const chatFields = $('chatFields');
const responsesFields = $('responsesFields');
const formFields = $('formFields');
const rawFields = $('rawFields');
const rawJsonInput = $('rawJson');
const rawToggle = $('rawToggle');
const modelInput = $('modelInput');
const modelList = $('modelList');
const systemMsg = $('systemMsg');
const userMsg = $('userMsg');
const respInput = $('respInput');
const respInstructions = $('respInstructions');
const tempSlider = $('tempSlider');
const tempValue = $('tempValue');
const maxTokensInput = $('maxTokens');
const maxOutputTokensInput = $('maxOutputTokens');
const streamCheck = $('streamCheck');
const streamCheckResp = $('streamCheckResp');
const sendBtn = $('sendBtn');
const responseArea = $('responseArea');

function onLogout() {
  models = [];
  modelList.innerHTML = '';
  responseArea.innerHTML = '<div class="chat-empty"><div class="chat-empty-title">Console</div><div>Send a request to begin</div></div>';
}

// API type toggle
apiTypeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentApiType = btn.dataset.type;
    apiTypeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateFieldsVisibility();
    if (isRawMode) updateRawJson();
  });
});

function updateFieldsVisibility() {
  if (isRawMode) {
    formFields.style.display = 'none';
    rawFields.style.display = 'block';
  } else {
    formFields.style.display = 'block';
    rawFields.style.display = 'none';
    chatFields.style.display = currentApiType === 'chat' ? 'block' : 'none';
    responsesFields.style.display = currentApiType === 'responses' ? 'block' : 'none';
  }
}

// Raw JSON toggle
rawToggle.addEventListener('change', () => {
  isRawMode = rawToggle.checked;
  if (isRawMode) updateRawJson();
  updateFieldsVisibility();
});

function buildRequestBody() {
  if (currentApiType === 'chat') {
    const body = {
      model: modelInput.value,
      messages: [],
      stream: streamCheck.checked,
    };
    const sys = systemMsg.value.trim();
    if (sys) body.messages.push({ role: 'system', content: sys });
    body.messages.push({ role: 'user', content: userMsg.value });
    const temp = parseFloat(tempSlider.value);
    if (!isNaN(temp)) body.temperature = temp;
    const maxTok = parseInt(maxTokensInput.value, 10);
    if (!isNaN(maxTok) && maxTok > 0) body.max_completion_tokens = maxTok;
    return body;
  } else {
    const body = {
      model: modelInput.value,
      input: respInput.value,
      stream: streamCheckResp.checked,
    };
    const instr = respInstructions.value.trim();
    if (instr) body.instructions = instr;
    const temp = parseFloat(tempSlider.value);
    if (!isNaN(temp)) body.temperature = temp;
    const maxTok = parseInt(maxOutputTokensInput.value, 10);
    if (!isNaN(maxTok) && maxTok > 0) body.max_output_tokens = maxTok;
    return body;
  }
}

function updateRawJson() {
  const body = buildRequestBody();
  rawJsonInput.value = JSON.stringify(body, null, 2);
}

// Temperature slider
tempSlider.addEventListener('input', () => {
  tempValue.textContent = parseFloat(tempSlider.value).toFixed(1);
});

// Fetch models
async function fetchModels() {
  try {
    const res = await apiFetch('/v1/models');
    if (!res.ok) return;
    const data = await res.json();
    models = (data.data || []).map(m => m.id);
    modelList.innerHTML = '';
    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      modelList.appendChild(opt);
    });
  } catch {}
}

onAuthenticated(() => {
  fetchModels();
});

// Syntax coloring for JSON
function colorizeJson(json) {
  const str = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"([^"\\\\]*(\\\\.[^"\\\\]*)*)"\\s*:/g, '<span class="json-key">"$1"</span>:')
    .replace(/"([^"\\\\]*(\\\\.[^"\\\\]*)*)"/g, '<span class="json-string">"$1"</span>')
    .replace(/\\b(-?\\d+\\.?\\d*([eE][+-]?\\d+)?)\\b/g, '<span class="json-number">$1</span>')
    .replace(/\\b(true|false)\\b/g, '<span class="json-bool">$1</span>')
    .replace(/\\bnull\\b/g, '<span class="json-null">null</span>');
}

function showError(title, detail) {
  responseArea.innerHTML =
    '<div class="error-card">' +
      '<div class="error-card-title">' + escapeHtml(title) + '</div>' +
      '<div class="error-card-body">' + escapeHtml(detail) + '</div>' +
    '</div>';
}

function renderMetaBar(info) {
  let html = '<div class="meta-bar">';
  if (info.totalTime != null) html += '<div class="meta-tag">Total <strong>' + info.totalTime + 'ms</strong></div>';
  if (info.ttft != null) html += '<div class="meta-tag">TTFT <strong>' + info.ttft + 'ms</strong></div>';
  if (info.model) html += '<div class="meta-tag">Model <strong>' + escapeHtml(info.model) + '</strong></div>';
  if (info.usage) {
    const u = info.usage;
    if (u.prompt_tokens != null) html += '<div class="meta-tag">Prompt <strong>' + u.prompt_tokens + '</strong></div>';
    if (u.completion_tokens != null) html += '<div class="meta-tag">Completion <strong>' + u.completion_tokens + '</strong></div>';
    if (u.total_tokens != null) html += '<div class="meta-tag">Tokens <strong>' + u.total_tokens + '</strong></div>';
  }
  html += '</div>';
  return html;
}

// Send request
async function sendRequest() {
  if (isLoading) {
    if (abortController) abortController.abort();
    return;
  }

  let body;
  try {
    body = isRawMode ? JSON.parse(rawJsonInput.value) : buildRequestBody();
  } catch (e) {
    showError('Invalid JSON', e.message);
    return;
  }

  if (!body.model) {
    showError('Missing model', 'Please specify a model name.');
    return;
  }

  const endpoint = currentApiType === 'chat' ? '/v1/chat/completions' : '/v1/responses';
  const isStream = !!body.stream;

  // Show user message in chat
  const userContent = body.messages ? body.messages[body.messages.length - 1]?.content : body.input;
  if (userContent) {
    const userMsgEl = document.createElement('div');
    userMsgEl.className = 'msg msg-user';
    userMsgEl.innerHTML = '<div class="msg-bubble">' + escapeHtml(userContent) + '</div>';
    responseArea.appendChild(userMsgEl);
    responseArea.scrollTop = responseArea.scrollHeight;
  }

  isLoading = true;
  abortController = new AbortController();
  sendBtn.textContent = 'Cancel';
  sendBtn.classList.add('cancel');

  // Show loading
  const loadingEl = document.createElement('div');
  loadingEl.className = 'loading-indicator';
  loadingEl.id = 'loadingIndicator';
  loadingEl.innerHTML =
    '<div class="loading-dot"></div>' +
    '<div class="loading-dot"></div>' +
    '<div class="loading-dot"></div>' +
    '<span>Waiting for response...</span>';
  responseArea.appendChild(loadingEl);
  responseArea.scrollTop = responseArea.scrollHeight;

  const startTime = performance.now();
  let ttft = null;

  try {
    const res = await apiFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: abortController.signal,
    });

    // Remove loading
    const li = $('loadingIndicator');
    if (li) li.remove();

    if (!res.ok) {
      const errData = await res.text();
      let errMsg;
      try { errMsg = JSON.stringify(JSON.parse(errData), null, 2); } catch { errMsg = errData; }
      const errEl = document.createElement('div');
      errEl.className = 'msg msg-assistant';
      errEl.innerHTML =
        '<div class="error-card">' +
          '<div class="error-card-title">HTTP ' + res.status + '</div>' +
          '<div class="error-card-body">' + escapeHtml(errMsg) + '</div>' +
        '</div>';
      responseArea.appendChild(errEl);
      responseArea.scrollTop = responseArea.scrollHeight;
      return;
    }

    if (isStream) {
      await handleStreamResponse(res, startTime);
    } else {
      const data = await res.json();
      const totalTime = Math.round(performance.now() - startTime);
      const model = data.model || '';
      const usage = data.usage || null;

      // Extract text content
      let textContent = '';
      if (data.choices && data.choices[0]) {
        textContent = data.choices[0].message?.content || '';
      } else if (data.output) {
        for (const item of data.output) {
          if (item.type === 'message' && item.content) {
            for (const c of item.content) {
              if (c.type === 'output_text') textContent += c.text;
            }
          }
        }
      }

      const assistantEl = document.createElement('div');
      assistantEl.className = 'msg msg-assistant';
      let assistantHtml = '';
      if (model) assistantHtml += '<div class="msg-model-label">' + escapeHtml(model) + '</div>';
      if (textContent) {
        assistantHtml += '<div class="msg-bubble">' + escapeHtml(textContent) + '</div>';
      }
      assistantHtml += '<div class="response-json">' + colorizeJson(data) + '</div>';
      assistantHtml += renderMetaBar({ totalTime, model, usage });
      assistantEl.innerHTML = assistantHtml;
      responseArea.appendChild(assistantEl);
      responseArea.scrollTop = responseArea.scrollHeight;
    }
  } catch (e) {
    const li = $('loadingIndicator');
    if (li) li.remove();
    if (e.name === 'AbortError') {
      const cancelEl = document.createElement('div');
      cancelEl.className = 'msg msg-assistant';
      cancelEl.innerHTML = '<div class="msg-bubble" style="color:var(--text-tertiary);font-style:italic;">Request cancelled</div>';
      responseArea.appendChild(cancelEl);
    } else {
      const errEl = document.createElement('div');
      errEl.className = 'msg msg-assistant';
      errEl.innerHTML =
        '<div class="error-card">' +
          '<div class="error-card-title">Request Failed</div>' +
          '<div class="error-card-body">' + escapeHtml(e.message) + '</div>' +
        '</div>';
      responseArea.appendChild(errEl);
    }
    responseArea.scrollTop = responseArea.scrollHeight;
  } finally {
    isLoading = false;
    abortController = null;
    sendBtn.textContent = 'Send';
    sendBtn.classList.remove('cancel');
  }
}

async function handleStreamResponse(res, startTime) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let ttft = null;
  let fullText = '';
  let lastData = null;
  let model = '';
  let usage = null;

  // Create assistant message element
  const assistantEl = document.createElement('div');
  assistantEl.className = 'msg msg-assistant';
  assistantEl.innerHTML =
    '<div class="msg-model-label" id="streamModelLabel"></div>' +
    '<div class="msg-bubble" id="streamOutput"><span class="stream-cursor"></span></div>' +
    '<div id="streamMeta"></div>';
  responseArea.appendChild(assistantEl);
  responseArea.scrollTop = responseArea.scrollHeight;

  const streamOutput = $('streamOutput');
  const streamMeta = $('streamMeta');
  const streamModelLabel = $('streamModelLabel');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const payload = trimmed.slice(6);
      if (payload === '[DONE]') continue;

      try {
        const parsed = JSON.parse(payload);
        lastData = parsed;
        if (!model && parsed.model) {
          model = parsed.model;
          streamModelLabel.textContent = model;
        }
        if (parsed.usage) usage = parsed.usage;

        // Chat completions streaming
        if (parsed.choices && parsed.choices.length > 0) {
          const delta = parsed.choices[0].delta;
          if (delta && delta.content) {
            if (ttft === null) ttft = Math.round(performance.now() - startTime);
            fullText += delta.content;
            streamOutput.innerHTML = escapeHtml(fullText) + '<span class="stream-cursor"></span>';
            responseArea.scrollTop = responseArea.scrollHeight;
          }
        }

        // Responses API streaming
        if (parsed.type === 'response.output_text.delta' && parsed.delta) {
          if (ttft === null) ttft = Math.round(performance.now() - startTime);
          fullText += parsed.delta;
          streamOutput.innerHTML = escapeHtml(fullText) + '<span class="stream-cursor"></span>';
          responseArea.scrollTop = responseArea.scrollHeight;
        }
        if (parsed.type === 'response.completed' && parsed.response) {
          if (parsed.response.model) {
            model = parsed.response.model;
            streamModelLabel.textContent = model;
          }
          if (parsed.response.usage) usage = parsed.response.usage;
        }
      } catch {}
    }
  }

  // Remove cursor, show final text
  streamOutput.innerHTML = escapeHtml(fullText);
  const totalTime = Math.round(performance.now() - startTime);
  streamMeta.innerHTML = renderMetaBar({ totalTime, ttft, model, usage });
}

sendBtn.addEventListener('click', sendRequest);

// Enter to send (Shift+Enter for newline)
const chatInput = $('chatInput');
if (chatInput) {
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Sync value to userMsg if in chat mode
      if (currentApiType === 'chat' && !isRawMode) {
        userMsg.value = chatInput.value;
      }
      sendRequest();
    }
  });
}

// Also sync chat input to userMsg on input
if (chatInput) {
  chatInput.addEventListener('input', () => {
    if (currentApiType === 'chat' && !isRawMode) {
      userMsg.value = chatInput.value;
    }
  });
}

// Ctrl+Enter shortcut
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    sendRequest();
  }
});

// Auto-resize chat input
if (chatInput) {
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';
  });
}

updateFieldsVisibility();
`;

export function PlaygroundPage(): JSX.Element {
	return (
		<Layout
			title="Console"
			activePage="playground"
			pageStyles={pageStyles}
			pageScript={pageScript}
		>
			<div class="console">
				<aside class="sidebar">
					<div class="sidebar-section">
						<span class="sidebar-label">Endpoint</span>
						<div class="api-toggle">
							<button
								type="button"
								class="api-toggle-btn api-type-btn active"
								data-type="chat"
							>
								Chat Completions
							</button>
							<button
								type="button"
								class="api-toggle-btn api-type-btn"
								data-type="responses"
							>
								Responses
							</button>
						</div>
					</div>

					<div class="sidebar-section">
						<span class="sidebar-label">Model</span>
						<input
							type="text"
							class="input"
							id="modelInput"
							list="modelList"
							placeholder="e.g. gpt-4o or gpt-4o@@openrouter"
						/>
						<datalist id="modelList" />
					</div>

					<div class="sidebar-section">
						<span class="sidebar-label">System Prompt</span>
						<textarea
							class="input"
							id="systemMsg"
							rows="3"
							placeholder="You are a helpful assistant."
						/>
					</div>

					<div class="sidebar-section">
						<span class="sidebar-label">Temperature</span>
						<div class="temp-row">
							<input
								type="range"
								class="temp-slider"
								id="tempSlider"
								min="0"
								max="2"
								step="0.1"
								value="1.0"
							/>
							<span class="temp-value" id="tempValue">
								1.0
							</span>
						</div>
					</div>

					<div class="sidebar-divider" />

					<div id="formFields">
						<div id="chatFields">
							<div class="sidebar-section">
								<span class="sidebar-label">Max Completion Tokens</span>
								<input
									type="number"
									class="input"
									id="maxTokens"
									min="1"
									placeholder="Optional"
									style="font-family:var(--font-mono);font-size:12px"
								/>
							</div>
							<div class="sidebar-section" style="display:none">
								<span class="sidebar-label">User Message</span>
								<textarea
									class="input"
									id="userMsg"
									rows="3"
									placeholder="Enter your message..."
								/>
							</div>
						</div>

						<div id="responsesFields">
							<div class="sidebar-section">
								<span class="sidebar-label">Input</span>
								<textarea
									class="input"
									id="respInput"
									rows="3"
									placeholder="Enter your input..."
								/>
							</div>
							<div class="sidebar-section">
								<span class="sidebar-label">Instructions</span>
								<textarea
									class="input"
									id="respInstructions"
									rows="2"
									placeholder="Optional instructions..."
								/>
							</div>
							<div class="sidebar-section">
								<span class="sidebar-label">Max Output Tokens</span>
								<input
									type="number"
									class="input"
									id="maxOutputTokens"
									min="1"
									placeholder="Optional"
									style="font-family:var(--font-mono);font-size:12px"
								/>
							</div>
						</div>
					</div>

					<div id="rawFields" class="raw-json-area">
						<div class="sidebar-section">
							<span class="sidebar-label">Request Body</span>
							<textarea
								id="rawJson"
								spellcheck="false"
								placeholder='{"model": "...", "messages": [...]}'
							/>
						</div>
					</div>

					<div class="sidebar-divider" />

					<div class="toggle-row">
						<span class="toggle-label">Raw JSON</span>
						<label class="toggle-switch">
							<input type="checkbox" id="rawToggle" />
							<span class="toggle-track" />
						</label>
					</div>

					<div class="toggle-row" id="streamToggleChat">
						<span class="toggle-label">Stream</span>
						<label class="toggle-switch">
							<input type="checkbox" id="streamCheck" />
							<span class="toggle-track" />
						</label>
					</div>

					<div class="toggle-row" id="streamToggleResp" style="display:none">
						<span class="toggle-label">Stream</span>
						<label class="toggle-switch">
							<input type="checkbox" id="streamCheckResp" />
							<span class="toggle-track" />
						</label>
					</div>

					<div class="sidebar-spacer" />

					<div class="routing-info">model@@provider to override routing</div>
				</aside>

				<div class="chat-area">
					<div class="chat-messages" id="responseArea">
						<div class="chat-empty">
							<div class="chat-empty-title">Console</div>
							<div>Send a request to begin</div>
						</div>
					</div>

					<div class="chat-input-area">
						<textarea
							id="chatInput"
							rows="1"
							placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
						/>
						<button type="button" class="send-btn" id="sendBtn">
							Send
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
}
