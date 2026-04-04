/* Dr. Cashless — coverage.js */

/* ==============================
   DATA
   ============================== */
const INSURERS_DATA = [
  {
    id: 'star',
    name: 'Star Health Insurance',
    type: 'private',
    settle: 'inhouse',
    settleLabel: 'In-house Settlement',
    sumOptions: ['₹3L', '₹5L', '₹10L', '₹15L', '₹25L', '₹50L+'],
    claimRatio: '99%',
    networkHospitals: '14,000+',
    daycareProcedures: '541+',
    plans: [
      { id: 'star-comp', name: 'Star Comprehensive' },
      { id: 'star-family', name: 'Star Family Health Optima' },
      { id: 'star-senior', name: 'Star Senior Citizens Red Carpet' },
      { id: 'star-young', name: 'Star Young Star' },
    ],
    highlights: ['No room rent sub-limit', 'Automatic restore benefit', 'OPD cover available', 'No pre-policy medical test up to 50 yrs'],
  },
  {
    id: 'hdfc',
    name: 'HDFC Ergo Health',
    type: 'private',
    settle: 'inhouse',
    settleLabel: 'In-house Settlement',
    sumOptions: ['₹3L', '₹5L', '₹10L', '₹15L', '₹25L', '₹50L+'],
    claimRatio: '98%',
    networkHospitals: '13,000+',
    daycareProcedures: '586+',
    plans: [
      { id: 'hdfc-optima', name: 'Optima Restore' },
      { id: 'hdfc-my', name: 'My:health Suraksha' },
      { id: 'hdfc-critical', name: 'Critical Illness Plan' },
    ],
    highlights: ['100% restore of sum insured', 'Earn healthy discount up to 20%', 'Unlimited e-consultation', 'Global cover add-on available'],
  },
  {
    id: 'care',
    name: 'Care Health Insurance',
    type: 'private',
    settle: 'inhouse',
    settleLabel: 'In-house Settlement',
    sumOptions: ['₹4L', '₹7L', '₹10L', '₹15L', '₹40L', '₹75L+'],
    claimRatio: '95.2%',
    networkHospitals: '24,800+',
    daycareProcedures: '540+',
    plans: [
      { id: 'care-plan', name: 'Care Plan' },
      { id: 'care-freedom', name: 'Care Freedom (Diabetic)' },
      { id: 'care-senior', name: 'Care Senior' },
    ],
    highlights: ['Largest hospital network in India', 'Unlimited restoration', 'Care anywhere — international cover', 'No claim bonus up to 150%'],
  },
  {
    id: 'niva',
    name: 'Niva Bupa',
    type: 'private',
    settle: 'inhouse',
    settleLabel: 'In-house Settlement',
    sumOptions: ['₹3L', '₹5L', '₹10L', '₹15L', '₹25L', '₹1Cr+'],
    claimRatio: '91.6%',
    networkHospitals: '10,000+',
    daycareProcedures: '550+',
    plans: [
      { id: 'niva-reassure', name: 'ReAssure 2.0' },
      { id: 'niva-health', name: 'Health Companion' },
      { id: 'niva-senior', name: 'Senior First' },
    ],
    highlights: ['Guaranteed annual bonus up to 100%', 'Lock-in room category', 'Direct claim settlement', 'Mental health cover included'],
  },
  {
    id: 'aditya',
    name: 'Aditya Birla Health',
    type: 'private',
    settle: 'inhouse',
    settleLabel: 'In-house Settlement',
    sumOptions: ['₹2L', '₹5L', '₹10L', '₹25L', '₹50L', '₹2Cr+'],
    claimRatio: '95%',
    networkHospitals: '11,000+',
    daycareProcedures: '586+',
    plans: [
      { id: 'ab-activ', name: 'Activ Health Platinum' },
      { id: 'ab-secure', name: 'Activ Secure' },
      { id: 'ab-one', name: 'Activ One' },
    ],
    highlights: ['Healthy returns — earn back premium', 'Chronic disease management', 'Up to 100% premium back for staying healthy', 'Mental wellness sessions'],
  },
  {
    id: 'new-india',
    name: 'New India Assurance',
    type: 'govt',
    settle: 'tpa',
    settleLabel: 'Via TPA',
    sumOptions: ['₹1L', '₹2L', '₹3L', '₹5L', '₹8L', '₹15L'],
    claimRatio: '106%',
    networkHospitals: '8,500+',
    daycareProcedures: '140+',
    plans: [
      { id: 'ni-mediclaim', name: 'New India Mediclaim 2012' },
      { id: 'ni-floater', name: 'New India Floater Mediclaim' },
      { id: 'ni-senior', name: 'New India Senior Citizen Mediclaim' },
    ],
    highlights: ['Govt-backed trusted insurer', 'Low premium rates', 'AYUSH treatment covered', 'Pre-existing diseases covered after 4 years'],
  },
  {
    id: 'united',
    name: 'United India Insurance',
    type: 'govt',
    settle: 'tpa',
    settleLabel: 'Via TPA',
    sumOptions: ['₹1L', '₹2L', '₹3L', '₹5L', '₹10L', '₹15L'],
    claimRatio: '110%',
    networkHospitals: '7,000+',
    daycareProcedures: '120+',
    plans: [
      { id: 'ui-individual', name: 'United Individual Mediclaim' },
      { id: 'ui-gold', name: 'United Gold Mediclaim' },
      { id: 'ui-super', name: 'United Super Top-Up' },
    ],
    highlights: ['Affordable govt insurer', 'Family floater available', 'Maternity benefit available', 'Critical illness cover available'],
  },
  {
    id: 'icici',
    name: 'ICICI Lombard',
    type: 'private',
    settle: 'tpa',
    settleLabel: 'Via TPA / In-house',
    sumOptions: ['₹3L', '₹5L', '₹10L', '₹25L', '₹50L', '₹1Cr+'],
    claimRatio: '97.9%',
    networkHospitals: '12,500+',
    daycareProcedures: '540+',
    plans: [
      { id: 'icici-health', name: 'Health Booster' },
      { id: 'icici-elevate', name: 'Elevate' },
      { id: 'icici-golden', name: 'Golden Shield' },
    ],
    highlights: ['Instant cashless approval', 'Wellness rewards', 'OPD cover in select plans', 'Cancer-specific plan available'],
  },
  {
    id: 'bajaj',
    name: 'Bajaj Allianz',
    type: 'private',
    settle: 'tpa',
    settleLabel: 'Via TPA / In-house',
    sumOptions: ['₹1.5L', '₹3L', '₹5L', '₹10L', '₹50L', '₹1Cr+'],
    claimRatio: '98.5%',
    networkHospitals: '18,400+',
    daycareProcedures: '586+',
    plans: [
      { id: 'bajaj-health', name: 'Health Guard' },
      { id: 'bajaj-star', name: 'Star Package' },
      { id: 'bajaj-global', name: 'Global Health Care' },
    ],
    highlights: ['Largest cashless hospital network', 'In-patient OPD cover', 'Cancer/cardiac specific plans', 'Renewal bonus up to 200%'],
  },
];

