<script setup lang="ts">
useSeoMeta({
  title: 'About — Bellaterra',
  description:
    'Bellaterra is a design-led hospitality company creating beautifully restored properties for long stays, retreats, and private events.',
})

const values = [
  {
    title: 'Craft over convenience.',
    body: 'Every decision in a Bellaterra property is made with intention — from the species of timber used for a kitchen shelf to the weight of the linen on your bed. We believe that beauty at this scale is worth the effort.',
  },
  {
    title: 'Slowness as luxury.',
    body: 'The world moves fast. Our spaces are designed as counterweights to that — places where a morning can stretch, where reading is uninterrupted, where the day begins without urgency.',
  },
  {
    title: 'Local as foundation.',
    body: 'Every Bellaterra property is rooted in its geography. We source from regional artisans, commission local stone and wood, and ensure that the place you\'re staying reveals the character of where it stands.',
  },
  {
    title: 'Discretion in all things.',
    body: 'Our guests value privacy. We operate with the quiet professionalism of a family-run institution — present when needed, invisible when not.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative min-h-[70vh] flex items-end overflow-hidden pt-24">
      <img :src="'/uploads/salon-bureau-1er.jpg'" alt="Bellaterra" class="absolute inset-0 w-full h-full object-cover" style="filter: saturate(0.8) brightness(0.85)" />
      <div class="absolute inset-0 bg-gradient-to-br from-chocolate/70 to-espresso/80"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-chocolate via-transparent to-transparent"></div>
      <div class="relative z-10 px-6 md:px-16 lg:px-24 pb-20 md:pb-28 max-w-7xl mx-auto w-full">
        <p class="text-amber/70 text-xs tracking-[0.3em] uppercase font-semibold mb-6">
          Our Story
        </p>
        <h1 class="font-display font-light text-6xl md:text-8xl text-cream leading-tight tracking-tight max-w-3xl">
          Built from<br />a deep belief.
        </h1>
      </div>
    </section>

    <!-- Brand Story -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-warm-white">
      <div class="max-w-3xl mx-auto">
        <p v-reveal class="font-display font-light text-3xl md:text-5xl text-chocolate leading-snug tracking-tight mb-10">
          "Where you stay shapes how you feel. We built Bellaterra on that belief."
        </p>
        <div class="space-y-6 font-sans font-light text-chocolate/65 text-base leading-relaxed">
          <p v-reveal="{ delay: 100 }">
            Bellaterra began not as a business plan, but as a recurring frustration: that beautiful spaces are rarely available for the kind of long, unhurried stay that allows them to genuinely affect you. Hotels are efficient. Vacation rentals are generic. Neither was designed to be lived in — truly lived in — for weeks or months at a time.
          </p>
          <p v-reveal="{ delay: 150 }">
            We set out to create something different. Properties that bear the marks of serious design investment — not styling, design. Spaces where the proportion of a room, the quality of light through a window, the texture of a wall, all conspire together to create the quiet feeling that you are exactly where you should be.
          </p>
          <p v-reveal="{ delay: 200 }">
            We started with one property. We intend to add carefully. The goal is never scale for its own sake — it is depth of experience, consistently delivered.
          </p>
        </div>
        <div v-reveal="{ delay: 250 }" class="h-px w-16 bg-amber mt-14"></div>
      </div>
    </section>

    <!-- Image interlude -->
    <section class="px-6 md:px-16 lg:px-24 pb-24 bg-warm-white">
      <div class="max-w-7xl mx-auto grid grid-cols-3 gap-3 md:gap-4">
        <div v-reveal="{ type: 'scale' }" class="aspect-[3/4] overflow-hidden">
          <img :src="'/uploads/salon-rdc.jpg'" alt="Living room" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        <div v-reveal="{ type: 'scale', delay: 100 }" class="aspect-[3/4] overflow-hidden mt-10 md:mt-16">
          <img :src="'/uploads/cuisine-1.jpg'" alt="Kitchen" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        <div v-reveal="{ type: 'scale', delay: 200 }" class="aspect-[3/4] overflow-hidden">
          <img :src="'/uploads/master-bedroom.jpeg'" alt="Master bedroom" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
      </div>
    </section>

    <!-- Philosophy -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-chocolate">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div>
            <p v-reveal class="kicker text-amber/60 text-xs tracking-[0.3em] uppercase font-semibold mb-8">
              What We Believe
            </p>
            <h2 v-reveal="{ delay: 100 }" class="font-display font-light text-5xl md:text-6xl text-cream leading-tight tracking-tight">
              Four principles<br />we don't compromise.
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="(value, i) in values"
            :key="value.title"
            v-reveal="{ delay: i * 100 }"
            class="card-lift border border-cream/10 p-10 md:p-12 hover:border-amber/30"
          >
            <h3 class="font-display text-2xl text-cream font-light mb-5 leading-snug">
              {{ value.title }}
            </h3>
            <p class="font-sans font-light text-cream/55 text-sm leading-relaxed">
              {{ value.body }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Founder Note -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-warm-white">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          <div v-reveal="{ type: 'scale' }" class="md:col-span-1">
            <div class="aspect-[3/4] overflow-hidden">
              <img :src="'/uploads/entree.jpg'" alt="Bellaterra entrance" class="w-full h-full object-cover" />
            </div>
            <div class="mt-6">
              <p class="font-semibold text-chocolate text-sm">Bellaterra, Founder</p>
              <p class="font-light text-chocolate/50 text-sm mt-1">Est. 2024</p>
            </div>
          </div>
          <div class="md:col-span-2">
            <p v-reveal class="kicker text-terracotta text-xs tracking-[0.3em] uppercase font-semibold mb-8">
              A Note
            </p>
            <blockquote v-reveal="{ delay: 100 }" class="font-display font-light text-3xl md:text-4xl text-chocolate leading-snug tracking-tight mb-10">
              "I want every guest to leave having felt that the space changed something in them — even slightly."
            </blockquote>
            <div class="space-y-5 font-sans font-light text-chocolate/65 text-base leading-relaxed">
              <p v-reveal="{ delay: 150 }">
                The properties we create are personal. They carry the influence of places that moved me — Moroccan riads where afternoon light pooled on plaster walls, farmhouses in the Dordogne where time genuinely slowed, coastal retreats where every meal became ceremonial.
              </p>
              <p v-reveal="{ delay: 200 }">
                Bellaterra is an attempt to distill that quality and offer it to people whose lives are full enough to deserve a proper pause. People who travel thoughtfully, who know the difference between a place that was designed and a place that was furnished.
              </p>
              <p v-reveal="{ delay: 250 }">
                If you find your way to one of our spaces, I hope it earns a permanent place in your memory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-32 md:py-40 px-6 md:px-16 lg:px-24 bg-terracotta">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="font-display font-light text-5xl md:text-7xl text-cream leading-tight tracking-tight mb-8">
          We'd love to<br />host you.
        </h2>
        <NuxtLink
          to="/inquiry"
          class="inline-block px-12 py-4 bg-cream text-chocolate text-xs font-semibold tracking-widest uppercase hover:bg-chocolate hover:text-cream transition-all duration-400"
        >
          Begin Your Inquiry
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
