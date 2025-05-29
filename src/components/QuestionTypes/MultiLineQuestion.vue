<template>
  <div class="field">
    <!-- Question Label -->
    <label class="label is-medium" :for="`question-${question.id}`">
      {{ getQuestionText() }}
      <span v-if="question.required" class="has-text-danger">*</span>
    </label>

    <!-- Error Message -->
    <div v-if="errorMessage" class="notification is-danger is-light">
      <p class="has-text-danger is-size-7">{{ errorMessage }}</p>
    </div>

    <!-- Textarea Input -->
    <div class="control" :class="{ 'is-loading': loading }">
      <textarea
        :id="`question-${question.id}`"
        v-model="inputValue"
        class="textarea"
        :class="{ 'is-danger': errorMessage }"
        :placeholder="getPlaceholderText()"
        :disabled="loading"
        :maxlength="getMaxLength()"
        :rows="getRows()"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :aria-describedby="errorMessage ? `error-${question.id}` : null"
      ></textarea>
    </div>

    <!-- Character Counter -->
    <div v-if="showCharacterCount()" class="is-flex is-justify-content-space-between mt-2">
      <div class="help" :class="getCharacterCountClass()">
        {{ getCharacterCountText() }}
      </div>
      <div v-if="loading" class="is-flex is-align-items-center">
        <div class="loader is-small mr-2"></div>
        <span class="is-size-7 has-text-grey">{{ getSavingText() }}</span>
      </div>
    </div>

    <!-- Loading Indicator (when no character count) -->
    <div v-else-if="loading" class="control mt-2">
      <div class="is-flex is-align-items-center">
        <div class="loader is-small mr-2"></div>
        <span class="is-size-7 has-text-grey">{{ getSavingText() }}</span>
      </div>
    </div>

    <!-- Help Text -->
    <div v-if="getHelpText()" class="help has-text-grey-dark mt-2">
      {{ getHelpText() }}
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { debounce } from 'lodash'

