/* Dr. Cashless — opd.js */

/* ==============================
   SHARED DATA (inline from search)
   ============================== */
const OPD_STATES = [
  { id: 'up',    name: 'Uttar Pradesh' },
  { id: 'delhi', name: 'Delhi' },
  { id: 'mh',    name: 'Maharashtra' },
  { id: 'rj',    name: 'Rajasthan' },
  { id: 'mp',    name: 'Madhya Pradesh' },
  { id: 'hr',    name: 'Haryana' },
  { id: 'wb',    name: 'West Bengal' },
  { id: 'tn',    name: 'Tamil Nadu' },
  { id: 'ka',    name: 'Karnataka' },
  { id: 'gj',    name: 'Gujarat' },
  { id: 'pb',    name: 'Punjab' },
  { id: 'br',    name: 'Bihar' },
];

const OPD_CITIES = {
  up:    [{ id: 'banda-city', name: 'Banda' }, { id: 'kanpur-nagar', name: 'Kanpur' }, { id: 'lucknow-city', name: 'Lucknow' }, { id: 'civil-lines', name: 'Prayagraj' }, { id: 'varanasi-city', name: 'Varanasi' }, { id: 'agra-city', name: 'Agra' }, { id: 'gorakhpur-city', name: 'Gorakhpur' }, { id: 'meerut-city', name: 'Meerut' }, { id: 'bareilly-city', name: 'Bareilly' }],
  delhi: [{ id: 'saket', name: 'South Delhi' }, { id: 'new-delhi-centre', name: 'New Delhi' }, { id: 'connaught-place', name: 'Central Delhi' }, { id: 'model-town', name: 'North Delhi' }, { id: 'preet-vihar', name: 'East Delhi' }, { id: 'janakpuri', name: 'West Delhi' }],
  mh:    [{ id: 'andheri', name: 'Mumbai' }, { id: 'bandra', name: 'Bandra' }, { id: 'shivajinagar', name: 'Pune' }, { id: 'nagpur-city', name: 'Nagpur' }, { id: 'nashik-city', name: 'Nashik' }, { id: 'thane-city', name: 'Thane' }],
  rj:    [{ id: 'jaipur-city', name: 'Jaipur' }, { id: 'jodhpur-city', name: 'Jodhpur' }, { id: 'udaipur-city', name: 'Udaipur' }, { id: 'kota-city', name: 'Kota' }],
  mp:    [{ id: 'bhopal-city', name: 'Bhopal' }, { id: 'indore-city', name: 'Indore' }, { id: 'gwalior-city', name: 'Gwalior' }, { id: 'jabalpur-city', name: 'Jabalpur' }],
  hr:    [{ id: 'gurgaon-city', name: 'Gurgaon' }, { id: 'faridabad-city', name: 'Faridabad' }, { id: 'ambala-city', name: 'Ambala' }, { id: 'rohtak-city', name: 'Rohtak' }],
  wb:    [{ id: 'kolkata-city', name: 'Kolkata' }, { id: 'howrah-city', name: 'Howrah' }, { id: 'darjeeling-town', name: 'Darjeeling' }],
  tn:    [{ id: 'chennai-city', name: 'Chennai' }, { id: 'coimbatore-city', name: 'Coimbatore' }, { id: 'madurai-city', name: 'Madurai' }],
  ka:    [{ id: 'koramangala', name: 'Bengaluru' }, { id: 'mysuru-city', name: 'Mysuru' }, { id: 'hubli-city', name: 'Hubli' }],
  gj:    [{ id: 'ahmedabad-city', name: 'Ahmedabad' }, { id: 'surat-city', name: 'Surat' }, { id: 'vadodara-city', name: 'Vadodara' }],
  pb:    [{ id: 'amritsar-city', name: 'Amritsar' }, { id: 'ludhiana-city', name: 'Ludhiana' }, { id: 'jalandhar-city', name: 'Jalandhar' }],
  br:    [{ id: 'patna-city', name: 'Patna' }, { id: 'gaya-city', name: 'Gaya' }, { id: 'muzaffarpur-city', name: 'Muzaffarpur' }],
};

