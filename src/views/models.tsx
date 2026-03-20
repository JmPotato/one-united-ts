import { Layout } from "@/views/layout";

const pageStyles = `
.page-heading {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--gold-base);
  letter-spacing: 0.02em;
  margin-bottom: 24px;
}

.models-table-wrap {
  width: 100%;
  border: 1px solid var(--border-hairline);
  background: var(--bg-surface);
  position: relative;
}

.models-table-wrap::before, .models-table-wrap::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border: 1px solid var(--gold-dim);
  opacity: 0.5;
}
.models-table-wrap::before { top: 4px; left: 4px; border-right: none; border-bottom: none; }
.models-table-wrap::after { bottom: 4px; right: 4px; border-left: none; border-top: none; }

.model-row {
  cursor: pointer;
  transition: background 0.15s ease;
}

.model-row:hover td {
  background: rgba(212, 180, 122, 0.04);
}

.model-name {
  font-family: var(--font-mono);
  color: var(--gold-bright);
  font-size: 13px;
  font-weight: 500;
}

.provider-target {
  font-size: 12px;
  color: var(--text-secondary);
}

.provider-target-id {
  font-family: var(--font-mono);
  color: var(--text-tertiary);
  font-size: 11px;
}

.latency-cell {
  font-family: var(--font-mono);
  font-size: 12px;
  white-space: nowrap;
}

.latency-good { color: var(--accent-success); }
.latency-mid { color: var(--accent-warning); }
.latency-bad { color: var(--accent-error); }
.latency-none { color: var(--text-tertiary); }

.status-cell {
  text-align: center;
  width: 40px;
}

.chevron-cell {
  text-align: right;
  width: 32px;
  color: var(--text-tertiary);
  font-size: 10px;
  transition: transform 0.2s ease;
}

.model-row.expanded .chevron-cell .chevron-icon {
  display: inline-block;
  transform: rotate(90deg);
}

.chevron-icon {
  display: inline-block;
  transition: transform 0.2s ease;
}

.detail-row {
  display: none;
}

.detail-row.visible {
  display: table-row;
}

.detail-row td {
  padding: 0;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-hairline);
}

.detail-inner {
  padding: 16px 24px;
}

.provider-detail-block {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-hairline);
}

.provider-detail-block:last-child {
  border-bottom: none;
}

.provider-detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.provider-detail-name {
  font-weight: 500;
  font-size: 13px;
  color: var(--text-primary);
}

.provider-detail-id {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

.backend-models-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.backend-model-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.backend-model-label {
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.routing-flow-block {
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-hairline);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
}

.routing-flow-arrow {
  color: var(--gold-base);
  margin: 0 6px;
}

.extra-fields-section {
  margin-top: 10px;
}

.extra-fields-label {
  font-size: 10px;
  color: var(--text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.extra-fields-code {
  background: var(--bg-surface);
  border: 1px solid var(--border-hairline);
  padding: 8px 12px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-all;
  overflow-x: auto;
}

.info-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-hairline);
  padding: 24px;
  margin-top: 24px;
  position: relative;
}

.info-panel::before, .info-panel::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border: 1px solid var(--gold-dim);
  opacity: 0.5;
}
.info-panel::before { top: 4px; left: 4px; border-right: none; border-bottom: none; }
.info-panel::after { bottom: 4px; right: 4px; border-left: none; border-top: none; }

.info-panel-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--gold-base);
  margin-bottom: 12px;
  letter-spacing: 0.03em;
}

.info-panel-content {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.info-panel-content li {
  margin-bottom: 6px;
  list-style: none;
  padding-left: 18px;
  position: relative;
}

.info-panel-content li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold-dim);
}

.no-results {
  text-align: center;
  padding: 32px;
  color: var(--text-tertiary);
  font-size: 13px;
}

@media (max-width: 640px) {
  .page-heading {
    font-size: 1.4rem;
    margin-bottom: 16px;
  }

  .detail-inner {
    padding: 12px 16px;
  }

  .hide-mobile {
    display: none;
  }
}
`;

