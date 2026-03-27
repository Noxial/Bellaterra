<script setup lang="ts">
import type { Property } from '~/types'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: property, error } = await useFetch<Property>(`/api/properties/${slug.value}`)

if (error.value) {
  throw createError({ statusCode: 404, message: 'Property not found' })
}

useSeoMeta({
  title: computed(() => `${property.value?.name ?? 'Property'} — Bellaterra`),
  description: computed(() => property.value?.short_description ?? ''),
})

// Fallback images used when property has no DB images
const fallbackImages = [
  { url: '/uploads/salon-rdc.jpg', alt: 'Living room — stone fireplace and natural light' },
  { url: '/uploads/master-bedroom.jpeg', alt: 'Master bedroom — linen and natural textures' },
  { url: '/uploads/cuisine-1.jpg', alt: 'Kitchen — wood and stone' },
  { url: '/uploads/salle-a-manger.jpg', alt: 'Dining room — curated setting' },
]

function img(index: number) {
  const dbImages = property.value?.images ?? []
  const src = dbImages[index]
  return src ? { url: src.url, alt: src.alt_text ?? '' } : fallbackImages[index] ?? fallbackImages[0]
}

const details = computed(() => [
  { label: 'Bedrooms', value: property.value?.bedrooms ? `${property.value.bedrooms}` : '—' },
  { label: 'Bathrooms', value: property.value?.bathrooms ? `${property.value.bathrooms}` : '—' },
  { label: 'Guests', value: property.value?.max_guests ? `Up to ${property.value.max_guests}` : '—' },
  { label: 'Min Stay', value: property.value?.min_stay_days ? `${property.value.min_stay_days} nights` : '—' },
  { label: 'Location', value: property.value?.location_city ?? '—' },
  { label: 'Type', value: property.value?.property_type ?? '—' },
])
</script>

