const styles = `
:root {
  --bg-primary: #FFFDFB;
  --bg-secondary: #FDF8F3;
  --bg-card: #FFFFFF;
  --text-primary: #1C1917;
  --text-secondary: #57534E;
  --text-muted: #A8A29E;
  --border: #E7E5E4;
  --border-hover: #D6D3D1;
  --accent: #D97706;
  --accent-light: #FEF3C7;
  --accent-gradient: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  --success: #059669;
  --success-light: #D1FAE5;
  --warning: #D97706;
  --error: #DC2626;
  --error-light: #FEE2E2;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.05);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.08);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg-secondary);
  color: var(--text-primary);
  min-height: 100vh;
  padding: 2rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 720px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 48px;
  height: 48px;
  background: var(--accent-gradient);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-md);
}

.logo svg {
  width: 28px;
  height: 28px;
  fill: white;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.auth-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.auth-card.authenticated {
  border-color: #86EFAC;
  background: #F0FDF4;
}

.auth-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.auth-input {
  flex: 1;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.2s ease;
}

.auth-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}

.auth-input::placeholder {
  color: var(--text-muted);
}

.auth-input:disabled {
  background: var(--bg-primary);
  color: var(--text-secondary);
}

.auth-btn {
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.75rem 1.25rem;
  color: white;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.auth-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.auth-btn:active {
  transform: translateY(0);
}

.auth-btn.logout {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.auth-btn.logout:hover {
  background: var(--error-light);
  color: var(--error);
  border-color: var(--error);
}

.auth-status {
  font-size: 0.8125rem;
  margin-top: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.auth-status.error { color: var(--error); }
.auth-status.success { color: var(--success); }

.meta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.meta-value {
  color: var(--text-secondary);
  font-weight: 500;
  font-family: "SF Mono", "Fira Code", monospace;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
  min-width: 0;
}

.model {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9375rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.provider {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.bar-container {
  margin-top: 0.5rem;
  max-width: 200px;
}

.bar-bg {
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.latency {
  font-size: 1.125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-sm);
  margin-left: 1rem;
  flex-shrink: 0;
}

.fast {
  color: var(--success);
  background: var(--success-light);
}
.fast .bar { background: var(--success); }

.medium {
  color: var(--warning);
  background: var(--accent-light);
}
.medium .bar { background: var(--warning); }

.slow {
  color: var(--error);
  background: var(--error-light);
}
.slow .bar { background: var(--error); }

.empty {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px dashed var(--border);
  border-radius: var(--radius-md);
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  opacity: 0.5;
}

@media (max-width: 640px) {
  body { padding: 1rem; }
  .card { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .latency { margin-left: 0; }
  .bar-container { max-width: 100%; width: 100%; }
}
`;

