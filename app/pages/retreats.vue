<script setup lang="ts">
useSeoMeta({
  title: 'Retreats & Private Hire — Bellaterra',
  description:
    'Bellaterra properties transform into private containers for thought, connection, and restoration. Corporate retreats, intimate gatherings, film and editorial productions.',
})

const useTypes = [
  {
    label: 'Corporate Offsites',
    headline: 'Think clearly. Decide boldly.',
    description:
      'Remove your leadership team from the familiar. Bellaterra properties provide the environment for strategy, alignment, and genuine conversation — without the distraction of hotel lobbies or conference rooms. No forced team-building. Just space to think.',
    capacity: 'Up to 14 guests',
    duration: '3 – 7 days',
    color: 'bg-chocolate',
    textColor: 'text-cream',
  },
  {
    label: 'Intimate Retreats',
    headline: 'Gather those who matter.',
    description:
      'Milestone celebrations, creative summits, wellness weekends — Bellaterra provides the backdrop while you provide the intention. Full venue hire includes exclusive access to all indoor and outdoor spaces, kitchen and dining facilities, and optional curated programming.',
    capacity: 'Up to 10 guests',
    duration: '2 – 5 days',
    color: 'bg-cream',
    textColor: 'text-chocolate',
  },
  {
    label: 'Film & Editorial',
    headline: 'The setting your vision deserves.',
    description:
      'Every corner of a Bellaterra property has been composed as a visual decision. Our spaces have hosted editorial fashion shoots, documentary productions, and brand campaign photography — providing an authentic architectural atmosphere that no studio can replicate.',
    capacity: 'Crew up to 20',
    duration: 'Full or half-day',
    color: 'bg-espresso',
    textColor: 'text-cream',
  },
  {
    label: 'Private Events',
    headline: 'Moments made to last.',
    description:
      'Intimate dinners, private concerts, art exhibitions, and proposal evenings. Bellaterra coordinates every detail — from floral installation to chef-curated menus — so that you are fully present for what matters.',
    capacity: 'Up to 30 guests',
    duration: 'Evening or weekend',
    color: 'bg-cocoa',
    textColor: 'text-cream',
  },
]

