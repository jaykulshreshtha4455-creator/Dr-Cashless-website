/* Dr. Cashless — appointments.js */

/* ==============================
   STATE
   ============================== */
let allAppts      = [];
let activeFilter  = 'all';
let searchQuery   = '';
let cancelTarget  = null;


/* ==============================
   LOAD
   ============================== */
function loadAppts() {
  return JSON.parse(localStorage.getItem('dc_appointments') || '[]');
}
function saveAppts(data) {
  localStorage.setItem('dc_appointments', JSON.stringify(data));
}


/* ==============================
   RENDER
   ============================== */
function render() {
  allAppts = loadAppts();

  const statsEl    = document.getElementById('apptStats');
  const filtersEl  = document.getElementById('apptFilters');
  const emptyEl    = document.getElementById('apptEmpty');
  const noMatchEl  = document.getElementById('apptNoMatch');
  const contentEl  = document.getElementById('apptContent');

  if (allAppts.length === 0) {
    statsEl.style.display   = 'none';
    filtersEl.style.display = 'none';
    contentEl.innerHTML     = '';
    emptyEl.style.display   = 'flex';
    noMatchEl.style.display = 'none';
    return;
  }

  // Stats
  statsEl.style.display   = 'flex';
  filtersEl.style.display = 'flex';
  emptyEl.style.display   = 'none';
  document.getElementById('statTotal').textContent     = allAppts.length;
  document.getElementById('statUpcoming').textContent  = allAppts.filter(a => a.status === 'upcoming').length;
  document.getElementById('statCompleted').textContent = allAppts.filter(a => a.status === 'completed').length;
  document.getElementById('statCancelled').textContent = allAppts.filter(a => a.status === 'cancelled').length;

  // Filter + search
  let filtered = allAppts.filter(a => {
    if (activeFilter !== 'all' && a.status !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.ref.toLowerCase().includes(q) ||
        (a.hospital || '').toLowerCase().includes(q) ||
        (a.dept || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (filtered.length === 0) {
    contentEl.innerHTML     = '';
    noMatchEl.style.display = 'flex';
    return;
  }
  noMatchEl.style.display = 'none';

  // Table (desktop)
  const tableHTML = `
    <div class="appt-table-wrap">
      <table class="appt-table">
        <thead>
          <tr>
            <th>Ref & Patient</th>
            <th>Department</th>
            <th>Hospital</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(a => `
            <tr>
              <td>
                <div class="appt-ref">${a.ref}</div>
                <div class="appt-patient-name">${a.name}</div>
                <div class="appt-patient-sub">${a.age} yrs · ${cap(a.gender)} · ${a.phone}</div>
              </td>
              <td>
                <div style="font-weight:600">${a.dept || '—'}</div>
                <div style="font-size:11px;color:var(--muted);margin-top:2px">${a.complaint || ''}</div>
              </td>
              <td>
                <div style="font-weight:600">${a.hospital || '—'}</div>
                <div style="font-size:11px;color:var(--muted);margin-top:2px">${a.location || ''}</div>
              </td>
              <td>
                <div style="font-weight:600">${a.date || '—'}</div>
                <div style="font-size:11px;color:var(--muted);margin-top:2px">${a.time || ''}</div>
              </td>
              <td><span class="appt-badge ${a.status}">${statusLabel(a.status)}</span></td>
              <td>
                <div class="appt-action-row">
                  ${a.status === 'upcoming' ? `
                    <button class="appt-act-btn" onclick="markDone('${a.ref}')">
                      <i class="fas fa-check"></i> Done
                    </button>
                    <button class="appt-act-btn cancel" onclick="askCancel('${a.ref}')">
                      <i class="fas fa-xmark"></i> Cancel
                    </button>
                  ` : `
                    <button class="appt-act-btn cancel" onclick="deleteAppt('${a.ref}')">
                      <i class="fas fa-trash"></i> Remove
                    </button>
                  `}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Cards (mobile)
  const cardsHTML = `
    <div class="appt-cards">
      ${filtered.map(a => `
        <div class="appt-card">
          <div class="appt-card-top">
            <div>
              <div class="appt-card-ref">${a.ref}</div>
              <div class="appt-card-name">${a.name}</div>
              <div class="appt-card-sub">${a.age} yrs · ${cap(a.gender)} · ${a.phone}</div>
            </div>
            <span class="appt-badge ${a.status}">${statusLabel(a.status)}</span>
          </div>
          <div class="appt-card-rows">
            <div class="appt-card-row"><i class="fas fa-stethoscope"></i><span>${a.dept || '—'}${a.complaint ? ' · ' + a.complaint : ''}</span></div>
            <div class="appt-card-row"><i class="fas fa-hospital"></i><span>${a.hospital || 'To be assigned'}</span></div>
            <div class="appt-card-row"><i class="fas fa-location-dot"></i><span>${a.location || '—'}</span></div>
            <div class="appt-card-row"><i class="fas fa-calendar"></i><span>${a.date || '—'} · ${a.time || '—'}</span></div>
            ${a.notes ? `<div class="appt-card-row"><i class="fas fa-comment-medical"></i><span>${a.notes}</span></div>` : ''}
          </div>
          <div class="appt-card-actions">
            ${a.status === 'upcoming' ? `
              <button class="appt-act-btn" onclick="markDone('${a.ref}')">
                <i class="fas fa-check"></i> Mark Done
              </button>
              <button class="appt-act-btn cancel" onclick="askCancel('${a.ref}')">
                <i class="fas fa-xmark"></i> Cancel
              </button>
            ` : `
              <button class="appt-act-btn cancel" onclick="deleteAppt('${a.ref}')">
                <i class="fas fa-trash"></i> Remove
              </button>
            `}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  contentEl.innerHTML = tableHTML + cardsHTML;
}


/* ==============================
   ACTIONS
   ============================== */
function markDone(ref) {
  const data = loadAppts();
  const idx  = data.findIndex(a => a.ref === ref);
  if (idx !== -1) { data[idx].status = 'completed'; saveAppts(data); render(); }
}

function askCancel(ref) {
  cancelTarget = ref;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function deleteAppt(ref) {
  const data = loadAppts().filter(a => a.ref !== ref);
  saveAppts(data);
  render();
}


/* ==============================
   MODAL
   ============================== */
document.getElementById('modalNo').addEventListener('click', () => {
  document.getElementById('modalOverlay').style.display = 'none';
  cancelTarget = null;
});
document.getElementById('modalYes').addEventListener('click', () => {
  if (cancelTarget) {
    const data = loadAppts();
    const idx  = data.findIndex(a => a.ref === cancelTarget);
    if (idx !== -1) { data[idx].status = 'cancelled'; saveAppts(data); }
  }
  document.getElementById('modalOverlay').style.display = 'none';
  cancelTarget = null;
  render();
});


/* ==============================
   FILTERS
   ============================== */
document.querySelectorAll('.appt-filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.appt-filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.filter;
    render();
  });
});

document.getElementById('apptSearch').addEventListener('input', function () {
  searchQuery = this.value.trim();
  render();
});

document.getElementById('clearAllBtn').addEventListener('click', () => {
  if (confirm('Remove all appointments from this device?')) {
    localStorage.removeItem('dc_appointments');
    render();
  }
});

document.getElementById('resetFilterBtn').addEventListener('click', () => {
  activeFilter  = 'all';
  searchQuery   = '';
  document.getElementById('apptSearch').value = '';
  document.querySelectorAll('.appt-filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-filter="all"]').classList.add('active');
  render();
});


/* ==============================
   HELPERS
   ============================== */
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function statusLabel(s) {
  return { upcoming: '⏳ Upcoming', completed: '✓ Completed', cancelled: '✕ Cancelled' }[s] || s;
}


/* ==============================
   BOOT
   ============================== */
render();
