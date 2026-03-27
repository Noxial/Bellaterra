<script setup lang="ts">
import { SEASONS, useSeason } from '~/composables/useSeason'
import type { SeasonConfig } from '~/composables/useSeason'

useSeoMeta({
  title: 'Bellaterra — A space can become a memory.',
  description: 'Bellaterra creates, renovates, and manages beautifully designed properties for guests who believe that where you stay shapes how you feel.',
})

const { data: cms } = await useFetch<Record<string, string>>('/api/content/home')
const { data: dbGallery } = await useFetch<{ id: number; url: string; alt_text: string | null }[]>('/api/gallery')

const c = computed(() => cms.value ?? {})
const quote = computed(() => c.value['positioning::quote'] || 'Bellaterra creates, renovates, and manages beautifully designed properties for guests who believe that where you stay shapes how you feel.')

const selectedSeason = useSeason()
const hoveredSeason = ref<string | null>(null)

const activeSeason = computed<SeasonConfig | null>(() =>
  selectedSeason.value ? SEASONS.find(s => s.id === selectedSeason.value) ?? null : null
)

function selectSeason(id: string) {
  selectedSeason.value = id as any
}

function resetSeason() {
  selectedSeason.value = null
  hoveredSeason.value = null
}

function selectSeasonAndScroll(id: string) {
  selectSeason(id)
  if (import.meta.client) {
    nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }
}

// Gallery
const staticGalleryUrls = [
  { url: '/uploads/salon-rdc.jpg', alt: 'Living room with fireplace' },
  { url: '/uploads/salle-a-manger.jpg', alt: 'Dining room' },
  { url: '/uploads/cuisine-1.jpg', alt: 'Kitchen' },
  { url: '/uploads/master-bedroom.jpeg', alt: 'Master bedroom' },
  { url: '/uploads/salon-bureau-1er.jpg', alt: 'Library and office' },
  { url: '/uploads/entree.jpg', alt: 'Entrance hall' },
]

function galleryImg(index: number) {
  const db = dbGallery.value ?? []
  return db[index] ? { url: db[index].url, alt: db[index].alt_text ?? '' } : staticGalleryUrls[index] ?? staticGalleryUrls[0]
}

const seasonImageFilter = computed(() =>
  activeSeason.value?.imageFilter ? `filter: ${activeSeason.value.imageFilter}` : ''
)
</script>

