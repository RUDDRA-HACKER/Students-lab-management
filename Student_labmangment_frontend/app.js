
const equipmentSeed = Array.isArray(globalThis.equipmentSeed) ? globalThis.equipmentSeed : [];
const maintenanceSeed = Array.isArray(globalThis.maintenanceSeed) ? globalThis.maintenanceSeed : [];
const calibrationSeed = Array.isArray(globalThis.calibrationSeed) ? globalThis.calibrationSeed : [];
const alertsSeed = Array.isArray(globalThis.alertsSeed) ? globalThis.alertsSeed : [];

const state = {
  equipment: equipmentSeed.map((item) => ({ ...item })),
  maintenance: maintenanceSeed.map((item) => ({ ...item })),
  calibration: calibrationSeed.map((item) => ({ ...item })),
  alerts: alertsSeed.map((item) => ({ ...item })),
  activePage: 'dashboard',
  activeFilter: 'all',
  viewMode: 'grid',
  selectedEquipmentId: null,
  searchTerm: '',
  remoteSearchResults: null,
};

const elements = {
  sidebar: document.getElementById('sidebar'),
  overlay: document.getElementById('overlay'),
  menuBtn: document.getElementById('menuBtn'),
  sidebarToggle: document.getElementById('sidebarToggle'),
  globalSearchForm: document.getElementById('globalSearchForm'),
  globalSearch: document.getElementById('globalSearch'),
  equipmentGrid: document.getElementById('equipmentGrid'),
  equipmentFilterTabs: document.getElementById('equipmentFilterTabs'),
  gridViewBtn: document.getElementById('gridViewBtn'),
  listViewBtn: document.getElementById('listViewBtn'),
  upcomingList: document.getElementById('upcomingList'),
  activityFeed: document.getElementById('activityFeed'),
  categoryBars: document.getElementById('categoryBars'),
  chartLegend: document.getElementById('chartLegend'),
  donutChart: document.getElementById('donutChart'),
  barChart: document.getElementById('barChart'),
  ageChart: document.getElementById('ageChart'),
  lineChart: document.getElementById('lineChart'),
  alertsList: document.getElementById('alertsList'),
  toastContainer: document.getElementById('toastContainer'),
  modal: document.getElementById('equipmentModal'),
  maintenanceModal: document.getElementById('maintenanceModal'),
  detailModal: document.getElementById('detailModal'),
  equipmentForm: document.getElementById('equipmentForm'),
  maintenanceForm: document.getElementById('maintenanceForm'),
  modalTitle: document.getElementById('modalTitle'),
  submitEquipment: document.getElementById('submitEquipment'),
  closeModal: document.getElementById('closeModal'),
  cancelModal: document.getElementById('cancelModal'),
  closeMaintenanceModal: document.getElementById('closeMaintenanceModal'),
  cancelMaintenanceModal: document.getElementById('cancelMaintenanceModal'),
  closeDetailModal: document.getElementById('closeDetailModal'),
  addEquipmentBtn: document.getElementById('addEquipmentBtn'),
  addEquipmentBtn2: document.getElementById('addEquipmentBtn2'),
  addMaintenanceBtn: document.getElementById('addMaintenanceBtn'),
  addCalibrationBtn: document.getElementById('addCalibrationBtn'),
  navLinks: Array.from(document.querySelectorAll('.nav-item[data-page]')),
  statTotal: document.getElementById('stat-total'),
  statActive: document.getElementById('stat-active'),
  statMaintenance: document.getElementById('stat-maintenance'),
  statRetired: document.getElementById('stat-retired'),
  statTrendTotal: document.getElementById('stat-trend-total'),
  statTrendActive: document.getElementById('stat-trend-active'),
  statTrendMaint: document.getElementById('stat-trend-maint'),
  statTrendRet: document.getElementById('stat-trend-ret'),
  donutNum: document.getElementById('donutNum'),
  badgeEquipment: document.getElementById('badge-equipment'),
  badgeMaintenance: document.getElementById('badge-maintenance'),
  badgeAlerts: document.getElementById('badge-alerts'),
  mEqSelect: document.getElementById('mEqSelect'),
  maintenanceBody: document.getElementById('maintenanceBody'),
  calibrationBody: document.getElementById('calibrationBody'),
  detailModalBody: document.getElementById('detailModalBody'),
  detailModalTitle: document.getElementById('detailModalTitle'),
  equipmentInputs: {
    name: document.getElementById('eqName'),
    id: document.getElementById('eqId'),
    category: document.getElementById('eqCategory'),
    status: document.getElementById('eqStatus'),
    manufacturer: document.getElementById('eqManufacturer'),
    model: document.getElementById('eqModel'),
    purchaseDate: document.getElementById('eqPurchaseDate'),
    warranty: document.getElementById('eqWarranty'),
    location: document.getElementById('eqLocation'),
    cost: document.getElementById('eqCost'),
    notes: document.getElementById('eqNotes'),
  },
  maintenanceInputs: {
    equipmentId: document.getElementById('mEqSelect'),
    type: document.getElementById('mType'),
    date: document.getElementById('mDate'),
    technician: document.getElementById('mTechnician'),
    priority: document.getElementById('mPriority'),
    cost: document.getElementById('mCost'),
    desc: document.getElementById('mDesc'),
  },
};