export default {
  name: 'MultiLineQuestion',
  props: {
    question: {
      type: Object,
      required: true,
      validator: (question) => {
        return question && 
               question.id && 
               question.question_text && 
               question.question_type === 'multi_line'
      }
    },
    modelValue: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    sessionId: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'answer-changed', 'validation-error'],
  setup(props, { emit }) {
    const { currentLanguage } = useLanguage()
    const inputValue = ref(props.modelValue || '')
    const errorMessage = ref('')
    const isFocused = ref(false)

    // Debounced save function to prevent too frequent saves
    const debouncedSave = debounce(() => {
      if (validateAnswer()) {
        emit('update:modelValue', inputValue.value)
        emit('answer-changed', {
          questionId: props.question.id,
          answer: inputValue.value,
          sessionId: props.sessionId,
          language: currentLanguage.value,
          questionType: 'multi_line'
        })
      }
    }, 500)

    // Get question text in current language
    const getQuestionText = () => {
      if (!props.question.question_text) return ''
      
      if (typeof props.question.question_text === 'string') {
        return props.question.question_text
      }
      
      return props.question.question_text[currentLanguage.value] || 
             props.question.question_text['en'] || 
             Object.values(props.question.question_text)[0] || ''
    }

    // Get placeholder text
    const getPlaceholderText = () => {
      if (props.question.placeholder) {
        if (typeof props.question.placeholder === 'string') {
          return props.question.placeholder
        }
        return props.question.placeholder[currentLanguage.value] || 
               props.question.placeholder['en'] || 
               Object.values(props.question.placeholder)[0]
      }
      
      const defaultTexts = {
        en: 'Enter your response here...',
        es: 'Ingresa tu respuesta aquí...',
        fr: 'Entrez votre réponse ici...',
        de: 'Geben Sie Ihre Antwort hier ein...',
        it: 'Inserisci la tua risposta qui...',
        pt: 'Digite sua resposta aqui...'
      }
      return defaultTexts[currentLanguage.value] || defaultTexts.en
    }

    // Get help text if available
    const getHelpText = () => {
      if (!props.question.help_text) return ''
      
      if (typeof props.question.help_text === 'string') {
        return props.question.help_text
      }
      
      return props.question.help_text[currentLanguage.value] || 
             props.question.help_text['en'] || 
             Object.values(props.question.help_text)[0] || ''
    }

    // Get saving text
    const getSavingText = () => {
      const texts = {
        en: 'Saving...',
        es: 'Guardando...',
        fr: 'Enregistrement...',
        de: 'Speichern...',
        it: 'Salvataggio...',
        pt: 'Salvando...'
      }
      return texts[currentLanguage.value] || texts.en
    }

    // Get maximum length from validation rules
    const getMaxLength = () => {
      if (props.question.validation_rules?.max_length) {
        return props.question.validation_rules.max_length
      }
      return 2000 // Default max length
    }

    // Get minimum length from validation rules
    const getMinLength = () => {
      if (props.question.validation_rules?.min_length) {
        return props.question.validation_rules.min_length
      }
      return 0
    }

    // Get number of rows for textarea
    const getRows = () => {
      return props.question.rows || 4 // Default rows
    }

    // Check if character count should be shown
    const showCharacterCount = () => {
      return getMaxLength() < 2000 || getMinLength() > 0 || isFocused.value
    }

    // Get character count text
    const getCharacterCountText = () => {
      const currentLength = inputValue.value.length
      const maxLength = getMaxLength()
      const minLength = getMinLength()
      
      if (maxLength < 2000) {
        return `${currentLength}/${maxLength}`
      } else if (minLength > 0) {
        const remaining = Math.max(0, minLength - currentLength)
        if (remaining > 0) {
          const texts = {
            en: `${remaining} more characters needed`,
            es: `${remaining} caracteres más necesarios`,
            fr: `${remaining} caractères de plus nécessaires`,
            de: `${remaining} weitere Zeichen benötigt`,
            it: `${remaining} caratteri in più necessari`,
            pt: `${remaining} caracteres a mais necessários`
          }
          return texts[currentLanguage.value] || texts.en
        }
      }
      
      return `${currentLength} characters`
    }

    // Get character count CSS class
    const getCharacterCountClass = () => {
      const currentLength = inputValue.value.length
      const maxLength = getMaxLength()
      const minLength = getMinLength()
      
      if (maxLength < 2000 && currentLength > maxLength * 0.9) {
        return 'has-text-warning'
      }
      if (maxLength < 2000 && currentLength >= maxLength) {
        return 'has-text-danger'
      }
      if (minLength > 0 && currentLength < minLength) {
        return 'has-text-info'
      }
      return 'has-text-grey'
    }

    // Handle input events
    const handleInput = () => {
      // Clear error message when user starts typing
      if (errorMessage.value) {
        errorMessage.value = ''
      }
      
      // Trigger debounced save
      debouncedSave()
    }

    // Handle blur events
    const handleBlur = () => {
      isFocused.value = false
      validateAnswer()
    }

    // Handle focus events
    const handleFocus = () => {
      isFocused.value = true
    }

    // Validate the answer
    const validateAnswer = () => {
      const value = inputValue.value.trim()
      
      // Check if required field is empty
      if (props.question.required && !value) {
        const errorTexts = {
          en: 'This field is required',
          es: 'Este campo es obligatorio',
          fr: 'Ce champ est obligatoire',
          de: 'Dieses Feld ist erforderlich',
          it: 'Questo campo è obbligatorio',
          pt: 'Este campo é obrigatório'
        }
        errorMessage.value = errorTexts[currentLanguage.value] || errorTexts.en
        emit('validation-error', {
          questionId: props.question.id,
          error: errorMessage.value,
          valid: false
        })
        return false
      }

      // Check validation rules
      if (props.question.validation_rules && value) {
        const rules = props.question.validation_rules
        
        // Minimum length validation
        if (rules.min_length && value.length < rules.min_length) {
          const errorTexts = {
            en: `Minimum ${rules.min_length} characters required`,
            es: `Mínimo ${rules.min_length} caracteres requeridos`,
            fr: `Minimum ${rules.min_length} caractères requis`,
            de: `Mindestens ${rules.min_length} Zeichen erforderlich`,
            it: `Minimo ${rules.min_length} caratteri richiesti`,
            pt: `Mínimo ${rules.min_length} caracteres necessários`
          }
          errorMessage.value = errorTexts[currentLanguage.value] || errorTexts.en
          emit('validation-error', {
            questionId: props.question.id,
            error: errorMessage.value,
            valid: false
          })
          return false
        }

        // Maximum length validation
        if (rules.max_length && value.length > rules.max_length) {
          const errorTexts = {
            en: `Maximum ${rules.max_length} characters allowed`,
            es: `Máximo ${rules.max_length} caracteres permitidos`,
            fr: `Maximum ${rules.max_length} caractères autorisés`,
            de: `Maximal ${rules.max_length} Zeichen erlaubt`,
            it: `Massimo ${rules.max_length} caratteri consentiti`,
            pt: `Máximo ${rules.max_length} caracteres permitidos`
          }
          errorMessage.value = errorTexts[currentLanguage.value] || errorTexts.en
          emit('validation-error', {
            questionId: props.question.id,
            error: errorMessage.value,
            valid: false
          })
          return false
        }

        // Pattern validation
        if (rules.pattern) {
          const regex = new RegExp(rules.pattern)
          if (!regex.test(value)) {
            errorMessage.value = rules.pattern_error || 'Invalid format'
            emit('validation-error', {
              questionId: props.question.id,
              error: errorMessage.value,
              valid: false
            })
            return false
          }
        }
      }

      // Clear error and emit valid state
      errorMessage.value = ''
      emit('validation-error', {
        questionId: props.question.id,
        error: null,
        valid: true
      })
      return true
    }

    // Clear input
    const clearInput = () => {
      inputValue.value = ''
      emit('update:modelValue', '')
      errorMessage.value = ''
    }

    // Watch for external model value changes
    watch(
      () => props.modelValue,
      (newValue) => {
        inputValue.value = newValue || ''
      },
      { immediate: true }
    )

    // Watch for language changes to re-validate
    watch(currentLanguage, () => {
      if (inputValue.value) {
        validateAnswer()
      }
    })

    // Initialize component
    onMounted(() => {
      // Set initial value if provided
      if (props.modelValue) {
        inputValue.value = props.modelValue
      }
      
      // Validate on mount if there's already a value
      if (inputValue.value && inputValue.value.trim()) {
        validateAnswer()
      }
    })

    return {
      inputValue,
      errorMessage,
      isFocused,
      getQuestionText,
      getPlaceholderText,
      getHelpText,
      getSavingText,
      getMaxLength,
      getMinLength,
      getRows,
      showCharacterCount,
      getCharacterCountText,
      getCharacterCountClass,
      handleInput,
      handleBlur,
      handleFocus,
      validateAnswer,
      clearInput,
      currentLanguage
    }
  }
}
</script>

