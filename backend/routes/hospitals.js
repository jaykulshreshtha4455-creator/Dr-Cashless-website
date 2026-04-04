const router = require('express').Router();
const db     = require('../db');

// GET /api/hospitals — search with optional filters
// ?city_id=&insurer_id=&department=&q=
router.get('/', async (req, res) => {
  const { city_id, insurer_id, department, q } = req.query;

  try {
    let query = `
      SELECT
        h.id, h.name, h.address, h.phone, h.beds, h.type,
        c.name AS city, s.name AS state,
        COALESCE(
          json_agg(DISTINCT i.name) FILTER (WHERE i.name IS NOT NULL), '[]'
        ) AS insurers,
        COALESCE(
          json_agg(DISTINCT hd.department) FILTER (WHERE hd.department IS NOT NULL), '[]'
        ) AS departments
      FROM hospitals h
      JOIN cities  c ON h.city_id = c.id
      JOIN states  s ON c.state_id = s.id
      LEFT JOIN hospital_insurers  hi ON h.id = hi.hospital_id
      LEFT JOIN insurers           i  ON hi.insurer_id = i.id
      LEFT JOIN hospital_departments hd ON h.id = hd.hospital_id
      WHERE h.active = true
    `;

    const params = [];
    let p = 1;

    if (city_id) {
      query += ` AND h.city_id = $${p++}`;
      params.push(city_id);
    }

    if (insurer_id) {
      query += ` AND h.id IN (SELECT hospital_id FROM hospital_insurers WHERE insurer_id = $${p++})`;
      params.push(insurer_id);
    }

    if (department) {
      query += ` AND h.id IN (SELECT hospital_id FROM hospital_departments WHERE LOWER(department) = LOWER($${p++}))`;
      params.push(department);
    }

    if (q) {
      query += ` AND LOWER(h.name) LIKE LOWER($${p++})`;
      params.push(`%${q}%`);
    }

    query += ` GROUP BY h.id, c.name, s.name ORDER BY h.name`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/hospitals/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT h.*, c.name AS city, s.name AS state
      FROM hospitals h
      JOIN cities c ON h.city_id = c.id
      JOIN states s ON c.state_id = s.id
      WHERE h.id = $1
    `, [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/hospitals/by-city/:city_id — for OPD dropdown
router.get('/by-city/:city_id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, address, phone FROM hospitals WHERE city_id = $1 AND active = true ORDER BY name`,
      [req.params.city_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/hospitals/states — all states with cities
router.get('/meta/states', async (req, res) => {
  try {
    const states = await db.query('SELECT id, name FROM states ORDER BY name');
    res.json(states.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/hospitals/meta/cities/:state_id
router.get('/meta/cities/:state_id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name FROM cities WHERE state_id = $1 ORDER BY name',
      [req.params.state_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/hospitals/meta/insurers
router.get('/meta/insurers', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, short_name FROM insurers ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