<template>
  <div>
    <!-- ─── SEASONAL SELECTOR HERO ─────────────────────────────────────── -->
    <Transition name="fade" mode="out-in">

      <!-- STATE A: No season selected — expanding panels -->
      <section
        v-if="!selectedSeason"
        key="selector"
        class="relative flex h-screen overflow-hidden"
      >
        <!-- Intro label (top center) -->
        <div class="absolute top-32 left-0 right-0 z-20 text-center pointer-events-none">
          <p class="text-cream/50 text-xs tracking-[0.4em] uppercase font-semibold">Choose Your Season</p>
        </div>

        <!-- Season panels -->
        <div
          v-for="season in SEASONS"
          :key="season.id"
          class="relative flex-1 overflow-hidden cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          :class="hoveredSeason === season.id ? 'flex-[2.5]' : hoveredSeason ? 'flex-[0.7]' : 'flex-1'"
          @mouseenter="hoveredSeason = season.id"
          @mouseleave="hoveredSeason = null"
          @click="selectSeason(season.id)"
        >
          <!-- Background image -->
          <img
            :src="season.image"
            :alt="season.label"
            :style="{ filter: season.imageFilter }"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <!-- Overlay -->
          <div class="absolute inset-0 transition-opacity duration-500" :class="[season.overlayColor, hoveredSeason === season.id ? 'opacity-70' : 'opacity-85']"></div>
          <!-- Vertical gradient at bottom -->
          <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-chocolate/80 to-transparent"></div>

          <!-- Content -->
          <div class="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <!-- Season label — always visible, rotated on desktop when collapsed -->
            <div class="transition-all duration-500">
              <p
                class="text-cream/50 text-xs tracking-[0.35em] uppercase font-semibold mb-2 transition-opacity duration-300"
                :class="hoveredSeason === season.id ? 'opacity-100' : 'opacity-70'"
              >
                {{ season.months }}
              </p>
              <h2
                class="font-display font-light text-cream leading-none tracking-tight transition-all duration-500"
                :class="hoveredSeason === season.id ? 'text-5xl md:text-7xl' : 'text-3xl md:text-5xl'"
              >
                {{ season.label }}
              </h2>
            </div>

            <!-- Expanded content -->
            <Transition name="panel-detail">
              <div v-if="hoveredSeason === season.id" class="mt-6 overflow-hidden">
                <p class="font-display font-light text-cream/80 text-xl md:text-2xl leading-snug mb-4 tracking-tight">
                  {{ season.tagline }}
                </p>
                <p class="font-sans font-light text-cream/55 text-sm leading-relaxed mb-6 max-w-xs hidden md:block">
                  {{ season.description }}
                </p>
                <button
                  class="inline-block px-8 py-3 border border-cream/40 text-cream text-xs font-semibold tracking-widest uppercase hover:bg-cream hover:text-chocolate transition-all duration-300"
                >
                  Select {{ season.label }} →
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Bottom scroll hint -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 pointer-events-none">
          <div class="w-px h-8 bg-cream relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full bg-cream animate-scroll-line"></div>
          </div>
        </div>
      </section>

      <!-- STATE B: Season selected — full-screen hero -->
      <section
        v-else
        key="season-hero"
        class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <img
          :src="activeSeason!.image"
          :alt="activeSeason!.label"
          :style="{ filter: activeSeason!.imageFilter }"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div class="absolute inset-0" :class="activeSeason!.overlayColor"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-chocolate/70 via-transparent to-transparent"></div>
        <div class="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-chocolate/60 to-transparent"></div>
        <!-- Content -->
        <div class="relative z-10 text-center px-6 md:px-16 max-w-5xl mx-auto mt-20 md:mt-24">
          <p v-reveal class="text-cream/50 text-xs tracking-[0.4em] uppercase font-semibold mb-6">
            {{ activeSeason!.months }}
          </p>
          <h1 v-reveal="{ delay: 80 }" class="font-display font-light text-7xl md:text-9xl text-cream leading-none tracking-tight mb-6">
            {{ activeSeason!.label }}
          </h1>
          <p v-reveal="{ delay: 150 }" class="font-display font-light text-cream/75 text-2xl md:text-3xl tracking-tight leading-snug mb-4">
            {{ activeSeason!.tagline }}
          </p>
          <p v-reveal="{ delay: 200 }" class="font-sans font-light text-cream/55 text-base leading-relaxed max-w-lg mx-auto mb-12">
            {{ activeSeason!.description }}
          </p>
          <div v-reveal="{ delay: 260 }" class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink
              :to="`/inquiry?season=${activeSeason!.id}`"
              class="btn-fill btn-fill-terra px-10 py-3.5 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:text-chocolate transition-colors duration-300"
            >
              Inquire for {{ activeSeason!.label }}
            </NuxtLink>
            <button
              class="px-10 py-3.5 border border-cream/30 text-cream/70 text-xs font-semibold tracking-widest uppercase hover:border-cream/60 hover:text-cream transition-all duration-300"
              @click="resetSeason"
            >
              Change Season
            </button>
          </div>
        </div>

        <!-- Season details strip -->
        <div v-reveal="{ delay: 300 }" class="absolute bottom-0 left-0 right-0 bg-chocolate/80 backdrop-blur-sm px-6 md:px-16 py-6 flex flex-wrap items-center gap-8 md:gap-16">
          <div>
            <p class="text-cream/40 text-xs tracking-widest uppercase font-semibold mb-1">Temperature</p>
            <p class="text-cream font-light text-sm">{{ activeSeason!.temperature }}</p>
          </div>
          <div class="h-px w-8 bg-cream/20 hidden md:block rotate-90"></div>
          <div v-for="(activity, i) in activeSeason!.activities" :key="i" class="hidden md:block">
            <p class="text-cream/55 text-xs tracking-widest uppercase font-semibold">{{ activity }}</p>
          </div>
        </div>
      </section>

    </Transition>

    <!-- ─── PHILOSOPHY QUOTE ─────────────────────────────────────────────── -->
    <section class="py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-warm-white">
      <div class="max-w-4xl mx-auto text-center">
        <p v-reveal class="kicker justify-center text-terracotta text-xs tracking-[0.3em] uppercase font-semibold mb-10">
          Our Philosophy
        </p>
        <blockquote
          v-reveal="{ delay: 100 }"
          class="font-display font-light text-3xl md:text-5xl lg:text-6xl text-chocolate leading-snug tracking-tight"
        >
          "{{ quote }}"
        </blockquote>
        <div v-reveal="{ delay: 200 }" class="h-px w-16 bg-amber mx-auto mt-14"></div>
      </div>
    </section>

    <!-- ─── FEATURED PROPERTY ─────────────────────────────────────────────── -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-warm-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
          <div v-reveal="{ type: 'scale' }" class="aspect-[3/4] md:aspect-auto md:h-[680px] relative overflow-hidden">
            <img
              :src="'/uploads/cuisine-1.jpg'"
              alt="Property 303"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-chocolate/40 to-transparent"></div>
            <div class="absolute bottom-8 left-8">
              <span class="text-cream/60 text-xs tracking-widest uppercase font-semibold">Property 303</span>
            </div>
          </div>

          <div class="md:pl-20 pt-12 md:pt-0">
            <p v-reveal class="kicker text-terracotta text-xs tracking-[0.3em] uppercase font-semibold mb-8">
              Featured Property
            </p>
            <h2 v-reveal="{ delay: 80 }" class="font-display font-light text-8xl md:text-[10rem] text-chocolate leading-none tracking-tight mb-4">
              303
            </h2>
            <p v-reveal="{ delay: 130 }" class="text-chocolate/50 text-xs tracking-widest uppercase font-semibold mb-10">
              Seasonal Long-Stay Rental
            </p>
            <p v-reveal="{ delay: 180 }" class="font-sans font-light text-chocolate/70 text-base leading-relaxed mb-6 max-w-md">
              A meticulously restored chalet bathed in natural light. Stone floors, arched ceilings, and curated objects from three continents — designed not just to be admired, but lived in deeply.
            </p>
            <p v-reveal="{ delay: 220 }" class="font-sans font-light text-chocolate/55 text-sm leading-relaxed mb-12 max-w-md">
              Available for stays of one month and beyond. For those seeking an unhurried season — working, creating, or simply being present.
            </p>
            <NuxtLink
              v-reveal="{ delay: 270 }"
              to="/property/303"
              class="inline-flex items-center gap-3 text-sm font-semibold text-chocolate tracking-widest uppercase border-b border-chocolate/30 pb-1 hover:border-terracotta hover:text-terracotta transition-colors duration-300"
            >
              Discover 303
              <span class="text-lg arrow-animate">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── DESIGN STORY (dark) ───────────────────────────────────────────── -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-espresso">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-end mb-20">
          <div>
            <p v-reveal class="kicker text-amber/60 text-xs tracking-[0.3em] uppercase font-semibold mb-8">
              Design & Craft
            </p>
            <h2 v-reveal="{ delay: 100 }" class="font-display font-light text-5xl md:text-7xl text-cream leading-tight tracking-tight">
              Every detail<br />is a decision.
            </h2>
          </div>
          <div>
            <p v-reveal="{ delay: 150 }" class="font-sans font-light text-cream/55 text-base leading-relaxed">
              We don't furnish spaces — we compose them. Each property passes through an extended design process: sourcing antiques in regional markets, commissioning local artisans, selecting natural textiles, and calibrating light at every hour of day.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div v-reveal="{ type: 'scale' }" class="aspect-[3/4] overflow-hidden">
            <img :src="galleryImg(0).url" :alt="galleryImg(0).alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div v-reveal="{ type: 'scale', delay: 100 }" class="aspect-[3/4] overflow-hidden mt-8 md:mt-16">
            <img :src="galleryImg(1).url" :alt="galleryImg(1).alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div v-reveal="{ type: 'scale', delay: 200 }" class="aspect-[3/4] overflow-hidden">
            <img :src="galleryImg(2).url" :alt="galleryImg(2).alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div v-reveal="{ type: 'scale', delay: 300 }" class="aspect-[3/4] overflow-hidden mt-8 md:mt-16">
            <img :src="galleryImg(3).url" :alt="galleryImg(3).alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SEASON CARDS GRID ─────────────────────────────────────────────── -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-cream">
      <div class="max-w-7xl mx-auto">
        <div class="mb-14">
          <p v-reveal class="kicker text-terracotta text-xs tracking-[0.3em] uppercase font-semibold mb-6">
            Four Seasons
          </p>
          <h2 v-reveal="{ delay: 80 }" class="font-display font-light text-5xl md:text-6xl text-chocolate tracking-tight leading-tight">
            Choose your<br />chapter.
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(season, i) in SEASONS"
            :key="season.id"
            v-reveal="{ delay: i * 80 }"
            class="card-lift relative aspect-[3/4] overflow-hidden cursor-pointer group"
            @click="selectSeasonAndScroll(season.id)"
          >
            <img :src="season.image" :alt="season.label" :style="{ filter: season.imageFilter }" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute inset-0" :class="season.overlayColor"></div>
            <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-chocolate/80 to-transparent"></div>
            <div class="absolute inset-0 flex flex-col justify-end p-6">
              <p class="text-cream/50 text-xs tracking-widest uppercase font-semibold mb-2">{{ season.months }}</p>
              <h3 class="font-display font-light text-4xl text-cream leading-none mb-3">{{ season.label }}</h3>
              <p class="font-sans font-light text-cream/60 text-sm leading-relaxed">{{ season.tagline }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── RETREATS TEASER ───────────────────────────────────────────────── -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-cocoa">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p v-reveal class="kicker text-cream/50 text-xs tracking-[0.3em] uppercase font-semibold mb-8">
              Retreats & Private Hire
            </p>
            <h2 v-reveal="{ delay: 100 }" class="font-display font-light text-5xl md:text-7xl text-cream leading-tight tracking-tight mb-10">
              Beyond<br />the stay.
            </h2>
            <p v-reveal="{ delay: 150 }" class="font-sans font-light text-cream/65 text-base leading-relaxed mb-12">
              Bellaterra transforms into a private container for thought, connection, and restoration. Corporate retreats, intimate gatherings, film productions — each designed with the same care as our long stays.
            </p>
            <NuxtLink
              v-reveal="{ delay: 200 }"
              to="/retreats"
              class="btn-fill btn-fill-cream inline-block px-10 py-3.5 border border-cream/50 text-cream text-xs font-semibold tracking-widest uppercase hover:text-chocolate transition-colors duration-300"
            >
              Explore Retreats
            </NuxtLink>
          </div>
          <div v-reveal="{ type: 'scale', delay: 100 }" class="aspect-[4/5] overflow-hidden relative">
            <img :src="'/uploads/salon-bureau-1er.jpg'" alt="Retreat" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-cocoa/30"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── INQUIRY CTA ───────────────────────────────────────────────────── -->
    <section class="py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-terracotta">
      <div class="max-w-4xl mx-auto text-center">
        <p v-reveal class="kicker justify-center text-cream/60 text-xs tracking-[0.3em] uppercase font-semibold mb-10">
          Begin Here
        </p>
        <h2 v-reveal="{ delay: 100 }" class="font-display font-light text-5xl md:text-7xl lg:text-8xl text-cream leading-tight tracking-tight mb-10">
          Let's design<br />your stay.
        </h2>
        <p v-reveal="{ delay: 180 }" class="font-sans font-light text-cream/65 text-base leading-relaxed max-w-lg mx-auto mb-14">
          Tell us which season calls to you. We'll respond within 48 hours with a thoughtful proposal.
        </p>
        <NuxtLink
          v-reveal="{ delay: 250 }"
          to="/inquiry"
          class="btn-fill btn-fill-dark inline-block px-12 py-4 bg-cream text-chocolate text-xs font-semibold tracking-widest uppercase hover:text-cream transition-colors duration-400"
        >
          Start Your Inquiry
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.panel-detail-enter-active {
  transition: opacity 0.4s ease 0.1s, max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s;
  max-height: 200px;
  overflow: hidden;
}
.panel-detail-leave-active {
  transition: opacity 0.2s ease, max-height 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}
.panel-detail-enter-from,
.panel-detail-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