/* Treatment coverage data by dept + treatment */
const TREATMENTS_BY_DEPT = {
  ortho: {
    label: 'Orthopaedics',
    treatments: [
      { id: 'knee-replacement', name: 'Knee Replacement' },
      { id: 'hip-replacement',  name: 'Hip Replacement' },
      { id: 'fracture',         name: 'Fracture / Trauma' },
      { id: 'spine-surgery',    name: 'Spine Surgery' },
      { id: 'joint-pain-opd',   name: 'Joint Pain OPD' },
    ],
  },
  cardio: {
    label: 'Cardiology',
    treatments: [
      { id: 'angioplasty',   name: 'Angioplasty / Stenting' },
      { id: 'bypass',        name: 'Bypass Surgery (CABG)' },
      { id: 'angiography',   name: 'Angiography' },
      { id: 'pacemaker',     name: 'Pacemaker Implantation' },
      { id: 'heart-valve',   name: 'Heart Valve Surgery' },
    ],
  },
  neuro: {
    label: 'Neurology',
    treatments: [
      { id: 'brain-surgery',    name: 'Brain Surgery / Craniotomy' },
      { id: 'stroke-treatment', name: 'Stroke Treatment' },
      { id: 'epilepsy-surg',    name: 'Epilepsy Surgery' },
      { id: 'spinal-cord',      name: 'Spinal Cord Surgery' },
    ],
  },
  onco: {
    label: 'Oncology',
    treatments: [
      { id: 'chemotherapy', name: 'Chemotherapy' },
      { id: 'radiation',    name: 'Radiation Therapy' },
      { id: 'tumour-surg',  name: 'Tumour Removal Surgery' },
      { id: 'immunotherapy',name: 'Immunotherapy' },
    ],
  },
  gynae: {
    label: 'Gynaecology',
    treatments: [
      { id: 'normal-delivery',   name: 'Normal Delivery' },
      { id: 'c-section',         name: 'Caesarean Section (C-Section)' },
      { id: 'hysterectomy',      name: 'Hysterectomy' },
      { id: 'fibroid-removal',   name: 'Fibroid Removal' },
      { id: 'ivf',               name: 'IVF / Infertility Treatment' },
    ],
  },
  gastro: {
    label: 'Gastroenterology',
    treatments: [
      { id: 'appendectomy',   name: 'Appendectomy' },
      { id: 'gallbladder-lap',name: 'Gallbladder Removal (Lap)' },
      { id: 'hernia-repair',  name: 'Hernia Repair' },
      { id: 'liver-transplant', name: 'Liver Transplant' },
      { id: 'colonoscopy',    name: 'Colonoscopy / Endoscopy' },
    ],
  },
  ent: {
    label: 'ENT',
    treatments: [
      { id: 'tonsillectomy', name: 'Tonsillectomy' },
      { id: 'sinus-surgery', name: 'Sinus Surgery (FESS)' },
      { id: 'cochlear',      name: 'Cochlear Implant' },
      { id: 'septoplasty',   name: 'Septoplasty' },
    ],
  },
  ophthal: {
    label: 'Ophthalmology',
    treatments: [
      { id: 'cataract-surg', name: 'Cataract Surgery' },
      { id: 'lasik',         name: 'LASIK Surgery' },
      { id: 'retinal-surg',  name: 'Retinal Detachment Surgery' },
      { id: 'glaucoma-surg', name: 'Glaucoma Surgery' },
    ],
  },
  nephro: {
    label: 'Nephrology',
    treatments: [
      { id: 'dialysis',         name: 'Dialysis (per session)' },
      { id: 'kidney-transplant',name: 'Kidney Transplant' },
      { id: 'kidney-stone-surg',name: 'Kidney Stone Surgery (PCNL/URS)' },
    ],
  },
  'gen-surgery': {
    label: 'General Surgery',
    treatments: [
      { id: 'piles-surgery',  name: 'Piles / Fistula Surgery' },
      { id: 'varicose-surg',  name: 'Varicose Vein Surgery' },
      { id: 'lipoma-removal', name: 'Lipoma / Cyst Removal' },
      { id: 'thyroid-surg',   name: 'Thyroid Surgery' },
    ],
  },
};

