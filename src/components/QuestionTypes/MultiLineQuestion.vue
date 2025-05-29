<template>
  <div class="multi-line-question">
    <div class="field">
      <label class="label" :for="textareaId">
        {{ questionText }}
        <span v-if="question.required" class="has-text-danger">*</span>
      </label>

      <div class="control">
        <textarea
          :id="textareaId"
          v-model="textValue"
          class="textarea"
          :class="{ 'is-danger': hasError }"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :rows="rows"
          :aria-invalid="hasError ? 'true' : 'false'"
          :aria-describedby="hasError ? `${textareaId}-error` : null"
          @input="handleInput"
          @blur="handleBlur"
        ></textarea>
      </div>

      <div v-if="hasError" class="help is-danger" :id="`${textareaId}-error`">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </div>

      <div class="help">
        <span :class="{ 'has-text-warning': isNearLimit, 'has-text-danger': isOverLimit }">
          {{ characterCount }} / {{ maxLength }}
        </span>
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

const textValue = ref(props.modelValue || '')
const textareaId = `question-${props.question.id}`

// Computed properties
const questionText = computed(() => getQuestionText(props.question))

const placeholder = computed(() => {
  const customPlaceholder = getQuestionPlaceholder(props.question)
  return customPlaceholder || getText(PLACEHOLDERS.MULTI_LINE)
})

const maxLength = computed(() => {
  return props.question.validation_rules?.max_length || 2000
})

const characterCount = computed(() => textValue.value.length)

const isNearLimit = computed(() => characterCount.value > maxLength.value * 0.8)
const isOverLimit = computed(() => characterCount.value > maxLength.value)

const rows = computed(() => {
  const minRows = 4
  const maxRows = 12
  const contentRows = Math.ceil(textValue.value.length / 60) + 1
  return Math.min(Math.max(minRows, contentRows), maxRows)
})

const errors = computed(() => validationErrors[props.question.id] || [])
const hasError = computed(() => errors.value.length > 0)

// Watchers
watch(() => props.modelValue, (newValue) => {
  textValue.value = newValue || ''
})

watch(textValue, (newValue) => {
  if (newValue.length > maxLength.value) {
    textValue.value = newValue.slice(0, maxLength.value)
  }
  emit('update:modelValue', textValue.value)
})

// Event handlers
const handleInput = () => {
  // Replace more than 3 line breaks with 2
  const cleanedValue = textValue.value.replace(/\n{4,}/g, '\n\n\n')
  if (cleanedValue !== textValue.value) {
    textValue.value = cleanedValue
  }
}

const handleBlur = () => {
  // Trim extra spaces and newlines
  textValue.value = textValue.value.trim().replace(/\n\s+/g, '\n')
}
</script>

<style scoped>
.multi-line-question {
  margin-bottom: 1.5rem;
}

.textarea {
  transition: border-color 0.3s ease, height 0.2s ease;
  resize: vertical;
  min-height: 120px;
}

.textarea:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  outline: none;
}

.help {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
