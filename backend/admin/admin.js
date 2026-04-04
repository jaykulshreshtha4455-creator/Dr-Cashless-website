'use strict';

// ── Auth guard ────────────────────────────────────────────────
const TOKEN = localStorage.getItem('dc_admin_token');
if (!TOKEN) { window.location.href = 'index.html'; }

document.getElementById('adminName').textContent =
  localStorage.getItem('dc_admin_user') || 'Admin';

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN };
}

async function api(method, path, body) {
  const res = await fetch('/api' + path, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { logout(); return; }
  return res.json();
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
  const data = await api('GET', '/admin/stats');
  if (!data) return;
  document.getElementById('s-hospitals').textContent    = data.hospitals;
  document.getElementById('s-today').textContent        = data.todayAppointments;
  document.getElementById('s-appointments').textContent = data.appointments;
  document.getElementById('s-claims').textContent       = data.claims;
  document.getElementById('s-pending').textContent      = data.pendingClaims;
}

// ── Hospitals ─────────────────────────────────────────────────
let allHospitals = [];
let metaData = { states: [], cities: [], insurers: [] };

async function loadHospitals() {
  const [hospitals, meta] = await Promise.all([
    api('GET', '/admin/hospitals'),
    api('GET', '/admin/meta'),
  ]);
  allHospitals = hospitals || [];
  metaData = meta || { states: [], cities: [], insurers: [] };
  renderHospitals(allHospitals);
}

function filterHospitals() {
  const q = document.getElementById('hospSearch').value.toLowerCase();
  renderHospitals(allHospitals.filter(h =>
    h.name.toLowerCase().includes(q) ||
    h.city.toLowerCase().includes(q) ||
    h.state.toLowerCase().includes(q)
  ));
}

function renderHospitals(list) {
  const tbody = document.getElementById('hospBody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fas fa-hospital"></i>No hospitals found</div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(h => `
    <tr>
      <td><strong>${esc(h.name)}</strong></td>
      <td>${esc(h.city)}</td>
      <td>${esc(h.state)}</td>
      <td>${esc(h.type || '—')}</td>
      <td>${h.beds || '—'}</td>
      <td><a href="tel:${h.phone}" style="color:#F25C08">${esc(h.phone || '—')}</a></td>
      <td><span class="badge badge-${h.active ? 'active' : 'inactive'}">${h.active ? 'Active' : 'Inactive'}</span></td>
      <td>
        <button class="act-btn act-edit" onclick="editHospital(${h.id})">Edit</button>
        <button class="act-btn act-delete" onclick="deactivateHospital(${h.id},'${esc(h.name)}')">${h.active ? 'Deactivate' : 'Deleted'}</button>
      </td>
    </tr>
  `).join('');
}

// Hospital modal
function openHospitalModal(hospital) {
  // Populate state dropdown
  const stateEl = document.getElementById('hm_state');
  stateEl.innerHTML = `<option value="">Select State</option>` +
    metaData.states.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');

  // Populate insurer checkboxes
  const insEl = document.getElementById('hm_insurers');
  insEl.innerHTML = metaData.insurers.map(i => `
    <label class="cb-item">
      <input type="checkbox" value="${i.id}" />
      ${esc(i.name)}
    </label>
  `).join('');

  // Populate department checkboxes
  const DEPTS = ['Cardiology','Orthopaedics','Neurology','Oncology','Gynaecology',
    'Gastroenterology','Nephrology','Pulmonology','Ophthalmology','General Surgery','Paediatrics'];
  const deptEl = document.getElementById('hm_depts');
  deptEl.innerHTML = DEPTS.map(d => `
    <label class="cb-item">
      <input type="checkbox" value="${d}" />
      ${d}
    </label>
  `).join('');

  if (hospital) {
    document.getElementById('hospModalTitle').textContent = 'Edit Hospital';
    document.getElementById('hm_id').value      = hospital.id;
    document.getElementById('hm_name').value    = hospital.name;
    document.getElementById('hm_type').value    = hospital.type;
    document.getElementById('hm_beds').value    = hospital.beds || '';
    document.getElementById('hm_address').value = hospital.address || '';
    document.getElementById('hm_phone').value   = hospital.phone || '';
    // Set state and load cities
    stateEl.value = hospital.state_id || '';
    if (hospital.state_id) loadModalCities(hospital.city_id);
  } else {
    document.getElementById('hospModalTitle').textContent = 'Add Hospital';
    document.getElementById('hm_id').value      = '';
    document.getElementById('hm_name').value    = '';
    document.getElementById('hm_beds').value    = '';
    document.getElementById('hm_address').value = '';
    document.getElementById('hm_phone').value   = '+91 7999868659';
    document.getElementById('hm_city').innerHTML = '<option value="">Select City</option>';
  }

  document.getElementById('hospModalOverlay').classList.add('open');
  document.getElementById('hospModal').classList.add('open');
}

function closeHospitalModal() {
  document.getElementById('hospModalOverlay').classList.remove('open');
  document.getElementById('hospModal').classList.remove('open');
}

async function loadModalCities(selectCityId) {
  const stateId = document.getElementById('hm_state').value;
  const cityEl  = document.getElementById('hm_city');
  if (!stateId) { cityEl.innerHTML = '<option value="">Select City</option>'; return; }
  const cities = metaData.cities.filter(c => c.state_id == stateId);
  cityEl.innerHTML = '<option value="">Select City</option>' +
    cities.map(c => `<option value="${c.id}" ${c.id == selectCityId ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
}

async function editHospital(id) {
  const h = allHospitals.find(x => x.id === id);
  if (h) openHospitalModal(h);
}

async function saveHospital() {
  const id      = document.getElementById('hm_id').value;
  const name    = document.getElementById('hm_name').value.trim();
  const city_id = document.getElementById('hm_city').value;
  const type    = document.getElementById('hm_type').value;
  const beds    = document.getElementById('hm_beds').value;
  const address = document.getElementById('hm_address').value.trim();
  const phone   = document.getElementById('hm_phone').value.trim();

  if (!name || !city_id) { alert('Hospital name and city are required.'); return; }

  const insurers = [...document.querySelectorAll('#hm_insurers input:checked')].map(c => parseInt(c.value));
  const departments = [...document.querySelectorAll('#hm_depts input:checked')].map(c => c.value);

  const body = { name, city_id: parseInt(city_id), type, beds: beds ? parseInt(beds) : null, address, phone, insurers, departments };

  if (id) {
    await api('PUT', '/admin/hospitals/' + id, { ...body, active: true });
  } else {
    await api('POST', '/admin/hospitals', body);
  }
  closeHospitalModal();
  loadHospitals();
}

async function deactivateHospital(id, name) {
  if (!confirm(`Deactivate "${name}"? It will be hidden from search.`)) return;
  await api('DELETE', '/admin/hospitals/' + id);
  loadHospitals();
}

// ── Appointments ──────────────────────────────────────────────
async function loadAppointments() {
  const q      = document.getElementById('apptSearch').value.trim();
  const status = document.getElementById('apptStatus').value;
  const date   = document.getElementById('apptDate').value;

  let path = '/admin/appointments?';
  if (q)      path += `q=${encodeURIComponent(q)}&`;
  if (status) path += `status=${status}&`;
  if (date)   path += `date=${date}&`;

  const data = await api('GET', path);
  renderAppointments(data || []);
}

function renderAppointments(list) {
  const tbody = document.getElementById('apptBody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fas fa-calendar-check"></i>No appointments found</div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(a => `
    <tr>
      <td><code style="font-size:11px;color:#F25C08">${esc(a.ref)}</code></td>
      <td><strong>${esc(a.patient_name)}</strong><div class="sub">${a.age ? a.age + ' yrs' : ''} ${a.gender || ''}</div></td>
      <td><a href="tel:${a.phone}" class="act-btn act-call" style="text-decoration:none">${esc(a.phone)}</a></td>
      <td>${esc(a.department || '—')}</td>
      <td>${esc(a.hospital_name || '—')}</td>
      <td>${fmtDate(a.appointment_date)}<div class="sub">${esc(a.appointment_time || '')}</div></td>
      <td><span class="badge badge-${a.status}">${a.status}</span></td>
      <td>
        <select class="filter-select" style="padding:4px 8px;font-size:11px" onchange="updateApptStatus(${a.id}, this.value)">
          <option value="upcoming"  ${a.status==='upcoming'  ?'selected':''}>Upcoming</option>
          <option value="done"      ${a.status==='done'      ?'selected':''}>Done</option>
          <option value="cancelled" ${a.status==='cancelled' ?'selected':''}>Cancelled</option>
        </select>
        <button class="act-btn act-delete" onclick="deleteAppt(${a.id})" style="margin-top:4px">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function updateApptStatus(id, status) {
  await api('PATCH', '/admin/appointments/' + id, { status });
}

async function deleteAppt(id) {
  if (!confirm('Delete this appointment permanently?')) return;
  await api('DELETE', '/admin/appointments/' + id);
  loadAppointments();
}

// ── Claims ────────────────────────────────────────────────────
async function loadClaims() {
  const q      = document.getElementById('claimSearch').value.trim();
  const status = document.getElementById('claimStatus').value;

  let path = '/admin/claims?';
  if (q)      path += `q=${encodeURIComponent(q)}&`;
  if (status) path += `status=${status}&`;

  const data = await api('GET', path);
  renderClaims(data || []);
}

function renderClaims(list) {
  const tbody = document.getElementById('claimBody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fas fa-file-invoice-dollar"></i>No claims found</div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c => `
    <tr>
      <td><code style="font-size:11px;color:#F25C08">${esc(c.ref)}</code></td>
      <td><strong>${esc(c.patient_name)}</strong><div class="sub">${esc(c.relation || '')}</div></td>
      <td><a href="tel:${c.phone}" class="act-btn act-call" style="text-decoration:none">${esc(c.phone)}</a></td>
      <td>${esc(c.insurer || '—')}</td>
      <td>${esc(c.hospital || '—')}<div class="sub">${esc(c.city || '')}${c.city && c.state ? ', ' : ''}${esc(c.state || '')}</div></td>
      <td style="color:#F25C08;font-weight:700">₹${fmtNum(c.claim_amount)}</td>
      <td><span class="badge badge-${c.status}">${c.status}</span></td>
      <td>
        <button class="act-btn act-update" onclick="openClaimModal(${c.id},'${esc(c.ref)}','${c.status}','${esc(c.admin_notes||'')}')">Update</button>
      </td>
    </tr>
  `).join('');
}

function openClaimModal(id, ref, status, notes) {
  document.getElementById('cm_id').value     = id;
  document.getElementById('cm_ref').value    = ref;
  document.getElementById('cm_status').value = status;
  document.getElementById('cm_notes').value  = notes;
  document.getElementById('claimModalOverlay').classList.add('open');
  document.getElementById('claimModal').classList.add('open');
}

function closeClaimModal() {
  document.getElementById('claimModalOverlay').classList.remove('open');
  document.getElementById('claimModal').classList.remove('open');
}

async function saveClaimStatus() {
  const id     = document.getElementById('cm_id').value;
  const status = document.getElementById('cm_status').value;
  const notes  = document.getElementById('cm_notes').value.trim();
  await api('PATCH', '/admin/claims/' + id, { status, admin_notes: notes });
  closeClaimModal();
  loadClaims();
}

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
