// Admin-only routes — all protected by JWT middleware
const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db     = require('../db');

// ── Auth middleware ───────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.admin = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── Stats ─────────────────────────────────────────────────────
router.get('/stats', auth, async (req, res) => {
  try {
    const [hospitals, appointments, claims, pending] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM hospitals WHERE active = true`),
      db.query(`SELECT COUNT(*) FROM appointments`),
      db.query(`SELECT COUNT(*) FROM claims`),
      db.query(`SELECT COUNT(*) FROM claims WHERE status = 'submitted'`),
    ]);
    const today = await db.query(
      `SELECT COUNT(*) FROM appointments WHERE appointment_date = CURRENT_DATE`
    );
    res.json({
      hospitals:    parseInt(hospitals.rows[0].count),
      appointments: parseInt(appointments.rows[0].count),
      claims:       parseInt(claims.rows[0].count),
      pendingClaims: parseInt(pending.rows[0].count),
      todayAppointments: parseInt(today.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Hospitals CRUD ────────────────────────────────────────────

router.get('/hospitals', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT h.id, h.name, h.address, h.phone, h.beds, h.type, h.active, h.created_at,
             c.name AS city, s.name AS state
      FROM hospitals h
      JOIN cities c ON h.city_id = c.id
      JOIN states s ON c.state_id = s.id
      ORDER BY h.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/hospitals', auth, async (req, res) => {
  const { name, city_id, address, phone, beds, type, insurers, departments } = req.body;
  if (!name || !city_id) return res.status(400).json({ error: 'name and city_id required' });

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const h = await client.query(
      `INSERT INTO hospitals (name, city_id, address, phone, beds, type)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [name, city_id, address || null, phone || '+91 7999868659', beds || null, type || 'Multi-Specialty']
    );
    const hid = h.rows[0].id;

    if (insurers?.length) {
      for (const iid of insurers) {
        await client.query(
          `INSERT INTO hospital_insurers (hospital_id, insurer_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
          [hid, iid]
        );
      }
    }
    if (departments?.length) {
      for (const dept of departments) {
        await client.query(
          `INSERT INTO hospital_departments (hospital_id, department) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
          [hid, dept]
        );
      }
    }
    await client.query('COMMIT');
    res.status(201).json({ id: hid, message: 'Hospital created' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

router.put('/hospitals/:id', auth, async (req, res) => {
  const { name, city_id, address, phone, beds, type, active, insurers, departments } = req.body;
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE hospitals SET name=$1, city_id=$2, address=$3, phone=$4, beds=$5, type=$6, active=$7
       WHERE id=$8`,
      [name, city_id, address || null, phone, beds || null, type, active !== false, req.params.id]
    );

    if (insurers !== undefined) {
      await client.query('DELETE FROM hospital_insurers WHERE hospital_id = $1', [req.params.id]);
      for (const iid of (insurers || [])) {
        await client.query(
          `INSERT INTO hospital_insurers (hospital_id, insurer_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
          [req.params.id, iid]
        );
      }
    }
    if (departments !== undefined) {
      await client.query('DELETE FROM hospital_departments WHERE hospital_id = $1', [req.params.id]);
      for (const dept of (departments || [])) {
        await client.query(
          `INSERT INTO hospital_departments (hospital_id, department) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
          [req.params.id, dept]
        );
      }
    }
    await client.query('COMMIT');
    res.json({ message: 'Updated' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

router.delete('/hospitals/:id', auth, async (req, res) => {
  try {
    await db.query(`UPDATE hospitals SET active = false WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Appointments ──────────────────────────────────────────────

router.get('/appointments', auth, async (req, res) => {
  const { status, date, q } = req.query;
  let query = `SELECT * FROM appointments WHERE 1=1`;
  const params = [];
  let p = 1;
  if (status)  { query += ` AND status = $${p++}`;                       params.push(status); }
  if (date)    { query += ` AND appointment_date = $${p++}`;             params.push(date); }
  if (q)       { query += ` AND (LOWER(patient_name) LIKE LOWER($${p}) OR phone LIKE $${p})`;
                 p++; params.push(`%${q}%`); }
  query += ` ORDER BY booked_at DESC LIMIT 200`;
  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/appointments/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await db.query(
      `UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/appointments/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM appointments WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Claims ────────────────────────────────────────────────────

router.get('/claims', auth, async (req, res) => {
  const { status, q } = req.query;
  let query = `SELECT * FROM claims WHERE 1=1`;
  const params = [];
  let p = 1;
  if (status) { query += ` AND status = $${p++}`; params.push(status); }
  if (q)      { query += ` AND (LOWER(patient_name) LIKE LOWER($${p}) OR phone LIKE $${p} OR UPPER(ref) LIKE UPPER($${p}))`;
                p++; params.push(`%${q}%`); }
  query += ` ORDER BY submitted_at DESC LIMIT 200`;
  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/claims/:id', auth, async (req, res) => {
  const { status, admin_notes } = req.body;
  try {
    const result = await db.query(
      `UPDATE claims SET status = $1, admin_notes = $2 WHERE id = $3 RETURNING *`,
      [status, admin_notes || null, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Meta (states, cities, insurers for dropdowns) ─────────────

router.get('/meta', auth, async (req, res) => {
  try {
    const [states, cities, insurers] = await Promise.all([
      db.query('SELECT id, name FROM states ORDER BY name'),
      db.query('SELECT id, name, state_id FROM cities ORDER BY name'),
      db.query('SELECT id, name FROM insurers ORDER BY name'),
    ]);
    res.json({
      states:   states.rows,
      cities:   cities.rows,
      insurers: insurers.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Change admin password ─────────────────────────────────────
router.post('/change-password', auth, async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!new_password || new_password.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  try {
    const result = await db.query('SELECT * FROM admin_users WHERE id = $1', [req.admin.id]);
    const user = result.rows[0];
    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hash = await bcrypt.hash(new_password, 12);
    await db.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [hash, req.admin.id]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
