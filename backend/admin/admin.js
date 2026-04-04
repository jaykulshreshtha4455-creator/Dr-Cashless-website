'use strict';

const API_BASE = 'https://dr-cashless-backend-production.up.railway.app';

// ── Auth guard ────────────────────────────────────────────────
const TOKEN = localStorage.getItem('dc_admin_token');
if (!TOKEN) { window.location.href = 'index.html'; }

document.getElementById('adminName').textContent =
  localStorage.getItem('dc_admin_user') || 'Admin';

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN };
}

async function api(method, path, body) {
  try {
    const res = await fetch(API_BASE + path, {
      method,
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 || res.status === 403) { logout(); return null; }
    return res.json();
  } catch (err) {
    console.error('API error:', err);
    return null;
  }
}

function logout() {
  localStorage.removeItem('dc_admin_token');
  localStorage.removeItem('dc_admin_user');
  window.location.href = 'index.html';
}

// ── Tab switching ─────────────────────────────────────────────
const TAB_TITLES = {
  overview:     'Overview',
  hospitals:    'Hospitals',
  appointments: 'Appointments',
  claims:       'Claims',
};

function switchTab(tab) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.sb-link[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('tabTitle').textContent = TAB_TITLES[tab];
  if (tab === 'overview')     loadStats();
  if (tab === 'hospitals')    loadHospitals();
  if (tab === 'appointments') loadAppointments();
  if (tab === 'claims')       loadClaims();
}

document.querySelectorAll('.sb-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab(link.dataset.tab);
  });
});

// ── Overview stats ────────────────────────────────────────────
async function loadStats() {
  // Fetch hospitals count from search (no filters = all active hospitals)
  const data = await api('GET', '/api/hospitals/search');
  if (data && data.success) {
    document.getElementById('s-hospitals').textContent    = data.count || 0;
    document.getElementById('s-today').textContent        = '—';
    document.getElementById('s-appointments').textContent = '—';
    document.getElementById('s-claims').textContent       = '—';
    document.getElementById('s-pending').textContent      = '—';
  }
}

// ── Master data (states, districts, cities, insurers) ─────────
let masterData = { states: [], insurers: [] };

async function loadMasterData() {
  const [statesRes, insurersRes] = await Promise.all([
    api('GET', '/api/master/states'),
    api('GET', '/api/master/insurance-companies'),
  ]);
  if (statesRes && statesRes.success)   masterData.states   = statesRes.data   || [];
  if (insurersRes && insurersRes.success) masterData.insurers = insurersRes.data || [];
}

// ── Hospitals ─────────────────────────────────────────────────
let allHospitals = [];

async function loadHospitals() {
  await loadMasterData();
  const data = await api('GET', '/api/hospitals/search');
  allHospitals = (data && data.success) ? data.data : [];
  renderHospitals(allHospitals);
}

function filterHospitals() {
  const q = document.getElementById('hospSearch').value.toLowerCase();
  renderHospitals(allHospitals.filter(h =>
    (h.name || '').toLowerCase().includes(q) ||
    (h.city_name || '').toLowerCase().includes(q) ||
    (h.state_name || '').toLowerCase().includes(q)
  ));
}

