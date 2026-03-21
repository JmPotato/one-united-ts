import { Layout } from "@/views/layout";

const pageStyles = `
.page-title {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--gold-base);
    font-weight: 400;
    letter-spacing: 0.02em;
    margin-bottom: 8px;
}

.page-subtitle {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 32px;
}

.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.sort-select {
    background: var(--bg-elevated);
    border: 1px solid var(--border-light);
    padding: 8px 32px 8px 14px;
    font-size: 1rem;
    color: var(--text-primary);
    font-family: var(--font-mono);
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s ease;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23756550' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    letter-spacing: 0.05em;
}

.sort-select:focus {
    border-color: var(--border-focus);
}

.sort-select option {
    background: var(--bg-elevated);
    color: var(--text-primary);
}

.provider-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

.provider-card {
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.provider-card:hover {
    border-color: var(--border-light);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
}

.card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
}

.card-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
}

.provider-name {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--text-primary);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.provider-id {
    font-size: 1rem;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
    padding: 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-hairline);
}

.meta-item .label {
    display: block;
    font-size: 0.94rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--text-tertiary);
    margin-bottom: 3px;
}

.meta-item .value {
    font-size: 1rem;
    font-family: var(--font-mono);
    color: var(--text-primary);
    font-weight: 500;
}

.meta-item .value.success { color: var(--accent-success); }
.meta-item .value.error { color: var(--accent-error); }
.meta-item .value.warning { color: var(--accent-warning); }
.meta-item .value.gold { color: var(--gold-base); }

.api-key-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.api-key-label {
    font-size: 0.94rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--text-tertiary);
    flex-shrink: 0;
    width: 56px;
}

.api-key-input {
    flex: 1;
    background: var(--bg-elevated);
    border: 1px solid var(--border-hairline);
    color: var(--text-secondary);
    padding: 6px 10px;
    font-family: var(--font-mono);
    font-size: 1rem;
    letter-spacing: 0.08em;
    min-width: 0;
}

.api-key-input:disabled {
    cursor: default;
    opacity: 0.7;
}

.card-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 8px;
}

.configure-btn {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--text-primary);
    padding: 6px 16px;
    font-family: var(--font-mono);
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.configure-btn:hover {
    background: var(--text-primary);
    color: var(--bg-deep);
}

.toggle-details {
    background: none;
    border: none;
    color: var(--text-tertiary);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    cursor: pointer;
    padding: 6px 0;
    transition: color 0.2s ease;
}

.toggle-details:hover {
    color: var(--gold-base);
}

.expand-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-left: 4px;
    vertical-align: middle;
    transition: transform 0.2s ease;
}

.provider-card.expanded .expand-icon {
    transform: rotate(180deg);
}

.latency-section {
    border-top: 1px solid var(--border-hairline);
    padding-top: 14px;
    display: none;
}

.provider-card.expanded .latency-section {
    display: block;
}

.latency-heading {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--text-secondary);
    margin-bottom: 8px;
    font-weight: 500;
}

.detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 2px;
}

.detail-row + .detail-row {
    border-top: 1px solid var(--border-hairline);
}

.detail-row-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    width: 100%;
}

.detail-key {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--text-tertiary);
}

.detail-val {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--text-secondary);
    word-break: break-all;
    text-align: right;
}

.model-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 10px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-hairline);
    margin-bottom: 4px;
    transition: border-color 0.15s ease;
}

.model-row:hover {
    border-color: var(--border-light);
}

.model-name {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1;
}

.model-latency {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 500;
    flex-shrink: 0;
    margin-left: 12px;
}

.model-latency.measured {
    color: var(--accent-success);
}

.model-latency.unmeasured {
    color: var(--text-tertiary);
    font-style: italic;
    font-weight: 400;
}

.models-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 8px;
}

.models-list .badge {
    font-size: 0.82rem;
}

.details-section {
    margin-top: 12px;
    display: none;
}

.provider-card.expanded .details-section {
    display: block;
}

@media (max-width: 640px) {
    .toolbar { flex-direction: column; align-items: stretch; }
    .provider-grid { grid-template-columns: 1fr; }
    .meta-grid { grid-template-columns: 1fr; }
    .card-actions { flex-direction: column; align-items: stretch; }
    .configure-btn { text-align: center; }
}
`;

