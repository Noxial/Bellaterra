<script setup lang="ts">
const props = defineProps<{ season: string }>()

interface Particle {
  x: number        // left %
  delay: number    // animation-delay s
  duration: number // animation-duration s
  size: number     // scale multiplier
  drift: number    // --px-drift value px
  opacity: number
}

const particles = ref<Particle[]>([])

const counts: Record<string, number> = {
  winter: 38,
  spring: 26,
  summer: 7,
  fall:   30,
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

onMounted(() => {
  const n = counts[props.season] ?? 0
  particles.value = Array.from({ length: n }, () => ({
    x:        rand(0, 100),
    delay:    rand(0, 12),
    duration: rand(7, 18),
    size:     rand(0.5, 1.5),
    drift:    rand(-40, 40),
    opacity:  rand(0.35, 0.85),
  }))
})
</script>

<template>
  <div
    v-if="particles.length"
    class="absolute inset-0 overflow-hidden pointer-events-none"
    style="z-index: 6"
    aria-hidden="true"
  >
    <!-- Winter: gentle snowflakes -->
    <template v-if="season === 'winter'">
      <div
        v-for="(p, i) in particles"
        :key="i"
        class="absolute top-0 rounded-full bg-white"
        :style="{
          left: `${p.x}%`,
          width: `${p.size * 5}px`,
          height: `${p.size * 5}px`,
          opacity: p.opacity,
          boxShadow: `0 0 ${p.size * 4}px rgba(255,255,255,0.6)`,
          animationName: 'season-snow',
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          '--px-drift': `${p.drift}px`,
        }"
      />
    </template>

    <!-- Spring: blush petals -->
    <template v-else-if="season === 'spring'">
      <div
        v-for="(p, i) in particles"
        :key="i"
        class="absolute top-0"
        :style="{
          left: `${p.x}%`,
          width: `${p.size * 10}px`,
          height: `${p.size * 6}px`,
          borderRadius: '50% 50% 50% 0',
          background: i % 3 === 0
            ? 'rgba(240,200,185,0.85)'
            : i % 3 === 1
              ? 'rgba(250,230,215,0.75)'
              : 'rgba(235,185,170,0.8)',
          opacity: p.opacity,
          animationName: 'season-petal',
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          '--px-drift': `${p.drift}px`,
        }"
      />
    </template>

    <!-- Summer: golden light shafts from above -->
    <template v-else-if="season === 'summer'">
      <div
        v-for="(p, i) in particles"
        :key="i"
        class="absolute top-0"
        :style="{
          left: `${p.x}%`,
          width: `${p.size * 2}px`,
          height: `${p.size * 200}px`,
          background: 'linear-gradient(to bottom, rgba(255,215,100,0.55), rgba(255,180,60,0.1), transparent)',
          transformOrigin: 'top center',
          animationName: 'season-ray',
          animationDuration: `${p.duration * 1.8}s`,
          animationDelay: `${p.delay}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        }"
      />
    </template>

    <!-- Fall: amber leaf shapes -->
    <template v-else-if="season === 'fall'">
      <div
        v-for="(p, i) in particles"
        :key="i"
        class="absolute top-0"
        :style="{
          left: `${p.x}%`,
          width: `${p.size * 10}px`,
          height: `${p.size * 10}px`,
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
          background: i % 4 === 0
            ? 'rgba(196,98,45,0.75)'
            : i % 4 === 1
              ? 'rgba(196,154,60,0.8)'
              : i % 4 === 2
                ? 'rgba(160,70,20,0.7)'
                : 'rgba(180,110,40,0.75)',
          opacity: p.opacity,
          animationName: 'season-leaf',
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          '--px-drift': `${p.drift}px`,
        }"
      />
    </template>
  </div>
</template>
