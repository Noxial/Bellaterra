// ─── Bellaterra Type Definitions ────────────────────────────────────────────

export interface Property {
  id: number
  slug: string
  name: string
  property_type: string
  short_description: string | null
  description: string | null
  bedrooms: number | null
  bathrooms: number | null
  max_guests: number | null
  sqm: number | null
  min_stay_days: number
  price_per_month: number | null
  price_per_week: number | null
  price_per_night: number | null
  currency: string
  location_city: string | null
  location_region: string | null
  location_country: string | null
  location_description: string | null
  latitude: number | null
  longitude: number | null
  amenities: string[] | null
  house_rules: string[] | null
  is_published: number
  featured: number
  created_at: string
  updated_at: string
  // Joined from property_images
  images?: PropertyImage[]
}

export interface PropertyImage {
  id: number
  property_id: number
  url: string
  alt_text: string | null
  caption: string | null
  category: 'general' | 'hero' | 'interior' | 'exterior' | 'details'
  sort_order: number
  created_at: string
}

export interface Inquiry {
  id?: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  company: string | null
  inquiry_type: string | null
  arrival_date: string | null
  departure_date: string | null
  date_flexibility: string | null
  num_guests: number | null
  bedrooms_needed: number | null
  primary_use: string | null
  budget_range: string | null
  addons: string[] | null
  experience_description: string | null
  special_requirements: string | null
  how_heard: string | null
  preferred_contact: string | null
  status: 'new' | 'in_progress' | 'completed' | 'archived'
  internal_notes: string | null
  created_at?: string
  updated_at?: string
}

export interface InquiryNote {
  id: number
  inquiry_id: number
  note: string
  author: string
  created_at: string
}

export interface PageContent {
  id: number
  page: string
  key: string
  value: string | null
  type: 'text' | 'richtext' | 'image' | 'json'
  updated_at: string
}

export interface Retreat {
  id: number
  slug: string
  title: string
  tagline: string | null
  description: string | null
  retreat_type: 'corporate' | 'intimate' | 'film' | 'event' | null
  min_guests: number | null
  max_guests: number | null
  min_days: number | null
  max_days: number | null
  price_from: number | null
  currency: string
  is_published: number
  created_at: string
  addons?: RetreatAddon[]
}

export interface RetreatAddon {
  id: number
  retreat_id: number | null
  title: string
  description: string | null
  price: number | null
  currency: string
  unit: string
  is_available: number
}

export interface AvailabilityBlock {
  id: number
  property_id: number
  start_date: string
  end_date: string
  reason: 'blocked' | 'booked' | 'maintenance'
  inquiry_id: number | null
  notes: string | null
  created_at: string
}

export interface AdminUser {
  id: number
  username: string
  email: string
  password_hash: string
  role: 'admin' | 'editor' | 'viewer'
  last_login: string | null
  created_at: string
}

export interface SeoMetadata {
  id: number
  page_path: string
  title: string | null
  description: string | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  canonical_url: string | null
  robots: string
  updated_at: string
}

// ─── API Response Types ────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true
  data?: T
  id?: number | bigint
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string>
}

// ─── Gallery ──────────────────────────────────────────────────────────────

export type GalleryCategory = 'all' | 'interior' | 'exterior' | 'nature' | 'details'

export interface GalleryImage {
  id: number
  property_id: number
  url: string
  alt_text: string | null
  category: GalleryCategory
  sort_order: number
}