const clientScript = `
const STORAGE_KEY = 'one_united_api_key';
const REFRESH_INTERVAL = 3000;

const $ = (id) => document.getElementById(id);
const grid = $('grid');
const hashEl = $('hash');
const timeEl = $('time');
const metaInfo = $('metaInfo');
const authCard = $('authCard');
const authBtn = $('authBtn');
const authStatus = $('authStatus');
const apiKeyInput = $('apiKey');

let apiKey = localStorage.getItem(STORAGE_KEY) || '';
let refreshInterval = null;

function getLatencyClass(ms) {
  if (ms < 1000) return 'fast';
  if (ms < 3000) return 'medium';
  return 'slow';
}

function renderStats(data) {
  hashEl.textContent = data.hash?.slice(0, 8) || '-';
  timeEl.textContent = new Date().toLocaleTimeString();

  const entries = Object.entries(data.latency || {});
  if (!entries.length) {
    grid.innerHTML = '<div class="empty"><div class="empty-icon">~</div>No latency data yet.<br>Make some API requests to see metrics.</div>';
    return;
  }

  const maxLatency = Math.max(...entries.map(([, v]) => v));

  grid.innerHTML = entries.map(([key, ms]) => {
    const [model, ...providerParts] = key.split('@');
    const provider = providerParts.join('@') || 'unknown';
    const cls = getLatencyClass(ms);
    const pct = (ms / maxLatency * 100).toFixed(1);
    return \`
      <div class="card">
        <div class="model-info">
          <div class="model">\${model}</div>
          <div class="provider">\${provider}</div>
          <div class="bar-container">
            <div class="bar-bg"><div class="bar \${cls}" style="width:\${pct}%"></div></div>
          </div>
        </div>
        <div class="latency \${cls}">\${ms.toFixed(0)}ms</div>
      </div>
    \`;
  }).join('');
}

async function fetchStats() {
  try {
    const res = await fetch('/stats', {
      headers: { 'Authorization': 'Bearer ' + apiKey }
    });
    if (res.status === 401) {
      logout();
      setStatus('Session expired', 'error');
      return;
    }
    const data = await res.json();
    renderStats(data);
  } catch (e) {
    console.error('Failed to fetch stats:', e);
  }
}

function setStatus(message, type = '') {
  authStatus.textContent = message;
  authStatus.className = 'auth-status' + (type ? ' ' + type : '');
}

function setAuthenticatedUI(authenticated) {
  if (authenticated) {
    authCard.classList.add('authenticated');
    setStatus('Connected', 'success');
    apiKeyInput.disabled = true;
    authBtn.textContent = 'Disconnect';
    authBtn.className = 'auth-btn logout';
    metaInfo.style.display = 'flex';
  } else {
    authCard.classList.remove('authenticated');
    setStatus('');
    apiKeyInput.value = '';
    apiKeyInput.disabled = false;
    authBtn.textContent = 'Connect';
    authBtn.className = 'auth-btn';
    metaInfo.style.display = 'none';
    grid.innerHTML = '';
  }
}

async function authenticate() {
  const key = apiKeyInput.value.trim();
  if (!key) {
    setStatus('Please enter an API Key', 'error');
    return;
  }

  try {
    const res = await fetch('/stats', {
      headers: { 'Authorization': 'Bearer ' + key }
    });

    if (res.status === 401) {
      setStatus('Invalid API Key', 'error');
      return;
    }

    apiKey = key;
    localStorage.setItem(STORAGE_KEY, key);
    setAuthenticatedUI(true);

    const data = await res.json();
    renderStats(data);

    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(fetchStats, REFRESH_INTERVAL);
  } catch (e) {
    setStatus('Connection failed', 'error');
  }
}

function logout() {
  apiKey = '';
  localStorage.removeItem(STORAGE_KEY);
  setAuthenticatedUI(false);

  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
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
`;

export function Dashboard() {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>One United - Model Latency</title>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossorigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
					rel="stylesheet"
				/>
				<style>{styles}</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<div class="logo">
							<svg
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								role="img"
								aria-label="Logo"
							>
								<path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
							</svg>
						</div>
						<h1>Model Latency</h1>
						<p class="subtitle">Real-time API performance metrics</p>
					</div>

					<div class="auth-card" id="authCard">
						<div class="auth-row">
							<input
								type="password"
								class="auth-input"
								id="apiKey"
								placeholder="Enter your API key..."
							/>
							<button type="button" class="auth-btn" id="authBtn">
								Connect
							</button>
						</div>
						<div class="auth-status" id="authStatus" />
					</div>

					<div class="meta" id="metaInfo" style="display:none">
						<div class="meta-item">
							<span>Config</span>
							<span class="meta-value" id="hash">
								-
							</span>
						</div>
						<div class="meta-item">
							<span>Updated</span>
							<span class="meta-value" id="time">
								-
							</span>
						</div>
					</div>

					<div class="grid" id="grid" />
				</div>
				<script>{clientScript}</script>
			</body>
		</html>
	);
}
