-- ─── Bellaterra Database Schema ──────────────────────────────────────────────
-- SQLite with WAL mode, foreign keys enabled

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ─── Properties ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                 TEXT    NOT NULL UNIQUE,
  name                 TEXT    NOT NULL,
  property_type        TEXT    NOT NULL DEFAULT 'Residential',  -- Residential, Villa, Farmhouse, Loft
  short_description    TEXT,
  description          TEXT,
  bedrooms             INTEGER,
  bathrooms            INTEGER,
  max_guests           INTEGER,
  sqm                  INTEGER,
  min_stay_days        INTEGER DEFAULT 30,
  price_per_month      REAL,
  price_per_week       REAL,
  price_per_night      REAL,
  currency             TEXT    DEFAULT 'EUR',
  location_city        TEXT,
  location_region      TEXT,
  location_country     TEXT,
  location_description TEXT,
  latitude             REAL,
  longitude            REAL,
  amenities            TEXT,  -- JSON array
  house_rules          TEXT,  -- JSON array
  is_published         INTEGER DEFAULT 0,
  featured             INTEGER DEFAULT 0,
  created_at           TEXT    DEFAULT (datetime('now')),
  updated_at           TEXT    DEFAULT (datetime('now'))
);

-- ─── Property Images ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_images (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id  INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url          TEXT    NOT NULL,
  alt_text     TEXT,
  caption      TEXT,
  category     TEXT    DEFAULT 'general',  -- general, hero, interior, exterior, details
  sort_order   INTEGER DEFAULT 0,
  created_at   TEXT    DEFAULT (datetime('now'))
);

-- ─── Page Content ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_content (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  page       TEXT    NOT NULL,
  key        TEXT    NOT NULL,
  value      TEXT,
  type       TEXT    DEFAULT 'text',  -- text, richtext, image, json
  updated_at TEXT    DEFAULT (datetime('now')),
  UNIQUE(page, key)
);

-- ─── Retreats ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS retreats (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  slug             TEXT    NOT NULL UNIQUE,
  title            TEXT    NOT NULL,
  tagline          TEXT,
  description      TEXT,
  retreat_type     TEXT,  -- corporate, intimate, film, event
  min_guests       INTEGER,
  max_guests       INTEGER,
  min_days         INTEGER,
  max_days         INTEGER,
  price_from       REAL,
  currency         TEXT    DEFAULT 'EUR',
  is_published     INTEGER DEFAULT 0,
  created_at       TEXT    DEFAULT (datetime('now'))
);

-- ─── Retreat Add-ons ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS retreat_addons (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  retreat_id  INTEGER REFERENCES retreats(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  price       REAL,
  currency    TEXT DEFAULT 'EUR',
  unit        TEXT DEFAULT 'per day',
  is_available INTEGER DEFAULT 1
);

-- ─── Inquiries ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name              TEXT    NOT NULL,
  last_name               TEXT    NOT NULL,
  email                   TEXT    NOT NULL,
  phone                   TEXT,
  company                 TEXT,
  inquiry_type            TEXT,
  arrival_date            TEXT,
  departure_date          TEXT,
  date_flexibility        TEXT,
  num_guests              INTEGER,
  bedrooms_needed         INTEGER,
  primary_use             TEXT,
  budget_range            TEXT,
  addons                  TEXT,  -- JSON array
  experience_description  TEXT,
  special_requirements    TEXT,
  how_heard               TEXT,
  preferred_contact       TEXT,
  status                  TEXT    DEFAULT 'new',  -- new, in_progress, completed, archived
  internal_notes          TEXT,
  created_at              TEXT    DEFAULT (datetime('now')),
  updated_at              TEXT    DEFAULT (datetime('now'))
);

-- ─── Inquiry Notes ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiry_notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  inquiry_id  INTEGER NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  note        TEXT    NOT NULL,
  author      TEXT    DEFAULT 'Admin',
  created_at  TEXT    DEFAULT (datetime('now'))
);

