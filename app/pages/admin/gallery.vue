<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: 'Gallery — Bellaterra Admin',
  robots: 'noindex, nofollow',
})

interface GalleryImage {
  id: number
  url: string
  alt_text: string | null
  category: string
  sort_order: number
}

const { data: images, refresh } = await useFetch<GalleryImage[]>('/api/admin/gallery')

const newImage = ref({ url: '', alt_text: '', category: 'interior' })
const adding = ref(false)
const addError = ref('')
const deletingId = ref<number | null>(null)

const categoryOptions = [
  { value: 'interior', label: 'Interior' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'nature', label: 'Nature' },
  { value: 'details', label: 'Details' },
]

const categoryColors: Record<string, string> = {
  interior: 'bg-chocolate/15 text-chocolate',
  exterior: 'bg-olive/15 text-olive',
  nature: 'bg-amber/15 text-amber',
  details: 'bg-terracotta/15 text-terracotta',
}

async function addImage() {
  if (!newImage.value.url.trim()) return
  adding.value = true
  addError.value = ''
  try {
    await $fetch('/api/admin/gallery', {
      method: 'POST',
      body: {
        url: newImage.value.url.trim(),
        alt_text: newImage.value.alt_text.trim(),
        category: newImage.value.category,
      },
    })
    newImage.value = { url: '', alt_text: '', category: 'interior' }
    await refresh()
  } catch (err: any) {
    addError.value = err?.data?.statusMessage ?? 'Failed to add image.'
  } finally {
    adding.value = false
  }
}

async function deleteImage(id: number) {
  if (!confirm('Remove this image from the gallery?')) return
  deletingId.value = id
  try {
    await $fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    await refresh()
  } catch {
    // handle
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="px-8 py-6 border-b border-charcoal/8 bg-white flex items-start justify-between">
      <div>
        <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Public Gallery</p>
        <h1 class="font-display text-2xl text-charcoal font-light">Gallery</h1>
      </div>
      <p class="text-xs text-charcoal/40 font-light max-w-xs text-right leading-relaxed mt-1">
        Images added here appear on the public gallery page. If empty, property images are shown instead.
      </p>
    </div>

    <div class="px-8 py-8">

      <!-- Add Image Form -->
      <div class="bg-white border border-charcoal/10 p-6 mb-8">
        <h3 class="text-xs tracking-widest uppercase font-semibold text-charcoal/50 mb-5">Add Image</h3>
        <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-4 items-end">
          <div>
            <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Image URL</label>
            <input
              v-model="newImage.url"
              type="url"
              placeholder="https://… or /uploads/…"
              class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
              @keydown.enter="addImage"
            />
          </div>
          <div>
            <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Alt Text</label>
            <input
              v-model="newImage.alt_text"
              type="text"
              placeholder="Describe the image…"
              class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Category</label>
            <select
              v-model="newImage.category"
              class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
            >
              <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div>
            <button
              :disabled="!newImage.url.trim() || adding"
              class="w-full px-6 py-3 bg-chocolate text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-200 disabled:opacity-40"
              @click="addImage"
            >
              {{ adding ? 'Adding…' : 'Add' }}
            </button>
          </div>
        </div>
        <p v-if="addError" class="mt-3 text-terracotta text-xs">{{ addError }}</p>
      </div>

      <!-- Gallery Grid -->
      <div v-if="images?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="img in images"
          :key="img.id"
          class="bg-white border border-charcoal/10 group relative overflow-hidden"
        >
          <div class="aspect-square bg-charcoal/5 overflow-hidden">
            <img
              :src="img.url"
              :alt="img.alt_text ?? ''"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="p-3">
            <p class="text-xs text-charcoal truncate font-light">{{ img.alt_text || '—' }}</p>
            <span
              class="inline-block mt-1.5 px-2 py-0.5 text-xs font-semibold tracking-widest uppercase"
              :class="categoryColors[img.category] ?? 'bg-charcoal/10 text-charcoal/50'"
            >
              {{ img.category }}
            </span>
          </div>
          <!-- Delete -->
          <button
            :disabled="deletingId === img.id"
            class="absolute top-2 right-2 w-6 h-6 bg-charcoal/70 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-terracotta disabled:opacity-40"
            @click="deleteImage(img.id)"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white border border-charcoal/10 py-20 flex flex-col items-center justify-center">
        <svg class="w-10 h-10 text-charcoal/20 mb-4" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
        </svg>
        <p class="text-charcoal/30 text-sm font-light">No gallery images yet.</p>
        <p class="text-charcoal/20 text-xs mt-1">Add image URLs above. Leave empty to auto-show property images.</p>
      </div>
    </div>
  </div>
</template>
