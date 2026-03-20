import { Layout } from "@/views/layout";

const pageStyles = `
.dashboard-content {
  max-width: 780px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 40px;
}

.text-display {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.last-updated-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-tertiary);
  font-weight: 500;
}

.meta-bar {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-hairline);
}

.meta-bar-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-bar-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-tertiary);
  font-weight: 500;
}

.meta-bar-value {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-secondary);
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.latency-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.model {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--gold-base);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.provider {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}

.bar-container {
  margin-top: 6px;
  max-width: 200px;
}

.bar-bg {
  height: 2px;
  background: var(--border-hairline);
  overflow: hidden;
}

.bar {
  height: 100%;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.latency-value {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  margin-left: 24px;
  flex-shrink: 0;
  line-height: 1;
}

.latency-unit {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-left: 2px;
}

.fast .latency-value { color: var(--accent-success); }
.fast .bar { background: var(--accent-success); }

.medium .latency-value { color: var(--accent-warning); }
.medium .bar { background: var(--accent-warning); }

.slow .latency-value { color: var(--accent-error); }
.slow .bar { background: var(--accent-error); }

.empty {
  text-align: center;
  padding: 64px 32px;
  color: var(--text-tertiary);
  background: var(--bg-surface);
  border: 1px dashed var(--border-hairline);
}

.empty-icon {
  font-family: var(--font-display);
  font-size: 2.5rem;
  margin-bottom: 16px;
  opacity: 0.3;
  color: var(--gold-dim);
}

@media (max-width: 640px) {
  .latency-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .latency-value { margin-left: 0; }
  .bar-container { max-width: 100%; width: 100%; }
  .meta-bar { flex-direction: column; gap: 8px; }
  .text-display { font-size: 1.75rem; }
}
`;

const pageScript = `
const REFRESH_INTERVAL = 3000;

const grid = $('grid');
const hashEl = $('hash');
const timeEl = $('time');
const lastUpdatedEl = $('lastUpdated');
const metaInfo = $('metaInfo');
let refreshInterval = null;

function getLatencyClass(ms) {
  if (ms < 1000) return 'fast';
  if (ms < 3000) return 'medium';
  return 'slow';
}

function renderStats(data) {
  hashEl.textContent = data.hash?.slice(0, 8) || '-';
  const now = new Date().toLocaleTimeString();
  timeEl.textContent = now;
  lastUpdatedEl.textContent = 'Last updated ' + now;

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
    const val = ms.toFixed(0);
    return \`
      <div class="card latency-card \${cls}">
        <div class="model-info">
          <div class="model">\${model}</div>
          <div class="provider">\${provider}</div>
          <div class="bar-container">
            <div class="bar-bg"><div class="bar" style="width:\${pct}%"></div></div>
          </div>
        </div>
        <div class="latency-value">\${val}<span class="latency-unit">ms</span></div>
      </div>
    \`;
  }).join('');
}

async function fetchStats() {
  try {
    const res = await apiFetch('/stats');
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

function onLogout() {
  metaInfo.style.display = 'none';
  grid.innerHTML = '';
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

onAuthenticated(() => {
  metaInfo.style.display = 'flex';
  fetchStats();
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(fetchStats, REFRESH_INTERVAL);
});
`;

export function DashboardPage() {
	return (
		<Layout
			title="Global Telemetry"
			activePage="latency"
			pageStyles={pageStyles}
			pageScript={pageScript}
		>
			<div class="dashboard-content">
				<div class="page-header">
					<h1 class="text-display">Global Telemetry</h1>
					<span class="last-updated-label" id="lastUpdated">
						Awaiting connection
					</span>
				</div>
				<div class="meta-bar" id="metaInfo" style="display:none">
					<div class="meta-bar-item">
						<span class="meta-bar-label">Config</span>
						<span class="meta-bar-value" id="hash">
							-
						</span>
					</div>
					<div class="meta-bar-item">
						<span class="meta-bar-label">Updated</span>
						<span class="meta-bar-value" id="time">
							-
						</span>
					</div>
				</div>
				<div class="grid" id="grid" />
			</div>
		</Layout>
	);
}
