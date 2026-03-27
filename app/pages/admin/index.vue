<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: 'Dashboard — Bellaterra Admin',
  robots: 'noindex, nofollow',
})

const { data: inquiries } = await useFetch<any[]>('/api/admin/inquiries')

const stats = computed(() => {
  const all = inquiries.value ?? []
  return [
    { label: 'Total Inquiries', value: all.length, color: 'bg-deep-green text-cream' },
    { label: 'Pending', value: all.filter((i) => i.status === 'pending' || i.status === 'new').length, color: 'bg-terracotta text-cream' },
    { label: 'In Progress', value: all.filter((i) => i.status === 'in_progress').length, color: 'bg-golden-brass text-charcoal' },
    { label: 'Completed', value: all.filter((i) => i.status === 'completed').length, color: 'bg-olive text-cream' },
  ]
})

const recentInquiries = computed(() => (inquiries.value ?? []).slice(0, 6))
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="px-8 py-6 border-b border-charcoal/8 bg-white">
      <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Overview</p>
      <h1 class="font-display text-2xl text-charcoal font-light">Dashboard</h1>
    </div>

    <div class="px-8 py-8 max-w-7xl">
      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div
          v-for="stat in stats"
          :key="stat.label"
          :class="[stat.color, 'p-6']"
        >
          <p class="text-xs tracking-widest uppercase font-semibold opacity-60 mb-2">{{ stat.label }}</p>
          <p class="font-display text-5xl font-light">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Quick Nav Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <NuxtLink
          to="/admin/inquiries"
          class="bg-white border border-charcoal/10 p-6 hover:border-terracotta/40 transition-colors duration-300"
        >
          <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Manage</p>
          <p class="font-display text-2xl text-charcoal font-light">Inquiries →</p>
        </NuxtLink>
        <NuxtLink
          to="/admin/content"
          class="bg-white border border-charcoal/10 p-6 hover:border-terracotta/40 transition-colors duration-300"
        >
          <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Edit</p>
          <p class="font-display text-2xl text-charcoal font-light">Content →</p>
        </NuxtLink>
        <NuxtLink
          to="/admin/availability"
          class="bg-white border border-charcoal/10 p-6 hover:border-terracotta/40 transition-colors duration-300"
        >
          <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Manage</p>
          <p class="font-display text-2xl text-charcoal font-light">Availability →</p>
        </NuxtLink>
      </div>

      <!-- Recent Inquiries -->
      <div class="bg-white border border-charcoal/10">
        <div class="flex items-center justify-between px-6 py-5 border-b border-charcoal/8">
          <h2 class="font-sans text-sm font-semibold text-charcoal tracking-wide">Recent Inquiries</h2>
          <NuxtLink to="/admin/inquiries" class="text-xs text-terracotta tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity duration-200">
            View All →
          </NuxtLink>
        </div>
        <div class="divide-y divide-charcoal/5">
          <div
            v-if="!recentInquiries.length"
            class="px-6 py-8 text-center text-charcoal/30 text-sm font-light"
          >
            No inquiries yet.
          </div>
          <div
            v-for="inquiry in recentInquiries"
            :key="inquiry.id"
            class="px-6 py-4 flex items-center justify-between gap-6 hover:bg-charcoal/[0.02] transition-colors duration-200"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-8 h-8 bg-deep-green/10 flex items-center justify-center text-xs font-semibold text-deep-green shrink-0">
                {{ (inquiry.full_name?.[0] ?? inquiry.first_name?.[0] ?? '?').toUpperCase() }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-charcoal truncate">
                  {{ inquiry.full_name ?? `${inquiry.first_name ?? ''} ${inquiry.last_name ?? ''}`.trim() }}
                </p>
                <p class="text-xs text-charcoal/40 truncate">{{ inquiry.email }}</p>
              </div>
            </div>
            <div class="hidden md:block shrink-0">
              <p class="text-xs text-charcoal/50">{{ inquiry.inquiry_type }}</p>
            </div>
            <div class="shrink-0">
              <span
                class="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase"
                :class="{
                  'bg-terracotta/15 text-terracotta': inquiry.status === 'new' || inquiry.status === 'pending',
                  'bg-golden-brass/15 text-golden-brass': inquiry.status === 'in_progress',
                  'bg-olive/15 text-olive': inquiry.status === 'completed',
                  'bg-charcoal/10 text-charcoal/50': !['new','pending','in_progress','completed'].includes(inquiry.status),
                }"
              >
                {{ inquiry.status ?? 'pending' }}
              </span>
            </div>
            <div class="hidden md:block shrink-0 text-xs text-charcoal/30">
              {{ inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString('en-GB') : '—' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
