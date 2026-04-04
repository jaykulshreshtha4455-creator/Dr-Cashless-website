/* =============================================
   DR. CASHLESS — reimbursement.js
   Reimbursement claim form logic
   ============================================= */

'use strict';

let currentStep = 1;

// ── Step navigation ──────────────────────────────────────────

function goStep(n) {
  if (n > currentStep && !validateStep(currentStep)) return;

  currentStep = n;

  // update panels
  document.querySelectorAll('.reimb-step-panel').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === n);
  });

  // update step indicator
  document.querySelectorAll('.opd-step').forEach((s) => {
    const num = parseInt(s.dataset.step);
    s.classList.toggle('active', num === n);
    s.classList.toggle('done', num < n);
  });

  if (n === 3) buildReview();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Validation ────────────────────────────────────────────────

function validateStep(step) {
  if (step === 1) {
    const name   = val('r_name');
    const phone  = val('r_phone');
    const age    = val('r_age');
    const gender = val('r_gender');
    const rel    = val('r_relation');
    const ins    = val('r_insurer');
    const policy = val('r_policy_no');
    const hosp   = val('r_hospital');
    const city   = val('r_hospital_city');
    const state  = val('r_hospital_state');

    if (!name)   { shake('r_name');   alert('Please enter patient name.');         return false; }
    if (!phone || phone.length < 10) { shake('r_phone'); alert('Please enter a valid 10-digit phone number.'); return false; }
    if (!age)    { shake('r_age');    alert('Please enter patient age.');           return false; }
    if (!gender) { shake('r_gender'); alert('Please select gender.');               return false; }
    if (!rel)    { shake('r_relation'); alert('Please select patient relationship.'); return false; }
    if (!ins)    { shake('r_insurer'); alert('Please select your insurer.');        return false; }
    if (!policy) { shake('r_policy_no'); alert('Please enter your policy number.'); return false; }
    if (!hosp)   { shake('r_hospital'); alert('Please enter the hospital name.');   return false; }
    if (!city)   { shake('r_hospital_city'); alert('Please enter the city.');       return false; }
    if (!state)  { shake('r_hospital_state'); alert('Please enter the state.');     return false; }
    return true;
  }

  if (step === 2) {
    const type      = val('r_type');
    const dept      = val('r_dept');
    const diagnosis = val('r_diagnosis');
    const admitDate = val('r_admit_date');
    const total     = val('r_total_bill');
    const claim     = val('r_claim_amount');

    if (!type)      { shake('r_type');       alert('Please select the claim type.');    return false; }
    if (!dept)      { shake('r_dept');       alert('Please select the department.');    return false; }
    if (!diagnosis) { shake('r_diagnosis'); alert('Please enter the diagnosis.');       return false; }
    if (!admitDate) { shake('r_admit_date'); alert('Please enter the treatment date.'); return false; }
    if (!total)     { shake('r_total_bill'); alert('Please enter the total bill amount.'); return false; }
    if (!claim)     { shake('r_claim_amount'); alert('Please enter the claim amount.'); return false; }
    return true;
  }

  return true;
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function shake(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.3s ease';
  setTimeout(() => { el.style.animation = ''; }, 400);
}

// ── Build review panel ────────────────────────────────────────

function buildReview() {
  const grid = document.getElementById('reviewGrid');
  const docsPanel = document.getElementById('reviewDocs');

  const claimAmt = parseInt(val('r_claim_amount') || '0');

  const items = [
    { label: 'Patient Name',    value: val('r_name') },
    { label: 'Phone',           value: '+91 ' + val('r_phone') },
    { label: 'Age / Gender',    value: val('r_age') + ' yrs / ' + capitalise(val('r_gender')) },
    { label: 'Patient Is',      value: capitalise(val('r_relation')) },
    { label: 'Insurer',         value: insurerLabel(val('r_insurer')) },
    { label: 'Policy Number',   value: val('r_policy_no') },
    { label: 'Hospital',        value: val('r_hospital') },
    { label: 'Location',        value: val('r_hospital_city') + ', ' + val('r_hospital_state') },
    { label: 'Claim Type',      value: claimTypeLabel(val('r_type')) },
    { label: 'Department',      value: capitalise(val('r_dept')) },
    { label: 'Diagnosis',       value: val('r_diagnosis') },
    { label: 'Treatment Date',  value: formatDate(val('r_admit_date')) },
    { label: 'Total Bill',      value: '₹ ' + formatNum(val('r_total_bill')) },
  ];

  grid.innerHTML = items.map(it =>
    `<div class="reimb-review-item">
      <div class="reimb-review-label">${it.label}</div>
      <div class="reimb-review-val">${it.value || '—'}</div>
    </div>`
  ).join('') +
  `<div class="reimb-review-item reimb-review-amount">
    <div class="reimb-review-label">Claim Amount</div>
    <div class="reimb-review-val">₹ ${formatNum(val('r_claim_amount'))}</div>
  </div>`;

  // Documents
  const DOC_LABELS = {
    doc_discharge:   'Discharge Summary',
    doc_bills:       'Bills & Receipts',
    doc_prescription:'Doctor\'s Prescription',
    doc_reports:     'Lab / Diagnostic Reports',
    doc_policy:      'Policy / Insurance Card',
    doc_id:          'Photo ID Proof',
    doc_bank:        'Bank Details / Cheque',
    doc_form:        'Insurer\'s Claim Form',
  };

  const tags = Object.entries(DOC_LABELS).map(([id, label]) => {
    const checked = document.getElementById(id)?.checked;
    return `<span class="reimb-doc-tag ${checked ? 'ready' : 'pending'}">
      <i class="fas fa-${checked ? 'check' : 'clock'}"></i> ${label}
    </span>`;
  }).join('');

  docsPanel.innerHTML = `
    <div class="reimb-review-docs-title">Documents Status</div>
    <div class="reimb-review-doc-tags">${tags}</div>
  `;
}

function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatNum(n) {
  const num = parseInt(n || '0');
  return num.toLocaleString('en-IN');
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function insurerLabel(v) {
  const map = {
    star: 'Star Health', hdfc: 'HDFC ERGO', icici: 'ICICI Lombard',
    niva: 'Niva Bupa', bajaj: 'Bajaj Allianz', sbi: 'SBI General',
    united: 'United India', oriental: 'Oriental Insurance',
    nic: 'National Insurance', care: 'Care Health', other: 'Other',
  };
  return map[v] || v;
}

function claimTypeLabel(v) {
  const map = {
    hospitalisation: 'Hospitalisation', daycare: 'Day Care Procedure',
    opd: 'OPD / Consultation', maternity: 'Maternity', ambulance: 'Ambulance',
    pharmacy: 'Pharmacy / Medicine', diagnostic: 'Diagnostics / Lab Tests',
    dental: 'Dental', vision: 'Vision / Eye Care',
  };
  return map[v] || capitalise(v);
}

// ── Submit claim ──────────────────────────────────────────────

function submitClaim() {
  const consent = document.getElementById('r_consent');
  if (!consent.checked) {
    alert('Please check the consent box to proceed.');
    return;
  }

  const ref = 'RC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

  const claim = {
    ref,
    name:        val('r_name'),
    phone:       '+91 ' + val('r_phone'),
    age:         val('r_age'),
    gender:      val('r_gender'),
    relation:    val('r_relation'),
    insurer:     insurerLabel(val('r_insurer')),
    policyNo:    val('r_policy_no'),
    memberId:    val('r_member_id'),
    tpa:         val('r_tpa'),
    hospital:    val('r_hospital'),
    city:        val('r_hospital_city'),
    state:       val('r_hospital_state'),
    claimType:   claimTypeLabel(val('r_type')),
    dept:        val('r_dept'),
    diagnosis:   val('r_diagnosis'),
    procedure:   val('r_procedure'),
    admitDate:   val('r_admit_date'),
    dischargeDate: val('r_discharge_date'),
    totalBill:   val('r_total_bill'),
    paidByIns:   val('r_paid_insurance'),
    claimAmount: val('r_claim_amount'),
    status:      'submitted',
    submittedAt: Date.now(),
  };

  // Save to localStorage
  const existing = JSON.parse(localStorage.getItem('dc_claims') || '[]');
  existing.unshift(claim);
  localStorage.setItem('dc_claims', JSON.stringify(existing));

  // Show success
  document.getElementById('panel3').style.display = 'none';
  document.getElementById('stepIndicator').style.display = 'none';

  const success = document.getElementById('successState');
  success.style.display = 'block';
  document.getElementById('successRef').textContent = 'Claim Reference: ' + ref;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Track claim ───────────────────────────────────────────────

function trackClaim() {
  const ref = document.getElementById('trackRef').value.trim().toUpperCase();
  const result = document.getElementById('trackResult');

  if (!ref) {
    result.style.display = 'none';
    alert('Please enter a claim reference number.');
    return;
  }

  const claims = JSON.parse(localStorage.getItem('dc_claims') || '[]');
  const claim = claims.find(c => c.ref.toUpperCase() === ref);

  result.style.display = 'block';

  if (!claim) {
    result.innerHTML = `<div class="reimb-track-not-found">
      <i class="fas fa-circle-xmark"></i>
      No claim found for reference <strong>${ref}</strong>. Please check the number and try again.
    </div>`;
    return;
  }

  const statusConfig = {
    submitted:  { icon: 'fa-paper-plane', label: 'Claim Submitted', msg: 'Our team is reviewing your documents. We\'ll call you shortly.' },
    processing: { icon: 'fa-spinner',     label: 'Under Processing', msg: 'Your claim has been filed with the insurer / TPA.' },
    approved:   { icon: 'fa-circle-check', label: 'Claim Approved!', msg: 'Your reimbursement has been approved. Amount will be credited within 5–7 days.' },
    rejected:   { icon: 'fa-circle-xmark', label: 'Claim Rejected', msg: 'Your claim was rejected. Call us to understand and file an appeal.' },
  };

  const cfg = statusConfig[claim.status] || statusConfig.submitted;

  result.innerHTML = `
    <div class="reimb-track-status ${claim.status}">
      <div class="reimb-track-status-icon"><i class="fas ${cfg.icon}"></i></div>
      <div>
        <div class="reimb-track-status-ref">${claim.ref} · ${claim.hospital} · ₹${parseInt(claim.claimAmount).toLocaleString('en-IN')}</div>
        <div class="reimb-track-status-label">${cfg.label}</div>
        <div class="reimb-track-status-msg">${cfg.msg}</div>
      </div>
    </div>
  `;
}

// ── FAQ accordion ─────────────────────────────────────────────

function toggleFaq(btn) {
  const item = btn.closest('.reimb-faq-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.reimb-faq-item.open').forEach(i => i.classList.remove('open'));

  if (!isOpen) item.classList.add('open');
}

// ── Shake keyframe (injected once) ───────────────────────────

(function injectShake() {
  if (document.getElementById('shake-style')) return;
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = `
    @keyframes shake {
      0%,100%{ transform:translateX(0); }
      20%    { transform:translateX(-6px); }
      40%    { transform:translateX(6px); }
      60%    { transform:translateX(-4px); }
      80%    { transform:translateX(4px); }
    }
  `;
  document.head.appendChild(style);
}());
