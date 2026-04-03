/* Dr. Cashless — search.js */

/* ==============================
   DATA
   ============================== */

const STATES = [
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

// Flat city list per state (no district step)
const CITIES_BY_STATE = {
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

const DISTRICTS = {
  up: [
    { id: 'banda',      name: 'Banda' },
    { id: 'kanpur',     name: 'Kanpur' },
    { id: 'lucknow',    name: 'Lucknow' },
    { id: 'prayagraj',  name: 'Prayagraj' },
    { id: 'varanasi',   name: 'Varanasi' },
    { id: 'agra',       name: 'Agra' },
    { id: 'gorakhpur',  name: 'Gorakhpur' },
    { id: 'mathura',    name: 'Mathura' },
    { id: 'meerut',     name: 'Meerut' },
    { id: 'bareilly',   name: 'Bareilly' },
  ],
  delhi: [
    { id: 'south-delhi',   name: 'South Delhi' },
    { id: 'north-delhi',   name: 'North Delhi' },
    { id: 'central-delhi', name: 'Central Delhi' },
    { id: 'east-delhi',    name: 'East Delhi' },
    { id: 'west-delhi',    name: 'West Delhi' },
    { id: 'new-delhi',     name: 'New Delhi' },
  ],
  mh: [
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'pune',   name: 'Pune' },
    { id: 'nagpur', name: 'Nagpur' },
    { id: 'nashik', name: 'Nashik' },
    { id: 'thane',  name: 'Thane' },
  ],
  rj: [
    { id: 'jaipur',  name: 'Jaipur' },
    { id: 'jodhpur', name: 'Jodhpur' },
    { id: 'udaipur', name: 'Udaipur' },
    { id: 'kota',    name: 'Kota' },
  ],
  mp: [
    { id: 'bhopal',    name: 'Bhopal' },
    { id: 'indore',    name: 'Indore' },
    { id: 'gwalior',   name: 'Gwalior' },
    { id: 'jabalpur',  name: 'Jabalpur' },
  ],
  hr: [
    { id: 'gurgaon',   name: 'Gurgaon' },
    { id: 'faridabad', name: 'Faridabad' },
    { id: 'ambala',    name: 'Ambala' },
    { id: 'rohtak',    name: 'Rohtak' },
  ],
  wb: [
    { id: 'kolkata',     name: 'Kolkata' },
    { id: 'howrah',      name: 'Howrah' },
    { id: 'darjeeling',  name: 'Darjeeling' },
  ],
  tn: [
    { id: 'chennai',  name: 'Chennai' },
    { id: 'coimbatore', name: 'Coimbatore' },
    { id: 'madurai',  name: 'Madurai' },
  ],
  ka: [
    { id: 'bengaluru', name: 'Bengaluru' },
    { id: 'mysuru',    name: 'Mysuru' },
    { id: 'hubli',     name: 'Hubli-Dharwad' },
  ],
  gj: [
    { id: 'ahmedabad', name: 'Ahmedabad' },
    { id: 'surat',     name: 'Surat' },
    { id: 'vadodara',  name: 'Vadodara' },
  ],
  pb: [
    { id: 'amritsar',  name: 'Amritsar' },
    { id: 'ludhiana',  name: 'Ludhiana' },
    { id: 'jalandhar', name: 'Jalandhar' },
  ],
  br: [
    { id: 'patna',   name: 'Patna' },
    { id: 'gaya',    name: 'Gaya' },
    { id: 'muzaffarpur', name: 'Muzaffarpur' },
  ],
};

const CITIES = {
  // UP
  banda:      [{ id: 'banda-city', name: 'Banda City' }, { id: 'naraini', name: 'Naraini' }],
  kanpur:     [{ id: 'kanpur-nagar', name: 'Kanpur Nagar' }, { id: 'kanpur-dehat', name: 'Kanpur Dehat' }],
  lucknow:    [{ id: 'lucknow-city', name: 'Lucknow City' }, { id: 'gomtinagar', name: 'Gomti Nagar' }, { id: 'hazratganj', name: 'Hazratganj' }],
  prayagraj:  [{ id: 'civil-lines', name: 'Civil Lines' }, { id: 'naini', name: 'Naini' }],
  varanasi:   [{ id: 'varanasi-city', name: 'Varanasi City' }, { id: 'lanka', name: 'Lanka' }],
  agra:       [{ id: 'agra-city', name: 'Agra City' }, { id: 'fatehabad', name: 'Fatehabad' }],
  gorakhpur:  [{ id: 'gorakhpur-city', name: 'Gorakhpur City' }, { id: 'pipraich', name: 'Pipraich' }],
  mathura:    [{ id: 'mathura-city', name: 'Mathura City' }, { id: 'vrindavan', name: 'Vrindavan' }],
  meerut:     [{ id: 'meerut-city', name: 'Meerut City' }, { id: 'hapur', name: 'Hapur' }],
  bareilly:   [{ id: 'bareilly-city', name: 'Bareilly City' }, { id: 'faridpur', name: 'Faridpur' }],
  // Delhi
  'south-delhi':   [{ id: 'saket', name: 'Saket' }, { id: 'hauz-khas', name: 'Hauz Khas' }, { id: 'malviya-nagar', name: 'Malviya Nagar' }],
  'north-delhi':   [{ id: 'model-town', name: 'Model Town' }, { id: 'civil-lines-delhi', name: 'Civil Lines' }],
  'central-delhi': [{ id: 'connaught-place', name: 'Connaught Place' }, { id: 'karol-bagh', name: 'Karol Bagh' }],
  'east-delhi':    [{ id: 'preet-vihar', name: 'Preet Vihar' }, { id: 'laxmi-nagar', name: 'Laxmi Nagar' }],
  'west-delhi':    [{ id: 'janakpuri', name: 'Janakpuri' }, { id: 'dwarka', name: 'Dwarka' }],
  'new-delhi':     [{ id: 'new-delhi-centre', name: 'New Delhi Centre' }, { id: 'patel-nagar', name: 'Patel Nagar' }],
  // MH
  mumbai:  [{ id: 'andheri', name: 'Andheri' }, { id: 'bandra', name: 'Bandra' }, { id: 'dadar', name: 'Dadar' }],
  pune:    [{ id: 'shivajinagar', name: 'Shivajinagar' }, { id: 'kothrud', name: 'Kothrud' }],
  nagpur:  [{ id: 'nagpur-city', name: 'Nagpur City' }, { id: 'sitabuldi', name: 'Sitabuldi' }],
  nashik:  [{ id: 'nashik-city', name: 'Nashik City' }, { id: 'deolali', name: 'Deolali' }],
  thane:   [{ id: 'thane-city', name: 'Thane City' }, { id: 'kalyan', name: 'Kalyan' }],
  // RJ
  jaipur:  [{ id: 'jaipur-city', name: 'Jaipur City' }, { id: 'sanganer', name: 'Sanganer' }],
  jodhpur: [{ id: 'jodhpur-city', name: 'Jodhpur City' }, { id: 'sojat', name: 'Sojat' }],
  udaipur: [{ id: 'udaipur-city', name: 'Udaipur City' }, { id: 'mavli', name: 'Mavli' }],
  kota:    [{ id: 'kota-city', name: 'Kota City' }, { id: 'ladpura', name: 'Ladpura' }],
  // MP
  bhopal:   [{ id: 'bhopal-city', name: 'Bhopal City' }, { id: 'berasia', name: 'Berasia' }],
  indore:   [{ id: 'indore-city', name: 'Indore City' }, { id: 'depalpur', name: 'Depalpur' }],
  gwalior:  [{ id: 'gwalior-city', name: 'Gwalior City' }, { id: 'lashkar', name: 'Lashkar' }],
  jabalpur: [{ id: 'jabalpur-city', name: 'Jabalpur City' }, { id: 'katni', name: 'Katni' }],
  // HR
  gurgaon:   [{ id: 'gurgaon-city', name: 'Gurgaon City' }, { id: 'sohna', name: 'Sohna' }, { id: 'manesar', name: 'Manesar' }],
  faridabad: [{ id: 'faridabad-city', name: 'Faridabad City' }, { id: 'ballabhgarh', name: 'Ballabhgarh' }],
  ambala:    [{ id: 'ambala-city', name: 'Ambala City' }, { id: 'ambala-cantonment', name: 'Ambala Cantonment' }],
  rohtak:    [{ id: 'rohtak-city', name: 'Rohtak City' }, { id: 'meham', name: 'Meham' }],
  // WB
  kolkata:    [{ id: 'kolkata-city', name: 'Kolkata City' }, { id: 'park-street', name: 'Park Street' }],
  howrah:     [{ id: 'howrah-city', name: 'Howrah City' }, { id: 'shibpur', name: 'Shibpur' }],
  darjeeling: [{ id: 'darjeeling-town', name: 'Darjeeling Town' }, { id: 'kurseong', name: 'Kurseong' }],
  // TN
  chennai:    [{ id: 'chennai-city', name: 'Chennai City' }, { id: 'adyar', name: 'Adyar' }, { id: 'anna-nagar', name: 'Anna Nagar' }],
  coimbatore: [{ id: 'coimbatore-city', name: 'Coimbatore City' }, { id: 'peelamedu', name: 'Peelamedu' }],
  madurai:    [{ id: 'madurai-city', name: 'Madurai City' }, { id: 'villapuram', name: 'Villapuram' }],
  // KA
  bengaluru: [{ id: 'koramangala', name: 'Koramangala' }, { id: 'indiranagar', name: 'Indiranagar' }, { id: 'whitefield', name: 'Whitefield' }],
  mysuru:    [{ id: 'mysuru-city', name: 'Mysuru City' }, { id: 'nanjangud', name: 'Nanjangud' }],
  hubli:     [{ id: 'hubli-city', name: 'Hubli City' }, { id: 'dharwad', name: 'Dharwad' }],
  // GJ
  ahmedabad: [{ id: 'ahmedabad-city', name: 'Ahmedabad City' }, { id: 'naranpura', name: 'Naranpura' }],
  surat:     [{ id: 'surat-city', name: 'Surat City' }, { id: 'katargam', name: 'Katargam' }],
  vadodara:  [{ id: 'vadodara-city', name: 'Vadodara City' }, { id: 'manjalpur', name: 'Manjalpur' }],
  // PB
  amritsar:  [{ id: 'amritsar-city', name: 'Amritsar City' }, { id: 'batala', name: 'Batala' }],
  ludhiana:  [{ id: 'ludhiana-city', name: 'Ludhiana City' }, { id: 'khanna', name: 'Khanna' }],
  jalandhar: [{ id: 'jalandhar-city', name: 'Jalandhar City' }, { id: 'phagwara', name: 'Phagwara' }],
  // BR
  patna:        [{ id: 'patna-city', name: 'Patna City' }, { id: 'danapur', name: 'Danapur' }],
  gaya:         [{ id: 'gaya-city', name: 'Gaya City' }, { id: 'bodhgaya', name: 'Bodh Gaya' }],
  muzaffarpur:  [{ id: 'muzaffarpur-city', name: 'Muzaffarpur City' }, { id: 'kanti', name: 'Kanti' }],
};

// tpas: [] = in-house settlement (no TPA dropdown needed)
const INSURERS = [
  { id: 'star',      name: 'Star Health Insurance',   tpas: [] },
  { id: 'hdfc',      name: 'HDFC Ergo Health',        tpas: [] },
  { id: 'care',      name: 'Care Health Insurance',   tpas: [] },
  { id: 'aditya',    name: 'Aditya Birla Health',     tpas: [] },
  { id: 'niva',      name: 'Niva Bupa',               tpas: [] },
  { id: 'new-india', name: 'New India Assurance',     tpas: ['medi-assist', 'paramount', 'health-india', 'fhpl', 'good-health'] },
  { id: 'united',    name: 'United India Insurance',  tpas: ['medi-assist', 'health-india', 'md-india', 'raksha'] },
  { id: 'oriental',  name: 'Oriental Insurance',      tpas: ['medi-assist', 'vipul', 'ericson', 'dedicated'] },
  { id: 'national',  name: 'National Insurance',      tpas: ['medi-assist', 'health-india', 'vipul', 'raksha', 'fhpl'] },
  { id: 'icici',     name: 'ICICI Lombard',           tpas: ['medi-assist', 'md-india'] },
  { id: 'bajaj',     name: 'Bajaj Allianz',           tpas: ['medi-assist', 'paramount', 'vipul'] },
  { id: 'sbi',       name: 'SBI General',             tpas: ['medi-assist', 'fhpl', 'dedicated'] },
  { id: 'tata',      name: 'Tata AIG',                tpas: ['medi-assist', 'paramount', 'ericson'] },
  { id: 'future',    name: 'Future Generali',         tpas: ['health-india', 'vipul', 'good-health'] },
  { id: 'iffco',     name: 'IFFCO Tokio',             tpas: ['medi-assist', 'paramount', 'health-india', 'raksha'] },
];

const TPAS = [
  { id: 'medi-assist',   name: 'Medi Assist' },
  { id: 'paramount',     name: 'Paramount Health' },
  { id: 'health-india',  name: 'Health India TPA' },
  { id: 'vipul',         name: 'Vipul MedCorp' },
  { id: 'md-india',      name: 'MD India' },
  { id: 'raksha',        name: 'Raksha Health' },
  { id: 'ericson',       name: 'Ericson TPA' },
  { id: 'fhpl',          name: 'FHPL' },
  { id: 'good-health',   name: 'Good Health TPA' },
  { id: 'dedicated',     name: 'Dedicated Healthcare' },
];

const HOSPITALS = [
  {
    id: 1,
    name: 'Banda Medical Centre',
    state: 'up', district: 'banda', city: 'banda-city',
    address: 'Civil Lines, Banda, Uttar Pradesh 210001',
    phone: '+919026320900',
    type: 'multi', typeLabel: 'Multi-Speciality',
    beds: 150,
    specialties: ['Orthopaedics', 'General Surgery', 'Gynaecology', 'Paediatrics', 'Medicine'],
    insurers: ['star', 'new-india', 'united', 'oriental', 'national'],
    tpa: ['medi-assist', 'health-india', 'vipul'],
    rating: 4.3,
  },
  {
    id: 2,
    name: 'Shri Vinayak Hospital',
    state: 'up', district: 'banda', city: 'banda-city',
    address: 'Rajapur Road, Banda, Uttar Pradesh 210001',
    phone: '+919026320900',
    type: 'multi', typeLabel: 'Multi-Speciality',
    beds: 80,
    specialties: ['General Medicine', 'Gynaecology', 'ENT', 'Dermatology'],
    insurers: ['star', 'hdfc', 'icici', 'bajaj'],
    tpa: ['medi-assist', 'paramount'],
    rating: 4.1,
  },
  {
    id: 3,
    name: 'Regency Hospital Kanpur',
    state: 'up', district: 'kanpur', city: 'kanpur-nagar',
    address: 'A-2, Sarvodaya Nagar, Kanpur 208005',
    phone: '+919026320900',
    type: 'super', typeLabel: 'Super-Speciality',
    beds: 350,
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopaedics', 'Transplants', 'Nephrology'],
    insurers: ['star', 'hdfc', 'new-india', 'icici', 'bajaj', 'care', 'niva'],
    tpa: ['medi-assist', 'md-india', 'good-health', 'vipul'],
    rating: 4.6,
  },
  {
    id: 4,
    name: 'Sahara Hospital Lucknow',
    state: 'up', district: 'lucknow', city: 'lucknow-city',
    address: 'Viraj Khand, Gomti Nagar, Lucknow 226010',
    phone: '+919026320900',
    type: 'super', typeLabel: 'Super-Speciality',
    beds: 500,
    specialties: ['Cardiac Sciences', 'Neurosciences', 'Oncology', 'Bone & Joint', 'Gastroenterology'],
    insurers: ['star', 'hdfc', 'new-india', 'united', 'oriental', 'icici', 'bajaj', 'care', 'aditya', 'niva'],
    tpa: ['medi-assist', 'paramount', 'health-india', 'md-india', 'good-health'],
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Ram Manohar Lohia Hospital',
    state: 'up', district: 'lucknow', city: 'hazratganj',
    address: 'Vibhuti Khand, Gomti Nagar, Lucknow 226010',
    phone: '+919026320900',
    type: 'govt', typeLabel: 'Government Hospital',
    beds: 1000,
    specialties: ['General Medicine', 'Surgery', 'Gynaecology', 'Paediatrics', 'Orthopaedics', 'ENT'],
    insurers: ['new-india', 'united', 'oriental', 'national', 'sbi'],
    tpa: ['health-india', 'raksha', 'fhpl'],
    rating: 3.9,
  },
  {
    id: 6,
    name: 'Heritage Hospitals Varanasi',
    state: 'up', district: 'varanasi', city: 'varanasi-city',
    address: 'Mahmoorganj, Varanasi 221010',
    phone: '+919026320900',
    type: 'multi', typeLabel: 'Multi-Speciality',
    beds: 200,
    specialties: ['Cardiology', 'General Surgery', 'Orthopaedics', 'Gynaecology', 'Paediatrics'],
    insurers: ['star', 'hdfc', 'new-india', 'icici', 'tata', 'future'],
    tpa: ['medi-assist', 'vipul', 'ericson'],
    rating: 4.4,
  },
  {
    id: 7,
    name: 'Kamla Nehru Memorial Hospital',
    state: 'up', district: 'prayagraj', city: 'civil-lines',
    address: 'Civil Lines, Prayagraj 211001',
    phone: '+919026320900',
    type: 'govt', typeLabel: 'Government Hospital',
    beds: 600,
    specialties: ['General Medicine', 'Surgery', 'Paediatrics', 'Gynaecology', 'Psychiatry'],
    insurers: ['new-india', 'united', 'oriental', 'national'],
    tpa: ['health-india', 'fhpl', 'dedicated'],
    rating: 3.8,
  },
  {
    id: 8,
    name: 'Max Super Speciality Hospital Saket',
    state: 'delhi', district: 'south-delhi', city: 'saket',
    address: 'Press Enclave Road, Saket, New Delhi 110017',
    phone: '+919026320900',
    type: 'super', typeLabel: 'Super-Speciality',
    beds: 500,
    specialties: ['Cardiac Sciences', 'Neurosciences', 'Oncology', 'Orthopaedics', 'Renal Sciences', 'Transplants'],
    insurers: ['star', 'hdfc', 'new-india', 'icici', 'bajaj', 'care', 'aditya', 'niva', 'tata'],
    tpa: ['medi-assist', 'paramount', 'md-india', 'good-health', 'vipul'],
    rating: 4.8,
  },
  {
    id: 9,
    name: 'Fortis Escorts Heart Institute',
    state: 'delhi', district: 'south-delhi', city: 'saket',
    address: 'Okhla Road, New Delhi 110025',
    phone: '+919026320900',
    type: 'super', typeLabel: 'Super-Speciality',
    beds: 310,
    specialties: ['Cardiology', 'Cardiac Surgery', 'Electrophysiology', 'Vascular Surgery', 'Pulmonology'],
    insurers: ['star', 'hdfc', 'new-india', 'united', 'icici', 'bajaj', 'care', 'niva', 'iffco'],
    tpa: ['medi-assist', 'paramount', 'health-india', 'vipul', 'dedicated'],
    rating: 4.9,
  },
  {
    id: 10,
    name: 'AIIMS New Delhi',
    state: 'delhi', district: 'new-delhi', city: 'new-delhi-centre',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    phone: '+919026320900',
    type: 'govt', typeLabel: 'Government Hospital',
    beds: 2478,
    specialties: ['All Specialities', 'Research', 'Trauma', 'Burns', 'Oncology', 'Neurosciences'],
    insurers: ['new-india', 'united', 'oriental', 'national', 'sbi', 'iffco'],
    tpa: ['health-india', 'fhpl', 'raksha', 'dedicated'],
    rating: 4.5,
  },
  {
    id: 11,
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    state: 'mh', district: 'mumbai', city: 'andheri',
    address: 'Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai 400053',
    phone: '+919026320900',
    type: 'super', typeLabel: 'Super-Speciality',
    beds: 750,
    specialties: ['Robotic Surgery', 'Oncology', 'Cardiology', 'Neurology', 'Orthopaedics', 'Transplants'],
    insurers: ['star', 'hdfc', 'new-india', 'icici', 'bajaj', 'care', 'aditya', 'niva', 'tata', 'future'],
    tpa: ['medi-assist', 'paramount', 'vipul', 'md-india', 'good-health'],
    rating: 4.8,
  },
  {
    id: 12,
    name: 'Lilavati Hospital Mumbai',
    state: 'mh', district: 'mumbai', city: 'bandra',
    address: 'A-791, Bandra Reclamation, Bandra West, Mumbai 400050',
    phone: '+919026320900',
    type: 'multi', typeLabel: 'Multi-Speciality',
    beds: 323,
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Gastroenterology', 'Pulmonology'],
    insurers: ['star', 'hdfc', 'icici', 'bajaj', 'care', 'aditya', 'niva'],
    tpa: ['medi-assist', 'paramount', 'good-health'],
    rating: 4.6,
  },
  {
    id: 13,
    name: 'Ruby Hall Clinic Pune',
    state: 'mh', district: 'pune', city: 'shivajinagar',
    address: '40 Sassoon Road, Pune 411001',
    phone: '+919026320900',
    type: 'multi', typeLabel: 'Multi-Speciality',
    beds: 430,
    specialties: ['Cardiology', 'Orthopaedics', 'Neurology', 'Oncology', 'Gynaecology'],
    insurers: ['star', 'hdfc', 'new-india', 'icici', 'bajaj', 'care', 'tata'],
    tpa: ['medi-assist', 'md-india', 'vipul', 'ericson'],
    rating: 4.5,
  },
  {
    id: 14,
    name: 'Medanta — The Medicity Gurgaon',
    state: 'hr', district: 'gurgaon', city: 'gurgaon-city',
    address: 'CH Baktawar Singh Road, Sector 38, Gurugram 122001',
    phone: '+919026320900',
    type: 'super', typeLabel: 'Super-Speciality',
    beds: 1250,
    specialties: ['Cardiac Sciences', 'Neurosciences', 'Oncology', 'Transplants', 'Orthopaedics', 'Gastroenterology'],
    insurers: ['star', 'hdfc', 'new-india', 'united', 'icici', 'bajaj', 'care', 'aditya', 'niva', 'tata', 'future'],
    tpa: ['medi-assist', 'paramount', 'health-india', 'vipul', 'md-india', 'good-health'],
    rating: 4.9,
  },
  {
    id: 15,
    name: 'Artemis Hospital Gurgaon',
    state: 'hr', district: 'gurgaon', city: 'gurgaon-city',
    address: 'Sector 51, Gurugram 122001',
    phone: '+919026320900',
    type: 'super', typeLabel: 'Super-Speciality',
    beds: 400,
    specialties: ['Cardiac Sciences', 'Neurology', 'Oncology', 'Orthopaedics', 'Renal Sciences'],
    insurers: ['star', 'hdfc', 'new-india', 'icici', 'bajaj', 'care', 'niva', 'sbi'],
    tpa: ['medi-assist', 'paramount', 'vipul', 'md-india'],
    rating: 4.7,
  },
  {
    id: 16,
    name: 'Manipal Hospital Bengaluru',
    state: 'ka', district: 'bengaluru', city: 'indiranagar',
    address: '98, HAL Airport Road, Kodihalli, Bengaluru 560017',
    phone: '+919026320900',
    type: 'super', typeLabel: 'Super-Speciality',
    beds: 600,
    specialties: ['Cardiac Sciences', 'Oncology', 'Neurosciences', 'Transplants', 'Orthopaedics', 'Gastroenterology'],
    insurers: ['star', 'hdfc', 'new-india', 'icici', 'bajaj', 'care', 'aditya', 'niva', 'tata'],
    tpa: ['medi-assist', 'paramount', 'vipul', 'good-health', 'md-india'],
    rating: 4.7,
  },
];


/* ==============================
   DOM REFS
   ============================== */
const stateSelect    = document.getElementById('stateSelect');
const citySelect     = document.getElementById('citySelect');
const insurerSelect  = document.getElementById('insurerSelect');
const tpaSelect      = document.getElementById('tpaSelect');
const tpaWrap        = document.getElementById('tpaWrap');
const searchBtn      = document.getElementById('searchBtn');
const resetBtn       = document.getElementById('resetBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsCount   = document.getElementById('resultsCount');
const resultsLocation = document.getElementById('resultsLocation');
const resultsGrid    = document.getElementById('resultsGrid');
const noResults      = document.getElementById('noResults');


/* ==============================
   POPULATE SELECTS ON LOAD
   ============================== */
function populateSelect(selectEl, items, defaultLabel) {
  selectEl.innerHTML = `<option value="">${defaultLabel}</option>`;
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.name;
    selectEl.appendChild(opt);
  });
}

