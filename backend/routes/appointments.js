const router = require('express').Router();
const db     = require('../db');

// POST /api/appointments — create new booking
router.post('/', async (req, res) => {
  const {
    ref, name, phone, age, gender, department, complaint, notes,
    hospital_id, hospital_name, location, date, time,
  } = req.body;

  if (!ref || !name || !phone || !date) {
    return res.status(400).json({ error: 'Missing required fields: ref, name, phone, date' });
  }

  try {
    const result = await db.query(
      `INSERT INTO appointments
        (ref, patient_name, phone, age, gender, department, complaint, notes,
         hospital_id, hospital_name, location, appointment_date, appointment_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [ref, name, phone, age || null, gender || null, department || null,
       complaint || null, notes || null, hospital_id || null,
       hospital_name || null, location || null, date, time || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Duplicate reference' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/appointments?phone=91XXXXXXXXXX — fetch by phone
router.get('/', async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: 'phone query param required' });

  try {
    const result = await db.query(
      `SELECT * FROM appointments WHERE phone = $1 ORDER BY booked_at DESC`,
      [phone]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/appointments/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const valid = ['upcoming', 'done', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  try {
    const result = await db.query(
      `UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM appointments WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
