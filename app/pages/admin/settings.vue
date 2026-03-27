<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: 'Settings — Bellaterra Admin',
  robots: 'noindex, nofollow',
})

const { data: settings } = await useFetch<Record<string, string>>('/api/admin/settings')

const sitePassword = ref(settings.value?.site_password ?? '')

const protectionEnabled = computed({
  get: () => settings.value?.protection_enabled === '1',
  set: (val: boolean) => {
    if (settings.value) {
      settings.value = { ...settings.value, protection_enabled: val ? '1' : '0' }
    }
  },
})

const saving = ref(false)
const saved = ref(false)
const showPassword = ref(false)

async function save() {
  saving.value = true
  await $fetch('/api/admin/settings', {
    method: 'PATCH',
    body: {
      protection_enabled: protectionEnabled.value ? '1' : '0',
      site_password: sitePassword.value,
    },
  })
  saving.value = false
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<template>
  <div class="p-8 md:p-12">
    <div class="max-w-3xl">

      <!-- Page Header -->
      <div class="mb-10">
        <p class="text-xs tracking-[0.3em] uppercase font-semibold text-terracotta mb-2">
          Configuration
        </p>
        <h1 class="font-display font-light text-4xl text-chocolate leading-tight">
          Site Settings
        </h1>
      </div>

      <!-- Card -->
      <div class="bg-white border border-sand/60 rounded-xl shadow-sm overflow-hidden">

        <!-- Site Protection Section -->
        <div class="px-8 py-7 border-b border-sand/40">
          <div class="flex items-start justify-between gap-6">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <p class="text-sm font-semibold text-chocolate tracking-wide">
                  Password Protection
                </p>
                <!-- Status badge -->
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide"
                  :class="protectionEnabled
                    ? 'bg-terracotta/12 text-terracotta'
                    : 'bg-sand/40 text-stone'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="protectionEnabled ? 'bg-terracotta' : 'bg-stone'"
                  />
                  {{ protectionEnabled ? 'Active' : 'Disabled' }}
                </span>
              </div>
              <p class="text-xs text-chocolate/55 leading-relaxed">
                Require visitors to enter a password before accessing the site.
              </p>
            </div>

            <!-- Toggle switch -->
            <button
              type="button"
              role="switch"
              :aria-checked="protectionEnabled"
              aria-label="Toggle password protection"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
              :class="protectionEnabled ? 'bg-terracotta' : 'bg-sand'"
              @click="protectionEnabled = !protectionEnabled"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out"
                :class="protectionEnabled ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
        </div>

        <!-- Access Password Section -->
        <div class="px-8 py-7">
          <div class="mb-4">
            <p class="text-sm font-semibold text-chocolate tracking-wide mb-1">
              Access Password
            </p>
            <p class="text-xs text-chocolate/55 leading-relaxed">
              The password visitors must enter to access the site.
            </p>
          </div>

          <div class="relative max-w-sm">
            <input
              v-model="sitePassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter access password"
              autocomplete="new-password"
              class="w-full bg-cream/40 border border-sand/70 rounded-lg px-4 py-2.5 pr-11 text-sm text-chocolate placeholder-stone/60 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta/60 transition-colors duration-200"
            />
            <!-- Show/hide password button -->
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-chocolate transition-colors duration-200"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <!-- Eye icon (show) -->
              <svg
                v-if="!showPassword"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                viewBox="0 0 24 24"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <!-- Eye-off icon (hide) -->
              <svg
                v-else
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                viewBox="0 0 24 24"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Save Button Footer -->
        <div class="px-8 py-5 bg-cream/30 border-t border-sand/40 flex items-center justify-between">
          <!-- Saved confirmation -->
          <Transition
            enter-active-class="transition-opacity duration-200"
            leave-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <p v-if="saved" class="text-xs font-semibold text-olive tracking-wide flex items-center gap-2">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Settings saved
            </p>
            <span v-else />
          </Transition>

          <button
            type="button"
            :disabled="saving"
            class="ml-auto inline-flex items-center gap-2 px-6 py-2.5 bg-chocolate text-cream text-xs font-semibold tracking-widest uppercase rounded-lg transition-all duration-200 hover:bg-espresso disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate focus-visible:ring-offset-2"
            @click="save"
          >
            <svg
              v-if="saving"
              class="w-3.5 h-3.5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ saving ? 'Saving…' : 'Save Settings' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