/* Coverage result templates */
const COVERAGE_DB = {
  _default: {
    status: 'covered',
    statusTitle: 'Covered under your policy',
    statusSub: 'This treatment is covered under standard health insurance plans. Subject to sum insured and waiting periods.',
    details: [
      { label: 'Cover Type',       val: 'Cashless / Reimbursement' },
      { label: 'Room Category',    val: 'Shared / Single (plan-based)' },
      { label: 'Pre-hospitalisation',  val: '30–60 days' },
      { label: 'Post-hospitalisation', val: '60–90 days' },
    ],
    covered: [
      'In-patient hospitalisation charges',
      'Doctor/surgeon consultation fees',
      'OT charges & anaesthesia',
      'Medicines & consumables during stay',
      'ICU charges (if required)',
      'Diagnostic tests & lab charges',
      'Ambulance charges',
    ],
    notCovered: [
      'OPD/outpatient visits (unless rider)',
      'Personal comfort items (TV, phone)',
      'Attendant charges',
      'Non-prescribed medicines',
    ],
    waitingPeriod: 'Standard 30-day initial waiting period applies. Pre-existing disease waiting period of 2–4 years may apply depending on your policy.',
  },
  ivf: {
    status: 'partial',
    statusTitle: 'Partially / Rarely Covered',
    statusSub: 'IVF and infertility treatments are excluded in most standard plans. A few insurers offer it as an optional rider.',
    details: [
      { label: 'Cover Type',    val: 'Rider / Add-on Only' },
      { label: 'Insurers',      val: 'Niva Bupa, HDFC Ergo (select plans)' },
      { label: 'Max Limit',     val: '₹50,000 – ₹1,50,000' },
      { label: 'Waiting Period',val: '2–3 years' },
    ],
    covered: [
      'IVF treatment (if rider purchased)',
      'Related diagnostic tests (some insurers)',
      'Hospitalisation for egg retrieval',
    ],
    notCovered: [
      'IVF in most standard plans',
      'Donor egg/sperm cost',
      'Multiple IVF cycles',
      'Freezing of embryos',
      'Surrogacy arrangements',
    ],
    waitingPeriod: 'Infertility treatments generally have a waiting period of 2–3 years even in plans that cover them. Contact your insurer to confirm.',
  },
  lasik: {
    status: 'uncovered',
    statusTitle: 'Not Covered in Standard Plans',
    statusSub: 'LASIK for refractive error correction is excluded by most insurers as it is considered an elective/cosmetic procedure.',
    details: [
      { label: 'Cover Type',    val: 'Excluded' },
      { label: 'Exception',     val: 'Post-trauma / medical necessity' },
      { label: 'Alternatives',  val: 'Retinal surgery, Glaucoma — covered' },
      { label: 'Advice',        val: 'Specific eye rider needed' },
    ],
    covered: [
      'Retinal detachment surgery',
      'Glaucoma treatment & surgery',
      'Cataract surgery (covered fully)',
      'LASIK post trauma/accident (some insurers)',
    ],
    notCovered: [
      'LASIK for refractive error (myopia/hyperopia)',
      'Spectacles & contact lenses',
      'Cosmetic eye surgery',
      'Routine eye check-ups',
    ],
    waitingPeriod: 'Not applicable — procedure is generally excluded regardless of waiting period.',
  },
  dialysis: {
    status: 'covered',
    statusTitle: 'Covered — with per-session limits',
    statusSub: 'Dialysis is covered under most health insurance plans, often with a per-session limit.',
    details: [
      { label: 'Cover Type',       val: 'In-patient + Daycare' },
      { label: 'Per Session Limit',val: '₹1,000 – ₹2,500' },
      { label: 'Annual Sessions',  val: 'Up to 52–104 sessions/year' },
      { label: 'Pre-existing',     val: 'After 2–4 year waiting period' },
    ],
    covered: [
      'Haemodialysis (in-patient & daycare)',
      'Peritoneal dialysis',
      'Dialysis equipment charges (in-patient)',
      'Related medication during session',
      'Nephrologist consultation',
    ],
    notCovered: [
      'Home dialysis equipment purchase',
      'First 2–4 years if CKD is pre-existing',
      'Transport to dialysis centre',
    ],
    waitingPeriod: 'If CKD is a pre-existing condition, dialysis claims will be admitted only after the waiting period (usually 2–4 years) lapses.',
  },
  chemotherapy: {
    status: 'covered',
    statusTitle: 'Covered — including daycare sessions',
    statusSub: 'Chemotherapy is covered as a daycare procedure in almost all comprehensive health insurance plans.',
    details: [
      { label: 'Cover Type',        val: 'Daycare + In-patient' },
      { label: 'Sub-limit',         val: 'No sub-limit in most plans' },
      { label: 'Related Cover',     val: 'Radiation, immunotherapy' },
      { label: 'Waiting Period',    val: '90-day initial waiting period' },
    ],
    covered: [
      'Chemotherapy drugs & infusion charges',
      'Radiation therapy sessions',
      'Targeted therapy & immunotherapy',
      'Surgeon/oncologist fees',
      'Pre & post-hospitalisation (30/90 days)',
      'ICU stay if required',
    ],
    notCovered: [
      'Experimental / clinical trial drugs',
      'Nutritional supplements',
      'Cosmetic side-effect treatments',
      'Cancer screening tests (OPD)',
    ],
    waitingPeriod: '90-day initial waiting period for cancer claims in most plans. Some plans have a 30-day waiting period.',
  },
};

