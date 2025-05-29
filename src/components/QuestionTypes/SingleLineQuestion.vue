<template>
  <div class="single-line-question">
    <div class="field">
      <label class="label" :for="inputId">
        {{ questionText }}
        <span v-if="question.required" class="has-text-danger">*</span>
      </label>
      
      <div class="control">
        <input
          :id="inputId"
          v-model="inputValue"
          type="text"
          class="input"
          :class="{ 'is-danger': hasError }"
          :placeholder="placeholder"
          :maxlength="maxLength"
          @input="handleInput"
          @blur="handleBlur"
        />
      </div>
      
      <div v-if="hasError" class="help is-danger">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </div>
      
      <div v-if="showCharacterCount" class="help">
        {{ characterCount }} / {{ maxLength }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useSurvey } from '@/composables/useSurvey'
import { useLanguage } from '@/composables/useLanguage'
import { PLACEHOLDERS } from '@/utils/constants'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const { getQuestionText, getQuestionPlaceholder, validationErrors } = useSurvey()
const { getText } = useLanguage()

const inputValue = ref(props.modelValue || '')
const inputId = `question-${props.question.id}`

// Computed properties
const questionText = computed(() => getQuestionText(props.question))

const placeholder = computed(() => {
  const customPlaceholder = getQuestionPlaceholder(props.question)
  if (customPlaceholder) return customPlaceholder
  return getText(PLACEHOLDERS.SINGLE_LINE)
})

const maxLength = computed(() => {
  return props.question.validation_rules?.max_length || 500
})

const characterCount = computed(() => inputValue.value.length)

const showCharacterCount = computed(() => {
  return maxLength.value < 1000 && characterCount.value > maxLength.value * 0.8
})

const errors = computed(() => validationErrors[props.question.id] || [])
const hasError = computed(() => errors.value.length > 0)

// Watchers
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue || ''
})

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// Event handlers
const handleInput = () => {
  // Auto-trim whitespace for single line inputs
  const trimmedValue = inputValue.value.replace(/\s+/g, ' ')
  if (trimmedValue !== inputValue.value) {
    inputValue.value = trimmedValue
  }
}

const handleBlur = () => {
  // Final trim on blur
  inputValue.value = inputValue.value.trim()
}
</script>

<style scoped>
.single-line-question {
  margin-bottom: 1.5rem;
}

.input {
  transition: border-color 0.3s ease;
}

.input:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
}

.label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.help {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>