const OPD_DEPARTMENTS = [
  { id: 'ortho',       name: 'Orthopaedics' },
  { id: 'cardio',      name: 'Cardiology' },
  { id: 'neuro',       name: 'Neurology' },
  { id: 'gastro',      name: 'Gastroenterology' },
  { id: 'onco',        name: 'Oncology' },
  { id: 'gynae',       name: 'Gynaecology' },
  { id: 'paeds',       name: 'Paediatrics' },
  { id: 'ent',         name: 'ENT' },
  { id: 'ophthal',     name: 'Ophthalmology' },
  { id: 'derma',       name: 'Dermatology' },
  { id: 'nephro',      name: 'Nephrology' },
  { id: 'pulmo',       name: 'Pulmonology' },
  { id: 'urology',     name: 'Urology' },
  { id: 'psych',       name: 'Psychiatry' },
  { id: 'gen-surgery', name: 'General Surgery' },
  { id: 'gen-med',     name: 'General Medicine' },
];

const OPD_COMPLAINTS = {
  ortho:       [{ id: 'knee-pain', name: 'Knee Pain / Knee Replacement' }, { id: 'hip-replacement', name: 'Hip Replacement' }, { id: 'back-pain', name: 'Back & Spine Pain' }, { id: 'fracture', name: 'Fracture / Trauma' }, { id: 'joint-pain', name: 'Joint Pain / Arthritis' }, { id: 'sports-injury', name: 'Sports Injury' }, { id: 'slip-disc', name: 'Slip Disc / Sciatica' }, { id: 'shoulder-pain', name: 'Shoulder Pain' }],
  cardio:      [{ id: 'chest-pain', name: 'Chest Pain / Angina' }, { id: 'heart-attack', name: 'Heart Attack (MI)' }, { id: 'angioplasty', name: 'Angioplasty / Stenting' }, { id: 'bypass', name: 'Bypass Surgery (CABG)' }, { id: 'arrhythmia', name: 'Arrhythmia / Palpitations' }, { id: 'heart-failure', name: 'Heart Failure' }, { id: 'valve-disease', name: 'Valve Disease' }, { id: 'hypertension', name: 'High Blood Pressure' }],
  neuro:       [{ id: 'stroke', name: 'Stroke / Paralysis' }, { id: 'epilepsy', name: 'Epilepsy / Seizures' }, { id: 'migraine', name: 'Migraine / Chronic Headache' }, { id: 'brain-tumour', name: 'Brain Tumour' }, { id: 'parkinsons', name: "Parkinson's Disease" }, { id: 'nerve-pain', name: 'Nerve Pain / Neuropathy' }, { id: 'memory-loss', name: 'Memory Loss / Dementia' }, { id: 'spine-neuro', name: 'Spinal Cord Issues' }],
  gastro:      [{ id: 'acidity', name: 'Acidity / GERD' }, { id: 'liver-disease', name: 'Liver Disease / Hepatitis' }, { id: 'gallstones', name: 'Gallstones / Cholecystitis' }, { id: 'appendix', name: 'Appendicitis' }, { id: 'ibs', name: "IBS / Crohn's Disease" }, { id: 'hernia', name: 'Hernia' }, { id: 'pancreatitis', name: 'Pancreatitis' }, { id: 'colonoscopy', name: 'Colonoscopy / Endoscopy' }],
  onco:        [{ id: 'breast-cancer', name: 'Breast Cancer' }, { id: 'lung-cancer', name: 'Lung Cancer' }, { id: 'prostate-cancer', name: 'Prostate Cancer' }, { id: 'blood-cancer', name: 'Blood Cancer / Leukaemia' }, { id: 'cervical-cancer', name: 'Cervical Cancer' }, { id: 'colon-cancer', name: 'Colon / Rectal Cancer' }, { id: 'chemo', name: 'Chemotherapy / Radiation' }, { id: 'oral-cancer', name: 'Oral / Throat Cancer' }],
  gynae:       [{ id: 'delivery', name: 'Normal / C-Section Delivery' }, { id: 'fibroid', name: 'Fibroid / Myomectomy' }, { id: 'hysterectomy', name: 'Hysterectomy' }, { id: 'pcos', name: 'PCOS / Hormonal Issues' }, { id: 'infertility', name: 'Infertility / IVF' }, { id: 'ectopic', name: 'Ectopic Pregnancy' }, { id: 'menstrual', name: 'Menstrual Disorders' }, { id: 'ovarian-cyst', name: 'Ovarian Cyst' }],
  paeds:       [{ id: 'fever', name: 'High Fever / Infections' }, { id: 'pneumonia', name: 'Pneumonia / Respiratory' }, { id: 'vaccination', name: 'Vaccination / Growth Check' }, { id: 'jaundice-baby', name: 'Neonatal Jaundice' }, { id: 'diarrhoea', name: 'Diarrhoea / Dehydration' }, { id: 'malnutrition', name: 'Malnutrition / Growth Issues' }, { id: 'paeds-surgery', name: 'Paediatric Surgery' }, { id: 'asthma-child', name: 'Childhood Asthma' }],
  ent:         [{ id: 'tonsils', name: 'Tonsillitis / Tonsillectomy' }, { id: 'hearing-loss', name: 'Hearing Loss' }, { id: 'sinusitis', name: 'Sinusitis / Nasal Polyps' }, { id: 'vertigo', name: 'Vertigo / Dizziness' }, { id: 'adenoids', name: 'Adenoids' }, { id: 'ear-infection', name: 'Ear Infection / Discharge' }, { id: 'voice-issues', name: 'Voice / Throat Problems' }, { id: 'nose-bleed', name: 'Nose Bleed / Deviated Septum' }],
  ophthal:     [{ id: 'cataract', name: 'Cataract Surgery' }, { id: 'lasik', name: 'LASIK / Refractive Surgery' }, { id: 'glaucoma', name: 'Glaucoma' }, { id: 'retina', name: 'Retinal Detachment / Macular' }, { id: 'diabetic-eye', name: 'Diabetic Retinopathy' }, { id: 'squint', name: 'Squint / Strabismus' }, { id: 'cornea', name: 'Corneal Disorder / Transplant' }, { id: 'dry-eyes', name: 'Dry Eyes / Conjunctivitis' }],
  derma:       [{ id: 'psoriasis', name: 'Psoriasis' }, { id: 'eczema', name: 'Eczema / Dermatitis' }, { id: 'acne', name: 'Acne / Pigmentation' }, { id: 'hair-loss', name: 'Hair Loss / Alopecia' }, { id: 'skin-allergy', name: 'Skin Allergy / Urticaria' }, { id: 'vitiligo', name: 'Vitiligo' }, { id: 'fungal', name: 'Fungal Infection' }, { id: 'skin-biopsy', name: 'Skin Biopsy / Mole Removal' }],
  nephro:      [{ id: 'kidney-stones', name: 'Kidney Stones' }, { id: 'ckd', name: 'Chronic Kidney Disease (CKD)' }, { id: 'dialysis', name: 'Dialysis' }, { id: 'kidney-transplant', name: 'Kidney Transplant' }, { id: 'uti', name: 'Urinary Tract Infection (UTI)' }, { id: 'nephrotic', name: 'Nephrotic Syndrome' }, { id: 'renal-failure', name: 'Acute Renal Failure' }],
  pulmo:       [{ id: 'asthma', name: 'Asthma' }, { id: 'copd', name: 'COPD / Bronchitis' }, { id: 'tb', name: 'Tuberculosis (TB)' }, { id: 'pneumonia-adult', name: 'Pneumonia' }, { id: 'sleep-apnea', name: 'Sleep Apnea' }, { id: 'pleural', name: 'Pleural Effusion' }, { id: 'ild', name: 'Interstitial Lung Disease (ILD)' }, { id: 'lung-infection', name: 'Lung Infection / Bronchiectasis' }],
  urology:     [{ id: 'prostate', name: 'Prostate Enlargement / BPH' }, { id: 'bladder', name: 'Bladder Issues / Incontinence' }, { id: 'kidney-stone-uro', name: 'Kidney / Ureteric Stones' }, { id: 'uti-uro', name: 'Recurrent UTI' }, { id: 'infertility-m', name: 'Male Infertility' }, { id: 'circumcision', name: 'Circumcision / Phimosis' }, { id: 'varicocele', name: 'Varicocele' }, { id: 'uro-cancer', name: 'Urological Cancer' }],
  psych:       [{ id: 'depression', name: 'Depression / Anxiety' }, { id: 'schizophrenia', name: 'Schizophrenia' }, { id: 'bipolar', name: 'Bipolar Disorder' }, { id: 'addiction', name: 'De-addiction / Substance Abuse' }, { id: 'ocd', name: 'OCD' }, { id: 'ptsd', name: 'PTSD / Trauma' }, { id: 'sleep-disorder', name: 'Sleep Disorder / Insomnia' }, { id: 'eating-disorder', name: 'Eating Disorder' }],
  'gen-surgery': [{ id: 'appendix-surg', name: 'Appendicitis / Appendectomy' }, { id: 'hernia-surg', name: 'Hernia Repair' }, { id: 'gallbladder', name: 'Gallbladder Removal (Lap)' }, { id: 'piles', name: 'Piles / Fistula / Fissure' }, { id: 'varicose', name: 'Varicose Veins' }, { id: 'wound', name: 'Wound / Abscess / Trauma' }, { id: 'lipoma', name: 'Lipoma / Cyst Removal' }, { id: 'thyroid-surg', name: 'Thyroid Surgery' }],
  'gen-med':   [{ id: 'diabetes', name: 'Diabetes Management' }, { id: 'typhoid', name: 'Typhoid / Viral Fever' }, { id: 'dengue', name: 'Dengue / Malaria' }, { id: 'anaemia', name: 'Anaemia' }, { id: 'thyroid', name: 'Thyroid Disorder' }, { id: 'jaundice', name: 'Jaundice / Liver Issues' }, { id: 'bp', name: 'Blood Pressure / Hypertension' }, { id: 'general-checkup', name: 'General Health Check-up' }],
};

