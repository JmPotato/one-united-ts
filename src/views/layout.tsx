interface LayoutProps {
	title: string;
	activePage: string;
	pageStyles: string;
	pageScript: string;
	children: JSX.Element;
}

const sharedStyles = `
:root {
  --bg-deep: #f4f1e6;
  --bg-surface: #fcfaf0;
  --bg-elevated: #f6f1e4;
  --gold-bright: #15120f;
  --gold-base: #26211b;
  --gold-muted: #5c5448;
  --gold-dim: #8b8376;
  --text-primary: #0f0f0f;
  --text-secondary: #4f493f;
  --text-tertiary: #878072;
  --border-hairline: rgba(15, 15, 15, 0.08);
  --border-light: rgba(15, 15, 15, 0.16);
  --border-focus: rgba(15, 15, 15, 0.34);
  --accent-success: #667a54;
  --accent-error: #8b0000;
  --accent-warning: #b07d2d;
  --font-display: "IBM Plex Serif", serif;
  --font-ui: "IBM Plex Serif", serif;
  --font-mono: "VT323", monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { min-height: 100%; }

body {
  background-color: var(--bg-deep);
  color: var(--text-primary);
  font-family: var(--font-ui);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  background-image:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.45), transparent 28%),
    radial-gradient(circle at 85% 0%, rgba(224, 220, 207, 0.7), transparent 24%),
    linear-gradient(180deg, #f6f3ea 0%, #f0ede0 100%);
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.18) 1px,
      transparent 1px,
      transparent 4px
    );
  opacity: 0.18;
  mix-blend-mode: multiply;
}

.gold-gradient-text {
  background: linear-gradient(180deg, var(--gold-bright) 0%, var(--gold-muted) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

h1 {
  font-size: 2.5rem;
  line-height: 1.1;
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: 0.02em;
}

h2 {
  font-size: 1.75rem;
  line-height: 1.2;
  font-family: var(--font-display);
  font-weight: 400;
  color: var(--gold-base);
}

h3 {
  font-size: 1.2rem;
  font-family: var(--font-display);
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}

.label {
  font-family: var(--font-mono);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
}

.header {
  border-top: 1px solid var(--border-hairline);
  border-bottom: 1px solid var(--border-hairline);
  padding: 16px 32px 20px;
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: rgba(252, 250, 240, 0.92);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);
}

.header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -12px;
  height: 12px;
  pointer-events: none;
  background-image:
    linear-gradient(135deg, rgba(252, 250, 240, 0.92) 25%, transparent 25%),
    linear-gradient(225deg, rgba(252, 250, 240, 0.92) 25%, transparent 25%);
  background-position: 0 0;
  background-size: 18px 18px;
}

.logo {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
}

.logo-mark {
  width: 28px;
  height: 28px;
  border: 1px solid var(--text-primary);
  border-radius: 4px;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.logo-mark::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 10px;
  background-color: var(--text-primary);
  border-radius: 2px;
}

.nav-links {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  transition: color 0.2s ease, border-color 0.2s ease;
  position: relative;
  padding: 4px 0;
  cursor: pointer;
  border-bottom: 1px solid transparent;
}

.nav-link:hover { color: var(--text-primary); }

.nav-link.active { color: var(--text-primary); }

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 1px;
  border-bottom: 2px dashed var(--text-primary);
}

.auth-widget {
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 1px dashed var(--border-light);
  padding-left: 20px;
  flex-wrap: wrap;
}

.auth-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-primary);
  padding: 6px 0;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  width: 180px;
  letter-spacing: 0.04em;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.auth-input:focus {
  outline: none;
  border-bottom-color: var(--text-primary);
}

.auth-input::placeholder { color: var(--text-tertiary); }

.auth-input:disabled {
  background: transparent;
  border-color: transparent;
  color: var(--text-primary);
  width: auto;
}

.auth-btn {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--text-primary);
  padding: 8px 14px;
  font-family: var(--font-mono);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  line-height: 1;
}

.auth-btn:hover {
  background: var(--text-primary);
  color: var(--bg-deep);
}

.auth-btn.logout {
  border-color: var(--border-light);
  color: var(--text-tertiary);
}

.auth-btn.logout:hover {
  border-color: var(--accent-error);
  background: transparent;
  color: var(--accent-error);
}

.auth-status {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-tertiary);
  display: none;
}

.auth-status.error {
  display: inline;
  color: var(--accent-error);
}

.auth-status.success { display: none; }

.main-content {
  flex: 1;
  padding: 72px 32px 64px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-hairline);
  padding: 24px;
  position: relative;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.08);
}

.card::before, .card::after { display: none; }

.btn {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--text-primary);
  padding: 8px 24px;
  font-family: var(--font-mono);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  line-height: 1;
}

.btn:hover {
  background: var(--text-primary);
  color: var(--bg-deep);
}

.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--text-primary);
  color: var(--bg-deep);
  border-color: var(--text-primary);
}

.btn-primary:hover {
  background: transparent;
  color: var(--text-primary);
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.btn-secondary:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.input {
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  width: 100%;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--border-focus);
}

.input::placeholder { color: var(--text-tertiary); }

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-active {
  background-color: var(--accent-success);
  box-shadow: 0 0 8px rgba(141, 163, 114, 0.4);
}

.status-warning { background-color: var(--accent-warning); }
.status-error { background-color: var(--accent-error); }

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-family: var(--font-mono);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.badge-success {
  background: rgba(141, 163, 114, 0.15);
  color: var(--accent-success);
  border: 1px solid rgba(141, 163, 114, 0.3);
}

.badge-warning {
  background: rgba(194, 154, 83, 0.15);
  color: var(--accent-warning);
  border: 1px solid rgba(194, 154, 83, 0.3);
}

.badge-error {
  background: rgba(163, 91, 76, 0.15);
  color: var(--accent-error);
  border: 1px solid rgba(163, 91, 76, 0.3);
}

.badge-muted {
  background: rgba(212, 180, 122, 0.08);
  color: var(--text-secondary);
  border: 1px solid var(--border-hairline);
}

.summary-bar {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-secondary);
}

.summary-value {
  font-weight: 600;
  color: var(--gold-base);
  font-family: var(--font-mono);
}

.search-input {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  padding: 10px 14px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 1.1rem;
  outline: none;
  margin-bottom: 16px;
  transition: border-color 0.2s ease;
}

.search-input:focus { border-color: var(--border-focus); }
.search-input::placeholder { color: var(--text-tertiary); }

.empty {
  text-align: center;
  padding: 48px 32px;
  color: var(--text-tertiary);
  background: var(--bg-surface);
  border: 1px dashed var(--border-light);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 12px;
  opacity: 0.4;
}

.table-container {
  width: 100%;
  border: 1px solid var(--border-hairline);
  background: var(--bg-surface);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  font-weight: 400;
  border-bottom: 1px dashed var(--border-light);
}

td {
  padding: 16px;
  border-bottom: 1px solid var(--border-hairline);
  color: var(--text-primary);
  font-size: 1rem;
}

tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(224, 220, 207, 0.2); }

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb-sm { margin-bottom: 8px; }
.mb-md { margin-bottom: 16px; }
.mb-lg { margin-bottom: 24px; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-enter { animation: fadeIn 0.4s ease forwards; }

@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 16px;
    gap: 8px;
  }
  .auth-widget {
    width: 100%;
    border-left: none;
    padding-left: 0;
    border-top: 1px dashed var(--border-light);
    padding-top: 8px;
  }
  .auth-input { flex: 1; }
  .nav-links { gap: 16px; }
  .nav-link { font-size: 1rem; }
  .main-content { padding: 24px 16px; }
  .summary-bar { flex-direction: column; gap: 8px; }
}

@media (max-width: 480px) {
  .nav-links { gap: 8px; }
  .nav-link { font-size: 0.95rem; letter-spacing: 0.05em; }
}
`;