function renderHospitals(list) {
  const tbody = document.getElementById('hospBody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-hospital"></i>No hospitals found</div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(h => `
    <tr>
      <td><strong>${esc(h.name)}</strong></td>
      <td>${esc(h.city_name || '—')}</td>
      <td>${esc(h.state_name || '—')}</td>
      <td><a href="tel:${h.contact_number}" style="color:#F25C08">${esc(h.contact_number || '—')}</a></td>
      <td>${esc(h.tpa_desk_number || '—')}</td>
      <td><span class="badge badge-${h.is_active ? 'active' : 'inactive'}">${h.is_active ? 'Active' : 'Inactive'}</span></td>
      <td>
        <button class="act-btn act-edit" onclick="editHospital(${h.id})">Edit</button>
        <button class="act-btn act-delete" onclick="deactivateHospital(${h.id},'${esc(h.name)}')">${h.is_active ? 'Deactivate' : 'Deleted'}</button>
      </td>
    </tr>
  `).join('');
}

// Hospital modal
async function openHospitalModal(hospital) {
  // Populate state dropdown
  const stateEl = document.getElementById('hm_state');
  stateEl.innerHTML = `<option value="">Select State</option>` +
    masterData.states.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');

  // Populate insurer checkboxes
  const insEl = document.getElementById('hm_insurers');
  insEl.innerHTML = masterData.insurers.map(i => `
    <label class="cb-item">
      <input type="checkbox" value="${i.id}" />
      ${esc(i.name)}
    </label>
  `).join('');

  if (hospital) {
    document.getElementById('hospModalTitle').textContent = 'Edit Hospital';
    document.getElementById('hm_id').value           = hospital.id;
    document.getElementById('hm_name').value         = hospital.name;
    document.getElementById('hm_address').value      = hospital.address || '';
    document.getElementById('hm_phone').value        = hospital.contact_number || '';
    document.getElementById('hm_tpa_desk').value     = hospital.tpa_desk_number || '';
    document.getElementById('hm_cashless').checked   = !!hospital.is_cashless;

    // Set state, then load districts, then cities
    stateEl.value = hospital.state_id || '';
    if (hospital.state_id) {
      await loadModalDistricts(null);
      if (hospital.district_id) {
        document.getElementById('hm_district').value = hospital.district_id;
        await loadModalCities(hospital.city_id);
      }
    }
  } else {
    document.getElementById('hospModalTitle').textContent = 'Add Hospital';
    document.getElementById('hm_id').value      = '';
    document.getElementById('hm_name').value    = '';
    document.getElementById('hm_address').value = '';
    document.getElementById('hm_phone').value   = '';
    document.getElementById('hm_tpa_desk').value = '';
    document.getElementById('hm_cashless').checked = true;
    document.getElementById('hm_district').innerHTML = '<option value="">Select District</option>';
    document.getElementById('hm_city').innerHTML    = '<option value="">Select City</option>';
  }

  document.getElementById('hospModalOverlay').classList.add('open');
  document.getElementById('hospModal').classList.add('open');
}

function closeHospitalModal() {
  document.getElementById('hospModalOverlay').classList.remove('open');
  document.getElementById('hospModal').classList.remove('open');
}

async function loadModalDistricts(selectDistrictId) {
  const stateId    = document.getElementById('hm_state').value;
  const districtEl = document.getElementById('hm_district');
  const cityEl     = document.getElementById('hm_city');
  districtEl.innerHTML = '<option value="">Select District</option>';
  cityEl.innerHTML     = '<option value="">Select City</option>';
  if (!stateId) return;

  const data = await api('GET', '/api/master/districts/' + stateId);
  if (!data || !data.success) return;
  districtEl.innerHTML = '<option value="">Select District</option>' +
    data.data.map(d => `<option value="${d.id}" ${d.id == selectDistrictId ? 'selected' : ''}>${esc(d.name)}</option>`).join('');
}

async function loadModalCities(selectCityId) {
  const districtId = document.getElementById('hm_district').value;
  const cityEl     = document.getElementById('hm_city');
  cityEl.innerHTML = '<option value="">Select City</option>';
  if (!districtId) return;

  const data = await api('GET', '/api/master/cities/' + districtId);
  if (!data || !data.success) return;
  cityEl.innerHTML = '<option value="">Select City</option>' +
    data.data.map(c => `<option value="${c.id}" ${c.id == selectCityId ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
}

async function editHospital(id) {
  // Fetch full hospital details
  const data = await api('GET', '/api/hospitals/' + id);
  if (data && data.success) {
    openHospitalModal(data.data);
  }
}

async function saveHospital() {
  const id          = document.getElementById('hm_id').value;
  const name        = document.getElementById('hm_name').value.trim();
  const city_id     = document.getElementById('hm_city').value;
  const address     = document.getElementById('hm_address').value.trim();
  const contact_number   = document.getElementById('hm_phone').value.trim();
  const tpa_desk_number  = document.getElementById('hm_tpa_desk').value.trim();
  const is_cashless = document.getElementById('hm_cashless').checked ? 1 : 0;

  if (!name || !city_id) { alert('Hospital name and city are required.'); return; }

  const body = {
    name,
    city_id: parseInt(city_id),
    address: address || null,
    contact_number: contact_number || null,
    tpa_desk_number: tpa_desk_number || null,
    is_cashless,
  };

  let result;
  if (id) {
    result = await api('PUT', '/api/hospitals/' + id, body);
  } else {
    result = await api('POST', '/api/hospitals', body);
  }

  if (result && result.success) {
    closeHospitalModal();
    loadHospitals();
  } else {
    alert((result && result.message) || 'Save failed. Please try again.');
  }
}

async function deactivateHospital(id, name) {
  if (!confirm(`Deactivate "${name}"? It will be hidden from search.`)) return;
  const result = await api('DELETE', '/api/hospitals/' + id);
  if (result && result.success) {
    loadHospitals();
  } else {
    alert((result && result.message) || 'Action failed.');
  }
}

// ── Appointments ──────────────────────────────────────────────
function loadAppointments() {
  document.getElementById('apptBody').innerHTML = `
    <tr><td colspan="8">
      <div class="empty-state">
        <i class="fas fa-calendar-check"></i>
        Appointments module coming soon
      </div>
    </td></tr>`;
}

// ── Claims ────────────────────────────────────────────────────
function loadClaims() {
  document.getElementById('claimBody').innerHTML = `
    <tr><td colspan="8">
      <div class="empty-state">
        <i class="fas fa-file-invoice-dollar"></i>
        Claims module coming soon
      </div>
    </td></tr>`;
}

function openClaimModal() {}
function closeClaimModal() {
  document.getElementById('claimModalOverlay').classList.remove('open');
  document.getElementById('claimModal').classList.remove('open');
}
async function saveClaimStatus() { closeClaimModal(); }

// ── Helpers ───────────────────────────────────────────────────
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function fmtNum(n) {
  return parseFloat(n || 0).toLocaleString('en-IN');
}

// ── Init ──────────────────────────────────────────────────────
loadStats();
