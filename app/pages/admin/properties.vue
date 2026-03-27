<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: 'Properties — Bellaterra Admin',
  robots: 'noindex, nofollow',
})

interface PropertyImage {
  id: number
  property_id: number
  url: string
  alt_text: string | null
  sort_order: number
}

interface Property {
  id: number
  slug: string
  name: string
  tagline: string | null
  description: string | null
  bedrooms: number | null
  bathrooms: number | null
  sqm: number | null
  max_guests: number | null
  min_stay_days: number | null
  location_city: string | null
  location_region: string | null
  location_country: string | null
  price_per_week: number | null
  is_published: number
  images: PropertyImage[]
}

const { data: properties, refresh } = await useFetch<Property[]>('/api/admin/properties')

const selectedProperty = ref<Property | null>(null)

watch(properties, (list) => {
  if (list?.length && !selectedProperty.value) {
    selectedProperty.value = list[0] ? { ...list[0] } : null
  }
}, { immediate: true })

const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

const newImageUrl = ref('')
const addingImage = ref(false)

async function save() {
  if (!selectedProperty.value) return
  saving.value = true
  saveSuccess.value = false
  saveError.value = ''
  try {
    await $fetch(`/api/admin/properties/${selectedProperty.value.id}`, {
      method: 'PATCH',
      body: {
        name: selectedProperty.value.name,
        tagline: selectedProperty.value.tagline,
        description: selectedProperty.value.description,
        bedrooms: selectedProperty.value.bedrooms,
        bathrooms: selectedProperty.value.bathrooms,
        sqm: selectedProperty.value.sqm,
        max_guests: selectedProperty.value.max_guests,
        min_stay_days: selectedProperty.value.min_stay_days,
        location_city: selectedProperty.value.location_city,
        location_region: selectedProperty.value.location_region,
        location_country: selectedProperty.value.location_country,
        price_per_week: selectedProperty.value.price_per_week,
        is_published: selectedProperty.value.is_published,
      },
    })
    saveSuccess.value = true
    await refresh()
    setTimeout(() => { saveSuccess.value = false }, 3000)
  } catch (err: any) {
    saveError.value = err?.data?.statusMessage ?? 'Save failed.'
  } finally {
    saving.value = false
  }
}

async function addImage() {
  if (!newImageUrl.value.trim() || !selectedProperty.value) return
  addingImage.value = true
  try {
    await $fetch(`/api/admin/properties/${selectedProperty.value.id}/images`, {
      method: 'POST',
      body: { url: newImageUrl.value.trim(), alt_text: '' },
    })
    newImageUrl.value = ''
    await refresh()
    selectedProperty.value = properties.value?.find(p => p.id === selectedProperty.value?.id) ?? selectedProperty.value
  } catch {
    // handle
  } finally {
    addingImage.value = false
  }
}

