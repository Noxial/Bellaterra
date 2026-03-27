<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: 'Content — Bellaterra Admin',
  robots: 'noindex, nofollow',
})

interface ContentItem {
  id?: number
  page: string
  section: string
  key: string
  value: string
  type: 'text' | 'textarea'
}

const { data: rawContent, refresh } = await useFetch<ContentItem[]>('/api/admin/content')

// Default content structure if DB is empty
const defaultContent: ContentItem[] = [
  { page: 'home', section: 'hero', key: 'headline', value: 'A space becomes a memory.', type: 'text' },
  { page: 'home', section: 'hero', key: 'subtext', value: 'Long-stay seasonal rentals. Private retreats. Editorial spaces.', type: 'text' },
  { page: 'home', section: 'positioning', key: 'quote', value: 'Bellaterra creates, renovates, and manages beautifully designed properties for guests who believe that where you stay shapes how you feel.', type: 'textarea' },
  { page: 'home', section: 'positioning', key: 'cta_label', value: 'Explore Property 303', type: 'text' },
  { page: 'property_303', section: 'hero', key: 'headline', value: 'Property 303', type: 'text' },
  { page: 'property_303', section: 'hero', key: 'tagline', value: 'A singular space. Yours for a season.', type: 'text' },
  { page: 'property_303', section: 'description', key: 'body', value: 'A meticulously restored residence bathed in natural light. Stone floors, arched ceilings, and curated objects from three continents — designed not just to be admired, but lived in deeply.', type: 'textarea' },
  { page: 'retreats', section: 'hero', key: 'headline', value: 'Private Retreats', type: 'text' },
  { page: 'retreats', section: 'hero', key: 'description', value: 'Bellaterra properties transform into private containers for thought, connection, and restoration. Corporate leadership retreats. Intimate gatherings. Film and editorial productions.', type: 'textarea' },
  { page: 'about', section: 'hero', key: 'headline', value: 'About Bellaterra', type: 'text' },
  { page: 'about', section: 'story', key: 'body', value: 'Bellaterra was born from a belief that spaces shape how we feel, how we think, and how we connect with others.', type: 'textarea' },
  { page: 'gallery', section: 'hero', key: 'headline', value: 'Gallery', type: 'text' },
  { page: 'inquiry', section: 'hero', key: 'headline', value: 'Begin Your Inquiry', type: 'text' },
  { page: 'inquiry', section: 'hero', key: 'subtext', value: 'Tell us about your vision and we\'ll craft the perfect experience.', type: 'text' },
  { page: 'global', section: 'footer', key: 'tagline', value: 'A space can become a memory.', type: 'text' },
  { page: 'global', section: 'footer', key: 'contact_email', value: 'hello@bellaterra.co', type: 'text' },
  { page: 'global', section: 'footer', key: 'instagram', value: '@bellaterra', type: 'text' },
]

// Merge DB content with defaults
const content = computed<ContentItem[]>(() => {
  const db = rawContent.value ?? []
  if (!db.length) return defaultContent

  const merged = [...defaultContent]
  for (const item of db) {
    const idx = merged.findIndex(d => d.page === item.page && d.section === item.section && d.key === item.key)
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], ...item }
    } else {
      merged.push(item)
    }
  }
  return merged
})

// Group by page
const pages = computed(() => {
  const map = new Map<string, { section: string; items: ContentItem[] }[]>()
  for (const item of content.value) {
    if (!map.has(item.page)) map.set(item.page, [])
    const pageSections = map.get(item.page)!
    let sec = pageSections.find(s => s.section === item.section)
    if (!sec) {
      sec = { section: item.section, items: [] }
      pageSections.push(sec)
    }
    sec.items.push(item)
  }
  return map
})

const pageLabels: Record<string, string> = {
  home: 'Home',
  property_303: 'Property 303',
  retreats: 'Retreats',
  about: 'About',
  gallery: 'Gallery',
  inquiry: 'Inquiry',
  global: 'Global / Footer',
}

const pageOrder = ['home', 'property_303', 'retreats', 'about', 'gallery', 'inquiry', 'global']
const orderedPages = computed(() => pageOrder.filter(p => pages.value.has(p)))

// Local editable values
const localValues = ref<Record<string, string>>({})

watch(content, (items) => {
  for (const item of items) {
    const k = `${item.page}::${item.section}::${item.key}`
    if (!(k in localValues.value)) {
      localValues.value[k] = item.value ?? ''
    }
  }
}, { immediate: true })