<template>
  <div v-if="property">
    <!-- Full-bleed Hero -->
    <section class="relative min-h-screen overflow-hidden">
      <!-- Background photo -->
      <img
        :src="(property.images?.[0]?.url) || '/uploads/salon-rdc.jpg'"
        :alt="property.name"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-chocolate/85 via-chocolate/20 to-chocolate/30"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-end min-h-screen px-6 md:px-16 lg:px-24 pb-20 md:pb-28 pt-40">
        <div class="max-w-7xl mx-auto w-full">
          <p class="text-amber/70 text-xs tracking-[0.3em] uppercase font-semibold mb-6">
            Bellaterra Property
          </p>
          <h1 class="font-display font-light text-7xl md:text-9xl text-cream leading-none tracking-tight mb-6">
            {{ property.name }}
          </h1>
          <p class="font-sans font-light text-cream/60 text-lg max-w-xl leading-relaxed">
            {{ property.short_description }}
          </p>
          <div class="mt-10 flex items-center gap-6">
            <span class="text-cream/40 text-xs tracking-widest uppercase">
              {{ property.location_city }}, {{ property.location_country }}
            </span>
            <span class="w-px h-4 bg-cream/20"></span>
            <span class="text-cream/40 text-xs tracking-widest uppercase">
              {{ property.property_type }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Overview -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-cream">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
          <div>
            <p v-reveal class="kicker text-terracotta text-xs tracking-[0.3em] uppercase font-semibold mb-8">
              About This Property
            </p>
            <h2 v-reveal="{ delay: 100 }" class="font-display font-light text-4xl md:text-6xl text-chocolate leading-tight tracking-tight mb-10">
              A home designed<br />for living deeply.
            </h2>
            <div v-reveal="{ delay: 180 }" class="prose prose-neutral font-sans font-light text-chocolate/70 text-base leading-relaxed">
              <p>{{ property.description }}</p>
            </div>
          </div>

          <!-- Key Details -->
          <div v-reveal="{ type: 'scale', delay: 100 }" class="bg-chocolate p-10 md:p-14">
            <p class="text-amber/60 text-xs tracking-[0.3em] uppercase font-semibold mb-8">
              Property Details
            </p>
            <div class="grid grid-cols-2 gap-8">
              <div
                v-for="(detail, i) in details"
                :key="detail.label"
                class="border-b border-cream/10 pb-5 transition-opacity duration-300"
              >
                <p class="text-cream/40 text-xs tracking-widest uppercase font-semibold mb-1.5">
                  {{ detail.label }}
                </p>
                <p class="text-cream text-base font-light">{{ detail.value }}</p>
              </div>
            </div>

            <div class="mt-10 pt-8 border-t border-cream/10" v-if="property.price_per_month">
              <p class="text-cream/40 text-xs tracking-widest uppercase font-semibold mb-2">
                Starting from
              </p>
              <p class="font-display text-4xl text-cream font-light">
                ${{ property.price_per_month.toLocaleString() }}
                <span class="text-cream/40 text-lg font-sans">/month</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interior photo strip -->
    <section class="py-4 px-6 md:px-16 lg:px-24 bg-cream">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-3 gap-3 md:gap-4">
          <div class="col-span-2 aspect-[16/9] overflow-hidden">
            <img :src="img(0).url" :alt="img(0).alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div class="aspect-[3/4] overflow-hidden">
            <img :src="img(1).url" :alt="img(1).alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>

    <!-- Second photo strip -->
    <section class="py-4 px-6 md:px-16 lg:px-24 bg-cream">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-3 gap-3 md:gap-4">
          <div class="aspect-[3/4] overflow-hidden">
            <img :src="img(2).url" :alt="img(2).alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div class="col-span-2 aspect-[16/9] overflow-hidden">
            <img :src="img(3).url" :alt="img(3).alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>

    <!-- Location -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-cream">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p class="text-terracotta text-xs tracking-[0.3em] uppercase font-semibold mb-8">
              Location
            </p>
            <h2 class="font-display font-light text-4xl md:text-6xl text-chocolate leading-tight tracking-tight mb-8">
              Situated with<br />intention.
            </h2>
            <p class="font-sans font-light text-chocolate/65 text-base leading-relaxed mb-4">
              {{ property.location_description ?? `Located in ${property.location_city}, ${property.location_country} — this property was chosen for its quietude, its proximity to nature, and its connection to local culture without being consumed by it.` }}
            </p>
            <p class="text-chocolate/40 text-sm mt-6">
              {{ property.location_city }}, {{ property.location_country }}
            </p>
          </div>
          <div class="aspect-[4/3] overflow-hidden">
            <img
              :src="'/uploads/entree-1.jpg'"
              alt="Bellaterra entrance"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Inquiry CTA -->
    <section class="py-32 md:py-40 px-6 md:px-16 lg:px-24 bg-espresso">
      <div class="max-w-3xl mx-auto text-center">
        <p v-reveal class="kicker justify-center text-amber/60 text-xs tracking-[0.3em] uppercase font-semibold mb-8">
          Availability
        </p>
        <h2 v-reveal="{ delay: 100 }" class="font-display font-light text-5xl md:text-7xl text-cream leading-tight tracking-tight mb-8">
          This could be<br />your next chapter.
        </h2>
        <p v-reveal="{ delay: 180 }" class="font-sans font-light text-cream/50 text-base leading-relaxed mb-12 max-w-lg mx-auto">
          Minimum stays begin at {{ property.min_stay_days }} nights. We'll work with your timeline to find the perfect arrangement.
        </p>
        <NuxtLink
          v-reveal="{ delay: 250 }"
          to="/inquiry"
          class="btn-fill btn-fill-dark inline-block px-12 py-4 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:text-cream transition-colors duration-300"
        >
          Begin Your Inquiry
        </NuxtLink>
      </div>
    </section>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center bg-cream">
    <p class="text-chocolate/40 font-sans font-light tracking-widest uppercase text-sm">
      Property not found.
    </p>
  </div>
</template>
