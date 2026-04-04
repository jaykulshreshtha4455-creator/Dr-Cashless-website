const router = require('express').Router();
const db     = require('../db');

// POST /api/claims — submit reimbursement claim
router.post('/', async (req, res) => {
  const {
    ref, name, phone, age, gender, relation,
    insurer, policy_no, member_id, tpa,
    hospital, city, state,
    claim_type, department, diagnosis, procedure_name,
    admit_date, discharge_date,
    total_bill, paid_by_insurance, claim_amount,
  } = req.body;

  if (!ref || !name || !phone || !claim_amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await db.query(
      `INSERT INTO claims
        (ref, patient_name, phone, age, gender, relation,
         insurer, policy_no, member_id, tpa,
         hospital, city, state,
         claim_type, department, diagnosis, procedure_name,
         admit_date, discharge_date,
         total_bill, paid_by_insurance, claim_amount)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
       RETURNING *`,
      [
        ref, name, phone,
        age || null, gender || null, relation || null,
        insurer || null, policy_no || null, member_id || null, tpa || null,
        hospital || null, city || null, state || null,
        claim_type || null, department || null, diagnosis || null, procedure_name || null,
        admit_date || null, discharge_date || null,
        total_bill || null, paid_by_insurance || 0, claim_amount,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Duplicate reference' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/claims/:ref — track by reference number (public)
router.get('/:ref', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ref, patient_name, hospital, claim_amount, status, submitted_at
       FROM claims WHERE UPPER(ref) = UPPER($1)`,
      [req.params.ref]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Claim not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/claims/:id/status — update status (admin uses admin route)
router.patch('/:id/status', async (req, res) => {
  const { status, admin_notes } = req.body;
  const valid = ['submitted', 'processing', 'approved', 'rejected'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  try {
    const result = await db.query(
      `UPDATE claims SET status = $1, admin_notes = $2 WHERE id = $3 RETURNING *`,
      [status, admin_notes || null, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
