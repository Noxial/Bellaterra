import type { Inquiry } from '~/types'

export interface InquiryFormData extends Partial<Inquiry> {
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  inquiry_type: string
  arrival_date: string
  departure_date: string
  date_flexibility: string
  num_guests: number | null
  bedrooms_needed: number | null
  primary_use: string
  budget_range: string
  addons: string[]
  experience_description: string
  special_requirements: string
  how_heard: string
  preferred_contact: string
}

export interface InquiryErrors {
  first_name?: string
  last_name?: string
  email?: string
  inquiry_type?: string
  experience_description?: string
  submit?: string
}

export function useInquiry() {
  const TOTAL_STEPS = 3

  const currentStep = ref(1)
  const isSubmitting = ref(false)
  const isSuccess = ref(false)

  const formData = reactive<InquiryFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    inquiry_type: '',
    arrival_date: '',
    departure_date: '',
    date_flexibility: '',
    num_guests: null,
    bedrooms_needed: null,
    primary_use: '',
    budget_range: '',
    addons: [],
    experience_description: '',
    special_requirements: '',
    how_heard: '',
    preferred_contact: '',
  })

  const errors = reactive<InquiryErrors>({})

  function clearErrors() {
    Object.keys(errors).forEach((key) => {
      delete (errors as Record<string, string>)[key]
    })
  }

  function validateStep(step: number): boolean {
    clearErrors()

    if (step === 1) {
      let valid = true

      if (!formData.first_name.trim()) {
        errors.first_name = 'First name is required.'
        valid = false
      }
      if (!formData.last_name.trim()) {
        errors.last_name = 'Last name is required.'
        valid = false
      }
      if (!formData.email.trim()) {
        errors.email = 'Email is required.'
        valid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address.'
        valid = false
      }
      if (!formData.inquiry_type) {
        errors.inquiry_type = 'Please select an inquiry type.'
        valid = false
      }

      return valid
    }

    if (step === 3) {
      let valid = true
      if (!formData.experience_description.trim()) {
        errors.experience_description = 'Please tell us about your ideal experience.'
        valid = false
      }
      return valid
    }

    return true
  }

  function nextStep() {
    if (!validateStep(currentStep.value)) return
    if (currentStep.value < TOTAL_STEPS) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      clearErrors()
      currentStep.value--
    }
  }

  async function submitInquiry() {
    if (!validateStep(3)) return

    isSubmitting.value = true
    clearErrors()

    try {
      await $fetch('/api/inquiries', {
        method: 'POST',
        body: {
          ...formData,
          addons: formData.addons,
        },
      })

      isSuccess.value = true
    } catch (err: unknown) {
      const error = err as { data?: { data?: { errors?: Record<string, string> }; message?: string }; message?: string }
      const serverErrors = error?.data?.data?.errors
      if (serverErrors) {
        Object.assign(errors, serverErrors)
      } else {
        errors.submit =
          error?.data?.message ??
          error?.message ??
          'Something went wrong. Please try again or email us directly.'
      }
    } finally {
      isSubmitting.value = false
    }
  }

  function resetForm() {
    currentStep.value = 1
    isSuccess.value = false
    clearErrors()
    Object.assign(formData, {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      inquiry_type: '',
      arrival_date: '',
      departure_date: '',
      date_flexibility: '',
      num_guests: null,
      bedrooms_needed: null,
      primary_use: '',
      budget_range: '',
      addons: [],
      experience_description: '',
      special_requirements: '',
      how_heard: '',
      preferred_contact: '',
    })
  }

  return {
    currentStep: readonly(currentStep),
    totalSteps: TOTAL_STEPS,
    formData,
    errors,
    isSubmitting: readonly(isSubmitting),
    isSuccess: readonly(isSuccess),
    nextStep,
    prevStep,
    submitInquiry,
    resetForm,
  }
}