const SLOTS = {
  am:  ['8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  pm:  ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM'],
  eve: ['4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'],
};

/* Hospital list — mirrors search.js, keyed by city id */
const OPD_HOSPITALS = [
  { id: 1,  name: 'Banda Medical Centre',           city: 'banda-city',        address: 'Civil Lines, Banda, UP 210001',                    type: 'Multi-Speciality',  beds: 150 },
  { id: 2,  name: 'Shri Vinayak Hospital',           city: 'banda-city',        address: 'Rajapur Road, Banda, UP 210001',                   type: 'Multi-Speciality',  beds: 80  },
  { id: 3,  name: 'Regency Hospital',                city: 'kanpur-nagar',      address: 'A-2 Sarvodaya Nagar, Kanpur 208005',               type: 'Super-Speciality',  beds: 350 },
  { id: 4,  name: 'Sahara Hospital',                 city: 'lucknow-city',      address: 'Viraj Khand, Gomti Nagar, Lucknow 226010',         type: 'Super-Speciality',  beds: 500 },
  { id: 5,  name: 'Ram Manohar Lohia Hospital',      city: 'hazratganj',        address: 'Vibhuti Khand, Gomti Nagar, Lucknow 226010',       type: 'Government',        beds: 1000},
  { id: 6,  name: 'Heritage Hospitals',              city: 'varanasi-city',     address: 'Mahmoorganj, Varanasi 221010',                     type: 'Multi-Speciality',  beds: 200 },
  { id: 7,  name: 'Kamla Nehru Memorial Hospital',   city: 'civil-lines',       address: 'Civil Lines, Prayagraj 211001',                    type: 'Government',        beds: 600 },
  { id: 8,  name: 'Max Super Speciality Hospital',   city: 'saket',             address: 'Press Enclave Road, Saket, New Delhi 110017',      type: 'Super-Speciality',  beds: 500 },
  { id: 9,  name: 'Fortis Escorts Heart Institute',  city: 'saket',             address: 'Okhla Road, New Delhi 110025',                     type: 'Super-Speciality',  beds: 310 },
  { id: 10, name: 'AIIMS New Delhi',                 city: 'new-delhi-centre',  address: 'Sri Aurobindo Marg, New Delhi 110029',             type: 'Government',        beds: 2478},
  { id: 11, name: 'Kokilaben Dhirubhai Ambani Hosp', city: 'andheri',           address: 'Four Bungalows, Andheri West, Mumbai 400053',      type: 'Super-Speciality',  beds: 750 },
  { id: 12, name: 'Lilavati Hospital',               city: 'bandra',            address: 'A-791 Bandra Reclamation, Mumbai 400050',          type: 'Multi-Speciality',  beds: 323 },
  { id: 13, name: 'Ruby Hall Clinic',                city: 'shivajinagar',      address: '40 Sassoon Road, Pune 411001',                     type: 'Multi-Speciality',  beds: 450 },
  { id: 14, name: 'Medanta — The Medicity',          city: 'gurgaon-city',      address: 'Sector 38, Gurugram, Haryana 122001',              type: 'Super-Speciality',  beds: 1250},
  { id: 15, name: 'Artemis Hospital',                city: 'gurgaon-city',      address: 'Sector 51, Gurugram, Haryana 122001',              type: 'Super-Speciality',  beds: 400 },
  { id: 16, name: 'Fortis Memorial Research Inst.',  city: 'gurgaon-city',      address: 'Sector 44, Gurugram, Haryana 122002',              type: 'Super-Speciality',  beds: 310 },
  { id: 17, name: 'Apollo Hospitals Chennai',        city: 'chennai-city',      address: '21 Greams Lane, Off Greams Road, Chennai 600006',  type: 'Super-Speciality',  beds: 700 },
  { id: 18, name: 'Manipal Hospital Bengaluru',      city: 'koramangala',       address: '98 HAL Airport Road, Bengaluru 560017',            type: 'Super-Speciality',  beds: 600 },
  { id: 19, name: 'AMRI Hospital Kolkata',           city: 'kolkata-city',      address: 'JC-16 & 17 Salt Lake City, Kolkata 700098',        type: 'Multi-Speciality',  beds: 350 },
  { id: 20, name: 'PGIMER Chandigarh',               city: 'amritsar-city',     address: 'Sector 12, Chandigarh 160012',                     type: 'Government',        beds: 1960},
  { id: 21, name: 'Sterling Hospital Ahmedabad',     city: 'ahmedabad-city',    address: 'Sterling Hospital Rd, Memnagar, Ahmedabad 380052', type: 'Multi-Speciality',  beds: 300 },
  { id: 22, name: 'IGIMS Patna',                     city: 'patna-city',        address: 'Sheikhpura, Patna 800014',                         type: 'Government',        beds: 750 },
  { id: 23, name: 'SMS Hospital Jaipur',             city: 'jaipur-city',       address: 'JLN Marg, Jaipur 302004',                          type: 'Government',        beds: 2000},
  { id: 24, name: 'Bombay Hospital Indore',          city: 'indore-city',       address: 'Ring Road, Indore 452010',                         type: 'Multi-Speciality',  beds: 250 },
  { id: 25, name: 'Care Hospital Nagpur',            city: 'nagpur-city',       address: 'Jaripatka, Nagpur 440014',                         type: 'Multi-Speciality',  beds: 230 },
];