function getCoverageResult(treatmentId) {
  return COVERAGE_DB[treatmentId] || COVERAGE_DB._default;
}


/* ==============================
   DOM REFS
   ============================== */
const covInsurer   = document.getElementById('covInsurer');
const covPlan      = document.getElementById('covPlan');
const covDept      = document.getElementById('covDept');
const covTreatment = document.getElementById('covTreatment');
const checkBtn     = document.getElementById('checkBtn');
const covResult    = document.getElementById('covResult');
const insurerGrid  = document.getElementById('insurerGrid');


/* ==============================
   HELPERS
   ============================== */
function populateSel(el, items, label) {
  el.innerHTML = `<option value="">${label}</option>`;
  items.forEach(i => {
    const o = document.createElement('option');
    o.value = i.id; o.textContent = i.name;
    el.appendChild(o);
  });
}


/* ==============================
   INIT
   ============================== */
(function init() {
  populateSel(covInsurer, INSURERS_DATA, 'Select Insurer');
  const depts = Object.entries(TREATMENTS_BY_DEPT).map(([id, d]) => ({ id, name: d.label }));
  populateSel(covDept, depts, 'Select Department');
  buildInsurerGrid();
})();


/* ==============================
   INSURER → PLAN
   ============================== */
covInsurer.addEventListener('change', function () {
  const ins = INSURERS_DATA.find(i => i.id === this.value);
  if (ins) {
    populateSel(covPlan, ins.plans, 'Select Plan Type');
    covPlan.disabled = false;
  } else {
    covPlan.innerHTML = '<option value="">Select Plan Type</option>';
    covPlan.disabled = true;
  }
});