(function init() {
  populateSelect(stateSelect, STATES, 'Select State');
  populateSelect(insurerSelect, INSURERS, 'All Insurance Companies');
})();


/* ==============================
   CASCADE: STATE → CITY
   ============================== */
stateSelect.addEventListener('change', function () {
  const stateId = this.value;
  citySelect.innerHTML = '<option value="">Select City</option>';
  citySelect.disabled = true;
  if (stateId && CITIES_BY_STATE[stateId]) {
    populateSelect(citySelect, CITIES_BY_STATE[stateId], 'Select City');
    citySelect.disabled = false;
  }
});


/* ==============================
   INSURER → SHOW/HIDE TPA
   ============================== */
insurerSelect.addEventListener('change', function () {
  const insurer = INSURERS.find(i => i.id === this.value);
  if (insurer && insurer.tpas.length > 0) {
    const tpaItems = TPAS.filter(t => insurer.tpas.includes(t.id));
    populateSelect(tpaSelect, tpaItems, 'All TPAs');
    tpaWrap.style.display = '';
  } else {
    tpaSelect.value = '';
    tpaWrap.style.display = 'none';
  }
});


/* ==============================
   SEARCH LOGIC
   ============================== */
searchBtn.addEventListener('click', function () {
  const stateVal    = stateSelect.value;
  const cityVal     = citySelect.value;
  const insurerVal  = insurerSelect.value;
  const tpaVal      = tpaSelect.value;

  let filtered = HOSPITALS.filter(h => {
    if (stateVal    && h.state    !== stateVal)    return false;
    if (cityVal     && h.city     !== cityVal)     return false;
    if (insurerVal  && !h.insurers.includes(insurerVal)) return false;
    if (tpaVal      && !h.tpa.includes(tpaVal))   return false;
    return true;
  });

  // Build location label for results header
  const locationParts = [];
  if (cityVal)          locationParts.push(getLabel(CITIES_BY_STATE[stateVal] || [], cityVal));
  else if (stateVal)    locationParts.push(getLabel(STATES, stateVal));
  if (insurerVal)  locationParts.push(getLabel(INSURERS, insurerVal));
  if (tpaVal)      locationParts.push(getLabel(TPAS, tpaVal));
  const locationText = locationParts.filter(Boolean).join(' · ');

  // Show results section
  resultsSection.classList.add('visible');

  if (filtered.length === 0) {
    resultsCount.textContent = 'No Hospitals Found';
    resultsLocation.textContent = locationText || 'All India';
    resultsGrid.innerHTML = '';
    noResults.classList.add('visible');
  } else {
    resultsCount.textContent = filtered.length + (filtered.length === 1 ? ' Hospital Found' : ' Hospitals Found');
    resultsLocation.textContent = locationText || 'All India';
    noResults.classList.remove('visible');
    resultsGrid.innerHTML = filtered.map(renderHospitalCard).join('');
  }

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


/* ==============================
   RESET
   ============================== */
resetBtn.addEventListener('click', function () {
  stateSelect.value = '';
  citySelect.innerHTML = '<option value="">Select City</option>';
  citySelect.disabled = true;
  populateSelect(insurerSelect, INSURERS, 'All Insurance Companies');
  insurerSelect.value = '';
  tpaSelect.value = '';
  tpaWrap.style.display = 'none';
  resultsSection.classList.remove('visible');
  noResults.classList.remove('visible');
  resultsGrid.innerHTML = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ==============================
   HELPER: get label by id
   ============================== */
function getLabel(arr, id) {
  const item = arr.find(i => i.id === id);
  return item ? item.name : '';
}


/* ==============================
   RENDER HOSPITAL CARD
   ============================== */
function renderHospitalCard(h) {
  // Specialties: show 3, then +N more
  const specShow = h.specialties.slice(0, 3);
  const specMore = h.specialties.length - 3;
  const specHTML = specShow.map(s => `<span class="spec-tag">${s}</span>`).join('') +
    (specMore > 0 ? `<span class="spec-tag spec-tag--more">+${specMore} more</span>` : '');

  // Insurers: show 4, then +N more
  const insNames = h.insurers.map(id => getLabel(INSURERS, id)).filter(Boolean);
  const insShow  = insNames.slice(0, 4);
  const insMore  = insNames.length - 4;
  const insHTML  = insShow.map(n => `<span class="insurer-tag">${n}</span>`).join('') +
    (insMore > 0 ? `<span class="insurer-tag insurer-tag--more">+${insMore} more</span>` : '');

  // Rating stars
  const ratingHTML = `<span class="hosp-rating"><i class="fas fa-star"></i> ${h.rating.toFixed(1)}</span>`;

  return `
    <div class="hosp-card">
      <span class="hosp-type-badge badge--${h.type}">
        <i class="fas fa-${h.type === 'super' ? 'star' : h.type === 'govt' ? 'landmark' : 'building-columns'}"></i>
        ${h.typeLabel}
      </span>

      <div class="hosp-card-top">
        <div class="hosp-name">${h.name}</div>
        ${ratingHTML}
      </div>

      <div class="hosp-address">
        <i class="fas fa-location-dot"></i>
        <span>${h.address}</span>
      </div>

      <div class="spec-tags">${specHTML}</div>

      <div class="hosp-insurers-row">
        <div class="hosp-insurers-label">Accepted Insurers</div>
        <div class="insurer-tags">${insHTML}</div>
      </div>

      <div class="hosp-meta">
        <div class="hosp-meta-item">
          <i class="fas fa-bed"></i>
          <span>${h.beds} Beds</span>
        </div>
        <div class="hosp-meta-item">
          <i class="fas fa-phone"></i>
          <span>${h.phone}</span>
        </div>
      </div>

      <a href="tel:+919026320900" class="hosp-help-btn">
        <i class="fas fa-phone"></i> Get Cashless Help
      </a>
    </div>
  `;
}