<style scoped>
.textarea {
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: 1px solid #dbdbdb;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  resize: vertical;
  min-height: 6rem;
}

.textarea:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  outline: none;
}

.textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
  resize: none;
}

.textarea.is-danger {
  border-color: #ff3860;
}

.textarea.is-danger:focus {
  border-color: #ff3860;
  box-shadow: 0 0 0 0.125em rgba(255, 56, 96, 0.25);
}

.loader {
  width: 1rem;
  height: 1rem;
  border: 2px solid #dbdbdb;
  border-radius: 50%;
  border-top-color: #3273dc;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { 
    transform: rotate(360deg); 
  }
}

.label {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.label .has-text-danger {
  margin-left: 0.25rem;
}

.help {
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.notification {
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease-out;
}

/* Control loading state */
.control.is-loading::after {
  display: none; /* Hide default Bulma loading spinner for textarea */
}

/* Animation for error messages */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .textarea {
    background-color: #363636;
    border-color: #4a4a4a;
    color: #f5f5f5;
  }
  
  .textarea:focus {
    border-color: #3273dc;
  }
  
  .textarea:disabled {
    background-color: #2b2b2b;
  }
  
  .textarea::placeholder {
    color: #b5b5b5;
  }
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .textarea {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 0.875rem 1rem;
  }
  
  .label {
    font-size: 1rem;
  }
}

/* Accessibility improvements */
.textarea:focus-visible {
  outline: 2px solid #3273dc;
  outline-offset: 2px;
}

/* Better visual feedback for validation states */
.textarea:valid {
  border-color: #48c774;
}

.textarea:invalid:not(:focus) {
  border-color: #ff3860;
}

/* Smooth transitions for all interactive elements */
.field > * {
  transition: all 0.2s ease-in-out;
}

/* Enhanced loading state */
.control.is-loading {
  position: relative;
}

/* Better visual hierarchy */
.label {
  display: block;
  color: #363636;
  font-size: 1rem;
  font-weight: 700;
}

/* Improved error styling */
.notification.is-danger.is-light {
  background-color: #feecf0;
  color: #cc0f35;
  border-left: 4px solid #ff3860;
}
</style>