/* ==============================
   DOM REFS
   ============================== */
const opdState         = document.getElementById('opdState');
const opdCity          = document.getElementById('opdCity');
const opdHospital      = document.getElementById('opdHospital');
const hospitalCard     = document.getElementById('hospitalCard');
const opdDept          = document.getElementById('opdDept');
const opdComplaint     = document.getElementById('opdComplaint');
const opdComplaintWrap = document.getElementById('opdComplaintWrap');

const panel1         = document.getElementById('panel1');
const panel2         = document.getElementById('panel2');
const panel3         = document.getElementById('panel3');
const panelSuccess   = document.getElementById('panelSuccess');

const stepDot1       = document.getElementById('stepDot1');
const stepDot2       = document.getElementById('stepDot2');
const stepDot3       = document.getElementById('stepDot3');

const dateGrid       = document.getElementById('dateGrid');
const slotsAM        = document.getElementById('slotsAM');
const slotsPM        = document.getElementById('slotsPM');
const slotsEve       = document.getElementById('slotsEve');


/* ==============================
   BOOKING STATE
   ============================== */
let selectedDate = '';
let selectedSlot = '';


/* ==============================
   HELPERS
   ============================== */
function populateOpdSelect(el, items, label) {
  el.innerHTML = `<option value="">${label}</option>`;
  items.forEach(i => {
    const o = document.createElement('option');
    o.value = i.id; o.textContent = i.name;
    el.appendChild(o);
  });
}

