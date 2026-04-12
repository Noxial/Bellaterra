<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: 'Availability — Bellaterra Admin',
  robots: 'noindex, nofollow',
})

interface AvailabilityBlock {
  id?: number
  property_id: number
  start_date: string
  end_date: string
  reason: 'booked' | 'blocked' | 'maintenance'
  notes: string | null
}

const { data: blocks, refresh } = await useFetch<AvailabilityBlock[]>('/api/admin/availability')

const showAddForm = ref(false)
const savingBlock = ref(false)
const deleteSuccess = ref<number | null>(null)

const newBlock = ref<Partial<AvailabilityBlock>>({
  start_date: '',
  end_date: '',
  reason: 'booked',
  notes: '',
  property_id: 1,
})

const typeColors: Record<string, string> = {
  booked: 'bg-terracotta/15 text-terracotta',
  blocked: 'bg-amber/15 text-amber',
  maintenance: 'bg-charcoal/10 text-charcoal/60',
}

const typeOptions = [
  { value: 'booked', label: 'Booked' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'maintenance', label: 'Maintenance' },
]

const filterType = ref<string>('all')
const filterYear = ref<number>(new Date().getFullYear())

const filteredBlocks = computed(() => {
  let list = blocks.value ?? []
  if (filterType.value !== 'all') {
    list = list.filter(b => b.reason === filterType.value)
  }
  list = list.filter(b => {
    const year = new Date(b.start_date).getFullYear()
    return year === filterYear.value
  })
  return list.sort((a, b) => a.start_date.localeCompare(b.start_date))
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function daysBetween(from: string, to: string) {
  const ms = new Date(to).getTime() - new Date(from).getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

async function addBlock() {
  if (!newBlock.value.start_date || !newBlock.value.end_date || !newBlock.value.reason) return
  savingBlock.value = true
  try {
    await $fetch('/api/admin/availability', {
      method: 'POST',
      body: newBlock.value,
    })
    newBlock.value = { start_date: '', end_date: '', reason: 'booked', notes: '', property_id: 1 }
    showAddForm.value = false
    await refresh()
  } catch {
    // handle
  } finally {
    savingBlock.value = false
  }
}

async function deleteBlock(id: number) {
  if (!confirm('Delete this block?')) return
  try {
    await $fetch(`/api/admin/availability/${id}`, { method: 'DELETE' })
    deleteSuccess.value = id
    await refresh()
    setTimeout(() => { deleteSuccess.value = null }, 2000)
  } catch {
    // handle
  }
}

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="px-8 py-6 border-b border-charcoal/8 bg-white flex items-center justify-between">
      <div>
        <p class="text-xs tracking-widest uppercase font-semibold text-charcoal/35 mb-1">Property 303</p>
        <h1 class="font-display text-2xl text-charcoal font-light">Availability</h1>
      </div>
      <button
        class="px-6 py-3 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-200"
        @click="showAddForm = !showAddForm"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Block' }}
      </button>
    </div>

    <div class="px-8 py-8">
      <!-- Add Block Form -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 -translate-y-2"
        leave-active-class="transition-all duration-200"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showAddForm" class="bg-white border border-charcoal/10 p-6 mb-6">
          <h3 class="text-xs tracking-widest uppercase font-semibold text-charcoal/50 mb-5">New Availability Block</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">From</label>
              <input
                v-model="newBlock.start_date"
                type="date"
                class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
              />
            </div>
            <div>
              <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">To</label>
              <input
                v-model="newBlock.end_date"
                type="date"
                class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
              />
            </div>
            <div>
              <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Reason</label>
              <select
                v-model="newBlock.reason"
                class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
              >
                <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs tracking-widest uppercase font-semibold text-charcoal/40 mb-2">Notes (optional)</label>
              <input
                v-model="newBlock.notes"
                type="text"
                placeholder="e.g. Guest name, reason..."
                class="w-full border border-charcoal/15 bg-charcoal/[0.02] p-3 text-charcoal text-sm focus:border-terracotta focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>
          <button
            :disabled="savingBlock || !newBlock.start_date || !newBlock.end_date"
            class="px-8 py-3 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-200 disabled:opacity-50"
            @click="addBlock"
          >
            {{ savingBlock ? 'Saving...' : 'Create Block' }}
          </button>
        </div>
      </Transition>

      <!-- Filters -->
      <div class="flex items-center gap-4 mb-6 flex-wrap">
        <!-- Year Filter -->
        <div class="flex items-center gap-2">
          <button
            v-for="year in years"
            :key="year"
            class="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border transition-all duration-200"
            :class="filterYear === year
              ? 'bg-charcoal text-cream border-charcoal'
              : 'border-charcoal/15 text-charcoal/45 hover:border-charcoal/40'"
            @click="filterYear = year"
          >
            {{ year }}
          </button>
        </div>
        <div class="h-4 w-px bg-charcoal/15"></div>
        <!-- Reason Filter -->
        <div class="flex items-center gap-2">
          <button
            class="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border transition-all duration-200"
            :class="filterType === 'all'
              ? 'bg-charcoal text-cream border-charcoal'
              : 'border-charcoal/15 text-charcoal/45 hover:border-charcoal/40'"
            @click="filterType = 'all'"
          >
            All
          </button>
          <button
            v-for="opt in typeOptions"
            :key="opt.value"
            class="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border transition-all duration-200"
            :class="filterType === opt.value
              ? 'bg-charcoal text-cream border-charcoal'
              : 'border-charcoal/15 text-charcoal/45 hover:border-charcoal/40'"
            @click="filterType = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Blocks Table -->
      <div class="bg-white border border-charcoal/10">
        <div class="grid grid-cols-[auto_auto_auto_1fr_auto] gap-4 px-5 py-3 border-b border-charcoal/8 text-xs tracking-widest uppercase font-semibold text-charcoal/35">
          <span>From</span>
          <span>To</span>
          <span>Duration</span>
          <span>Notes</span>
          <span>Reason</span>
        </div>
        <div class="divide-y divide-charcoal/5">
          <div
            v-if="!filteredBlocks.length"
            class="px-5 py-10 text-center text-charcoal/30 text-sm font-light"
          >
            No availability blocks for {{ filterYear }}.
          </div>
          <div
            v-for="block in filteredBlocks"
            :key="block.id"
            class="grid grid-cols-[auto_auto_auto_1fr_auto] gap-4 items-center px-5 py-4 hover:bg-charcoal/[0.02] transition-colors duration-200 group"
          >
            <span class="text-sm text-charcoal font-medium whitespace-nowrap">{{ formatDate(block.start_date) }}</span>
            <span class="text-sm text-charcoal whitespace-nowrap">{{ formatDate(block.end_date) }}</span>
            <span class="text-xs text-charcoal/40 whitespace-nowrap">
              {{ daysBetween(block.start_date, block.end_date) }}d
            </span>
            <span class="text-sm text-charcoal/60 font-light truncate">{{ block.notes ?? '—' }}</span>
            <div class="flex items-center gap-3">
              <span
                class="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase whitespace-nowrap"
                :class="typeColors[block.reason] ?? 'bg-charcoal/10 text-charcoal/50'"
              >
                {{ block.reason }}
              </span>
              <button
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-terracotta/60 hover:text-terracotta"
                :title="`Delete block`"
                @click="deleteBlock(block.id!)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div v-if="filteredBlocks.length" class="mt-4 flex items-center gap-6 text-xs text-charcoal/40">
        <span>{{ filteredBlocks.length }} block{{ filteredBlocks.length !== 1 ? 's' : '' }}</span>
        <span>
          {{ filteredBlocks.reduce((sum, b) => sum + daysBetween(b.start_date, b.end_date), 0) }} total days
        </span>
      </div>
    </div>
  </div>
</template>