const pageScript = `
let refreshTimer = null;
let routingData = null;
let searchTerm = '';

function onLogout() {
  if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
  routingData = null;
  renderPage(null);
}

onAuthenticated(() => {
  fetchRoutingData();
  refreshTimer = setInterval(fetchRoutingData, 10000);
});

async function fetchRoutingData() {
  try {
    const res = await apiFetch('/stats/routing');
    if (!res.ok) {
      setStatus('Failed to fetch routing data', 'error');
      return;
    }
    routingData = await res.json();
    renderPage(routingData);
  } catch (e) {
    setStatus('Connection error', 'error');
  }
}

function getLatencyClass(ms) {
  if (ms === null || ms === undefined) return 'latency-none';
  if (ms < 1000) return 'latency-good';
  if (ms < 3000) return 'latency-mid';
  return 'latency-bad';
}

function getStatusDotClass(ms) {
  if (ms === null || ms === undefined) return '';
  if (ms < 1000) return 'status-active';
  if (ms < 3000) return 'status-warning';
  return 'status-error';
}

function formatLatency(ms) {
  if (ms === null || ms === undefined) return '\\u2014';
  if (ms < 1000) return ms + 'ms';
  return (ms / 1000).toFixed(1) + 's';
}

function getPrimaryProvider(model) {
  if (!model.providers || model.providers.length === 0) return { name: '\\u2014', latency: null };
  const p = model.providers[0];
  const firstModel = p.models && p.models.length > 0 ? p.models[0] : null;
  const lat = firstModel && p.latency ? p.latency[firstModel] : null;
  return { name: p.name, identifier: p.identifier, latency: lat };
}

function renderPage(data) {
  const content = $('modelsContent');
  if (!content) return;

  if (!data || !data.models) {
    content.innerHTML = '<div class="empty"><div class="empty-icon">&#x1F4E1;</div><p>Connect to view model routing information</p></div>';
    return;
  }

  const models = data.models;
  const totalProviders = models.reduce((sum, m) => sum + m.providers.length, 0);

  const filtered = searchTerm
    ? models.filter(m => m.model.toLowerCase().includes(searchTerm.toLowerCase()))
    : models;

  let html = '';

  // Summary bar
  html += '<div class="summary-bar mb-md">';
  html += '<div class="summary-item"><span class="summary-value">' + models.length + '</span> models</div>';
  html += '<div class="summary-item"><span class="summary-value">' + totalProviders + '</span> provider mappings</div>';
  html += '</div>';

  // Search
  html += '<input type="text" class="search-input" id="modelSearch" placeholder="Filter models by name..." value="' + escapeHtml(searchTerm) + '" />';

  if (filtered.length === 0) {
    html += '<div class="no-results">No models match your search</div>';
  } else {
    html += '<div class="models-table-wrap"><table>';
    html += '<thead><tr>';
    html += '<th>Model</th>';
    html += '<th>Primary Provider</th>';
    html += '<th>Latency</th>';
    html += '<th class="status-cell">Status</th>';
    html += '<th class="chevron-cell"></th>';
    html += '</tr></thead>';
    html += '<tbody>';

    for (const model of filtered) {
      const rowId = 'model-' + model.model.replace(/[^a-zA-Z0-9]/g, '-');
      const primary = getPrimaryProvider(model);
      const latClass = getLatencyClass(primary.latency);
      const dotClass = getStatusDotClass(primary.latency);
      const latText = formatLatency(primary.latency);

      // Main row
      html += '<tr class="model-row" id="' + rowId + '" onclick="toggleCard(\\'' + rowId + '\\')">';
      html += '<td><span class="model-name">' + escapeHtml(model.model) + '</span></td>';
      html += '<td><span class="provider-target">' + escapeHtml(primary.name) + '</span>';
      if (primary.identifier) {
        html += ' <span class="provider-target-id">' + escapeHtml(primary.identifier) + '</span>';
      }
      html += '</td>';
      html += '<td class="latency-cell ' + latClass + '">' + latText + '</td>';
      html += '<td class="status-cell">';
      if (dotClass) {
        html += '<span class="status-dot ' + dotClass + '"></span>';
      } else {
        html += '<span class="status-dot" style="background:var(--text-tertiary);opacity:0.3"></span>';
      }
      html += '</td>';
      html += '<td class="chevron-cell"><span class="chevron-icon">&#9654;</span></td>';
      html += '</tr>';

      // Detail row
      html += '<tr class="detail-row" id="' + rowId + '-detail">';
      html += '<td colspan="5"><div class="detail-inner">';

      for (const provider of model.providers) {
        html += '<div class="provider-detail-block">';
        html += '<div class="provider-detail-header">';
        html += '<span class="provider-detail-name">' + escapeHtml(provider.name) + '</span>';
        html += '<span class="provider-detail-id">' + escapeHtml(provider.identifier) + '</span>';
        html += '<span class="badge badge-muted">' + provider.models.length + ' model' + (provider.models.length !== 1 ? 's' : '') + '</span>';
        html += '</div>';

        // Backend models with latency
        html += '<div class="backend-models-list">';
        for (const backendModel of provider.models) {
          const lat = provider.latency[backendModel];
          const bLatClass = getLatencyClass(lat);
          const bLatText = formatLatency(lat);

          html += '<div class="backend-model-entry">';
          html += '<span class="backend-model-label">' + escapeHtml(backendModel) + '</span>';
          html += '<span class="' + bLatClass + '" style="font-family:var(--font-mono);font-size:11px">' + bLatText + '</span>';
          html += '</div>';
        }
        html += '</div>';

        // Routing flow
        for (const backendModel of provider.models) {
          const lat = provider.latency[backendModel];
          const latText = formatLatency(lat);
          html += '<div class="routing-flow-block">';
          html += escapeHtml(model.model);
          html += '<span class="routing-flow-arrow">&rarr;</span>';
          html += escapeHtml(provider.identifier) + ':' + escapeHtml(backendModel);
          html += ' <span style="color:var(--text-tertiary)">(' + latText + ')</span>';
          html += '</div>';
        }

        // Extra fields
        if (provider.extra_fields && Object.keys(provider.extra_fields).length > 0) {
          html += '<div class="extra-fields-section">';
          html += '<div class="extra-fields-label">extra_fields</div>';
          html += '<div class="extra-fields-code">' + escapeHtml(JSON.stringify(provider.extra_fields, null, 2)) + '</div>';
          html += '</div>';
        }

        html += '</div>';
      }

      html += '</div></td></tr>';
    }

    html += '</tbody></table></div>';
  }

  // Info panel
  html += '<div class="info-panel">';
  html += '<div class="info-panel-title">Routing Algorithm</div>';
  html += '<div class="info-panel-content"><ul>';
  html += '<li>If providers with unknown latency exist, 20% chance to explore one of them (random selection)</li>';
  html += '<li>Among providers with known latency, 20% chance to use weighted random selection (favoring lower latency)</li>';
  html += '<li>Otherwise, the provider with the lowest measured latency is selected</li>';
  html += '</ul></div></div>';

  content.innerHTML = html;

  // Reattach search listener
  const searchInput = $('modelSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderPage(routingData);
      // Refocus and restore cursor position
      const input = $('modelSearch');
      if (input) {
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
      }
    });
  }
}

function toggleCard(id) {
  const row = document.getElementById(id);
  const detail = document.getElementById(id + '-detail');
  if (row && detail) {
    const isExpanded = row.classList.contains('expanded');
    row.classList.toggle('expanded');
    detail.classList.toggle('visible');
  }
}
`;

export function ModelsPage(): JSX.Element {
	return (
		<Layout
			title="Model Routing Strategy"
			activePage="models"
			pageStyles={pageStyles}
			pageScript={pageScript}
		>
			<div>
				<h2 class="page-heading">Model Routing Strategy</h2>
				<div id="modelsContent">
					<div class="empty">
						<div class="empty-icon">&#x1F4E1;</div>
						<p>Connect to view model routing information</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}