function getLabel(arr, id) {
  const item = arr.find(i => i.id === id);
  return item ? item.name : '';
}

function markError(el) { el.classList.add('error'); }
function clearError(el) { el.classList.remove('error'); }

function showPanel(show) {
  [panel1, panel2, panel3, panelSuccess].forEach(p => p.style.display = 'none');
  show.style.display = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setStep(n) {
  [stepDot1, stepDot2, stepDot3].forEach((d, i) => {
    d.classList.remove('active', 'done');
    if (i + 1 < n)  d.classList.add('done');
    if (i + 1 === n) d.classList.add('active');
  });
  // update connecting lines
  document.querySelectorAll('.opd-step-line').forEach((l, i) => {
    l.classList.toggle('done', i + 1 < n);
  });
}


/* ==============================
   INIT
   ============================== */
(function init() {
  populateOpdSelect(opdState, OPD_STATES, 'Select State');
  populateOpdSelect(opdDept, OPD_DEPARTMENTS, 'Select Department');
  buildDateGrid();
  buildSlots();
})();


/* ==============================
   STATE → CITY
   ============================== */
opdState.addEventListener('change', function () {
  opdCity.innerHTML = '<option value="">Select City</option>';
  opdCity.disabled = true;
  opdHospital.innerHTML = '<option value="">No preference (we\'ll assign best hospital)</option>';
  opdHospital.disabled = false;
  hospitalCard.style.display = 'none';
  if (this.value && OPD_CITIES[this.value]) {
    populateOpdSelect(opdCity, OPD_CITIES[this.value], 'Select City');
    opdCity.disabled = false;
  }
  clearError(this);
});

opdCity.addEventListener('change', function () {
  clearError(this);
  const cityId = this.value;
  opdHospital.innerHTML = '<option value="">No preference (we\'ll assign best hospital)</option>';
  hospitalCard.style.display = 'none';
  if (!cityId) {
    opdHospital.disabled = false;
    return;
  }
  const matches = OPD_HOSPITALS.filter(h => h.city === cityId);
  matches.forEach(h => {
    const o = document.createElement('option');
    o.value = h.id;
    o.textContent = h.name;
    opdHospital.appendChild(o);
  });
  opdHospital.disabled = false;
});

opdHospital.addEventListener('change', function () {
  clearError(this);
  const h = OPD_HOSPITALS.find(x => x.id === +this.value);
  if (!h) { hospitalCard.style.display = 'none'; return; }
  hospitalCard.innerHTML = `
    <div class="hmc-name"><i class="fas fa-hospital-user"></i> ${h.name}</div>
    <div class="hmc-meta">${h.type} &nbsp;·&nbsp; ${h.beds} beds</div>
    <div class="hmc-addr"><i class="fas fa-location-dot"></i> ${h.address}</div>
  `;
  hospitalCard.style.display = '';
});


/* ==============================
   DEPT → COMPLAINT
   ============================== */
opdDept.addEventListener('change', function () {
  const deptId = this.value;
  clearError(this);
  if (deptId && OPD_COMPLAINTS[deptId]) {
    populateOpdSelect(opdComplaint, OPD_COMPLAINTS[deptId], 'Select Complaint');
    opdComplaintWrap.style.display = '';
  } else {
    opdComplaint.value = '';
    opdComplaintWrap.style.display = 'none';
  }
});


/* ==============================
   DATE GRID
   ============================== */
function buildDateGrid() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  dateGrid.innerHTML = '';
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const chip = document.createElement('div');
    chip.className = 'date-chip';
    chip.innerHTML = `
      <span class="date-chip-day">${days[d.getDay()]}</span>
      <span class="date-chip-num">${d.getDate()}</span>
      <span class="date-chip-mon">${months[d.getMonth()]}</span>
    `;
    const iso = d.toISOString().split('T')[0];
    chip.dataset.date = iso;
    chip.dataset.label = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
    chip.addEventListener('click', function () {
      dateGrid.querySelectorAll('.date-chip').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      selectedDate = this.dataset.label;
    });
    dateGrid.appendChild(chip);
  }
}