const pageScript = `
let refreshTimer = null;
let routingData = null;
let currentSort = 'name';

function onLogout() {
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
    routingData = null;
    $('summaryBar').innerHTML = '';
    $('providerGrid').innerHTML = '';
}

onAuthenticated(() => {
    fetchData();
    refreshTimer = setInterval(fetchData, 10000);
});

async function fetchData() {
    try {
        const res = await apiFetch('/stats/routing');
        if (!res.ok) {
            setStatus('Failed to fetch routing data', 'error');
            return;
        }
        routingData = await res.json();
        render();
    } catch (e) {
        setStatus('Connection error', 'error');
    }
}

function aggregateLatency(provider) {
    if (!routingData) return { models: {}, avg: null };
    const latencies = {};
    for (const rule of routingData.models) {
        for (const rp of rule.providers) {
            if (rp.identifier !== provider.identifier) continue;
            for (const [model, val] of Object.entries(rp.latency)) {
                if (latencies[model] === undefined || (val !== null && (latencies[model] === null || val < latencies[model]))) {
                    latencies[model] = val;
                }
            }
        }
    }
    const measured = Object.values(latencies).filter(v => v !== null);
    const avg = measured.length > 0 ? measured.reduce((a, b) => a + b, 0) / measured.length : null;
    return { models: latencies, avg };
}

function getSortedProviders() {
    if (!routingData) return [];
    const providers = routingData.providers.map(p => {
        const agg = aggregateLatency(p);
        return { ...p, latencyMap: agg.models, avgLatency: agg.avg };
    });

    switch (currentSort) {
        case 'latency':
            providers.sort((a, b) => {
                if (a.avgLatency === null && b.avgLatency === null) return a.name.localeCompare(b.name);
                if (a.avgLatency === null) return 1;
                if (b.avgLatency === null) return -1;
                return a.avgLatency - b.avgLatency;
            });
            break;
        case 'models':
            providers.sort((a, b) => b.models.length - a.models.length || a.name.localeCompare(b.name));
            break;
        default:
            providers.sort((a, b) => a.name.localeCompare(b.name));
    }
    return providers;
}

function render() {
    if (!routingData) return;

    const providers = getSortedProviders();
    const total = providers.length;
    const withLatency = providers.filter(p => p.avgLatency !== null).length;
    const missingLatency = total - withLatency;

    $('summaryBar').innerHTML =
        '<div class="summary-item">Total <span class="summary-value">' + total + '</span></div>' +
        '<div class="summary-item">With Latency <span class="summary-value badge badge-success">' + withLatency + '</span></div>' +
        '<div class="summary-item">Missing Latency <span class="summary-value badge ' + (missingLatency > 0 ? 'badge-warning' : 'badge-muted') + '">' + missingLatency + '</span></div>';

    if (total === 0) {
        $('providerGrid').innerHTML = '<div class="empty"><div class="empty-icon">&#x1F50C;</div>No providers configured</div>';
        return;
    }

    const expandedSet = new Set();
    $('providerGrid').querySelectorAll('.provider-card.expanded').forEach(el => {
        expandedSet.add(el.dataset.id);
    });

    let html = '';
    for (const p of providers) {
        const isExpanded = expandedSet.has(p.identifier);
        const avgText = p.avgLatency !== null ? p.avgLatency.toFixed(0) + ' ms' : 'N/A';
        const statusClass = p.has_api_key ? 'status-active' : 'status-error';
        const keyStatusText = p.has_api_key ? 'Configured' : 'Missing';
        const keyStatusClass = p.has_api_key ? 'success' : 'error';

        const latencyEntries = Object.entries(p.latencyMap);
        const measuredCount = latencyEntries.filter(([, v]) => v !== null).length;

        let modelsHtml = '';
        if (latencyEntries.length > 0) {
            for (const [model, val] of latencyEntries) {
                const cls = val !== null ? 'measured' : 'unmeasured';
                const text = val !== null ? val.toFixed(0) + ' ms' : 'No data';
                modelsHtml += '<div class="model-row"><span class="model-name">' + escapeHtml(model) + '</span><span class="model-latency ' + cls + '">' + text + '</span></div>';
            }
        } else {
            modelsHtml = '<div class="model-row"><span class="model-latency unmeasured">No routing data</span></div>';
        }

        const supportedModels = p.models.map(m => '<span class="badge badge-muted">' + escapeHtml(m) + '</span>').join(' ');

        const detailRows =
            '<div class="detail-row"><div class="detail-row-inner"><span class="detail-key">Endpoint</span><span class="detail-val">' + escapeHtml(p.endpoint) + '</span></div></div>' +
            '<div class="detail-row"><div class="detail-row-inner"><span class="detail-key">Completion</span><span class="detail-val">' + escapeHtml(p.path) + '</span></div></div>' +
            '<div class="detail-row"><div class="detail-row-inner"><span class="detail-key">Responses</span><span class="detail-val">' + escapeHtml(p.responses_path || 'N/A') + '</span></div></div>' +
            (supportedModels ? '<div style="margin-top: 10px;"><span class="detail-key">Models</span><div class="models-list">' + supportedModels + '</div></div>' : '');

        html += '<div class="card provider-card' + (isExpanded ? ' expanded' : '') + '" data-id="' + escapeHtml(p.identifier) + '">' +
            '<div class="card-header">' +
                '<div class="card-header-left">' +
                    '<span class="status-dot ' + statusClass + '"></span>' +
                    '<div style="min-width:0">' +
                        '<h2 class="provider-name">' + escapeHtml(p.name) + '</h2>' +
                        '<div class="provider-id">' + escapeHtml(p.identifier) + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="meta-grid">' +
                '<div class="meta-item"><span class="label">Avg Latency</span><span class="value' + (p.avgLatency !== null ? ' gold' : '') + '">' + avgText + '</span></div>' +
                '<div class="meta-item"><span class="label">API Key</span><span class="value ' + keyStatusClass + '">' + keyStatusText + '</span></div>' +
                '<div class="meta-item"><span class="label">Models</span><span class="value">' + p.models.length + '</span></div>' +
                '<div class="meta-item"><span class="label">Measured</span><span class="value">' + measuredCount + '/' + latencyEntries.length + '</span></div>' +
            '</div>' +
            '<div class="api-key-row">' +
                '<span class="api-key-label">Key</span>' +
                '<input type="password" class="api-key-input" value="' + (p.has_api_key ? 'configured-key-value' : '') + '" disabled />' +
            '</div>' +
            '<div class="card-actions">' +
                '<button class="configure-btn" onclick="toggleCard(this.closest(' + "'" + '.provider-card' + "'" + '))">Configure</button>' +
                '<button class="toggle-details" onclick="toggleCard(this.closest(' + "'" + '.provider-card' + "'" + '))">' +
                    'Details <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                '</button>' +
            '</div>' +
            '<div class="latency-section">' +
                '<div class="latency-heading">Per-Model Latency</div>' +
                modelsHtml +
            '</div>' +
            '<div class="details-section">' +
                detailRows +
            '</div>' +
        '</div>';
    }
    $('providerGrid').innerHTML = html;
}

function toggleCard(card) {
    card.classList.toggle('expanded');
}

$('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value;
    render();
});
`;

export function ProvidersPage(): JSX.Element {
	return (
		<Layout
			title="Upstream Providers"
			activePage="providers"
			pageStyles={pageStyles}
			pageScript={pageScript}
		>
			<div>
				<h1 class="page-title gold-gradient-text">Upstream Providers</h1>
				<p class="page-subtitle">
					Provider fleet status and latency monitoring
				</p>
				<div class="toolbar">
					<div class="summary-bar" id="summaryBar" />
					<select class="sort-select" id="sortSelect">
						<option value="name" selected>
							Sort by Name
						</option>
						<option value="latency">Sort by Avg Latency</option>
						<option value="models">Sort by Model Count</option>
					</select>
				</div>
				<div class="provider-grid" id="providerGrid" />
			</div>
		</Layout>
	);
}
