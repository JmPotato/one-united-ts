import { Layout } from "@/views/layout";

const pageStyles = `
.page-heading {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    margin-bottom: 32px;
}

.toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    align-items: center;
}

.toolbar-group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.toolbar-spacer {
    flex: 1;
}

.editor-wrapper {
    position: relative;
}

.editor-textarea {
    width: 100%;
    min-height: 600px;
    background:
        linear-gradient(transparent 30px, rgba(15, 15, 15, 0.06) 31px),
        linear-gradient(90deg, rgba(224, 220, 207, 0.38), rgba(224, 220, 207, 0.1)),
        var(--bg-surface);
    background-size: 100% 31px, 100% 100%, auto;
    border: 1px solid var(--border-light);
    padding: 24px;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 1.1rem;
    line-height: 1.55;
    resize: vertical;
    outline: none;
    tab-size: 2;
    white-space: pre;
    overflow-wrap: normal;
    overflow-x: auto;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.04);
}

.editor-textarea:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 1px rgba(15, 15, 15, 0.08);
}

.editor-textarea::placeholder {
    color: var(--text-tertiary);
}

.feedback-bar {
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    font-family: var(--font-mono);
    display: none;
    line-height: 1.6;
}

.feedback-bar.valid {
    display: block;
    background: rgba(102, 122, 84, 0.08);
    color: var(--accent-success);
    border: 1px solid rgba(102, 122, 84, 0.2);
}

.feedback-bar.invalid {
    display: block;
    background: rgba(139, 0, 0, 0.05);
    color: var(--accent-error);
    border: 1px solid rgba(139, 0, 0, 0.18);
}

.feedback-bar .yaml-key {
    color: var(--gold-base);
}

.feedback-bar .yaml-string {
    color: var(--text-secondary);
}

.feedback-bar .yaml-value {
    color: var(--gold-bright);
}

.feedback-bar .yaml-comment {
    color: var(--text-tertiary);
    font-style: italic;
}

.hash-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.75rem;
    padding: 0.9rem 0 0;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
    font-family: var(--font-mono);
    border-top: 1px dashed var(--border-light);
}

.hash-label {
    font-family: var(--font-mono);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 1rem;
}

.hash-value {
    color: var(--text-tertiary);
    word-break: break-all;
}

.hash-match {
    color: var(--accent-success);
}

.hash-mismatch {
    color: var(--accent-warning);
}

.hash-separator {
    color: var(--gold-dim);
    user-select: none;
}

@media (max-width: 640px) {
    .page-heading {
        font-size: 1.75rem;
        margin-bottom: 24px;
    }
    .toolbar {
        flex-direction: column;
    }
    .toolbar-group {
        width: 100%;
    }
    .toolbar-group .btn {
        flex: 1;
    }
    .toolbar-spacer {
        display: none;
    }
    .editor-textarea {
        min-height: 360px;
        font-size: 0.95rem;
        padding: 16px;
    }
    .hash-indicator {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }
}
`;