/* ==============================
   TIME SLOTS
   ============================== */
function buildSlots() {
  function render(container, times) {
    container.innerHTML = '';
    times.forEach(t => {
      const chip = document.createElement('div');
      chip.className = 'slot-chip';
      chip.textContent = t;
      chip.addEventListener('click', function () {
        document.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedSlot = t;
      });
      container.appendChild(chip);
    });
  }
  render(slotsAM,  SLOTS.am);
  render(slotsPM,  SLOTS.pm);
  render(slotsEve, SLOTS.eve);
}


/* ==============================
   STEP 1 → STEP 2
   ============================== */
document.getElementById('nextBtn1').addEventListener('click', function () {
  const name   = document.getElementById('patientName');
  const phone  = document.getElementById('patientPhone');
  const age    = document.getElementById('patientAge');
  const gender = document.getElementById('patientGender');

  let valid = true;

  [name, phone, age].forEach(el => {
    if (!el.value.trim()) { markError(el); valid = false; }
    else clearError(el);
  });
  if (!gender.value) { markError(gender); valid = false; } else clearError(gender);
  if (!opdState.value) { markError(opdState); valid = false; } else clearError(opdState);
  if (!opdDept.value)  { markError(opdDept);  valid = false; } else clearError(opdDept);

  if (phone.value && !/^\d{10}$/.test(phone.value.trim())) {
    markError(phone); valid = false;
  }

  if (!valid) return;

  setStep(2);
  showPanel(panel2);
});