const addons = [
  { title: 'Private Chef', description: 'Daily meals, private dinners, and catered group lunches prepared by regional chefs using seasonal local produce.' },
  { title: 'Wellness Programming', description: 'Morning yoga, guided meditation, sound healing sessions, and in-house massage — scheduled around your group\'s rhythm.' },
  { title: 'Facilitation', description: 'Structured workshop facilitation for leadership teams, creative sessions, and strategic offsites.' },
  { title: 'Transportation', description: 'Airport transfers, regional excursions, and private day trips curated to complement your stay.' },
  { title: 'Floral & Décor', description: 'Property styling for events, seasonal tablescapes, and ceremonial florals sourced from local markets.' },
  { title: 'Photography', description: 'Dedicated editorial photographer to document your gathering with discretion and artistry.' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative min-h-[80vh] flex items-end overflow-hidden pt-24">
      <img
        :src="'/uploads/salon-bureau-1er.jpg'"
        alt="Library and office — Bellaterra retreats"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-chocolate/55"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-chocolate/70 to-transparent"></div>

      <div class="relative z-10 px-6 md:px-16 lg:px-24 pb-20 md:pb-28 max-w-7xl mx-auto w-full">
        <p class="text-amber/70 text-xs tracking-[0.3em] uppercase font-semibold mb-6">
          Retreats & Private Hire
        </p>
        <h1 class="font-display font-light text-6xl md:text-8xl text-cream leading-tight tracking-tight mb-8 max-w-3xl">
          Space held for what matters most.
        </h1>
        <p class="font-sans font-light text-cream/60 text-lg max-w-xl leading-relaxed">
          A Bellaterra property is more than a backdrop. It is an environment calibrated to shift how your group thinks, feels, and connects.
        </p>
      </div>
    </section>

    <!-- Intro -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-cream">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="font-display font-light text-4xl md:text-6xl text-chocolate leading-snug tracking-tight mb-8">
          We don't do event venues.<br />We offer something rarer.
        </h2>
        <p class="font-sans font-light text-chocolate/65 text-base leading-relaxed max-w-2xl mx-auto">
          The particular quality of a Bellaterra space — its quietude, its natural light, its considered proportions — cannot be manufactured. It must be built over time, with care. When you hire a Bellaterra property for a retreat or private event, you receive exclusive access to that environment, along with our full attention to making your gathering exceptional.
        </p>
        <div class="h-px w-16 bg-amber mx-auto mt-14"></div>
      </div>
    </section>

    <!-- Use Types -->
    <section class="px-6 md:px-16 lg:px-24 pb-24 md:pb-40 bg-cream">
      <div class="max-w-7xl mx-auto">
        <p v-reveal class="kicker text-terracotta text-xs tracking-[0.3em] uppercase font-semibold mb-14">
          How We Host
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(type, i) in useTypes"
            :key="type.label"
            v-reveal="{ delay: i * 80 }"
            :class="[type.color, 'card-lift p-10 md:p-14 flex flex-col justify-between min-h-[400px]']"
          >
            <div>
              <p
                class="text-xs tracking-[0.3em] uppercase font-semibold mb-8 opacity-50"
                :class="type.textColor"
              >
                {{ type.label }}
              </p>
              <h3
                class="font-display font-light text-3xl md:text-4xl leading-tight tracking-tight mb-6"
                :class="type.textColor"
              >
                {{ type.headline }}
              </h3>
              <p
                class="font-sans font-light text-sm leading-relaxed opacity-65"
                :class="type.textColor"
              >
                {{ type.description }}
              </p>
            </div>
            <div class="flex items-center gap-8 mt-10 border-t pt-8"
              :class="type.textColor === 'text-cream' ? 'border-cream/15' : 'border-chocolate/15'"
            >
              <div>
                <p class="text-xs tracking-widest uppercase font-semibold opacity-40" :class="type.textColor">
                  Capacity
                </p>
                <p class="text-sm font-light mt-1" :class="type.textColor">{{ type.capacity }}</p>
              </div>
              <div>
                <p class="text-xs tracking-widest uppercase font-semibold opacity-40" :class="type.textColor">
                  Duration
                </p>
                <p class="text-sm font-light mt-1" :class="type.textColor">{{ type.duration }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Add-ons -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-espresso">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div>
            <p class="text-amber/60 text-xs tracking-[0.3em] uppercase font-semibold mb-8">
              Add-Ons & Services
            </p>
            <h2 class="font-display font-light text-5xl md:text-6xl text-cream leading-tight tracking-tight">
              Every element,<br />considered.
            </h2>
          </div>
          <div class="flex items-end">
            <p class="font-sans font-light text-cream/55 text-base leading-relaxed">
              Your Bellaterra retreat can be as minimal or as rich as you wish. We coordinate a network of trusted collaborators across every discipline — all selected for their craft and their discretion.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(addon, i) in addons"
            :key="addon.title"
            v-reveal="{ delay: i * 80 }"
            class="card-lift border border-cream/10 p-8 hover:border-amber/30"
          >
            <h3 class="font-display text-xl text-cream font-light mb-4">{{ addon.title }}</h3>
            <p class="font-sans font-light text-cream/50 text-sm leading-relaxed">{{ addon.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Visual interlude -->
    <div class="grid grid-cols-3 gap-1 h-48 md:h-72">
      <div class="overflow-hidden">
        <img :src="'/uploads/salon-rdc.jpg'" alt="Living room" class="w-full h-full object-cover" />
      </div>
      <div class="overflow-hidden">
        <img :src="'/uploads/salle-a-manger.jpg'" alt="Dining room" class="w-full h-full object-cover" />
      </div>
      <div class="overflow-hidden">
        <img :src="'/uploads/cuisine-1.jpg'" alt="Kitchen" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Inquiry CTA -->
    <section class="py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-terracotta">
      <div class="max-w-3xl mx-auto text-center">
        <p v-reveal class="kicker justify-center text-cream/60 text-xs tracking-[0.3em] uppercase font-semibold mb-8">
          Plan Your Retreat
        </p>
        <h2 v-reveal="{ delay: 100 }" class="font-display font-light text-5xl md:text-7xl text-cream leading-tight tracking-tight mb-8">
          Tell us your vision.
        </h2>
        <p v-reveal="{ delay: 180 }" class="font-sans font-light text-cream/65 text-base leading-relaxed max-w-lg mx-auto mb-12">
          Every retreat begins with a conversation. Share what you're imagining and we'll design an experience around it.
        </p>
        <NuxtLink
          v-reveal="{ delay: 250 }"
          to="/inquiry"
          class="btn-fill btn-fill-dark inline-block px-12 py-4 bg-cream text-chocolate text-xs font-semibold tracking-widest uppercase hover:text-cream transition-colors duration-400"
        >
          Begin Your Inquiry
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
