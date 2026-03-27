<script setup lang="ts">
import { useInquiry } from '~/composables/useInquiry'
import { SEASONS, useSeason } from '~/composables/useSeason'

useSeoMeta({
  title: 'Inquire — Bellaterra',
  description: 'Begin your Bellaterra seasonal rental inquiry.',
})

const headerLight = useHeaderLight()
onMounted(() => { headerLight.value = true })
onUnmounted(() => { headerLight.value = false })

const {
  currentStep,
  totalSteps,
  formData,
  isSubmitting,
  isSuccess,
  errors,
  nextStep,
  prevStep,
  submitInquiry,
} = useInquiry()

// Pre-fill season from query param or from useSeason state
const route = useRoute()
const globalSeason = useSeason()

const selectedSeason = ref<string>(
  (route.query.season as string) || globalSeason.value || ''
)

watch(selectedSeason, (v) => {
  formData.inquiry_type = v ? `Seasonal rental — ${v.charAt(0).toUpperCase() + v.slice(1)}` : ''
})

// Set on mount
onMounted(() => {
  if (selectedSeason.value) {
    formData.inquiry_type = `Seasonal rental — ${selectedSeason.value.charAt(0).toUpperCase() + selectedSeason.value.slice(1)}`
  }
})

const activeSeason = computed(() => SEASONS.find(s => s.id === selectedSeason.value) ?? null)

// Auto-set form data when season is confirmed
const SEASON_PERIODS: Record<string, { label: string; start: string; months: string }> = {
  winter: { label: 'December — March', start: 'December', months: activeSeason.value?.months ?? 'Dec — Mar' },
  spring: { label: 'April — June',     start: 'April',    months: activeSeason.value?.months ?? 'Apr — Jun' },
  summer: { label: 'July — September', start: 'July',     months: activeSeason.value?.months ?? 'Jul — Sep' },
  fall:   { label: 'October — November', start: 'October', months: activeSeason.value?.months ?? 'Oct — Nov' },
}

watch(selectedSeason, (v) => {
  if (v && SEASON_PERIODS[v]) {
    formData.date_flexibility = `Full season — ${SEASON_PERIODS[v].label}`
    formData.arrival_date = SEASON_PERIODS[v].start
  }
}, { immediate: true })

const seasonPeriod = computed(() =>
  selectedSeason.value ? SEASON_PERIODS[selectedSeason.value] : null
)

const howHeardOptions = [
  'Word of mouth',
  'Instagram',
  'Google Search',
  'Editorial feature',
  'Architecture publication',
  'Agency referral',
  'Other',
]
</script>

