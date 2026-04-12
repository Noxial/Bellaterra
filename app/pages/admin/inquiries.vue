<script setup lang="ts">
import type { Inquiry } from '~/types'

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: 'Inquiries — Bellaterra Admin',
  robots: 'noindex, nofollow',
})

const statusFilter = ref<string>('all')
const selectedInquiry = ref<Inquiry | null>(null)
const updatingStatus = ref(false)
const updateSuccess = ref(false)
const adminNotesValue = ref('')

const { data: inquiries, refresh } = await useFetch<Inquiry[]>('/api/admin/inquiries')

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
]

const filteredInquiries = computed(() => {
  const all = inquiries.value ?? []
  if (statusFilter.value === 'all') return all
  return all.filter((i) => i.status === statusFilter.value)
})

function selectInquiry(inquiry: Inquiry) {
  selectedInquiry.value = selectedInquiry.value?.id === inquiry.id ? null : inquiry
  adminNotesValue.value = selectedInquiry.value?.internal_notes ?? ''
  updateSuccess.value = false
}

async function updateStatus(status: string) {
  if (!selectedInquiry.value?.id) return
  updatingStatus.value = true
  updateSuccess.value = false
  try {
    await $fetch(`/api/admin/inquiries/${selectedInquiry.value.id}`, {
      method: 'PATCH',
      body: { status, admin_notes: adminNotesValue.value },
    })
    updateSuccess.value = true
    await refresh()
    // Update local selected inquiry
    const updated = inquiries.value?.find(i => i.id === selectedInquiry.value?.id)
    if (updated) selectedInquiry.value = updated
    setTimeout(() => { updateSuccess.value = false }, 3000)
  } catch (e) {
    // silently handle
  } finally {
    updatingStatus.value = false
  }
}

async function saveNotes() {
  if (!selectedInquiry.value?.id) return
  updatingStatus.value = true
  updateSuccess.value = false
  try {
    await $fetch(`/api/admin/inquiries/${selectedInquiry.value.id}`, {
      method: 'PATCH',
      body: { status: selectedInquiry.value.status, admin_notes: adminNotesValue.value },
    })
    updateSuccess.value = true
    await refresh()
    setTimeout(() => { updateSuccess.value = false }, 3000)
  } catch (e) {
    // silently handle
  } finally {
    updatingStatus.value = false
  }
}

const statusColors: Record<string, string> = {
  new: 'bg-terracotta/15 text-terracotta',
  pending: 'bg-terracotta/15 text-terracotta',
  in_progress: 'bg-amber/15 text-amber',
  completed: 'bg-olive/15 text-olive',
  archived: 'bg-charcoal/10 text-charcoal/40',
}