const sharedScript = `
const STORAGE_KEY = 'one_united_api_key';

const $ = (id) => document.getElementById(id);
const authBtn = $('authBtn');
const authStatus = $('authStatus');
const apiKeyInput = $('apiKey');

let apiKey = localStorage.getItem(STORAGE_KEY) || '';
let _onAuthCallback = null;

function setStatus(message, type = '') {
  authStatus.textContent = message;
  authStatus.className = 'auth-status' + (type ? ' ' + type : '');
}

function setAuthenticatedUI(authenticated) {
  if (authenticated) {
    setStatus('', 'success');
    apiKeyInput.disabled = true;
    apiKeyInput.value = apiKey.slice(0, 8) + '...' + apiKey.slice(-4);
    authBtn.textContent = 'Disconnect';
    authBtn.className = 'auth-btn logout';
  } else {
    setStatus('');
    apiKeyInput.value = '';
    apiKeyInput.disabled = false;
    authBtn.textContent = 'Connect';
    authBtn.className = 'auth-btn';
  }
}

async function apiFetch(path, options = {}) {
  const headers = { ...options.headers, 'Authorization': 'Bearer ' + apiKey };
  return fetch(path, { ...options, headers });
}

function onAuthenticated(callback) {
  _onAuthCallback = callback;
}

async function authenticate() {
  const key = apiKeyInput.value.trim();
  if (!key) {
    setStatus('Enter API Key', 'error');
    return;
  }

  try {
    const res = await fetch('/stats', {
      headers: { 'Authorization': 'Bearer ' + key }
    });

    if (res.status === 401) {
      setStatus('Invalid key', 'error');
      return;
    }

    apiKey = key;
    localStorage.setItem(STORAGE_KEY, key);
    setAuthenticatedUI(true);

    if (_onAuthCallback) _onAuthCallback();
  } catch (e) {
    setStatus('Failed', 'error');
  }
}

function logout() {
  apiKey = '';
  localStorage.removeItem(STORAGE_KEY);
  setAuthenticatedUI(false);
  if (typeof onLogout === 'function') onLogout();
}

function handleAuthClick() {
  if (apiKeyInput.disabled) {
    logout();
  } else {
    authenticate();
  }
}

authBtn.addEventListener('click', handleAuthClick);
apiKeyInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !apiKeyInput.disabled) authenticate();
});

if (apiKey) {
  apiKeyInput.value = apiKey;
  authenticate();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
`;