-- ─── Availability Blocks ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS availability_blocks (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id  INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  start_date   TEXT    NOT NULL,
  end_date     TEXT    NOT NULL,
  reason       TEXT    DEFAULT 'blocked',  -- blocked, booked, maintenance
  inquiry_id   INTEGER REFERENCES inquiries(id),
  notes        TEXT,
  created_at   TEXT    DEFAULT (datetime('now'))
);

-- ─── Admin Users ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    NOT NULL UNIQUE,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    DEFAULT 'admin',  -- admin, editor, viewer
  last_login    TEXT,
  created_at    TEXT    DEFAULT (datetime('now'))
);

-- ─── SEO Metadata ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_metadata (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path        TEXT    NOT NULL UNIQUE,
  title            TEXT,
  description      TEXT,
  og_title         TEXT,
  og_description   TEXT,
  og_image_url     TEXT,
  canonical_url    TEXT,
  robots           TEXT    DEFAULT 'index, follow',
  updated_at       TEXT    DEFAULT (datetime('now'))
);

-- ─── Seed Data ────────────────────────────────────────────────────────────────

-- Property 303
INSERT OR IGNORE INTO properties (
  slug,
  name,
  property_type,
  short_description,
  description,
  bedrooms,
  bathrooms,
  max_guests,
  sqm,
  min_stay_days,
  price_per_month,
  price_per_week,
  currency,
  location_city,
  location_region,
  location_country,
  location_description,
  amenities,
  is_published,
  featured
) VALUES (
  '303',
  'Property 303',
  'Residential',
  'A meticulously restored residence bathed in natural light, designed for long stays of intention and depth.',
  'Property 303 is a fully restored 19th-century residence occupying the upper floors of a heritage building in the old quarter. Its three-metre ceilings, original stone floors, and deep-set arched windows create an atmosphere that is at once grand and intimate. The space has been furnished over several years — not staged — with antique pieces sourced from regional markets in France, Morocco, and Portugal, alongside commissioned ceramics and textiles from local artisans. Morning light enters from the east through floor-to-ceiling windows, filling the kitchen and living area with warmth. Afternoons belong to the shaded courtyard below. It is a space for thinking, writing, resting, and living with deliberate slowness.',
  3,
  2,
  6,
  185,
  30,
  7800.00,
  2100.00,
  'EUR',
  'Barcelona',
  'Catalonia',
  'Spain',
  'Situated in the Gothic Quarter, steps from the medieval cathedral, minutes from the sea, and surrounded by the finest food markets in southern Europe. The neighbourhood rewards those who prefer to walk — and punishes those who do not.',
  '["High-speed WiFi", "Fully equipped kitchen", "Courtyard access", "Laundry", "Air conditioning", "Central heating", "Workspace", "Library", "Rooftop terrace access"]',
  1,
  1
);

-- SEO entries
INSERT OR IGNORE INTO seo_metadata (page_path, title, description) VALUES
  ('/', 'Bellaterra — A space can become a memory.', 'Bellaterra creates, renovates, and manages beautifully designed properties for guests who believe that where you stay shapes how you feel.'),
  ('/retreats', 'Retreats & Private Hire — Bellaterra', 'Bellaterra properties transform into private containers for thought, connection, and restoration.'),
  ('/gallery', 'Gallery — Bellaterra', 'Explore the Bellaterra visual archive — interiors, exteriors, and natural details from our curated properties.'),
  ('/about', 'About — Bellaterra', 'The story behind Bellaterra and the beliefs that guide every design decision we make.'),
  ('/inquiry', 'Inquire — Bellaterra', 'Begin your Bellaterra inquiry. Tell us about your vision and we will design a stay around it.');

-- Page content defaults
INSERT OR IGNORE INTO page_content (page, key, value, type) VALUES
  ('home', 'hero_headline', 'A space becomes a memory.', 'text'),
  ('home', 'hero_subtext', 'Long-stay seasonal rentals. Private retreats. Editorial spaces.', 'text'),
  ('home', 'positioning_quote', 'Bellaterra creates, renovates, and manages beautifully designed properties for guests who believe that where you stay shapes how you feel.', 'text'),
  ('global', 'tagline', 'A space can become a memory.', 'text'),
  ('global', 'contact_email', 'hello@bellaterra.co', 'text');