/* ==============================
   DEPT → TREATMENT
   ============================== */
covDept.addEventListener('change', function () {
  const dept = TREATMENTS_BY_DEPT[this.value];
  if (dept) {
    populateSel(covTreatment, dept.treatments, 'Select Treatment');
    covTreatment.disabled = false;
  } else {
    covTreatment.innerHTML = '<option value="">Select Treatment</option>';
    covTreatment.disabled = true;
  }
});


/* ==============================
   CHECK COVERAGE
   ============================== */
checkBtn.addEventListener('click', function () {
  if (!covInsurer.value || !covDept.value || !covTreatment.value) {
    if (!covInsurer.value)   covInsurer.style.outline   = '2px solid #ef4444';
    if (!covDept.value)      covDept.style.outline      = '2px solid #ef4444';
    if (!covTreatment.value) covTreatment.style.outline = '2px solid #ef4444';
    setTimeout(() => {
      covInsurer.style.outline = covDept.style.outline = covTreatment.style.outline = '';
    }, 2000);
    return;
  }

  const ins    = INSURERS_DATA.find(i => i.id === covInsurer.value);
  const result = getCoverageResult(covTreatment.value);
  const planName = covPlan.value
    ? ins.plans.find(p => p.id === covPlan.value)?.name || ''
    : '';

  renderResult(result, ins, planName);

  covResult.style.display = '';
  covResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


/* ==============================
   RENDER RESULT
   ============================== */
function renderResult(r, ins, planName) {
  // Status
  const statusEl = document.getElementById('covStatus');
  statusEl.className = 'cov-status ' + r.status;
  const icons = { covered: 'fa-circle-check', partial: 'fa-circle-exclamation', uncovered: 'fa-circle-xmark' };
  document.getElementById('covStatusIcon').innerHTML = `<i class="fas ${icons[r.status]}"></i>`;
  document.getElementById('covStatusTitle').textContent = r.statusTitle;
  document.getElementById('covStatusSub').innerHTML =
    `<strong>${ins.name}${planName ? ' — ' + planName : ''}</strong> &nbsp;·&nbsp; ${r.statusSub}`;

  // Detail cards
  const detailsData = [
    ...r.details,
    { label: 'Claim Ratio',        val: ins.claimRatio },
    { label: 'Network Hospitals',  val: ins.networkHospitals },
  ];
  document.getElementById('covDetailsGrid').innerHTML = detailsData.map(d => `
    <div class="cov-detail-card">
      <div class="cov-detail-val">${d.val}</div>
      <div class="cov-detail-label">${d.label}</div>
    </div>
  `).join('');

  // Covered / not covered
  const coveredList    = r.covered.map(c => `<div class="cov-list-item"><i class="fas fa-check yes"></i>${c}</div>`).join('');
  const notCoveredList = r.notCovered.map(c => `<div class="cov-list-item"><i class="fas fa-xmark no"></i>${c}</div>`).join('');
  document.getElementById('covLists').innerHTML = `
    <div class="cov-list-card">
      <div class="cov-list-title yes"><i class="fas fa-circle-check"></i> What's Covered</div>
      ${coveredList}
    </div>
    <div class="cov-list-card">
      <div class="cov-list-title no"><i class="fas fa-circle-xmark"></i> Not Covered</div>
      ${notCoveredList}
    </div>
  `;

  // Waiting period
  document.getElementById('covWaiting').innerHTML = `
    <i class="fas fa-clock"></i>
    <div><strong>Waiting Period:</strong> ${r.waitingPeriod}</div>
  `;
}


/* ==============================
   INSURER GRID
   ============================== */
function buildInsurerGrid() {
  insurerGrid.innerHTML = INSURERS_DATA.map(ins => `
    <div class="cov-insurer-card">
      <div class="cov-insurer-head">
        <div class="cov-insurer-name">${ins.name}</div>
        <span class="cov-insurer-type ${ins.type}">${ins.type === 'govt' ? 'Govt' : 'Private'}</span>
      </div>
      <div class="cov-insurer-pills">
        ${ins.sumOptions.map(s => `<span class="cov-insurer-pill">${s}</span>`).join('')}
      </div>
      <div class="cov-insurer-meta">
        <div class="cov-insurer-meta-row">
          <span class="cov-insurer-meta-label">Claim Settlement Ratio</span>
          <span class="cov-insurer-meta-val">${ins.claimRatio}</span>
        </div>
        <div class="cov-insurer-meta-row">
          <span class="cov-insurer-meta-label">Network Hospitals</span>
          <span class="cov-insurer-meta-val">${ins.networkHospitals}</span>
        </div>
        <div class="cov-insurer-meta-row">
          <span class="cov-insurer-meta-label">Daycare Procedures</span>
          <span class="cov-insurer-meta-val">${ins.daycareProcedures}</span>
        </div>
      </div>
      <div class="cov-insurer-settle ${ins.settle}">
        <i class="fas ${ins.settle === 'inhouse' ? 'fa-building' : 'fa-handshake'}"></i>
        ${ins.settleLabel}
      </div>
    </div>
  `).join('');
}