async function deleteImage(imageId: number) {
  if (!confirm('Delete this image?')) return
  try {
    await $fetch(`/api/admin/properties/images/${imageId}`, { method: 'DELETE' })
    await refresh()
    selectedProperty.value = properties.value?.find(p => p.id === selectedProperty.value?.id) ?? selectedProperty.value
  } catch {
    // handle
  }
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="px-8 py-6 border-b border-charcoal/8 bg-white">
      <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Listings</p>
      <h1 class="font-display text-2xl text-charcoal font-light">Properties</h1>
    </div>

    <div class="px-8 py-8">
      <div v-if="!properties?.length" class="bg-white border border-charcoal/10 py-16 text-center">
        <p class="text-charcoal/30 text-sm font-light">No properties found.</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Property Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white border border-charcoal/10">
            <div class="px-5 py-4 border-b border-charcoal/8">
              <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/40">Properties</p>
            </div>
            <div class="divide-y divide-charcoal/5">
              <button
                v-for="prop in properties"
                :key="prop.id"
                class="w-full text-left px-5 py-4 transition-colors duration-200 border-l-2"
                :class="selectedProperty?.id === prop.id
                  ? 'bg-terracotta/5 border-l-terracotta'
                  : 'hover:bg-charcoal/[0.02] border-l-transparent'"
                @click="selectedProperty = { ...prop }"
              >
                <p class="text-sm font-semibold text-charcoal">{{ prop.name }}</p>
                <p class="text-xs text-charcoal/40 mt-0.5">{{ prop.location_city ?? 'No location' }}</p>
                <span
                  class="inline-block mt-2 px-2 py-0.5 text-xs font-semibold tracking-widest uppercase"
                  :class="prop.is_published ? 'bg-olive/15 text-olive' : 'bg-charcoal/10 text-charcoal/50'"
                >
                  {{ prop.is_published ? 'Published' : 'Draft' }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-if="selectedProperty" class="lg:col-span-3 space-y-6">
          <div class="bg-white border border-charcoal/10">
            <div class="flex items-center justify-between px-6 py-5 border-b border-charcoal/8">
              <h2 class="font-display text-xl text-charcoal font-light">Edit: {{ selectedProperty.name }}</h2>
              <div class="flex items-center gap-4">
                <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0" leave-active-class="transition-all duration-200" leave-to-class="opacity-0">
                  <span v-if="saveSuccess" class="text-olive text-xs font-semibold tracking-widest uppercase">Saved ✓</span>
                </Transition>
                <p v-if="saveError" class="text-terracotta text-xs">{{ saveError }}</p>
                <button
                  :disabled="saving"
                  class="px-8 py-3 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-200 disabled:opacity-50"
                  @click="save"
                >
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>

            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Name -->
              <div class="md:col-span-2">
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Name</label>
                <input
                  v-model="selectedProperty.name"
                  type="text"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Tagline -->
              <div class="md:col-span-2">
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Tagline</label>
                <input
                  v-model="selectedProperty.tagline"
                  type="text"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Description</label>
                <textarea
                  v-model="selectedProperty.description"
                  rows="4"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm leading-relaxed focus:border-terracotta focus:outline-none transition-colors duration-200 resize-y"
                ></textarea>
              </div>

              <!-- Bedrooms -->
              <div>
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Bedrooms</label>
                <input
                  v-model.number="selectedProperty.bedrooms"
                  type="number"
                  min="0"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Bathrooms -->
              <div>
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Bathrooms</label>
                <input
                  v-model.number="selectedProperty.bathrooms"
                  type="number"
                  min="0"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Area -->
              <div>
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Area (sqm)</label>
                <input
                  v-model.number="selectedProperty.sqm"
                  type="number"
                  min="0"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Max Guests -->
              <div>
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Max Guests</label>
                <input
                  v-model.number="selectedProperty.max_guests"
                  type="number"
                  min="1"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Min Stay -->
              <div>
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Min Stay (days)</label>
                <input
                  v-model.number="selectedProperty.min_stay_days"
                  type="number"
                  min="1"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Price -->
              <div>
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Price / Week (CAD)</label>
                <input
                  v-model.number="selectedProperty.price_per_week"
                  type="number"
                  min="0"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Location City -->
              <div>
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">City</label>
                <input
                  v-model="selectedProperty.location_city"
                  type="text"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Location Region -->
              <div>
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Region / Province</label>
                <input
                  v-model="selectedProperty.location_region"
                  type="text"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Location Country -->
              <div>
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Country</label>
                <input
                  v-model="selectedProperty.location_country"
                  type="text"
                  class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                />
              </div>

              <!-- Published Toggle -->
              <div class="md:col-span-2 flex items-center gap-4">
                <label class="text-xs tracking-widest uppercase font-semibold text-charcoal/40">Published</label>
                <button
                  class="px-5 py-2 text-xs font-semibold tracking-widest uppercase border transition-all duration-200"
                  :class="selectedProperty.is_published
                    ? 'bg-olive text-cream border-olive'
                    : 'border-charcoal/20 text-charcoal/50 hover:border-charcoal/40'"
                  @click="selectedProperty.is_published = selectedProperty.is_published ? 0 : 1"
                >
                  {{ selectedProperty.is_published ? 'Published' : 'Draft' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Images Section -->
          <div class="bg-white border border-charcoal/10">
            <div class="px-6 py-5 border-b border-charcoal/8">
              <h3 class="font-sans text-sm font-semibold text-charcoal tracking-wide">Property Images</h3>
            </div>

            <div class="p-6 space-y-4">
              <!-- Add Image URL -->
              <div class="flex gap-3">
                <input
                  v-model="newImageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg or /uploads/filename.jpg"
                  class="flex-1 border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                  @keydown.enter="addImage"
                />
                <button
                  :disabled="!newImageUrl.trim() || addingImage"
                  class="px-6 py-3 bg-deep-green text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-200 disabled:opacity-40"
                  @click="addImage"
                >
                  Add
                </button>
              </div>

              <!-- Image List -->
              <div v-if="selectedProperty.images?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div
                  v-for="img in selectedProperty.images"
                  :key="img.id"
                  class="relative aspect-square bg-charcoal/5 overflow-hidden border border-charcoal/10 group"
                >
                  <img :src="img.url" :alt="img.alt_text ?? ''" class="w-full h-full object-cover" />
                  <button
                    class="absolute top-1.5 right-1.5 w-6 h-6 bg-charcoal/70 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-terracotta"
                    title="Delete image"
                    @click="deleteImage(img.id)"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <p v-else class="text-charcoal/30 text-sm font-light py-4 text-center">
                No images yet. Add a URL above or upload in the Media section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
