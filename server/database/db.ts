/**
 * Bellaterra DB — Nitro built-in useDatabase() (experimental SQLite, no native deps).
 * Column names match app/types/index.ts exactly.
 */

let _initialized = false

export async function initSchema() {
  if (_initialized) return
  _initialized = true

  const db = useDatabase()

  // ── Properties ────────────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS properties (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      slug               TEXT    UNIQUE NOT NULL,
      name               TEXT    NOT NULL,
      property_type      TEXT    DEFAULT 'long_stay',
      tagline            TEXT,
      short_description  TEXT,
      description        TEXT,
      bedrooms           INTEGER,
      bathrooms          INTEGER,
      sqm                INTEGER,
      max_guests         INTEGER,
      min_stay_days      INTEGER DEFAULT 30,
      price_per_month    INTEGER,
      price_per_week     INTEGER,
      price_per_night    INTEGER,
      currency           TEXT    DEFAULT 'CAD',
      location_city      TEXT,
      location_region    TEXT,
      location_country   TEXT    DEFAULT 'Canada',
      location_description TEXT,
      latitude           REAL,
      longitude          REAL,
      amenities          TEXT,
      house_rules        TEXT,
      is_published       INTEGER DEFAULT 1,
      featured           INTEGER DEFAULT 0,
      created_at         TEXT    DEFAULT CURRENT_TIMESTAMP,
      updated_at         TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── Property Images ───────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS property_images (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      url         TEXT    NOT NULL,
      alt_text    TEXT,
      caption     TEXT,
      category    TEXT    DEFAULT 'general',
      sort_order  INTEGER DEFAULT 0,
      created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── Inquiries ─────────────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name           TEXT    NOT NULL,
      last_name            TEXT    NOT NULL,
      email                TEXT    NOT NULL,
      phone                TEXT,
      company              TEXT,
      inquiry_type         TEXT    NOT NULL,
      arrival_date         TEXT,
      departure_date       TEXT,
      date_flexibility     TEXT,
      num_guests           INTEGER,
      bedrooms_needed      INTEGER,
      primary_use          TEXT,
      budget_range         TEXT,
      addons               TEXT,
      experience_description TEXT,
      special_requirements TEXT,
      how_heard            TEXT,
      preferred_contact    TEXT,
      status               TEXT    DEFAULT 'new',
      internal_notes       TEXT,
      created_at           TEXT    DEFAULT CURRENT_TIMESTAMP,
      updated_at           TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── Inquiry Notes ─────────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS inquiry_notes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      inquiry_id  INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
      note        TEXT    NOT NULL,
      author      TEXT    DEFAULT 'admin',
      created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── Page Content (CMS) ────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS page_content (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      page       TEXT    NOT NULL,
      section    TEXT    NOT NULL,
      key        TEXT    NOT NULL,
      value      TEXT,
      type       TEXT    DEFAULT 'text',
      updated_at TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── Retreats ──────────────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS retreats (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      slug         TEXT    UNIQUE NOT NULL,
      title        TEXT    NOT NULL,
      tagline      TEXT,
      description  TEXT,
      retreat_type TEXT,
      min_guests   INTEGER,
      max_guests   INTEGER,
      min_days     INTEGER,
      max_days     INTEGER,
      price_from   INTEGER,
      currency     TEXT    DEFAULT 'CAD',
      is_published INTEGER DEFAULT 1,
      created_at   TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── Retreat Add-ons ───────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS retreat_addons (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      retreat_id   INTEGER REFERENCES retreats(id) ON DELETE CASCADE,
      title        TEXT    NOT NULL,
      description  TEXT,
      price        INTEGER,
      currency     TEXT    DEFAULT 'CAD',
      unit         TEXT    DEFAULT 'per day',
      is_available INTEGER DEFAULT 1
    )
  `

  // ── Availability Blocks ───────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS availability_blocks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      start_date  TEXT    NOT NULL,
      end_date    TEXT    NOT NULL,
      reason      TEXT    DEFAULT 'blocked',
      inquiry_id  INTEGER REFERENCES inquiries(id),
      notes       TEXT,
      created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── SEO Metadata ──────────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS seo_metadata (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path       TEXT    UNIQUE NOT NULL,
      title           TEXT,
      description     TEXT,
      og_title        TEXT,
      og_description  TEXT,
      og_image_url    TEXT,
      canonical_url   TEXT,
      robots          TEXT    DEFAULT 'index, follow',
      updated_at      TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── Admin Users ───────────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT    UNIQUE NOT NULL,
      email         TEXT    UNIQUE NOT NULL,
      password_hash TEXT    NOT NULL,
      role          TEXT    DEFAULT 'editor',
      last_login    TEXT,
      created_at    TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── Gallery Images ────────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER REFERENCES properties(id),
      url         TEXT    NOT NULL,
      alt_text    TEXT,
      category    TEXT    DEFAULT 'general',
      sort_order  INTEGER DEFAULT 0,
      created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
    )
  `

  // ── Site Settings ─────────────────────────────────────────────────────────
  await db.sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `

  // Seed defaults (only if not already present)
  const protectionSetting = await db.sql`SELECT key FROM site_settings WHERE key = 'protection_enabled' LIMIT 1`
  if (!protectionSetting.rows?.length) {
    await db.sql`INSERT INTO site_settings (key, value) VALUES ('protection_enabled', '1')`
  }
  const passwordSetting = await db.sql`SELECT key FROM site_settings WHERE key = 'site_password' LIMIT 1`
  if (!passwordSetting.rows?.length) {
    await db.sql`INSERT INTO site_settings (key, value) VALUES ('site_password', '%bellaterra%26')`
  }

  // ── Seed: Property 303 ────────────────────────────────────────────────────
  const existing = await db.sql`SELECT id FROM properties WHERE slug = '303' LIMIT 1`
  if (!existing.rows?.length) {
    await db.sql`
      INSERT INTO properties (
        slug, name, property_type, tagline, short_description, description,
        bedrooms, bathrooms, sqm, max_guests, min_stay_days,
        price_per_month, currency, location_city, location_region, location_country,
        location_description, is_published, featured
      ) VALUES (
        '303',
        '303',
        'long_stay',
        'A singular space. Yours for a season.',
        'A meticulously restored residence designed for extended stays — private, architectural, and deeply considered.',
        'Property 303 is an architectural retreat for those who choose to stay slowly. Stone floors, arched ceilings, and curated objects from three continents. Available for stays of 30 days and beyond.',
        4, 3, 297, 8, 30,
        18000, 'CAD',
        'Mont-Tremblant', 'Laurentides', 'Canada',
        'Set within the Laurentians, 40 minutes north of Montréal. Private road access, surrounded by forest and a natural lake.',
        1, 1
      )
    `
  }

  // ── Seed: Default SEO ─────────────────────────────────────────────────────
  const seoSeeds = [
    { path: '/', title: 'Bellaterra — A Space Can Become a Memory', desc: 'Bellaterra curates beautifully designed properties for long-term seasonal stays, private retreats, and editorial experiences.' },
    { path: '/property/303', title: '303 — Seasonal Long-Stay Rental | Bellaterra', desc: 'A singular architectural property in the Laurentians. Available for 30-day minimum stays.' },
    { path: '/retreats', title: 'Private Retreats & Corporate Hire | Bellaterra', desc: 'Executive offsites, intimate gatherings, film and editorial. Bellaterra properties for private hire.' },
    { path: '/gallery', title: 'Gallery | Bellaterra', desc: 'A visual tour of Bellaterra spaces.' },
    { path: '/inquiry', title: 'Begin Your Inquiry | Bellaterra', desc: 'Tell us about your vision and we\'ll design your perfect stay.' },
    { path: '/about', title: 'About Bellaterra', desc: 'The story, philosophy, and people behind Bellaterra.' },
  ]
  for (const s of seoSeeds) {
    const exists = await db.sql`SELECT id FROM seo_metadata WHERE page_path = ${s.path} LIMIT 1`
    if (!exists.rows?.length) {
      await db.sql`
        INSERT INTO seo_metadata (page_path, title, description, og_title, og_description)
        VALUES (${s.path}, ${s.title}, ${s.desc}, ${s.title}, ${s.desc})
      `
    }
  }
}
