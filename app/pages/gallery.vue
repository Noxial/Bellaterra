<script setup lang="ts">
useSeoMeta({
  title: 'Gallery — Bellaterra',
  description: 'Explore the Bellaterra visual archive — interiors, exteriors, and natural details from our curated properties.',
})

const headerSolid = useHeaderSolid()
onMounted(() => { headerSolid.value = true })
onUnmounted(() => { headerSolid.value = false })

type FilterCategory = 'all' | 'interior' | 'exterior' | 'nature' | 'details'

const activeFilter = ref<FilterCategory>('all')

const filters: { label: string; value: FilterCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Interior', value: 'interior' },
  { label: 'Exterior', value: 'exterior' },
  { label: 'Nature', value: 'nature' },
  { label: 'Details', value: 'details' },
]

interface GalleryItem {
  id: number
  category: FilterCategory
  url: string
  alt: string
  aspectClass: string
  colSpan?: string
}

// Aspect classes assigned by position in a repeating pattern for visual rhythm
const aspectPattern: { aspectClass: string; colSpan?: string }[] = [
  { aspectClass: 'aspect-[4/5]' },
  { aspectClass: 'aspect-[16/9]', colSpan: 'md:col-span-2' },
  { aspectClass: 'aspect-square' },
  { aspectClass: 'aspect-[3/4]' },
  { aspectClass: 'aspect-[4/3]' },
  { aspectClass: 'aspect-square' },
  { aspectClass: 'aspect-[16/9]', colSpan: 'md:col-span-2' },
  { aspectClass: 'aspect-[4/5]' },
  { aspectClass: 'aspect-[3/4]' },
  { aspectClass: 'aspect-square' },
  { aspectClass: 'aspect-[4/3]' },
  { aspectClass: 'aspect-[4/3]' },
]

const staticItems: GalleryItem[] = [
  { id: 1, category: 'interior', url: '/uploads/salon-rdc.jpg', alt: 'Living room — fireplace and natural light', aspectClass: 'aspect-[4/5]' },
  { id: 2, category: 'interior', url: '/uploads/salle-a-manger.jpg', alt: 'Dining room — curated table setting', aspectClass: 'aspect-[16/9]', colSpan: 'md:col-span-2' },
  { id: 3, category: 'details', url: '/uploads/sdb-1er-vue-1.jpg', alt: 'Bathroom — stone and wood', aspectClass: 'aspect-square' },
  { id: 4, category: 'interior', url: '/uploads/master-bedroom.jpeg', alt: 'Master bedroom — linen and light', aspectClass: 'aspect-[3/4]' },
  { id: 5, category: 'interior', url: '/uploads/cuisine-1.jpg', alt: 'Kitchen — considered design', aspectClass: 'aspect-[4/3]' },
  { id: 6, category: 'details', url: '/uploads/sdb-rdc-vue-1.jpg', alt: 'Ground floor bathroom', aspectClass: 'aspect-square' },
  { id: 7, category: 'interior', url: '/uploads/salon-1er.jpg', alt: '1st floor lounge — amber afternoon', aspectClass: 'aspect-[16/9]', colSpan: 'md:col-span-2' },
  { id: 8, category: 'interior', url: '/uploads/cuisine-2.jpg', alt: 'Kitchen — alternate view', aspectClass: 'aspect-[4/5]' },
  { id: 9, category: 'interior', url: '/uploads/salon-bureau-1er.jpg', alt: 'Library and workspace', aspectClass: 'aspect-[3/4]' },
  { id: 10, category: 'details', url: '/uploads/sdb-entree-vue-1.jpg', alt: 'Entrance bathroom', aspectClass: 'aspect-square' },
  { id: 11, category: 'interior', url: '/uploads/main-floor-bedroom.jpeg', alt: 'Main floor bedroom', aspectClass: 'aspect-[4/3]' },
  { id: 12, category: 'interior', url: '/uploads/entree.jpg', alt: 'Entrance hall — first impression', aspectClass: 'aspect-[4/3]' },
]

const { data: dbImages } = await useFetch<{ id: number; url: string; alt_text: string | null; category: string }[]>('/api/gallery')

const galleryItems = computed<GalleryItem[]>(() => {
  const db = dbImages.value ?? []
  if (!db.length) return staticItems
  return db.map((img, i) => {
    const pattern = aspectPattern[i % aspectPattern.length]
    const cat = (['interior', 'exterior', 'nature', 'details'].includes(img.category) ? img.category : 'interior') as FilterCategory
    return { id: img.id, category: cat, url: img.url, alt: img.alt_text ?? '', ...pattern }
  })
})

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return galleryItems.value
  return galleryItems.value.filter(item => item.category === activeFilter.value)
})
</script>

<template>
  <div class="bg-cream min-h-screen">
    <!-- Header -->
    <section class="pt-40 pb-16 md:pt-48 md:pb-20 px-6 md:px-16 lg:px-24">
      <div class="max-w-7xl mx-auto">
        <p class="text-terracotta text-xs tracking-[0.3em] uppercase font-semibold mb-6">
          Visual Archive
        </p>
        <h1 class="font-display font-light text-6xl md:text-8xl text-chocolate leading-none tracking-tight">
          The spaces.
        </h1>
      </div>
    </section>

    <!-- Filter Tabs -->
    <section class="sticky top-20 md:top-24 z-40 bg-cream/95 backdrop-blur-md border-b border-chocolate/8 px-6 md:px-16 lg:px-24 py-5">
      <div class="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="relative text-xs tracking-widest uppercase font-semibold whitespace-nowrap px-4 py-1.5 transition-all duration-300"
          :class="
            activeFilter === filter.value
              ? 'text-terracotta bg-terracotta/10'
              : 'text-chocolate/40 hover:text-chocolate/70 hover:bg-chocolate/5'
          "
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
          <span
            class="absolute bottom-0 left-0 h-0.5 bg-terracotta transition-all duration-400"
            :class="activeFilter === filter.value ? 'w-full' : 'w-0'"
          ></span>
        </button>
      </div>
    </section>

    <!-- Gallery Grid -->
    <section class="px-6 md:px-16 lg:px-24 py-12 md:py-16">
      <div class="max-w-7xl mx-auto">
        <TransitionGroup
          tag="div"
          class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300 ease-in absolute"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-for="item in filteredItems"
            :key="item.id"
            :class="[
              item.colSpan ?? '',
              item.aspectClass,
              'overflow-hidden group cursor-pointer relative bg-chocolate/5',
            ]"
          >
            <img
              :src="item.url"
              :alt="item.alt"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-chocolate/0 group-hover:bg-chocolate/25 transition-all duration-400"></div>
            <!-- Category label on hover -->
            <div class="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span class="text-cream/90 text-xs tracking-widest uppercase font-semibold">
                {{ item.category }}
              </span>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="filteredItems.length === 0" class="py-32 text-center">
          <p class="text-chocolate/30 font-sans font-light tracking-widest uppercase text-sm">
            No images in this category yet.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-chocolate">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="font-display font-light text-4xl md:text-5xl text-cream leading-tight tracking-tight mb-8">
          Ready to experience<br />the spaces in person?
        </h2>
        <NuxtLink
          to="/inquiry"
          class="inline-block px-10 py-3.5 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-300"
        >
          Begin Your Inquiry
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