function getKey(item: ContentItem) {
  return `${item.page}::${item.section}::${item.key}`
}

const saving = ref<Record<string, boolean>>({})
const saveSuccess = ref<Record<string, boolean>>({})

async function saveSection(page: string, section: string, items: ContentItem[]) {
  const sk = `${page}::${section}`
  saving.value[sk] = true
  saveSuccess.value[sk] = false
  try {
    await Promise.all(items.map(item =>
      $fetch('/api/admin/content', {
        method: 'PATCH',
        body: {
          page: item.page,
          section: item.section,
          key: item.key,
          value: localValues.value[getKey(item)] ?? item.value,
          type: item.type,
        },
      })
    ))
    saveSuccess.value[sk] = true
    await refresh()
    setTimeout(() => { saveSuccess.value[sk] = false }, 3000)
  } catch {
    // handle error
  } finally {
    saving.value[sk] = false
  }
}

const expandedPages = ref<Set<string>>(new Set(['home']))

function togglePage(page: string) {
  if (expandedPages.value.has(page)) {
    expandedPages.value.delete(page)
  } else {
    expandedPages.value.add(page)
  }
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="px-8 py-6 border-b border-charcoal/8 bg-white flex items-center justify-between">
      <div>
        <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">CMS</p>
        <h1 class="font-display text-2xl text-charcoal font-light">Content Editor</h1>
      </div>
      <p class="text-xs text-charcoal/40 font-light max-w-xs text-right leading-relaxed">
        Edit all website copy. Changes are saved per section to the database.
      </p>
    </div>

    <div class="px-8 py-8 max-w-4xl">
      <!-- Page Accordions -->
      <div class="space-y-3">
        <div
          v-for="pageKey in orderedPages"
          :key="pageKey"
          class="bg-white border border-charcoal/10"
        >
          <!-- Page Header Toggle -->
          <button
            class="w-full flex items-center justify-between px-6 py-5 hover:bg-charcoal/[0.02] transition-colors duration-200"
            @click="togglePage(pageKey)"
          >
            <div class="flex items-center gap-3">
              <span class="font-display text-lg text-charcoal font-light">{{ pageLabels[pageKey] ?? pageKey }}</span>
              <span class="text-xs tracking-widest text-charcoal/30 uppercase font-semibold">{{ pages.get(pageKey)?.length ?? 0 }} sections</span>
            </div>
            <svg
              class="w-4 h-4 text-charcoal/40 transition-transform duration-300"
              :class="expandedPages.has(pageKey) ? 'rotate-180' : ''"
              fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Sections -->
          <div v-if="expandedPages.has(pageKey)" class="border-t border-charcoal/8">
            <div
              v-for="sec in pages.get(pageKey)"
              :key="sec.section"
              class="px-6 py-6 border-b border-charcoal/5 last:border-b-0"
            >
              <div class="flex items-center justify-between mb-5">
                <h3 class="text-xs tracking-widest uppercase font-semibold text-charcoal/50">
                  {{ sec.section.replace(/_/g, ' ') }}
                </h3>
                <div class="flex items-center gap-3">
                  <Transition
                    enter-active-class="transition-all duration-300"
                    enter-from-class="opacity-0"
                    leave-active-class="transition-all duration-200"
                    leave-to-class="opacity-0"
                  >
                    <span
                      v-if="saveSuccess[`${pageKey}::${sec.section}`]"
                      class="text-olive text-xs font-semibold tracking-widest uppercase"
                    >
                      Saved ✓
                    </span>
                  </Transition>
                  <button
                    :disabled="saving[`${pageKey}::${sec.section}`]"
                    class="px-6 py-2 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-200 disabled:opacity-50"
                    @click="saveSection(pageKey, sec.section, sec.items)"
                  >
                    {{ saving[`${pageKey}::${sec.section}`] ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  v-for="item in sec.items"
                  :key="getKey(item)"
                >
                  <label class="block text-xs font-semibold text-charcoal/40 mb-2 font-mono">{{ item.key }}</label>
                  <textarea
                    v-if="item.type === 'textarea'"
                    v-model="localValues[getKey(item)]"
                    rows="3"
                    class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm leading-relaxed focus:border-terracotta focus:outline-none transition-colors duration-200 resize-y"
                  ></textarea>
                  <input
                    v-else
                    v-model="localValues[getKey(item)]"
                    type="text"
                    class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal font-light text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