const pageScript = `
let serverHash = '';
let loadedContent = '';
let hasUnsavedChanges = false;

const editor = $('configEditor');
const feedbackBar = $('feedbackBar');
const hashLocal = $('hashLocal');
const hashServer = $('hashServer');
const hashStatus = $('hashStatus');
const btnDiscard = $('btnDiscard');
const btnDeploy = $('btnDeploy');
const btnLoad = $('btnLoad');
const btnValidate = $('btnValidate');
const btnFormat = $('btnFormat');
const btnDownload = $('btnDownload');

function setFeedback(message, valid) {
    feedbackBar.textContent = message;
    feedbackBar.className = 'feedback-bar ' + (valid ? 'valid' : 'invalid');
}

function clearFeedback() {
    feedbackBar.className = 'feedback-bar';
    feedbackBar.textContent = '';
}

async function computeHash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    const array = Array.from(new Uint8Array(buffer));
    return array.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

async function updateHashDisplay() {
    const content = editor.value;
    if (content) {
        const local = await computeHash(content);
        hashLocal.textContent = local;
    } else {
        hashLocal.textContent = 'empty';
    }

    if (serverHash) {
        hashServer.textContent = serverHash.slice(0, 16);
    } else {
        hashServer.textContent = 'unknown';
    }

    if (!serverHash || !editor.value) {
        hashStatus.textContent = '';
        hashStatus.className = '';
    } else if (loadedContent === editor.value) {
        hashStatus.textContent = '(synced)';
        hashStatus.className = 'hash-match';
    } else {
        hashStatus.textContent = '(modified)';
        hashStatus.className = 'hash-mismatch';
    }
}

function markDirty() {
    hasUnsavedChanges = loadedContent !== editor.value;
    updateHashDisplay();
}

async function fetchServerHash() {
    try {
        const res = await apiFetch('/stats');
        if (res.ok) {
            const data = await res.json();
            serverHash = data.hash || '';
            updateHashDisplay();
        }
    } catch (e) {
        // Silently fail
    }
}

async function loadConfig() {
    btnLoad.disabled = true;
    clearFeedback();
    try {
        const res = await apiFetch('/config', {
            headers: { 'Accept': 'application/yaml' }
        });
        if (!res.ok) {
            const err = await res.text();
            setFeedback('Failed to load config: ' + (err || res.statusText), false);
            return;
        }
        const yaml = await res.text();
        editor.value = yaml;
        loadedContent = yaml;
        hasUnsavedChanges = false;
        setFeedback('Configuration loaded successfully', true);
        await fetchServerHash();
    } catch (e) {
        setFeedback('Failed to load config: ' + e.message, false);
    } finally {
        btnLoad.disabled = false;
    }
}

async function validateConfig() {
    const content = editor.value.trim();
    if (!content) {
        setFeedback('Editor is empty', false);
        return;
    }
    btnValidate.disabled = true;
    clearFeedback();
    try {
        const res = await apiFetch('/config/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/yaml' },
            body: content
        });
        const data = await res.json();
        if (data.valid) {
            setFeedback('Valid: ' + data.providers_count + ' providers, ' + data.rules_count + ' rules', true);
        } else {
            setFeedback(data.error || 'Validation failed', false);
        }
    } catch (e) {
        setFeedback('Validation request failed: ' + e.message, false);
    } finally {
        btnValidate.disabled = false;
    }
}

async function applyConfig() {
    const content = editor.value.trim();
    if (!content) {
        setFeedback('Editor is empty', false);
        return;
    }
    if (!confirm('Deploy this configuration to the gateway? This will replace the current config.')) {
        return;
    }
    btnDeploy.disabled = true;
    clearFeedback();
    try {
        const res = await apiFetch('/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/yaml' },
            body: content
        });
        const data = await res.json();
        if (data.error) {
            setFeedback('Deploy failed: ' + data.error, false);
        } else {
            loadedContent = editor.value;
            hasUnsavedChanges = false;
            setFeedback('Configuration deployed successfully', true);
            await fetchServerHash();
        }
    } catch (e) {
        setFeedback('Deploy request failed: ' + e.message, false);
    } finally {
        btnDeploy.disabled = false;
    }
}

function discardChanges() {
    if (!loadedContent) {
        setFeedback('No loaded configuration to revert to', false);
        return;
    }
    if (!hasUnsavedChanges) return;
    if (!confirm('Discard all unsaved changes?')) return;
    editor.value = loadedContent;
    hasUnsavedChanges = false;
    clearFeedback();
    updateHashDisplay();
}

async function formatConfig() {
    const content = editor.value.trim();
    if (!content) {
        setFeedback('Editor is empty', false);
        return;
    }
    btnFormat.disabled = true;
    clearFeedback();
    try {
        const res = await apiFetch('/config/format', {
            method: 'POST',
            headers: { 'Content-Type': 'application/yaml' },
            body: content
        });
        if (!res.ok) {
            const err = await res.json();
            setFeedback('Format failed: ' + (err.error || res.statusText), false);
            return;
        }
        editor.value = await res.text();
        markDirty();
        setFeedback('Formatted successfully', true);
    } catch (e) {
        setFeedback('Format failed: ' + e.message, false);
    } finally {
        btnFormat.disabled = false;
    }
}

function downloadConfig() {
    const content = editor.value;
    if (!content.trim()) {
        setFeedback('Editor is empty', false);
        return;
    }
    const blob = new Blob([content], { type: 'application/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Tab key inserts 2 spaces
editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        markDirty();
    }
});

editor.addEventListener('input', markDirty);

btnDiscard.addEventListener('click', discardChanges);
btnDeploy.addEventListener('click', applyConfig);
btnLoad.addEventListener('click', loadConfig);
btnValidate.addEventListener('click', validateConfig);
btnFormat.addEventListener('click', formatConfig);
btnDownload.addEventListener('click', downloadConfig);

window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

function onLogout() {
    editor.value = '';
    loadedContent = '';
    serverHash = '';
    hasUnsavedChanges = false;
    clearFeedback();
    updateHashDisplay();
}

onAuthenticated(() => {
    loadConfig();
});
`;

export function ConfigEditorPage(): JSX.Element {
	return (
		<Layout
			title="Gateway Configuration"
			activePage="config"
			pageStyles={pageStyles}
			pageScript={pageScript}
		>
			<div>
				<h1 class="page-heading">
					<span class="gold-gradient-text">Gateway Configuration</span>
				</h1>

				<div class="toolbar">
					<div class="toolbar-group">
						<button type="button" class="btn btn-secondary" id="btnDiscard">
							Discard
						</button>
						<button type="button" class="btn btn-primary" id="btnDeploy">
							Deploy Changes
						</button>
					</div>
					<div class="toolbar-spacer" />
					<div class="toolbar-group">
						<button type="button" class="btn btn-secondary" id="btnLoad">
							Load
						</button>
						<button type="button" class="btn btn-secondary" id="btnValidate">
							Validate
						</button>
						<button type="button" class="btn btn-secondary" id="btnFormat">
							Format
						</button>
						<button type="button" class="btn btn-secondary" id="btnDownload">
							Download
						</button>
					</div>
				</div>

				<div class="editor-wrapper">
					<textarea
						id="configEditor"
						class="editor-textarea"
						placeholder="Load the current configuration or paste YAML here..."
						spellcheck="false"
						autocorrect="off"
						autocapitalize="off"
					/>
				</div>

				<div id="feedbackBar" class="feedback-bar" />

				<div class="hash-indicator">
					<span>
						<span class="hash-label">Local:</span>{" "}
						<span class="hash-value" id="hashLocal">
							empty
						</span>
					</span>
					<span class="hash-separator">|</span>
					<span>
						<span class="hash-label">Server:</span>{" "}
						<span class="hash-value" id="hashServer">
							unknown
						</span>
					</span>
					<span id="hashStatus" />
				</div>
			</div>
		</Layout>
	);
}
