interface LayoutProps {
	title: string;
	activePage: string;
	pageStyles: string;
	pageScript: string;
	children: JSX.Element;
}

const sharedStyles = `
:root {
  --bg-deep: #0c0807;
  --bg-surface: #140d0b;
  --bg-elevated: #1e1411;
  --gold-bright: #e8ce96;
  --gold-base: #d4b47a;
  --gold-muted: #9e8457;
  --gold-dim: #6b583a;
  --text-primary: #f2e8da;
  --text-secondary: #baa485;
  --text-tertiary: #756550;
  --border-hairline: rgba(212, 180, 122, 0.12);
  --border-light: rgba(212, 180, 122, 0.25);
  --border-focus: rgba(212, 180, 122, 0.5);
  --accent-success: #8da372;
  --accent-error: #a35b4c;
  --accent-warning: #c29a53;
  --font-display: 'Cormorant Garamond', serif;
  --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--bg-deep);
  color: var(--text-primary);
  font-family: var(--font-ui);
  font-size: 13px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  background-image: radial-gradient(circle at 50% 0%, var(--bg-surface) 0%, var(--bg-deep) 70%);
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.gold-gradient-text {
  background: linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-base) 50%, var(--gold-muted) 100%);
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
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
  font-weight: 500;
}

.header {
  border-bottom: 1px solid var(--border-hairline);
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(20, 13, 11, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
}

.logo-mark {
  width: 24px;
  height: 24px;
  border: 1px solid var(--gold-base);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.logo-mark::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: var(--gold-bright);
  border-radius: 50%;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.2s ease;
  position: relative;
  padding: 16px 0;
  cursor: pointer;
}

.nav-link:hover { color: var(--gold-base); }

.nav-link.active { color: var(--gold-bright); }

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--gold-bright);
}

.auth-widget {
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 1px solid var(--border-hairline);
  padding-left: 24px;
}

.auth-input {
  background: var(--bg-elevated);
  border: 1px solid var(--border-hairline);
  color: var(--text-primary);
  padding: 6px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  width: 200px;
  transition: border-color 0.2s ease;
}

.auth-input:focus {
  outline: none;
  border-color: var(--border-focus);
}

.auth-input::placeholder { color: var(--text-tertiary); }

.auth-input:disabled {
  background: transparent;
  border-color: transparent;
  color: var(--gold-base);
  width: auto;
}

.auth-btn {
  background: transparent;
  color: var(--gold-base);
  border: 1px solid var(--border-light);
  padding: 6px 16px;
  font-family: var(--font-ui);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.auth-btn:hover {
  border-color: var(--gold-base);
  background: rgba(212, 180, 122, 0.05);
  color: var(--gold-bright);
}

.auth-btn.logout {
  border-color: var(--border-hairline);
  color: var(--text-tertiary);
}

.auth-btn.logout:hover {
  border-color: var(--accent-error);
  color: var(--accent-error);
}

.auth-status {
  font-size: 10px;
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
  padding: 48px 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-hairline);
  padding: 24px;
  position: relative;
}

.card::before, .card::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border: 1px solid var(--gold-dim);
  opacity: 0.5;
}
.card::before { top: 4px; left: 4px; border-right: none; border-bottom: none; }
.card::after { bottom: 4px; right: 4px; border-left: none; border-top: none; }

.btn {
  background: transparent;
  color: var(--gold-base);
  border: 1px solid var(--border-light);
  padding: 8px 24px;
  font-family: var(--font-ui);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:hover {
  border-color: var(--gold-base);
  background: rgba(212, 180, 122, 0.05);
  color: var(--gold-bright);
}

.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--gold-dim);
  color: var(--bg-deep);
  border-color: var(--gold-base);
}

.btn-primary:hover {
  background: var(--gold-muted);
  color: var(--bg-deep);
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-hairline);
}

.btn-secondary:hover {
  border-color: var(--border-light);
  color: var(--gold-base);
}

.input {
  background: var(--bg-elevated);
  border: 1px solid var(--border-hairline);
  color: var(--text-primary);
  padding: 8px 16px;
  font-family: var(--font-ui);
  font-size: 13px;
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
  font-size: 10px;
  font-weight: 500;
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
  gap: 8px;
  font-size: 12px;
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
  border: 1px solid var(--border-hairline);
  padding: 10px 16px;
  color: var(--text-primary);
  font-size: 13px;
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
  border: 1px dashed var(--border-hairline);
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
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  padding: 16px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  font-weight: 400;
  border-bottom: 1px solid var(--border-light);
}

td {
  padding: 16px;
  border-bottom: 1px solid var(--border-hairline);
  color: var(--text-primary);
}

tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(212, 180, 122, 0.02); }

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
    border-top: 1px solid var(--border-hairline);
    padding-top: 8px;
  }
  .auth-input { flex: 1; }
  .nav-links { gap: 16px; }
  .nav-link { font-size: 10px; }
  .main-content { padding: 24px 16px; }
  .summary-bar { flex-direction: column; gap: 8px; }
}

@media (max-width: 480px) {
  .nav-links { gap: 8px; }
  .nav-link { font-size: 9px; letter-spacing: 0.05em; }
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
					href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
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