const navItems = [
	{ href: "/", key: "latency", label: "Latency" },
	{ href: "/ui/models", key: "models", label: "Routing" },
	{ href: "/ui/providers", key: "providers", label: "Providers" },
	{ href: "/ui/config", key: "config", label: "Config" },
	{ href: "/ui/playground", key: "playground", label: "Console" },
];

export function Layout({
	title,
	activePage,
	pageStyles,
	pageScript,
	children,
}: LayoutProps): JSX.Element {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>One United - {title}</title>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossorigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500;600&family=VT323&display=swap"
					rel="stylesheet"
				/>
				<style>
					{sharedStyles}
					{pageStyles}
				</style>
			</head>
			<body>
				<header class="header">
					<a href="/" class="logo">
						<div class="logo-mark" />
						<span class="gold-gradient-text">ONE UNITED</span>
					</a>

					<nav class="nav-links">
						{navItems.map((item) => (
							<a
								href={item.href}
								class={`nav-link${activePage === item.key ? " active" : ""}`}
							>
								{item.label}
							</a>
						))}
					</nav>

					<div class="auth-widget">
						<input
							type="password"
							class="auth-input"
							id="apiKey"
							placeholder="API Key..."
						/>
						<button type="button" class="auth-btn" id="authBtn">
							Connect
						</button>
						<span class="auth-status" id="authStatus" />
					</div>
				</header>

				<main class="main-content page-enter">{children}</main>

				<script>
					{sharedScript}
					{pageScript}
				</script>
			</body>
		</html>
	);
}