/* ==============================
   STEP 2 → STEP 3
   ============================== */
document.getElementById('nextBtn2').addEventListener('click', function () {
  if (!selectedDate) {
    dateGrid.style.outline = '2px solid #e03e3e';
    dateGrid.style.borderRadius = '12px';
    return;
  }
  dateGrid.style.outline = '';
  if (!selectedSlot) {
    [slotsAM, slotsPM, slotsEve].forEach(s => {
      s.style.outline = '2px solid #e03e3e';
      s.style.borderRadius = '8px';
    });
    return;
  }
  [slotsAM, slotsPM, slotsEve].forEach(s => s.style.outline = '');

  // Populate confirm panel
  const name      = document.getElementById('patientName').value.trim();
  const phone     = document.getElementById('patientPhone').value.trim();
  const age       = document.getElementById('patientAge').value.trim();
  const gender    = document.getElementById('patientGender').value;
  const notes     = document.getElementById('patientNotes').value.trim();
  const deptName    = getLabel(OPD_DEPARTMENTS, opdDept.value);
  const complaint   = opdComplaint.value ? getLabel(OPD_COMPLAINTS[opdDept.value] || [], opdComplaint.value) : '';
  const stateName   = getLabel(OPD_STATES, opdState.value);
  const cityName    = opdCity.value ? getLabel(OPD_CITIES[opdState.value] || [], opdCity.value) : '';
  const location    = [cityName, stateName].filter(Boolean).join(', ');
  const hospitalObj = OPD_HOSPITALS.find(h => h.id === +opdHospital.value);
  const hospitalName = hospitalObj ? hospitalObj.name : '';

  document.getElementById('cName').textContent      = name;
  document.getElementById('cPhone').textContent     = '+91 ' + phone;
  document.getElementById('cAgeGender').textContent = `${age} yrs · ${gender.charAt(0).toUpperCase() + gender.slice(1)}`;
  document.getElementById('cDept').textContent      = deptName;
  document.getElementById('cHospital').textContent  = hospitalName || 'Not specified';
  document.getElementById('cLocation').textContent  = location || 'Not specified';
  document.getElementById('cDateTime').textContent  = `${selectedDate} · ${selectedSlot}`;

  const cComplaintRow = document.getElementById('cComplaintRow');
  const cNotesRow     = document.getElementById('cNotesRow');
  if (complaint) {
    document.getElementById('cComplaint').textContent = complaint;
    cComplaintRow.style.display = '';
  } else {
    cComplaintRow.style.display = 'none';
  }
  if (notes) {
    document.getElementById('cNotes').textContent = notes;
    cNotesRow.style.display = '';
  } else {
    cNotesRow.style.display = 'none';
  }

  setStep(3);
  showPanel(panel3);
});


