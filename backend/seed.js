/**
 * DR. CASHLESS — seed.js
 * Seeds states, cities, insurers, TPAs, and sample hospitals into the DB.
 * Run: node seed.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./db');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🌱 Seeding database...');

    // ── States ────────────────────────────────────────────────
    const states = [
      'Uttar Pradesh','Delhi','Maharashtra','Rajasthan','Madhya Pradesh',
      'Haryana','West Bengal','Tamil Nadu','Karnataka','Gujarat','Punjab','Bihar',
    ];
    const stateIds = {};
    for (const name of states) {
      const r = await client.query(
        `INSERT INTO states (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
        [name]
      );
      stateIds[name] = r.rows[0].id;
    }
    console.log(`  ✓ ${states.length} states`);

    // ── Cities ────────────────────────────────────────────────
    const citiesByState = {
      'Uttar Pradesh': ['Banda','Kanpur','Lucknow','Prayagraj','Varanasi','Agra','Gorakhpur','Meerut','Bareilly'],
      'Delhi':         ['South Delhi','New Delhi','Central Delhi','North Delhi','East Delhi','West Delhi'],
      'Maharashtra':   ['Mumbai','Pune','Nagpur','Nashik','Thane'],
      'Rajasthan':     ['Jaipur','Jodhpur','Udaipur','Kota'],
      'Madhya Pradesh':['Bhopal','Indore','Gwalior','Jabalpur'],
      'Haryana':       ['Gurgaon','Faridabad','Ambala','Rohtak'],
      'West Bengal':   ['Kolkata','Howrah','Darjeeling'],
      'Tamil Nadu':    ['Chennai','Coimbatore','Madurai'],
      'Karnataka':     ['Bengaluru','Mysuru','Hubli'],
      'Gujarat':       ['Ahmedabad','Surat','Vadodara'],
      'Punjab':        ['Amritsar','Ludhiana','Jalandhar'],
      'Bihar':         ['Patna','Gaya','Muzaffarpur'],
    };
    const cityIds = {}; // name → id
    let cityCount = 0;
    for (const [stateName, cities] of Object.entries(citiesByState)) {
      const sid = stateIds[stateName];
      for (const city of cities) {
        const r = await client.query(
          `INSERT INTO cities (name, state_id) VALUES ($1,$2)
           ON CONFLICT (name, state_id) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
          [city, sid]
        );
        cityIds[city] = r.rows[0].id;
        cityCount++;
      }
    }
    console.log(`  ✓ ${cityCount} cities`);

    // ── Insurers ──────────────────────────────────────────────
    const insurers = [
      { name: 'Star Health Insurance',  short: 'Star Health' },
      { name: 'HDFC ERGO Health',       short: 'HDFC ERGO' },
      { name: 'Care Health Insurance',  short: 'Care Health' },
      { name: 'Aditya Birla Health',    short: 'Aditya Birla' },
      { name: 'Niva Bupa',              short: 'Niva Bupa' },
      { name: 'New India Assurance',    short: 'New India' },
      { name: 'United India Insurance', short: 'United India' },
      { name: 'Oriental Insurance',     short: 'Oriental' },
      { name: 'National Insurance',     short: 'National' },
      { name: 'ICICI Lombard',          short: 'ICICI Lombard' },
      { name: 'Bajaj Allianz',          short: 'Bajaj Allianz' },
      { name: 'SBI General',            short: 'SBI General' },
      { name: 'Tata AIG',               short: 'Tata AIG' },
      { name: 'Future Generali',        short: 'Future Generali' },
      { name: 'IFFCO Tokio',            short: 'IFFCO Tokio' },
    ];
    const insurerIds = {};
    for (const ins of insurers) {
      const r = await client.query(
        `INSERT INTO insurers (name, short_name) VALUES ($1,$2)
         ON CONFLICT (name) DO UPDATE SET short_name=EXCLUDED.short_name RETURNING id`,
        [ins.name, ins.short]
      );
      insurerIds[ins.name] = r.rows[0].id;
    }
    console.log(`  ✓ ${insurers.length} insurers`);

    // ── Sample hospitals ──────────────────────────────────────
    const sampleHospitals = [
      // Lucknow
      { name: 'Medanta Hospital Lucknow',         city: 'Lucknow',    type: 'Super-Specialty', beds: 450, insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard'], depts: ['Cardiology','Orthopaedics','Neurology','Oncology'] },
      { name: 'SGPGI Lucknow',                    city: 'Lucknow',    type: 'Government',      beds: 800, insurers: ['New India Assurance','United India Insurance','National Insurance'], depts: ['Neurology','Nephrology','Oncology','Cardiology'] },
      { name: 'Apollo Medics Hospital Lucknow',   city: 'Lucknow',    type: 'Multi-Specialty', beds: 350, insurers: ['Star Health Insurance','Niva Bupa','Bajaj Allianz'], depts: ['Cardiology','Orthopaedics','General Surgery','Gynaecology'] },
      // Delhi
      { name: 'AIIMS Delhi',                      city: 'New Delhi',  type: 'Government',      beds: 2400, insurers: ['New India Assurance','United India Insurance','National Insurance','Oriental Insurance'], depts: ['Cardiology','Neurology','Oncology','Orthopaedics','Nephrology'] },
      { name: 'Medanta The Medicity Gurgaon',     city: 'Gurgaon',    type: 'Super-Specialty', beds: 1250, insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard','Niva Bupa','Aditya Birla Health'], depts: ['Cardiology','Orthopaedics','Neurology','Oncology','Nephrology'] },
      { name: 'Fortis Memorial Research Institute', city: 'Gurgaon',  type: 'Super-Specialty', beds: 310,  insurers: ['Star Health Insurance','HDFC ERGO Health','Bajaj Allianz'], depts: ['Cardiology','Oncology','Orthopaedics','Neurology'] },
      { name: 'Apollo Hospital Delhi',            city: 'New Delhi',  type: 'Super-Specialty', beds: 710,  insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard','Niva Bupa'], depts: ['Cardiology','Neurology','Orthopaedics','Oncology','General Surgery'] },
      { name: 'Max Super Speciality Hospital',    city: 'South Delhi', type: 'Super-Specialty', beds: 500, insurers: ['Star Health Insurance','HDFC ERGO Health','Care Health Insurance','Bajaj Allianz'], depts: ['Cardiology','Orthopaedics','Neurology','General Surgery'] },
      // Mumbai
      { name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', type: 'Super-Specialty', beds: 750, insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard','Tata AIG'], depts: ['Cardiology','Neurology','Oncology','Orthopaedics','Nephrology'] },
      { name: 'Lilavati Hospital Mumbai',         city: 'Mumbai',     type: 'Multi-Specialty', beds: 330,  insurers: ['Star Health Insurance','Niva Bupa','Bajaj Allianz','Future Generali'], depts: ['Cardiology','Orthopaedics','Neurology','General Surgery','Gynaecology'] },
      { name: 'Hinduja Hospital Mumbai',          city: 'Mumbai',     type: 'Multi-Specialty', beds: 350,  insurers: ['HDFC ERGO Health','ICICI Lombard','United India Insurance'], depts: ['Cardiology','Oncology','General Surgery','Nephrology'] },
      // Kanpur
      { name: 'Regency Hospital Kanpur',          city: 'Kanpur',     type: 'Multi-Specialty', beds: 300,  insurers: ['Star Health Insurance','New India Assurance','United India Insurance'], depts: ['Cardiology','Orthopaedics','General Surgery','Gynaecology'] },
      { name: 'Rama Medical College Hospital Kanpur', city: 'Kanpur', type: 'Government',      beds: 500,  insurers: ['New India Assurance','National Insurance'], depts: ['General Medicine','General Surgery','Orthopaedics'] },
      // Pune
      { name: 'Ruby Hall Clinic Pune',            city: 'Pune',       type: 'Multi-Specialty', beds: 450,  insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard'], depts: ['Cardiology','Orthopaedics','Neurology','General Surgery'] },
      { name: 'Jehangir Hospital Pune',           city: 'Pune',       type: 'Multi-Specialty', beds: 400,  insurers: ['Star Health Insurance','Bajaj Allianz','SBI General'], depts: ['Cardiology','Gynaecology','Orthopaedics','General Surgery'] },
      // Kolkata
      { name: 'Apollo Gleneagles Hospital Kolkata', city: 'Kolkata',  type: 'Super-Specialty', beds: 520,  insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard','Niva Bupa'], depts: ['Cardiology','Oncology','Neurology','Orthopaedics'] },
      { name: 'Fortis Hospital Kolkata',          city: 'Kolkata',    type: 'Multi-Specialty', beds: 400,  insurers: ['Star Health Insurance','HDFC ERGO Health','Bajaj Allianz'], depts: ['Cardiology','Orthopaedics','General Surgery'] },
      // Chennai
      { name: 'Apollo Hospital Chennai',          city: 'Chennai',    type: 'Super-Specialty', beds: 700,  insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard','Tata AIG','Niva Bupa'], depts: ['Cardiology','Neurology','Oncology','Orthopaedics','Nephrology'] },
      { name: 'MIOT International Chennai',       city: 'Chennai',    type: 'Super-Specialty', beds: 1000, insurers: ['Star Health Insurance','Niva Bupa','Bajaj Allianz','Future Generali'], depts: ['Orthopaedics','Cardiology','Neurology','General Surgery'] },
      // Bengaluru
      { name: 'Manipal Hospital Bengaluru',       city: 'Bengaluru',  type: 'Super-Specialty', beds: 600,  insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard','Aditya Birla Health'], depts: ['Cardiology','Oncology','Neurology','Orthopaedics','Nephrology'] },
      { name: 'Narayana Health City Bengaluru',   city: 'Bengaluru',  type: 'Super-Specialty', beds: 3000, insurers: ['Star Health Insurance','HDFC ERGO Health','New India Assurance','United India Insurance'], depts: ['Cardiology','Neurology','Oncology','Orthopaedics','Nephrology','Pulmonology'] },
      // Jaipur
      { name: 'Fortis Escorts Hospital Jaipur',   city: 'Jaipur',     type: 'Super-Specialty', beds: 250,  insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard'], depts: ['Cardiology','Orthopaedics','General Surgery'] },
      // Hyderabad / Ahmedabad
      { name: 'Apollo Hospital Ahmedabad',        city: 'Ahmedabad',  type: 'Super-Specialty', beds: 350,  insurers: ['Star Health Insurance','HDFC ERGO Health','ICICI Lombard','Bajaj Allianz'], depts: ['Cardiology','Neurology','Orthopaedics','Oncology'] },
      // Patna
      { name: 'Paras HMRI Hospital Patna',        city: 'Patna',      type: 'Multi-Specialty', beds: 300,  insurers: ['Star Health Insurance','New India Assurance','National Insurance'], depts: ['Cardiology','Orthopaedics','General Surgery','Neurology'] },
      // Bhopal
      { name: 'Bansal Hospital Bhopal',           city: 'Bhopal',     type: 'Multi-Specialty', beds: 250,  insurers: ['Star Health Insurance','HDFC ERGO Health','United India Insurance'], depts: ['Cardiology','Orthopaedics','General Surgery','Gynaecology'] },
    ];

    for (const h of sampleHospitals) {
      const cid = cityIds[h.city];
      if (!cid) { console.warn(`  ⚠ City not found: ${h.city}`); continue; }

      const hr = await client.query(
        `INSERT INTO hospitals (name, city_id, phone, beds, type)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT DO NOTHING RETURNING id`,
        [h.name, cid, '+91 7999868659', h.beds, h.type]
      );
      if (!hr.rows[0]) continue;
      const hid = hr.rows[0].id;

      for (const ins of (h.insurers || [])) {
        const iid = insurerIds[ins];
        if (iid) {
          await client.query(
            `INSERT INTO hospital_insurers (hospital_id, insurer_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
            [hid, iid]
          );
        }
      }
      for (const dept of (h.depts || [])) {
        await client.query(
          `INSERT INTO hospital_departments (hospital_id, department) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
          [hid, dept]
        );
      }
    }
    console.log(`  ✓ ${sampleHospitals.length} sample hospitals`);

    // ── Admin user ────────────────────────────────────────────
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hash = await bcrypt.hash(adminPass, 12);
    await client.query(
      `INSERT INTO admin_users (username, password_hash)
       VALUES ($1,$2) ON CONFLICT (username) DO NOTHING`,
      [adminUser, hash]
    );
    console.log(`  ✓ Admin user: "${adminUser}" (password from ADMIN_PASSWORD env var)`);

    await client.query('COMMIT');
    console.log('\n✅ Seed complete!');
    console.log(`\n🔑 Admin login: ${adminUser} / ${adminPass}`);
    console.log('⚠️  Change your password immediately after first login!\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