<template>
  <div class="min-h-screen bg-warm-white">

    <!-- Page Header -->
    <section class="pt-40 pb-16 px-6 md:px-16 lg:px-24 bg-warm-white border-b border-chocolate/8">
      <div class="max-w-3xl mx-auto">
        <p class="text-terracotta text-xs tracking-[0.3em] uppercase font-semibold mb-6">Begin Here</p>
        <h1 class="font-display font-light text-5xl md:text-7xl text-chocolate leading-tight tracking-tight mb-4">
          Let's design<br />your season.
        </h1>
        <p class="font-sans font-light text-chocolate/55 text-base leading-relaxed">
          Tell us which season calls to you. We respond within 48 hours.
        </p>
      </div>
    </section>

    <!-- Success State -->
    <div v-if="isSuccess" class="px-6 md:px-16 lg:px-24 py-24">
      <div class="max-w-2xl mx-auto text-center">
        <div class="w-16 h-px bg-amber mx-auto mb-12"></div>
        <h2 class="font-display font-light text-4xl md:text-5xl text-chocolate leading-tight tracking-tight mb-6">
          Thank you.
        </h2>
        <p class="font-sans font-light text-chocolate/65 text-base leading-relaxed mb-4">
          Your inquiry has been received. A member of the Bellaterra team will be in touch within 48 hours.
        </p>
        <p class="font-sans font-light text-chocolate/40 text-sm leading-relaxed mb-12">
          In the meantime, feel free to explore the gallery or learn more about our spaces.
        </p>
        <div class="flex items-center justify-center gap-6">
          <NuxtLink to="/gallery" class="text-sm font-semibold text-chocolate/60 tracking-widest uppercase border-b border-chocolate/20 pb-1 hover:text-chocolate hover:border-chocolate transition-all duration-300">View Gallery</NuxtLink>
          <NuxtLink to="/" class="text-sm font-semibold text-chocolate/60 tracking-widest uppercase border-b border-chocolate/20 pb-1 hover:text-chocolate hover:border-chocolate transition-all duration-300">Return Home</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="px-6 md:px-16 lg:px-24 py-16 md:py-24">
      <div class="max-w-3xl mx-auto">

        <!-- Step Progress -->
        <div class="flex items-center gap-4 mb-16">
          <div v-for="step in totalSteps" :key="step" class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 flex items-center justify-center text-xs font-semibold tracking-wide transition-all duration-300"
                :class="step === currentStep ? 'bg-terracotta text-cream' : step < currentStep ? 'bg-chocolate text-cream' : 'border border-chocolate/20 text-chocolate/30'"
              >
                <svg v-if="step < currentStep" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>{{ step }}</span>
              </div>
              <span
                class="text-xs tracking-widest uppercase font-semibold hidden md:block transition-colors duration-300"
                :class="step === currentStep ? 'text-chocolate' : 'text-chocolate/30'"
              >
                {{ step === 1 ? 'Your Season' : step === 2 ? 'Your Stay' : 'Your Vision' }}
              </span>
            </div>
            <div v-if="step < totalSteps" class="w-12 h-px transition-colors duration-300" :class="step < currentStep ? 'bg-chocolate' : 'bg-chocolate/15'"></div>
          </div>
        </div>

        <!-- STEP 1: Season + Contact -->
        <Transition name="step" mode="out-in">
          <div v-if="currentStep === 1" key="step1">
            <h2 class="font-display font-light text-3xl md:text-4xl text-chocolate mb-8 tracking-tight">
              Choose your season.
            </h2>

            <!-- Season Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              <div
                v-for="season in SEASONS"
                :key="season.id"
                class="relative aspect-[3/4] overflow-hidden cursor-pointer group transition-all duration-300"
                :class="selectedSeason === season.id ? 'ring-2 ring-terracotta ring-offset-2 ring-offset-warm-white' : 'opacity-70 hover:opacity-100'"
                @click="selectedSeason = season.id"
              >
                <img :src="season.image" :alt="season.label" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div class="absolute inset-0" :class="season.overlayColor"></div>
                <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-chocolate/80 to-transparent"></div>
                <div class="absolute inset-0 flex flex-col justify-end p-4">
                  <p class="text-cream/50 text-xs tracking-widest uppercase font-semibold mb-1">{{ season.months }}</p>
                  <h3 class="font-display font-light text-2xl text-cream leading-none">{{ season.label }}</h3>
                </div>
                <!-- Selected checkmark -->
                <div v-if="selectedSeason === season.id" class="absolute top-3 right-3 w-6 h-6 bg-terracotta flex items-center justify-center">
                  <svg class="w-3 h-3 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Selected season mini-summary -->
            <div v-if="activeSeason" class="mb-12 p-6 bg-chocolate/5 border-l-2 border-terracotta">
              <p class="text-terracotta text-xs tracking-widest uppercase font-semibold mb-2">{{ activeSeason.label }} · {{ activeSeason.months }}</p>
              <p class="font-display font-light text-chocolate text-xl leading-snug">{{ activeSeason.tagline }}</p>
              <p class="font-sans font-light text-chocolate/55 text-sm leading-relaxed mt-2">{{ activeSeason.description }}</p>
            </div>

            <!-- Contact Fields -->
            <h3 class="font-display font-light text-2xl text-chocolate mb-8 tracking-tight">About you.</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">First Name <span class="text-terracotta">*</span></label>
                <input v-model="formData.first_name" type="text" class="border-b border-chocolate/20 bg-transparent p-3 text-chocolate font-light focus:border-terracotta outline-none transition-colors duration-300 placeholder:text-chocolate/20" placeholder="Your first name" />
                <p v-if="errors.first_name" class="text-terracotta text-xs">{{ errors.first_name }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">Last Name <span class="text-terracotta">*</span></label>
                <input v-model="formData.last_name" type="text" class="border-b border-chocolate/20 bg-transparent p-3 text-chocolate font-light focus:border-terracotta outline-none transition-colors duration-300 placeholder:text-chocolate/20" placeholder="Your last name" />
                <p v-if="errors.last_name" class="text-terracotta text-xs">{{ errors.last_name }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">Email <span class="text-terracotta">*</span></label>
                <input v-model="formData.email" type="email" class="border-b border-chocolate/20 bg-transparent p-3 text-chocolate font-light focus:border-terracotta outline-none transition-colors duration-300 placeholder:text-chocolate/20" placeholder="you@example.com" />
                <p v-if="errors.email" class="text-terracotta text-xs">{{ errors.email }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">Phone</label>
                <input v-model="formData.phone" type="tel" class="border-b border-chocolate/20 bg-transparent p-3 text-chocolate font-light focus:border-terracotta outline-none transition-colors duration-300 placeholder:text-chocolate/20" placeholder="+1 234 567 8900" />
              </div>
            </div>
          </div>
        </Transition>

        <!-- STEP 2: Stay Details -->
        <Transition name="step" mode="out-in">
          <div v-if="currentStep === 2" key="step2">
            <h2 class="font-display font-light text-3xl md:text-4xl text-chocolate mb-12 tracking-tight">
              About your stay.
            </h2>

            <!-- Season period card -->
            <div v-if="activeSeason" class="mb-12 relative overflow-hidden">
              <div class="absolute inset-0">
                <img :src="activeSeason.image" :alt="activeSeason.label" class="w-full h-full object-cover" :style="{ filter: activeSeason.imageFilter }" />
                <div class="absolute inset-0" :class="activeSeason.overlayColor"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-chocolate/80 to-transparent"></div>
              </div>
              <div class="relative z-10 p-8 md:p-10">
                <p class="text-cream/50 text-xs tracking-[0.35em] uppercase font-semibold mb-3">Your Season</p>
                <h3 class="font-display font-light text-cream text-4xl md:text-5xl leading-none tracking-tight mb-3">{{ activeSeason.label }}</h3>
                <p class="text-cream/70 font-sans font-light text-base mb-2">{{ seasonPeriod?.label }}</p>
                <p class="text-cream/45 font-sans font-light text-sm">{{ activeSeason.description }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">




              <!-- Guests -->
              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">Number of Guests</label>
                <input
                  v-model="formData.num_guests"
                  type="number"
                  min="1"
                  max="20"
                  class="border-b border-chocolate/20 bg-transparent p-3 text-chocolate font-light focus:border-terracotta outline-none transition-colors duration-300"
                  placeholder="e.g. 4"
                />
              </div>

              <!-- Bedrooms -->
              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">Bedrooms Needed</label>
                <input
                  v-model="formData.bedrooms_needed"
                  type="number"
                  min="1"
                  max="10"
                  class="border-b border-chocolate/20 bg-transparent p-3 text-chocolate font-light focus:border-terracotta outline-none transition-colors duration-300"
                  placeholder="e.g. 2"
                />
              </div>

              <!-- Budget -->
              <div class="flex flex-col gap-2 md:col-span-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">Budget Range</label>
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="range in ['Under €5,000', '€5,000–€10,000', '€10,000–€20,000', '€20,000–€50,000', '€50,000+', 'To discuss']"
                    :key="range"
                    type="button"
                    class="px-4 py-2 border text-xs tracking-widest uppercase font-semibold transition-all duration-300"
                    :class="formData.budget_range === range ? 'border-terracotta bg-terracotta text-cream' : 'border-chocolate/20 text-chocolate/50 hover:border-chocolate/50'"
                    @click="formData.budget_range = range"
                  >
                    {{ range }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- STEP 3: Vision -->
        <Transition name="step" mode="out-in">
          <div v-if="currentStep === 3" key="step3">
            <h2 class="font-display font-light text-3xl md:text-4xl text-chocolate mb-12 tracking-tight">
              Paint us a picture.
            </h2>
            <div class="flex flex-col gap-10">
              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">Describe your ideal experience <span class="text-terracotta">*</span></label>
                <textarea
                  v-model="formData.experience_description"
                  rows="5"
                  class="border-b border-chocolate/20 bg-transparent p-3 text-chocolate font-light focus:border-terracotta outline-none transition-colors duration-300 resize-none placeholder:text-chocolate/20"
                  placeholder="Tell us about the mood, what you're hoping to feel or accomplish during your season..."
                ></textarea>
                <p v-if="errors.experience_description" class="text-terracotta text-xs">{{ errors.experience_description }}</p>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">Special Requirements</label>
                <textarea
                  v-model="formData.special_requirements"
                  rows="3"
                  class="border-b border-chocolate/20 bg-transparent p-3 text-chocolate font-light focus:border-terracotta outline-none transition-colors duration-300 resize-none placeholder:text-chocolate/20"
                  placeholder="Accessibility needs, dietary requirements, any specific considerations..."
                ></textarea>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-xs tracking-widest uppercase font-semibold text-chocolate/50">How did you hear about Bellaterra?</label>
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="option in howHeardOptions"
                    :key="option"
                    type="button"
                    class="px-4 py-2 border text-xs tracking-widest uppercase font-semibold transition-all duration-300"
                    :class="formData.how_heard === option ? 'border-terracotta bg-terracotta text-cream' : 'border-chocolate/20 text-chocolate/50 hover:border-chocolate/50'"
                    @click="formData.how_heard = option"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Navigation -->
        <div class="flex items-center justify-between mt-16 pt-10 border-t border-chocolate/10">
          <button
            v-if="currentStep > 1"
            type="button"
            class="text-xs font-semibold tracking-widest uppercase text-chocolate/40 hover:text-chocolate transition-colors duration-300"
            @click="prevStep"
          >
            ← Back
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < totalSteps"
            type="button"
            class="px-10 py-3.5 bg-chocolate text-cream text-xs font-semibold tracking-widest uppercase hover:bg-terracotta transition-colors duration-300"
            @click="nextStep"
          >
            Continue →
          </button>

          <button
            v-if="currentStep === totalSteps"
            type="button"
            :disabled="isSubmitting"
            class="px-10 py-3.5 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:opacity-85 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="submitInquiry"
          >
            <span v-if="isSubmitting">Sending...</span>
            <span v-else>Submit Inquiry</span>
          </button>
        </div>

        <p v-if="errors.submit" class="mt-4 text-terracotta text-sm text-center">{{ errors.submit }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-enter-active,
.step-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.step-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.step-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
