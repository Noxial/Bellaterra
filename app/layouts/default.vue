<script setup lang="ts">
const season = useSeason()

useHead(computed(() => ({
  htmlAttrs: {
    class: season.value ? `season-${season.value}` : '',
  },
})))
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Seasonal atmosphere tint (very subtle) -->
    <div
      v-if="season"
      class="season-overlay"
      :class="`season-overlay-${season}`"
    />
    <LayoutTheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
