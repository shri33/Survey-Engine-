<template>
  <div class="single-line-question" :class="{ 'is-required': question.required }">
    <div class="field">
      <!-- Question Label -->
      <label class="label" :for="inputId">
        {{ questionText }}
        <span v-if="question.required" class="has-text-danger" aria-label="Required">*</span>
        <span v-if="question.description" class="question-description">
          {{ questionDescription }}
        </span>
      </label>
      
      <!-- Input Control -->
      <div class="control" :class="{ 'has-icons-left': hasIcon, 'has-icons-right': hasValidationIcon }">
        <input
          :id="inputId"
          ref="inputRef"
          v-model="inputValue"
          :type="inputType"
          class="input"
          :class="inputClasses"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :minlength="minLength"
          :pattern="validationPattern"
          :autocomplete="autocompleteValue"
          :disabled="isDisabled"
          :readonly="isReadonly"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="hasError"
          :aria-required="question.required"
          @input="handleInput"
          @blur="handleBlur"
          @focus="handleFocus"
          @keydown="handleKeydown"
          @paste="handlePaste"
        />
        
        <!-- Left Icon -->
        <span v-if="hasIcon" class="icon is-small is-left">
          <i :class="iconClass" aria-hidden="true"></i>
        </span>
        
        <!-- Validation Icon -->
        <span v-if="hasValidationIcon" class="icon is-small is-right">
          <i :class="validationIconClass" aria-hidden="true"></i>
        </span>
      </div>
      
      <!-- Error Messages -->
      <div v-if="hasError" class="help is-danger" :id="`${inputId}-errors`">
        <ul class="error-list">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      
      <!-- Character Count -->
      <div 
        v-if="showCharacterCount" 
        class="help character-count"
        :class="characterCountClass"
      >
        <span class="count-text">
          {{ characterCount }}<span class="separator">/</span>{{ maxLength }}
        </span>
        <span v-if="isNearLimit" class="limit-warning">
          {{ getText('CHAR_LIMIT_WARNING') }}
        </span>
      </div>
      
      <!-- Validation Feedback -->
      <div v-if="showValidationFeedback && !hasError" class="help is-success">
        <i class="fas fa-check" aria-hidden="true"></i>
        {{ getText('VALIDATION_SUCCESS') }}
      </div>
      
      <!-- Help Text -->
      <div v-if="helpText" class="help is-info" :id="`${inputId}-help`">
        <i class="fas fa-info-circle" aria-hidden="true"></i>
        {{ helpText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { useSurvey } from '@/composables/useSurvey'
import { useLanguage } from '@/composables/useLanguage'
import { 
  QUESTION_TYPES, 
  VALIDATION_RULES, 
  REGEX_PATTERNS,
  UI_COLORS 
} from '@/utils/constants'

const props = defineProps({
  question: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object' && value.id
    }
  },
  modelValue: {
    type: String,
    default: ''
  },
  // Additional props for enhanced functionality
  autoFocus: {
    type: Boolean,
    default: false
  },
  showValidationFeedback: {
    type: Boolean,
    default: true
  },
  debounceDelay: {
    type: Number,
    default: 300
  },
  validateOnInput: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue',
  'input',
  'focus',
  'blur',
  'validation-change',
  'character-limit-warning'
])

// Composables
const { 
  getQuestionText, 
  getQuestionPlaceholder, 
  validateQuestion,
  saveAnswer,
  validationErrors 
} = useSurvey()
const { getText, currentLanguage } = useLanguage()

// Refs
const inputRef = ref(null)
const inputValue = ref(props.modelValue || '')
const isFocused = ref(false)
const hasBeenTouched = ref(false)
let debounceTimer = null

// Computed Properties
const inputId = computed(() => `question-${props.question.id}`)

const questionText = computed(() => getQuestionText(props.question))

const questionDescription = computed(() => {
  return props.question.description?.[currentLanguage.value] || ''
})