const API_BASE_URL = 'http://localhost:8080';

function byId(id) {
  return state.equipment.find((item) => String(item.id) === String(id) || String(item.dbId) === String(id)) || null;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function daysFromNow(value) {
  const target = new Date(value);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

function openModal(modalEl) {
  modalEl.classList.add('show');
}

function closeModal(modalEl) {
  modalEl.classList.remove('show');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 8v4"></path>
      <path d="M12 16h.01"></path>
    </svg>
    <span>${message}</span>
  `;
  elements.toastContainer.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add('toast-out');
    window.setTimeout(() => toast.remove(), 280);
  }, 2600);
}

function getFilteredEquipment() {
  const search = state.searchTerm.trim().toLowerCase();
  const source = state.remoteSearchResults || state.equipment;

  return source.filter((item) => {
    const matchesFilter = state.activeFilter === 'all' || item.status === state.activeFilter;
    const haystack = [item.name, item.id, item.category, item.manufacturer, item.model, item.location, item.notes]
      .join(' ')
      .toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    return matchesFilter && matchesSearch;
  });
}

function mapApiStatusToUi(status) {
  if (!status) return 'Operational';
  const normalized = String(status).toUpperCase();
  if (normalized === 'UNDER_MAINTENANCE') return 'Maintenance';
  if (normalized === 'IN_USE') return 'In Use';
  if (normalized === 'AVAILABLE') return 'Operational';
  return 'Operational';
}

function mapUiStatusToApi(status) {
  if (!status) return 'AVAILABLE';
  const normalized = String(status).toUpperCase();
  if (normalized === 'MAINTENANCE') return 'UNDER_MAINTENANCE';
  if (normalized === 'IN USE' || normalized === 'IN_USE') return 'IN_USE';
  return 'AVAILABLE';
}

function normalizeEquipmentFromApi(item) {
  return {
    dbId: item?.id || null,
    id: item?.serialNumber || String(item?.id || ''),
    name: item?.name || 'Unnamed Equipment',
    category: item?.type || 'General',
    status: mapApiStatusToUi(item?.status),
    apiStatus: item?.status || 'AVAILABLE',
    manufacturer: '',
    model: '',
    purchaseDate: '',
    warranty: '',
    location: '',
    cost: 0,
    notes: '',
  };
}

function normalizeMaintenanceFromApi(item) {
  const equipment = item?.equipment || {};
  return {
    id: item?.id || null,
    equipmentDbId: equipment?.id || null,
    equipmentId: equipment?.serialNumber || String(equipment?.id || ''),
    equipmentName: equipment?.name || 'Unknown Equipment',
    type: item?.description || 'General',
    scheduledDate: item?.maintenanceDate || '',
    technician: item?.performedBy || '',
    priority: 'Medium',
    status: String(item?.status || '').toUpperCase() === 'COMPLETED' ? 'Completed' : 'Scheduled',
    description: item?.description || '',
  };
}

function normalizeCalibrationFromApi(item) {
  const equipment = item?.equipment || {};
  return {
    id: item?.id || null,
    equipmentDbId: equipment?.id || null,
    equipmentId: equipment?.serialNumber || String(equipment?.id || ''),
    equipmentName: equipment?.name || 'Unknown Equipment',
    lastCalibrated: item?.calibrationDate || '',
    nextDue: item?.nextDueDate || '',
    certificate: item?.id ? `CAL-${item.id}` : 'N/A',
    performedBy: item?.calibratedBy || '',
    status: String(item?.result || '').toUpperCase() === 'FAILED' ? 'Failed' : 'Valid',
  };
}

function normalizeAlertType(type) {
  const normalized = String(type || '').toUpperCase();
  if (normalized === 'MAINTENANCE_DUE') return 'warning';
  if (normalized === 'CALIBRATION_DUE') return 'info';
  return 'info';
}

function normalizeAlertFromApi(item) {
  const equipment = item?.equipment || {};
  return {
    id: item?.id || null,
    type: normalizeAlertType(item?.type),
    title: item?.type || 'Alert',
    desc: item?.message || 'Notification',
    time: item?.createdAt ? formatDate(item.createdAt) : 'N/A',
    equipmentDbId: equipment?.id || null,
  };
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(`Request failed (${response.status}): ${reason || response.statusText}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function fetchEquipmentApi(term = '') {
  const query = term.trim();
  const path = query
    ? `/api/search/equipment?q=${encodeURIComponent(query)}`
    : '/api/equipment';
  const data = await apiRequest(path);
  return Array.isArray(data) ? data.map(normalizeEquipmentFromApi) : [];
}

async function fetchMaintenanceApi() {
  const data = await apiRequest('/api/maintenance');
  return Array.isArray(data) ? data.map(normalizeMaintenanceFromApi) : [];
}

async function fetchCalibrationApi() {
  const data = await apiRequest('/api/calibration');
  return Array.isArray(data) ? data.map(normalizeCalibrationFromApi) : [];
}

async function fetchAlertsApi() {
  const data = await apiRequest('/api/alerts');
  return Array.isArray(data) ? data.map(normalizeAlertFromApi) : [];
}

function toEquipmentApiPayload(payload) {
  return {
    name: payload.name,
    type: payload.category,
    serialNumber: payload.id,
    status: mapUiStatusToApi(payload.status),
  };
}

async function createEquipmentApi(payload) {
  return apiRequest('/api/equipment', {
    method: 'POST',
    body: JSON.stringify(toEquipmentApiPayload(payload)),
  });
}

async function updateEquipmentApi(dbId, payload) {
  return apiRequest(`/api/equipment/${dbId}`, {
    method: 'PUT',
    body: JSON.stringify(toEquipmentApiPayload(payload)),
  });
}

async function createMaintenanceApi(payload) {
  return apiRequest('/api/maintenance', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function deleteAlertApi(id) {
  return apiRequest(`/api/alerts/${id}`, { method: 'DELETE' });
}

async function searchEquipmentApi(term = '') {
  return fetchEquipmentApi(term);
}

async function loadEquipmentFromApi({ showErrorToast = true } = {}) {
  try {
    const results = await searchEquipmentApi();
    state.equipment = results;
    state.remoteSearchResults = null;
    refreshAll();
  } catch (error) {
    if (showErrorToast) {
      showToast('Could not load equipment from API. Showing existing data.', 'error');
    }
    console.error(error);
  }
}

async function loadAllDataFromApi({ showErrorToast = true } = {}) {
  try {
    const [equipment, maintenance, calibration, alerts] = await Promise.all([
      fetchEquipmentApi(),
      fetchMaintenanceApi(),
      fetchCalibrationApi(),
      fetchAlertsApi(),
    ]);

    state.equipment = equipment;
    state.maintenance = maintenance;
    state.calibration = calibration;
    state.alerts = alerts;
    state.remoteSearchResults = null;
    refreshAll();
  } catch (error) {
    if (showErrorToast) {
      showToast('Could not load backend data. Showing current state.', 'error');
    }
    console.error(error);
  }
}

function renderEquipmentCard(item) {
  const ageLabel = item.purchaseDate ? `${Math.max(0, Math.floor((Date.now() - new Date(item.purchaseDate)) / 31536000000))} yrs` : 'N/A';
  return `
    <article class="eq-card status-${item.status}" data-equipment-id="${item.dbId || item.id}">
      <div class="eq-card-header">
        <div>
          <div class="eq-card-title">${item.name}</div>
          <div class="eq-card-id">${item.id}</div>
        </div>
        <div class="eq-actions">
          <button class="eq-action-btn" data-action="view" aria-label="View details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="eq-action-btn" data-action="edit" aria-label="Edit equipment">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          </button>
        </div>
      </div>
      <div class="eq-meta">
        <div class="eq-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>${item.category}</div>
        <div class="eq-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10.5V6a2 2 0 0 0-2-2h-4.5"/><path d="M3 13.5V18a2 2 0 0 0 2 2h4.5"/><path d="M13.5 3H18a2 2 0 0 1 2 2v4.5"/><path d="M10.5 21H6a2 2 0 0 1-2-2v-4.5"/></svg>${item.location || 'Unassigned'}</div>
        <div class="eq-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"/><path d="M12 2v20"/></svg>${item.manufacturer || 'Unknown'}${item.model ? ` · ${item.model}` : ''}</div>
      </div>
      <div class="eq-footer">
        <span class="status-badge status-${item.status}">${item.status}</span>
        <span class="eq-age">${ageLabel}</span>
      </div>
    </article>
  `;
}

function renderEquipmentList() {
  const items = getFilteredEquipment();
  if (!items.length) {
    elements.equipmentGrid.innerHTML = `
      <div class="empty-state full-width">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h3"/></svg>
        <h3>No equipment found</h3>
        <p>Try another search or add a new instrument.</p>
      </div>
    `;
    return;
  }

  elements.equipmentGrid.innerHTML = items.map(renderEquipmentCard).join('');
}

function renderMaintenanceTable() {
  const rows = state.maintenance
    .slice()
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .map((item) => `
      <tr>
        <td>${item.equipmentName}<br><span class="eq-card-id">${item.equipmentId}</span></td>
        <td>${item.type}</td>
        <td>${formatDate(item.scheduledDate)}</td>
        <td>${item.technician || 'Unassigned'}</td>
        <td><span class="priority-badge priority-${item.priority}">${item.priority}</span></td>
        <td><span class="status-badge status-${item.status === 'In Progress' ? 'Maintenance' : 'Operational'}">${item.status}</span></td>
        <td><button class="btn btn-ghost btn-sm" data-maintenance-equipment="${item.equipmentDbId || item.equipmentId}">View</button></td>
      </tr>
    `)
    .join('');

  elements.maintenanceBody.innerHTML = rows || '<tr><td colspan="7" class="empty-state-sm">No maintenance scheduled</td></tr>';
}

function renderCalibrationTable() {
  const rows = state.calibration
    .map((item) => `
      <tr>
        <td>${item.equipmentName}<br><span class="eq-card-id">${item.equipmentId}</span></td>
        <td>${formatDate(item.lastCalibrated)}</td>
        <td>${formatDate(item.nextDue)}</td>
        <td>${item.certificate}</td>
        <td>${item.performedBy}</td>
        <td><span class="status-badge status-${item.status === 'Valid' ? 'Operational' : 'Calibration'}">${item.status}</span></td>
        <td><button class="btn btn-ghost btn-sm" data-calibration-equipment="${item.equipmentDbId || item.equipmentId}">View</button></td>
      </tr>
    `)
    .join('');

  elements.calibrationBody.innerHTML = rows || '<tr><td colspan="7" class="empty-state-sm">No calibration records available</td></tr>';
}

function renderUpcomingMaintenance() {
  const items = state.maintenance
    .slice()
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 4)
    .map((item) => {
      const days = daysFromNow(item.scheduledDate);
      const label = days === 0 ? 'Today' : days > 0 ? `${days} day${days === 1 ? '' : 's'}` : `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
      return `
        <div class="upcoming-item">
          <div class="upcoming-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <div>
            <div class="upcoming-name">${item.equipmentName}</div>
            <div class="upcoming-date">${formatDate(item.scheduledDate)} · ${label}</div>
          </div>
        </div>
      `;
    })
    .join('');

  elements.upcomingList.innerHTML = items || '<div class="empty-state-sm">No upcoming maintenance</div>';
}

function renderActivityFeed() {
  const activityItems = [
    ...state.maintenance.slice(0, 2).map((item) => ({
      text: `${item.equipmentName} maintenance ${item.status.toLowerCase()}.`,
      time: formatDate(item.scheduledDate),
    })),
    ...state.calibration.slice(0, 1).map((item) => ({
      text: `${item.equipmentName} calibration record updated.`,
      time: formatDate(item.lastCalibrated),
    })),
  ];

  elements.activityFeed.innerHTML = activityItems.length
    ? activityItems
        .map(
          (item) => `
            <div class="activity-item">
              <div class="activity-dot"></div>
              <div>
                <div class="activity-text">${item.text}</div>
                <div class="activity-time">${item.time}</div>
              </div>
            </div>
          `,
        )
        .join('')
    : '<div class="empty-state-sm">No recent activity</div>';
}

function renderCategoryBreakdown() {
  const counts = state.equipment.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...categories.map(([, count]) => count));
  elements.categoryBars.innerHTML = categories
    .map(
      ([category, count]) => `
        <div>
          <div class="bar-item-label"><span>${category}</span><span>${count}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div>
        </div>
      `,
    )
    .join('');
}

function renderAlerts() {
  elements.alertsList.innerHTML = state.alerts
    .map(
      (alert) => `
        <div class="alert-item alert-${alert.type}">
          <div class="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          </div>
          <div class="alert-content">
            <div class="alert-title">${alert.title}</div>
            <div class="alert-desc">${alert.desc}</div>
          </div>
          <div class="alert-time">${alert.time}</div>
          <button class="dismiss-btn" data-dismiss-alert="${alert.id}">Dismiss</button>
        </div>
      `,
    )
    .join('') || '<div class="empty-state-sm">No active alerts</div>';
}

function renderStats() {
  const total = state.equipment.length;
  const operational = state.equipment.filter((item) => item.status === 'Operational' || item.status === 'In Use').length;
  const maintenance = state.equipment.filter((item) => item.status === 'Maintenance').length;
  const retired = state.equipment.filter((item) => item.status === 'Retired').length;

  elements.statTotal.textContent = String(total);
  elements.statActive.textContent = String(operational);
  elements.statMaintenance.textContent = String(maintenance);
  elements.statRetired.textContent = String(retired);
  elements.donutNum.textContent = String(total);
  elements.badgeEquipment.textContent = String(total);
  elements.badgeMaintenance.textContent = String(maintenance);
  elements.badgeAlerts.textContent = String(state.alerts.length);

  elements.statTrendTotal.textContent = total ? '+12%' : '0%';
  elements.statTrendActive.textContent = total ? `${Math.round((operational / total) * 100)}%` : '0%';
  elements.statTrendMaint.textContent = maintenance ? `${maintenance} due` : '0';
  elements.statTrendRet.textContent = retired ? `${retired} retired` : '0';
}

function drawDonutChart(canvas, data) {
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const size = Math.min(canvas.width, canvas.height);
  const center = size / 2;
  const radius = center - 16;
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let start = -Math.PI / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 18;
  context.lineCap = 'round';

  data.forEach((item) => {
    const angle = (item.value / total) * Math.PI * 2;
    context.beginPath();
    context.strokeStyle = item.color;
    context.arc(center, center, radius, start, start + angle);
    context.stroke();
    start += angle;
  });
}

function drawBarChart(canvas) {
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const values = [180, 240, 210, 300, 260, 340];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const width = canvas.width;
  const height = canvas.height;
  const padding = 20;
  const barWidth = (width - padding * 2) / values.length - 10;
  const max = Math.max(...values);

  context.clearRect(0, 0, width, height);
  context.fillStyle = '#8b949e';
  context.font = '11px Inter, sans-serif';
  context.textAlign = 'center';

  values.forEach((value, index) => {
    const barHeight = ((height - padding * 2) * value) / max;
    const x = padding + index * (barWidth + 10);
    const y = height - padding - barHeight;
    const gradient = context.createLinearGradient(0, y, 0, height);
    gradient.addColorStop(0, '#2f81f7');
    gradient.addColorStop(1, '#a371f7');
    context.fillStyle = gradient;
    context.fillRect(x, y, barWidth, barHeight);
    context.fillStyle = '#8b949e';
    context.fillText(labels[index], x + barWidth / 2, height - 6);
  });
}

function drawAgeChart(canvas) {
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const labels = ['0-1', '1-3', '3-5', '5+'];
  const values = [2, 1, 1, 1];
  const total = values.reduce((sum, value) => sum + value, 0);
  const center = { x: canvas.width / 2, y: canvas.height / 2 + 10 };
  const radius = 62;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#30363d';
  context.lineWidth = 18;
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = '#e6edf3';
  context.font = '600 13px Inter, sans-serif';
  context.textAlign = 'center';
  context.fillText('Age Mix', center.x, center.y - 6);
  context.fillStyle = '#8b949e';
  context.font = '12px Inter, sans-serif';
  context.fillText(`${total} assets`, center.x, center.y + 14);

  const legend = labels.map((label, index) => `${label}: ${values[index]}`).join(' · ');
  context.fillText(legend, center.x, canvas.height - 16);
}

function drawLineChart(canvas) {
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const values = [8, 10, 7, 12, 15, 14, 17];
  const width = canvas.width;
  const height = canvas.height;
  const padding = 24;
  const max = Math.max(...values);
  const step = (width - padding * 2) / (values.length - 1);

  context.clearRect(0, 0, width, height);
  context.strokeStyle = '#30363d';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(padding, height - padding);
  context.lineTo(width - padding, height - padding);
  context.stroke();

  context.beginPath();
  values.forEach((value, index) => {
    const x = padding + index * step;
    const y = height - padding - ((height - padding * 2) * value) / max;
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  context.strokeStyle = '#3fb950';
  context.lineWidth = 3;
  context.stroke();
}

function renderCharts() {
  const total = state.equipment.length || 1;
  const operational = state.equipment.filter((item) => item.status === 'Operational').length;
  const inUse = state.equipment.filter((item) => item.status === 'In Use').length;
  const maintenance = state.equipment.filter((item) => item.status === 'Maintenance').length;

  const legendItems = [
    ['Operational', operational, '#3fb950'],
    ['In Use', inUse, '#2f81f7'],
    ['Maintenance', maintenance, '#d29922'],
  ];

  elements.chartLegend.innerHTML = legendItems
    .map(
      ([label, value, color]) => `
        <div class="legend-item"><span class="legend-dot" style="background:${color}"></span>${label} ${Math.round((value / total) * 100)}%</div>
      `,
    )
    .join('');

  drawDonutChart(elements.donutChart, legendItems.map(([label, value, color]) => ({ label, value, color })));
  drawBarChart(elements.barChart);
  drawAgeChart(elements.ageChart);
  drawLineChart(elements.lineChart);
}

function populateEquipmentSelect() {
  elements.mEqSelect.innerHTML = state.equipment
    .filter((item) => item.status !== 'Retired')
    .map((item) => `<option value="${item.dbId || item.id}">${item.name} (${item.id})</option>`)
    .join('');
}

function setActivePage(page) {
  state.activePage = page;
  document.querySelectorAll('.page').forEach((pageEl) => {
    pageEl.classList.toggle('active', pageEl.id === `page-${page}`);
  });
  elements.navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.page === page);
  });
  if (page === 'equipment') {
    loadEquipmentFromApi();
  }
  if (page === 'maintenance' || page === 'calibration' || page === 'alerts') {
    loadAllDataFromApi({ showErrorToast: false });
  }
  closeSidebar();
}

function openSidebar() {
  elements.sidebar.classList.add('open');
  elements.overlay.classList.add('show');
}

function closeSidebar() {
  elements.sidebar.classList.remove('open');
  elements.overlay.classList.remove('show');
}

function applyEquipmentFilter(filter) {
  state.activeFilter = filter;
  const tabs = elements.equipmentFilterTabs.querySelectorAll('.filter-tab');
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.filter === filter));
  renderEquipmentList();
}

function fillEquipmentForm(item) {
  elements.equipmentInputs.name.value = item?.name || '';
  elements.equipmentInputs.id.value = item?.id || '';
  elements.equipmentInputs.category.value = item?.category || '';
  elements.equipmentInputs.status.value = item?.status || '';
  elements.equipmentInputs.manufacturer.value = item?.manufacturer || '';
  elements.equipmentInputs.model.value = item?.model || '';
  elements.equipmentInputs.purchaseDate.value = item?.purchaseDate || '';
  elements.equipmentInputs.warranty.value = item?.warranty || '';
  elements.equipmentInputs.location.value = item?.location || '';
  elements.equipmentInputs.cost.value = item?.cost || '';
  elements.equipmentInputs.notes.value = item?.notes || '';
}

function resetEquipmentForm() {
  state.selectedEquipmentId = null;
  elements.modalTitle.textContent = 'Add Equipment';
  elements.submitEquipment.textContent = 'Add Equipment';
  fillEquipmentForm(null);
}

function openEquipmentModal(item = null) {
  state.selectedEquipmentId = item?.dbId || null;
  elements.modalTitle.textContent = item ? 'Edit Equipment' : 'Add Equipment';
  elements.submitEquipment.textContent = item ? 'Update Equipment' : 'Add Equipment';
  fillEquipmentForm(item);
  openModal(elements.modal);
}

function openMaintenanceModal(selectedEquipmentId = '') {
  elements.maintenanceForm.reset();
  elements.maintenanceInputs.priority.value = 'High';
  if (selectedEquipmentId) {
    elements.maintenanceInputs.equipmentId.value = selectedEquipmentId;
  }
  openModal(elements.maintenanceModal);
}

function renderDetailModal(item) {
  if (!item) return;
  elements.detailModalTitle.textContent = `${item.name} Details`;
  elements.detailModalBody.innerHTML = `
    <div class="detail-grid">
      <div class="detail-field"><label>Equipment ID</label><span>${item.id}</span></div>
      <div class="detail-field"><label>Status</label><span>${item.status}</span></div>
      <div class="detail-field"><label>Category</label><span>${item.category}</span></div>
      <div class="detail-field"><label>Manufacturer</label><span>${item.manufacturer || 'N/A'}</span></div>
      <div class="detail-field"><label>Model</label><span>${item.model || 'N/A'}</span></div>
      <div class="detail-field"><label>Location</label><span>${item.location || 'N/A'}</span></div>
      <div class="detail-field"><label>Purchase Date</label><span>${formatDate(item.purchaseDate)}</span></div>
      <div class="detail-field"><label>Warranty</label><span>${formatDate(item.warranty)}</span></div>
      <div class="detail-field"><label>Cost</label><span>${formatCurrency(item.cost)}</span></div>
      <div class="detail-field"><label>Notes</label><span>${item.notes || 'No notes provided'}</span></div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-detail-action="maintenance" data-equipment-id="${item.dbId || item.id}">Schedule Maintenance</button>
      <button type="button" class="btn btn-primary" data-detail-action="edit" data-equipment-id="${item.dbId || item.id}">Edit Equipment</button>
    </div>
  `;
  openModal(elements.detailModal);
}

function handleEquipmentAction(card, action) {
  const item = byId(card.dataset.equipmentId);
  if (!item) return;

  if (action === 'view') {
    renderDetailModal(item);
    return;
  }

  if (action === 'edit') {
    openEquipmentModal(item);
  }
}

async function handleEquipmentSubmit(event) {
  event.preventDefault();
  const payload = {
    name: elements.equipmentInputs.name.value.trim(),
    id: elements.equipmentInputs.id.value.trim(),
    category: elements.equipmentInputs.category.value,
    status: elements.equipmentInputs.status.value,
    manufacturer: elements.equipmentInputs.manufacturer.value.trim(),
    model: elements.equipmentInputs.model.value.trim(),
    purchaseDate: elements.equipmentInputs.purchaseDate.value,
    warranty: elements.equipmentInputs.warranty.value,
    location: elements.equipmentInputs.location.value.trim(),
    cost: Number(elements.equipmentInputs.cost.value || 0),
    notes: elements.equipmentInputs.notes.value.trim(),
  };

  if (!payload.name || !payload.id || !payload.category || !payload.status) {
    showToast('Please fill all required fields.', 'error');
    return;
  }

  const existingIndex = state.equipment.findIndex((item) => item.id === payload.id);
  const isEditing = Boolean(state.selectedEquipmentId);
  const editingIndex = state.equipment.findIndex((item) => String(item.dbId) === String(state.selectedEquipmentId));

  try {
    if (isEditing) {
      if (existingIndex !== -1 && existingIndex !== editingIndex) {
        showToast('Equipment ID already exists.', 'error');
        return;
      }
      await updateEquipmentApi(state.selectedEquipmentId, payload);
      showToast('Equipment updated successfully.', 'success');
    } else {
      if (existingIndex !== -1) {
        showToast('Equipment ID already exists.', 'error');
        return;
      }
      await createEquipmentApi(payload);
      showToast('Equipment added successfully.', 'success');
    }

    closeModal(elements.modal);
    resetEquipmentForm();
    await loadAllDataFromApi({ showErrorToast: false });
  } catch (error) {
    showToast('Could not save equipment. Check backend and try again.', 'error');
    console.error(error);
  }
}

async function handleMaintenanceSubmit(event) {
  event.preventDefault();
  const equipment = byId(elements.maintenanceInputs.equipmentId.value);
  if (!equipment) {
    showToast('Choose an equipment item.', 'error');
    return;
  }

  const type = elements.maintenanceInputs.type.value;
  const scheduledDate = elements.maintenanceInputs.date.value;
  const descriptionInput = elements.maintenanceInputs.desc.value.trim();
  const description = descriptionInput ? `${type}: ${descriptionInput}` : type;

  if (!type || !scheduledDate) {
    showToast('Maintenance type and date are required.', 'error');
    return;
  }

  try {
    await createMaintenanceApi({
      description,
      maintenanceDate: scheduledDate,
      performedBy: elements.maintenanceInputs.technician.value.trim(),
      status: 'PENDING',
      equipment: { id: equipment.dbId || equipment.id },
    });
    closeModal(elements.maintenanceModal);
    showToast('Maintenance scheduled successfully.', 'success');
    await loadAllDataFromApi({ showErrorToast: false });
  } catch (error) {
    showToast('Could not schedule maintenance. Check backend and try again.', 'error');
    console.error(error);
  }
}

async function handleGlobalSearchSubmit(event) {
  event.preventDefault();
  const term = elements.globalSearch.value.trim();
  state.searchTerm = term;

  if (!term) {
    state.remoteSearchResults = null;
    renderEquipmentList();
    return;
  }

  try {
    const results = await searchEquipmentApi(term);
    state.remoteSearchResults = results;
    setActivePage('equipment');
    renderEquipmentList();
    showToast(`Found ${results.length} matching result${results.length === 1 ? '' : 's'}.`, 'success');
  } catch (error) {
    state.remoteSearchResults = null;
    renderEquipmentList();
    showToast('Search API is unavailable. Showing local results only.', 'error');
    console.error(error);
  }
}

function handlePageClick(event) {
  const statCard = event.target.closest('.stat-card[data-stat-page]');
  if (statCard) {
    event.preventDefault();
    setActivePage(statCard.dataset.statPage);

    if (statCard.dataset.statPage === 'equipment') {
      const filter = statCard.dataset.statFilter || 'all';
      applyEquipmentFilter(filter);
    }
    return;
  }

  const link = event.target.closest('[data-page]');
  if (link && link.dataset.page) {
    event.preventDefault();
    setActivePage(link.dataset.page);
    return;
  }

  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    event.preventDefault();
    const card = actionButton.closest('.eq-card');
    if (card) {
      handleEquipmentAction(card, actionButton.dataset.action);
    }
    return;
  }

  const dismissButton = event.target.closest('[data-dismiss-alert]');
  if (dismissButton) {
    event.preventDefault();
    const alertId = dismissButton.dataset.dismissAlert;
    deleteAlertApi(alertId)
      .then(() => {
        state.alerts = state.alerts.filter((alert) => String(alert.id) !== String(alertId));
        renderAlerts();
        renderStats();
        showToast('Alert dismissed.', 'info');
      })
      .catch((error) => {
        showToast('Could not dismiss alert from backend.', 'error');
        console.error(error);
      });
    return;
  }

  const detailAction = event.target.closest('[data-detail-action]');
  if (detailAction) {
    event.preventDefault();
    const equipmentId = detailAction.dataset.equipmentId;
    const item = byId(equipmentId);
    if (!item) return;
    closeModal(elements.detailModal);
    if (detailAction.dataset.detailAction === 'maintenance') {
      openMaintenanceModal(equipmentId);
    } else {
      openEquipmentModal(item);
    }
    return;
  }

  const maintenanceButton = event.target.closest('[data-maintenance-equipment]');
  if (maintenanceButton) {
    const item = byId(maintenanceButton.dataset.maintenanceEquipment);
    if (item) {
      renderDetailModal(item);
    }
    return;
  }

  const calibrationButton = event.target.closest('[data-calibration-equipment]');
  if (calibrationButton) {
    const item = byId(calibrationButton.dataset.calibrationEquipment);
    if (item) {
      renderDetailModal(item);
    }
  }
}

function bindEvents() {
  document.addEventListener('click', handlePageClick);
  elements.menuBtn.addEventListener('click', openSidebar);
  elements.sidebarToggle.addEventListener('click', closeSidebar);
  elements.overlay.addEventListener('click', () => {
    closeSidebar();
    closeModal(elements.modal);
    closeModal(elements.maintenanceModal);
    closeModal(elements.detailModal);
  });

  elements.gridViewBtn.addEventListener('click', () => {
    state.viewMode = 'grid';
    elements.gridViewBtn.classList.add('active');
    elements.listViewBtn.classList.remove('active');
    elements.equipmentGrid.classList.remove('list-view');
  });

  elements.listViewBtn.addEventListener('click', () => {
    state.viewMode = 'list';
    elements.listViewBtn.classList.add('active');
    elements.gridViewBtn.classList.remove('active');
    elements.equipmentGrid.classList.add('list-view');
  });

  elements.equipmentFilterTabs.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-tab');
    if (!button) return;
    state.activeFilter = button.dataset.filter;
    elements.equipmentFilterTabs.querySelectorAll('.filter-tab').forEach((tab) => tab.classList.toggle('active', tab === button));
    renderEquipmentList();
  });

  elements.globalSearch.addEventListener('input', (event) => {
    state.searchTerm = event.target.value;
    if (!state.searchTerm.trim()) {
      state.remoteSearchResults = null;
    }
    renderEquipmentList();
  });
  elements.globalSearchForm.addEventListener('submit', handleGlobalSearchSubmit);

  elements.addEquipmentBtn.addEventListener('click', () => {
    resetEquipmentForm();
    openEquipmentModal();
  });
  elements.addEquipmentBtn2.addEventListener('click', () => {
    resetEquipmentForm();
    openEquipmentModal();
  });
  elements.addMaintenanceBtn.addEventListener('click', () => openMaintenanceModal());
  elements.addCalibrationBtn.addEventListener('click', async () => {
    await loadAllDataFromApi({ showErrorToast: true });
    showToast('Calibration list refreshed from backend.', 'info');
  });

  [elements.closeModal, elements.cancelModal].forEach((button) => {
    button.addEventListener('click', () => {
      closeModal(elements.modal);
      resetEquipmentForm();
    });
  });

  [elements.closeMaintenanceModal, elements.cancelMaintenanceModal].forEach((button) => {
    button.addEventListener('click', () => closeModal(elements.maintenanceModal));
  });

  elements.closeDetailModal.addEventListener('click', () => closeModal(elements.detailModal));
  elements.equipmentForm.addEventListener('submit', handleEquipmentSubmit);
  elements.maintenanceForm.addEventListener('submit', handleMaintenanceSubmit);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const statCard = event.target.closest('.stat-card[data-stat-page]');
    if (!statCard) return;
    event.preventDefault();
    statCard.click();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSidebar();
      closeModal(elements.modal);
      closeModal(elements.maintenanceModal);
      closeModal(elements.detailModal);
    }
  });
}

function refreshAll() {
  renderStats();
  renderEquipmentList();
  renderMaintenanceTable();
  renderCalibrationTable();
  renderUpcomingMaintenance();
  renderActivityFeed();
  renderCategoryBreakdown();
  renderAlerts();
  populateEquipmentSelect();
  renderCharts();
}

async function init() {
  bindEvents();
  refreshAll();
  await loadAllDataFromApi({ showErrorToast: false });
  setActivePage('dashboard');
  showToast('group_v.Student_labmangment_backend is ready.', 'success');
}

function bootApp() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
    return;
  }

  init();
}

bootApp();