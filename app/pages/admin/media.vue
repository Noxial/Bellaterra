<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: 'Media — Bellaterra Admin',
  robots: 'noindex, nofollow',
})

interface MediaFile {
  filename: string
  url: string
  size: number
  createdAt: string
}

const { data: mediaFiles, refresh } = await useFetch<MediaFile[]>('/api/admin/media')

const isDragging = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const uploadSuccess = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const deletingFile = ref<string | null>(null)

const pageTags = [
  'Home Hero',
  'Property 303',
  'Retreats',
  'Gallery',
  'About',
  'General',
]

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

async function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length) {
    await uploadFiles(files)
  }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    uploadFiles(target.files)
  }
}

async function uploadFiles(files: FileList) {
  uploading.value = true
  uploadError.value = ''
  uploadSuccess.value = false
  try {
    const formData = new FormData()
    for (const file of Array.from(files)) {
      formData.append('files', file)
    }
    await $fetch('/api/admin/media/upload', { method: 'POST', body: formData })
    uploadSuccess.value = true
    await refresh()
    setTimeout(() => { uploadSuccess.value = false }, 3000)
    if (fileInput.value) fileInput.value.value = ''
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage ?? 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

async function deleteFile(filename: string) {
  if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return
  deletingFile.value = filename
  try {
    await $fetch(`/api/admin/media/${encodeURIComponent(filename)}`, { method: 'DELETE' })
    await refresh()
  } catch {
    // handle error
  } finally {
    deletingFile.value = null
  }
}

function copyUrl(url: string) {
  navigator.clipboard.writeText(window.location.origin + url)
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="px-8 py-6 border-b border-charcoal/8 bg-white">
      <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Assets</p>
      <h1 class="font-display text-2xl text-charcoal font-light">Media Library</h1>
    </div>

    <div class="px-8 py-8">
      <!-- Upload Dropzone -->
      <div
        class="border-2 border-dashed transition-colors duration-200 mb-8 cursor-pointer"
        :class="isDragging ? 'border-terracotta bg-terracotta/5' : 'border-charcoal/20 hover:border-charcoal/40 bg-white'"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
        @click="fileInput?.click()"
      >
        <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
          <svg class="w-8 h-8 text-charcoal/30 mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="text-sm text-charcoal/50 font-light mb-1">
            <span v-if="uploading">Uploading...</span>
            <span v-else>Drop images here or <span class="text-terracotta font-semibold">click to browse</span></span>
          </p>
          <p class="text-xs text-charcoal/30">JPG, PNG, WebP, GIF, SVG up to 10MB</p>

          <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0" leave-active-class="transition-all duration-200" leave-to-class="opacity-0">
            <p v-if="uploadSuccess" class="mt-3 text-olive text-xs font-semibold tracking-widest uppercase">Uploaded ✓</p>
          </Transition>
          <p v-if="uploadError" class="mt-3 text-terracotta text-xs font-light">{{ uploadError }}</p>
        </div>
      </div>
      <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="onFileChange" />

      <!-- Media Grid -->
      <div v-if="mediaFiles?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="file in mediaFiles"
          :key="file.filename"
          class="bg-white border border-charcoal/10 group relative overflow-hidden"
        >
          <!-- Preview -->
          <div class="aspect-square bg-charcoal/5 overflow-hidden">
            <img
              :src="file.url"
              :alt="file.filename"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <!-- Info -->
          <div class="p-3">
            <p class="text-xs font-semibold text-charcoal truncate" :title="file.filename">
              {{ file.filename }}
            </p>
            <p class="text-xs text-charcoal/40 mt-0.5">{{ formatSize(file.size) }}</p>

            <!-- Actions -->
            <div class="flex items-center gap-2 mt-3">
              <button
                class="flex-1 py-1.5 text-xs font-semibold tracking-widest uppercase text-charcoal/50 border border-charcoal/15 hover:border-charcoal/40 hover:text-charcoal transition-all duration-200"
                :title="`Copy URL: ${file.url}`"
                @click="copyUrl(file.url)"
              >
                Copy
              </button>
              <button
                :disabled="deletingFile === file.filename"
                class="py-1.5 px-2.5 text-xs font-semibold tracking-widest uppercase text-terracotta/60 border border-terracotta/20 hover:border-terracotta hover:text-terracotta transition-all duration-200 disabled:opacity-40"
                @click.stop="deleteFile(file.filename)"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white border border-charcoal/10 py-20 flex flex-col items-center justify-center">
        <svg class="w-10 h-10 text-charcoal/20 mb-4" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
        </svg>
        <p class="text-charcoal/30 text-sm font-light">No media files uploaded yet.</p>
        <p class="text-charcoal/20 text-xs mt-1">Upload images above to get started.</p>
      </div>
    </div>
  </div>
</template>