const placeholder = computed(() => {
  const customPlaceholder = getQuestionPlaceholder(props.question)
  if (customPlaceholder) return customPlaceholder
  
  // Default placeholders based on question type/validation
  const rules = props.question.validation_rules || {}
  if (rules.email) return getText('PLACEHOLDER_EMAIL')
  if (rules.phone) return getText('PLACEHOLDER_PHONE')
  if (rules.url) return getText('PLACEHOLDER_URL')
  
  return getText('PLACEHOLDER_SINGLE_LINE')
})

const inputType = computed(() => {
  const rules = props.question.validation_rules || {}
  if (rules.email) return 'email'
  if (rules.url) return 'url'
  if (rules.number) return 'number'
  return 'text'
})

const autocompleteValue = computed(() => {
  const rules = props.question.validation_rules || {}
  if (rules.email) return 'email'
  if (rules.phone) return 'tel'
  if (rules.url) return 'url'
  return 'off'
})

const maxLength = computed(() => {
  return props.question.validation_rules?.max_length || 500
})

const minLength = computed(() => {
  return props.question.validation_rules?.min_length || 0
})

const validationPattern = computed(() => {
  const rules = props.question.validation_rules || {}
  if (rules.pattern) return rules.pattern
  if (rules.email) return REGEX_PATTERNS.EMAIL.source
  if (rules.phone) return REGEX_PATTERNS.PHONE.source
  if (rules.url) return REGEX_PATTERNS.URL.source
  return null
})

const characterCount = computed(() => inputValue.value.length)

const isNearLimit = computed(() => {
  return characterCount.value > maxLength.value * 0.8
})

const showCharacterCount = computed(() => {
  return maxLength.value < 1000 && (
    characterCount.value > maxLength.value * 0.5 || 
    isNearLimit.value ||
    isFocused.value
  )
})

const characterCountClass = computed(() => {
  if (characterCount.value >= maxLength.value) return 'has-text-danger'
  if (isNearLimit.value) return 'has-text-warning'
  return 'has-text-grey'
})

const errors = computed(() => validationErrors.value[props.question.id] || [])
const hasError = computed(() => errors.value.length > 0)

const isValid = computed(() => {
  return hasBeenTouched.value && !hasError.value && inputValue.value.length > 0
})

const isDisabled = computed(() => props.disabled)
const isReadonly = computed(() => props.readonly)

const inputClasses = computed(() => {
  return {
    'is-danger': hasError.value,
    'is-success': isValid.value && props.showValidationFeedback,
    'is-focused': isFocused.value,
    'is-loading': false // Can be used for async validation
  }
})

// Icon configuration
const hasIcon = computed(() => {
  const rules = props.question.validation_rules || {}
  return rules.email || rules.phone || rules.url
})

const iconClass = computed(() => {
  const rules = props.question.validation_rules || {}
  if (rules.email) return 'fas fa-envelope'
  if (rules.phone) return 'fas fa-phone'
  if (rules.url) return 'fas fa-link'
  return ''
})

const hasValidationIcon = computed(() => {
  return props.showValidationFeedback && hasBeenTouched.value && inputValue.value.length > 0
})

const validationIconClass = computed(() => {
  if (hasError.value) return 'fas fa-exclamation-triangle has-text-danger'
  if (isValid.value) return 'fas fa-check has-text-success'
  return ''
})

const helpText = computed(() => {
  return props.question.help_text?.[currentLanguage.value] || ''
})

const ariaDescribedBy = computed(() => {
  const ids = []
  if (hasError.value) ids.push(`${inputId.value}-errors`)
  if (helpText.value) ids.push(`${inputId.value}-help`)
  return ids.length > 0 ? ids.join(' ') : null
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue || ''
  }
})

watch(inputValue, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    emit('update:modelValue', newValue)
    
    if (props.validateOnInput) {
      debouncedValidation()
    }
    
    // Character limit warning
    if (isNearLimit.value && !wasNearLimit(oldValue)) {
      emit('character-limit-warning', {
        current: characterCount.value,
        max: maxLength.value
      })
    }
  }
})

