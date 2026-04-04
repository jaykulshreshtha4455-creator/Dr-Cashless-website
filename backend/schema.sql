-- DR. CASHLESS — Database Schema
-- Run this on your Railway PostgreSQL instance

-- States
CREATE TABLE IF NOT EXISTS states (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Cities
CREATE TABLE IF NOT EXISTS cities (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  state_id INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  UNIQUE(name, state_id)
);

-- Insurers
CREATE TABLE IF NOT EXISTS insurers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL UNIQUE,
  short_name VARCHAR(50)
);

-- TPAs
CREATE TABLE IF NOT EXISTS tpas (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  insurer_id  INTEGER REFERENCES insurers(id) ON DELETE SET NULL
);

-- Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(300) NOT NULL,
  city_id   INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  address   TEXT,
  phone     VARCHAR(30) DEFAULT '+91 7999868659',
  beds      INTEGER,
  type      VARCHAR(50) DEFAULT 'Multi-Specialty',
  active    BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Hospital ↔ Insurer (many-to-many)
CREATE TABLE IF NOT EXISTS hospital_insurers (
  hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  insurer_id  INTEGER NOT NULL REFERENCES insurers(id) ON DELETE CASCADE,
  PRIMARY KEY (hospital_id, insurer_id)
);

-- Hospital departments
CREATE TABLE IF NOT EXISTS hospital_departments (
  hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  department  VARCHAR(100) NOT NULL,
  PRIMARY KEY (hospital_id, department)
);

-- OPD Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id               SERIAL PRIMARY KEY,
  ref              VARCHAR(50) UNIQUE NOT NULL,
  patient_name     VARCHAR(200) NOT NULL,
  phone            VARCHAR(20) NOT NULL,
  age              INTEGER,
  gender           VARCHAR(20),
  department       VARCHAR(100),
  complaint        VARCHAR(200),
  notes            TEXT,
  hospital_id      INTEGER REFERENCES hospitals(id) ON DELETE SET NULL,
  hospital_name    VARCHAR(300),
  location         VARCHAR(200),
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(50),
  status           VARCHAR(30) DEFAULT 'upcoming',
  booked_at        TIMESTAMP DEFAULT NOW()
);

-- Reimbursement Claims
CREATE TABLE IF NOT EXISTS claims (
  id                  SERIAL PRIMARY KEY,
  ref                 VARCHAR(50) UNIQUE NOT NULL,
  patient_name        VARCHAR(200) NOT NULL,
  phone               VARCHAR(20) NOT NULL,
  age                 INTEGER,
  gender              VARCHAR(20),
  relation            VARCHAR(50),
  insurer             VARCHAR(200),
  policy_no           VARCHAR(100),
  member_id           VARCHAR(100),
  tpa                 VARCHAR(200),
  hospital            VARCHAR(300),
  city                VARCHAR(100),
  state               VARCHAR(100),
  claim_type          VARCHAR(100),
  department          VARCHAR(100),
  diagnosis           VARCHAR(300),
  procedure_name      VARCHAR(300),
  admit_date          DATE,
  discharge_date      DATE,
  total_bill          NUMERIC(12,2),
  paid_by_insurance   NUMERIC(12,2) DEFAULT 0,
  claim_amount        NUMERIC(12,2),
  status              VARCHAR(30) DEFAULT 'submitted',
  admin_notes         TEXT,
  submitted_at        TIMESTAMP DEFAULT NOW()
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_appointments_phone    ON appointments(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_status   ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date     ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_claims_phone          ON claims(phone);
CREATE INDEX IF NOT EXISTS idx_claims_status         ON claims(status);
CREATE INDEX IF NOT EXISTS idx_hospitals_city        ON hospitals(city_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_active      ON hospitals(active);
