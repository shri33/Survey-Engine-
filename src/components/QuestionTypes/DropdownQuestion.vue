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

    <!-- Dropdown Select -->
    <div class="control" :class="{ 'is-loading': loading }">
      <div class="select is-fullwidth" :class="{ 'is-danger': errorMessage }">
        <select
          :id="`question-${question.id}`"
          v-model="selectedValue"
          @change="handleSelectionChange"
          :disabled="loading"
          :aria-describedby="errorMessage ? `error-${question.id}` : null"
        >
          <option value="" disabled>{{ getPlaceholderText() }}</option>
          <option
            v-for="(option, index) in getOptions()"
            :key="`${question.id}-option-${index}`"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="control mt-2">
      <div class="is-flex is-align-items-center">
        <div class="loader is-small mr-2"></div>
        <span class="is-size-7 has-text-grey">{{ getSavingText() }}</span>
      </div>
    </div>

    <!-- Help Text -->
    <div v-if="getHelpText()" class="help has-text-grey-dark">
      {{ getHelpText() }}
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

export default {
  name: 'DropdownQuestion',
  props: {
    question: {
      type: Object,
      required: true,
      validator: (question) => {
        return question && 
               question.id && 
               question.question_text && 
               question.question_type === 'dropdown' &&
               question.options
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
    const selectedValue = ref(props.modelValue || '')
    const errorMessage = ref('')

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

    // Get dropdown options in current language
    const getOptions = () => {
      if (!props.question.options) return []
      
      if (Array.isArray(props.question.options)) {
        return props.question.options
      }
      
      if (typeof props.question.options === 'object') {
        return props.question.options[currentLanguage.value] || 
               props.question.options['en'] || 
               Object.values(props.question.options)[0] || []
      }
      
      return []
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
        en: 'Please select an option...',
        es: 'Por favor selecciona una opción...',
        fr: 'Veuillez sélectionner une option...',
        de: 'Bitte wählen Sie eine Option...',
        it: 'Seleziona un\'opzione...',
        pt: 'Selecione uma opção...'
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

    // Handle selection change
    const handleSelectionChange = () => {
      // Clear any existing error
      errorMessage.value = ''
      
      // Validate the selection
      if (!validateAnswer()) {
        return
      }

      // Emit changes
      emit('update:modelValue', selectedValue.value)
      emit('answer-changed', {
        questionId: props.question.id,
        answer: selectedValue.value,
        sessionId: props.sessionId,
        language: currentLanguage.value,
        questionType: 'dropdown'
      })
    }

    // Validate the answer
    const validateAnswer = () => {
      // Check if required field is empty
      if (props.question.required && !selectedValue.value) {
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

      // Check if selected value is in available options
      const availableOptions = getOptions()
      if (selectedValue.value && !availableOptions.includes(selectedValue.value)) {
        const errorTexts = {
          en: 'Please select a valid option',
          es: 'Por favor selecciona una opción válida',
          fr: 'Veuillez sélectionner une option valide',
          de: 'Bitte wählen Sie eine gültige Option',
          it: 'Seleziona un\'opzione valida',
          pt: 'Selecione uma opção válida'
        }
        errorMessage.value = errorTexts[currentLanguage.value] || errorTexts.en
        emit('validation-error', {
          questionId: props.question.id,
          error: errorMessage.value,
          valid: false
        })
        return false
      }

      // Custom validation rules
      if (props.question.validation_rules && selectedValue.value) {
        const rules = props.question.validation_rules
        
        // Pattern validation (if needed for specific dropdown values)
        if (rules.pattern) {
          const regex = new RegExp(rules.pattern)
          if (!regex.test(selectedValue.value)) {
            errorMessage.value = rules.pattern_error || 'Invalid selection'
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

    // Clear selection
    const clearSelection = () => {
      selectedValue.value = ''
      emit('update:modelValue', '')
      errorMessage.value = ''
    }

    // Watch for external model value changes
    watch(
      () => props.modelValue,
      (newValue) => {
        selectedValue.value = newValue || ''
      },
      { immediate: true }
    )

    // Watch for language changes to re-validate
    watch(currentLanguage, () => {
      if (selectedValue.value) {
        validateAnswer()
      }
    })

    // Initialize component
    onMounted(() => {
      // Set initial value if provided
      if (props.modelValue) {
        selectedValue.value = props.modelValue
      }
      
      // Validate on mount if there's already a value
      if (selectedValue.value) {
        validateAnswer()
      }
    })

    return {
      selectedValue,
      errorMessage,
      getQuestionText,
      getOptions,
      getPlaceholderText,
      getHelpText,
      getSavingText,
      handleSelectionChange,
      validateAnswer,
      clearSelection,
      currentLanguage
    }
  }
}
</script>

<style scoped>
.select.is-fullwidth {
  width: 100%;
}

.select select {
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: 1px solid #dbdbdb;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.select select:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  outline: none;
}

.select select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.select.is-danger select {
  border-color: #ff3860;
}

.select.is-danger select:focus {
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
  to { transform: rotate(360deg); }
}

.label {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.label .has-text-danger {
  margin-left: 0.25rem;
}

.help {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.notification {
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

/* Control loading state */
.control.is-loading::after {
  position: absolute !important;
  right: 1.125em;
  top: 1.125em;
  z-index: 4;
}

.control.is-loading .select select {
  padding-right: 2.5em;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .select select {
    background-color: #363636;
    border-color: #4a4a4a;
    color: #f5f5f5;
  }
  
  .select select:focus {
    border-color: #3273dc;
  }
  
  .select select:disabled {
    background-color: #2b2b2b;
  }
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .select select {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 0.875rem 1rem;
  }
  
  .label {
    font-size: 1rem;
  }
}

/* Animation for error messages */
.notification {
  animation: slideDown 0.3s ease-out;
}

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
</style>