// Methods
const wasNearLimit = (oldValue) => {
  return oldValue && oldValue.length > maxLength.value * 0.8
}

const debouncedValidation = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(() => {
    validateAndSave()
  }, props.debounceDelay)
}

const validateAndSave = async () => {
  if (inputValue.value.trim()) {
    const validation = await validateQuestion(props.question.id, inputValue.value)
    emit('validation-change', validation)
    
    if (validation.isValid) {
      await saveAnswer(props.question.id, inputValue.value)
    }
  }
}

const handleInput = (event) => {
  const value = event.target.value
  
  // Handle special input formatting
  if (inputType.value === 'phone') {
    inputValue.value = formatPhoneNumber(value)
  } else {
    // Auto-trim excessive whitespace for single line inputs
    inputValue.value = value.replace(/\s+/g, ' ')
  }
  
  emit('input', inputValue.value)
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  hasBeenTouched.value = true
  
  // Final trim on blur
  inputValue.value = inputValue.value.trim()
  
  // Validate on blur
  validateAndSave()
  
  emit('blur')
}

const handleKeydown = (event) => {
  // Prevent line breaks in single-line input
  if (event.key === 'Enter') {
    event.preventDefault()
    // Optionally move to next question or submit
    emit('enter-pressed')
  }
  
  // Character limit enforcement
  if (characterCount.value >= maxLength.value && 
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key) &&
      !event.ctrlKey && !event.metaKey) {
    event.preventDefault()
  }
}

const handlePaste = (event) => {
  // Handle paste events to respect character limits
  setTimeout(() => {
    if (inputValue.value.length > maxLength.value) {
      inputValue.value = inputValue.value.substring(0, maxLength.value)
    }
  }, 0)
}

const formatPhoneNumber = (value) => {
  // Basic phone number formatting (can be enhanced)
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
  return value
}

const focus = () => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

// Lifecycle
onMounted(() => {
  if (props.autoFocus) {
    focus()
  }
})

// Expose methods for parent components
defineExpose({
  focus,
  validate: validateAndSave,
  inputRef
})
</script>

<style scoped>
.single-line-question {
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.single-line-question.is-required .label::after {
  content: '';
  margin-left: 0.25rem;
}

.label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #363636;
  font-size: 1rem;
}

.question-description {
  display: block;
  font-weight: 400;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
  line-height: 1.4;
}

.input {
  transition: all 0.3s ease;
  font-size: 1rem;
  border-radius: 0.375rem;
}

.input:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  transform: translateY(-1px);
}

.input.is-focused {
  border-color: #3273dc;
}

.input:hover:not(:focus):not(.is-danger):not(.is-success) {
  border-color: #b5b5b5;
}

.help {
  font-size: 0.875rem;
  margin-top: 0.375rem;
  line-height: 1.4;
}

.help.character-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.count-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
}

.separator {
  margin: 0 0.125rem;
  opacity: 0.6;
}

.limit-warning {
  font-size: 0.75rem;
  font-style: italic;
}

.error-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-list li {
  margin-bottom: 0.25rem;
}

.error-list li:last-child {
  margin-bottom: 0;
}

.help.is-success,
.help.is-info {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.icon.is-left,
.icon.is-right {
  transition: color 0.3s ease;
}

/* Animation for validation feedback */
.help.is-success,
.help.is-danger {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .label {
    font-size: 0.95rem;
  }
  
  .input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .help {
    font-size: 0.8rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .input {
    border-width: 2px;
  }
  
  .input:focus {
    border-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .input,
  .single-line-question,
  .icon.is-left,
  .icon.is-right {
    transition: none;
  }
  
  .help.is-success,
  .help.is-danger {
    animation: none;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .label {
    color: #f5f5f5;
  }
  
  .question-description {
    color: #9ca3af;
  }
  
  .input {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 0.125em rgba(96, 165, 250, 0.25);
  }
}
</style>