const statusUpdateOptions = ['pending', 'in_progress', 'completed', 'archived']
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="px-8 py-6 border-b border-charcoal/8 bg-white">
      <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Manage</p>
      <h1 class="font-display text-2xl text-charcoal font-light">Inquiries</h1>
    </div>

    <div class="px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3 flex-wrap">
          <button
            v-for="option in statusOptions"
            :key="option.value"
            class="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border transition-all duration-200"
            :class="statusFilter === option.value
              ? 'bg-charcoal text-cream border-charcoal'
              : 'border-charcoal/15 text-charcoal/45 hover:border-charcoal/40'"
            @click="statusFilter = option.value"
          >
            {{ option.label }}
          </button>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-charcoal/40 text-xs font-light">
            {{ filteredInquiries.length }} result{{ filteredInquiries.length !== 1 ? 's' : '' }}
          </span>
          <button
            class="text-xs tracking-widest uppercase font-semibold text-charcoal/40 hover:text-charcoal transition-colors duration-200"
            @click="refresh"
          >
            Refresh
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Table -->
        <div class="lg:col-span-3 bg-white border border-charcoal/10">
          <div class="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-charcoal/8 text-xs tracking-widest uppercase font-semibold text-charcoal/35">
            <span>Contact</span>
            <span>Type</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          <div class="divide-y divide-charcoal/5">
            <div
              v-if="!filteredInquiries.length"
              class="px-5 py-10 text-center text-charcoal/30 text-sm font-light"
            >
              No inquiries match this filter.
            </div>
            <div
              v-for="inquiry in filteredInquiries"
              :key="inquiry.id"
              class="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 cursor-pointer transition-colors duration-200"
              :class="selectedInquiry?.id === inquiry.id
                ? 'bg-terracotta/5 border-l-2 border-l-terracotta'
                : 'hover:bg-charcoal/[0.02] border-l-2 border-l-transparent'"
              @click="selectInquiry(inquiry)"
            >
              <div class="min-w-0">
                <p class="text-sm font-semibold text-charcoal truncate">
                  {{ inquiry.full_name ?? `${inquiry.first_name ?? ''} ${inquiry.last_name ?? ''}`.trim() }}
                </p>
                <p class="text-xs text-charcoal/40 truncate">{{ inquiry.email }}</p>
              </div>
              <span class="text-xs text-charcoal/40 whitespace-nowrap shrink-0">
                {{ (inquiry.inquiry_type ?? '').split(' ').slice(0, 2).join(' ') }}
              </span>
              <span
                class="inline-block px-2.5 py-1 text-xs font-semibold tracking-widest uppercase shrink-0 whitespace-nowrap"
                :class="statusColors[inquiry.status ?? 'pending'] ?? 'bg-charcoal/10 text-charcoal/50'"
              >
                {{ inquiry.status ?? 'pending' }}
              </span>
              <span class="text-xs text-charcoal/30 shrink-0">
                {{ inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detail Panel -->
        <div class="lg:col-span-2">
          <div v-if="selectedInquiry" class="bg-white border border-charcoal/10 p-7 space-y-6">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="font-display text-2xl text-charcoal font-light">
                  {{ selectedInquiry.full_name ?? `${selectedInquiry.first_name ?? ''} ${selectedInquiry.last_name ?? ''}`.trim() }}
                </h2>
                <p class="text-sm text-charcoal/50 mt-1">{{ selectedInquiry.company ?? 'Individual' }}</p>
              </div>
              <span
                class="px-3 py-1 text-xs font-semibold tracking-widest uppercase"
                :class="statusColors[selectedInquiry.status ?? 'pending']"
              >
                {{ selectedInquiry.status ?? 'pending' }}
              </span>
            </div>

            <!-- Contact Details -->
            <div class="space-y-4 border-t border-charcoal/8 pt-5">
              <div v-if="selectedInquiry.email">
                <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Email</p>
                <a :href="`mailto:${selectedInquiry.email}`" class="text-sm text-charcoal hover:text-terracotta transition-colors duration-300">
                  {{ selectedInquiry.email }}
                </a>
              </div>
              <div v-if="selectedInquiry.phone">
                <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Phone</p>
                <p class="text-sm text-charcoal">{{ selectedInquiry.phone }}</p>
              </div>
              <div v-if="selectedInquiry.inquiry_type">
                <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Type</p>
                <p class="text-sm text-charcoal">{{ selectedInquiry.inquiry_type }}</p>
              </div>
              <div v-if="selectedInquiry.arrival_date || selectedInquiry.departure_date">
                <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Dates</p>
                <p class="text-sm text-charcoal">
                  {{ selectedInquiry.arrival_date ?? '?' }} → {{ selectedInquiry.departure_date ?? '?' }}
                  <span v-if="selectedInquiry.date_flexibility" class="text-charcoal/40">
                    ({{ selectedInquiry.date_flexibility }})
                  </span>
                </p>
              </div>
              <div v-if="selectedInquiry.num_guests">
                <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Guests</p>
                <p class="text-sm text-charcoal">{{ selectedInquiry.num_guests }} guests, {{ selectedInquiry.bedrooms_needed ?? '?' }} bedrooms</p>
              </div>
              <div v-if="selectedInquiry.budget_range">
                <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Budget</p>
                <p class="text-sm text-charcoal">{{ selectedInquiry.budget_range }}</p>
              </div>
              <div v-if="selectedInquiry.experience_description">
                <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Their Vision</p>
                <p class="text-sm text-charcoal/70 leading-relaxed">{{ selectedInquiry.experience_description }}</p>
              </div>
              <div v-if="selectedInquiry.special_requirements">
                <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Special Requirements</p>
                <p class="text-sm text-charcoal/70 leading-relaxed">{{ selectedInquiry.special_requirements }}</p>
              </div>
              <div v-if="selectedInquiry.how_heard">
                <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">How They Heard</p>
                <p class="text-sm text-charcoal">{{ selectedInquiry.how_heard }}</p>
              </div>
            </div>

            <!-- Status Update -->
            <div class="border-t border-charcoal/8 pt-5 space-y-3">
              <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35">Update Status</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="s in statusUpdateOptions"
                  :key="s"
                  :disabled="updatingStatus"
                  class="px-3 py-1.5 text-xs font-semibold tracking-widest uppercase border transition-all duration-200 disabled:opacity-50"
                  :class="selectedInquiry.status === s
                    ? 'bg-charcoal text-cream border-charcoal'
                    : 'border-charcoal/15 text-charcoal/50 hover:border-charcoal/40'"
                  @click="updateStatus(s)"
                >
                  {{ s.replace('_', ' ') }}
                </button>
              </div>

              <!-- Admin Notes -->
              <div class="pt-2">
                <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-2">Admin Notes</label>
                <textarea
                  v-model="adminNotesValue"
                  rows="3"
                  placeholder="Internal notes..."
                  class="w-full border border-charcoal/15 bg-charcoal/2 p-3 text-charcoal font-light text-xs leading-relaxed focus:border-terracotta focus:outline-none transition-colors duration-200 resize-y"
                ></textarea>
                <div class="flex items-center justify-between mt-2">
                  <Transition
                    enter-active-class="transition-all duration-300"
                    enter-from-class="opacity-0"
                    leave-active-class="transition-all duration-200"
                    leave-to-class="opacity-0"
                  >
                    <span v-if="updateSuccess" class="text-olive text-xs font-semibold tracking-widest uppercase">Saved ✓</span>
                    <span v-else></span>
                  </Transition>
                  <button
                    :disabled="updatingStatus"
                    class="px-5 py-2 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-200 disabled:opacity-50"
                    @click="saveNotes"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            <!-- Reply Button -->
            <div class="border-t border-charcoal/8 pt-5">
              <a
                :href="`mailto:${selectedInquiry.email}`"
                class="block w-full text-center py-3 bg-chocolate text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-300"
              >
                Reply by Email
              </a>
            </div>
          </div>

          <div v-else class="bg-white border border-charcoal/10 p-7 flex items-center justify-center h-48">
            <p class="text-charcoal/25 text-sm font-light tracking-wide">Select an inquiry to view details</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