/* ==============================
   BACK BUTTONS
   ============================== */
document.getElementById('backBtn1').addEventListener('click', function () {
  setStep(1);
  showPanel(panel1);
});
document.getElementById('backBtn2').addEventListener('click', function () {
  setStep(2);
  showPanel(panel2);
});


/* ==============================
   CONFIRM → SUCCESS
   ============================== */
document.getElementById('confirmBtn').addEventListener('click', function () {
  const name      = document.getElementById('patientName').value.trim();
  const phone     = document.getElementById('patientPhone').value.trim();
  const age       = document.getElementById('patientAge').value.trim();
  const gender    = document.getElementById('patientGender').value;
  const notes     = document.getElementById('patientNotes').value.trim();
  const deptName  = getLabel(OPD_DEPARTMENTS, opdDept.value);
  const complaint = opdComplaint.value ? getLabel(OPD_COMPLAINTS[opdDept.value] || [], opdComplaint.value) : '';
  const stateName = getLabel(OPD_STATES, opdState.value);
  const cityName  = opdCity.value ? getLabel(OPD_CITIES[opdState.value] || [], opdCity.value) : '';
  const location  = [cityName, stateName].filter(Boolean).join(', ');
  const hospitalObj  = OPD_HOSPITALS.find(h => h.id === +opdHospital.value);
  const hospitalName = hospitalObj ? hospitalObj.name : 'To be assigned';
  const ref = 'DC-OPD-' + Date.now().toString(36).toUpperCase().slice(-6);

  const appt = {
    ref, name, phone: '+91 ' + phone, age, gender,
    dept: deptName, complaint, notes,
    hospital: hospitalName, location,
    date: selectedDate, time: selectedSlot,
    status: 'upcoming',
    bookedAt: Date.now(),
  };

  // Save to API if available, else fallback to localStorage
  if (window.API_BASE) {
    window.apiCall('POST', '/api/appointments', {
      ref, name,
      phone: '+91 ' + phone,
      age: age || null,
      gender: gender || null,
      department: deptName,
      complaint,
      notes,
      hospital_id: hospitalObj ? hospitalObj.id : null,
      hospital_name: hospitalName,
      location,
      date: selectedDate,
      time: selectedSlot,
    }).catch(err => console.warn('API save failed, using localStorage:', err));
  }
  // Always save locally so My Appointments works offline too
  const existing = JSON.parse(localStorage.getItem('dc_appointments') || '[]');
  existing.unshift(appt);
  localStorage.setItem('dc_appointments', JSON.stringify(existing));

  document.getElementById('sName').textContent = name;
  document.getElementById('sRef').textContent  = 'Ref: ' + ref;

  // Hide step indicator on success
  document.getElementById('opdSteps').style.display = 'none';
  showPanel(panelSuccess);
});
