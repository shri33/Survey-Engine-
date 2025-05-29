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

    <!-- Checkbox Options -->
    <div class="control">
      <div 
        v-for="(option, index) in getOptions()" 
        :key="`${question.id}-option-${index}`"
        class="field"
      >
        <label class="checkbox">
          <input
            type="checkbox"
            :value="option"
            :checked="isOptionSelected(option)"
            @change="handleOptionChange(option, $event)"
            :disabled="loading"
            class="mr-2"
          />
          {{ option }}
        </label>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="control">
      <div class="is-flex is-align-items-center">
        <div class="loader is-small mr-2"></div>
        <span class="is-size-7 has-text-grey">{{ getSavingText() }}</span>
      </div>
    </div>

    <!-- Selection Counter -->
    <div v-if="selectedOptions.length > 0" class="help has-text-info">
      {{ getSelectionCountText() }}
    </div>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

export default {
  name: 'CheckboxQuestion',
  props: {
    question: {
      type: Object,
      required: true,
      validator: (question) => {
        return question && 
               question.id && 
               question.question_text && 
               question.question_type === 'checkbox' &&
               question.options
      }
    },
    modelValue: {
      type: Array,
      default: () => []
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
    const { currentLanguage, t } = useLanguage()
    const selectedOptions = ref([...props.modelValue])
    const errorMessage = ref('')

    // Computed properties
    const getQuestionText = () => {
      if (!props.question.question_text) return ''
      
      if (typeof props.question.question_text === 'string') {
        return props.question.question_text
      }
      
      return props.question.question_text[currentLanguage.value] || 
             props.question.question_text['en'] || 
             Object.values(props.question.question_text)[0] || ''
    }

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

    const getSelectionCountText = () => {
      const count = selectedOptions.value.length
      const texts = {
        en: count === 1 ? '1 option selected' : `${count} options selected`,
        es: count === 1 ? '1 opción seleccionada' : `${count} opciones seleccionadas`,
        fr: count === 1 ? '1 option sélectionnée' : `${count} options sélectionnées`,
        de: count === 1 ? '1 Option ausgewählt' : `${count} Optionen ausgewählt`,
        it: count === 1 ? '1 opzione selezionata' : `${count} opzioni selezionate`,
        pt: count === 1 ? '1 opção selecionada' : `${count} opções selecionadas`
      }
      return texts[currentLanguage.value] || texts.en
    }

    // Methods
    const isOptionSelected = (option) => {
      return selectedOptions.value.includes(option)
    }

    const handleOptionChange = (option, event) => {
      const isChecked = event.target.checked
      
      if (isChecked) {
        // Add option if not already selected
        if (!selectedOptions.value.includes(option)) {
          selectedOptions.value.push(option)
        }
      } else {
        // Remove option if currently selected
        const index = selectedOptions.value.indexOf(option)
        if (index > -1) {
          selectedOptions.value.splice(index, 1)
        }
      }

      // Clear any existing error
      errorMessage.value = ''
      
      // Validate if required
      if (!validateAnswer()) {
        return
      }

      // Emit changes
      emit('update:modelValue', [...selectedOptions.value])
      emit('answer-changed', {
        questionId: props.question.id,
        answer: [...selectedOptions.value],
        sessionId: props.sessionId,
        language: currentLanguage.value,
        questionType: 'checkbox'
      })
    }

    const validateAnswer = () => {
      // Check if required field has at least one selection
      if (props.question.required && selectedOptions.value.length === 0) {
        const errorTexts = {
          en: 'Please select at least one option',
          es: 'Por favor selecciona al menos una opción',
          fr: 'Veuillez sélectionner au moins une option',
          de: 'Bitte wählen Sie mindestens eine Option',
          it: 'Seleziona almeno un\'opzione',
          pt: 'Selecione pelo menos uma opção'
        }
        errorMessage.value = errorTexts[currentLanguage.value] || errorTexts.en
        emit('validation-error', {
          questionId: props.question.id,
          error: errorMessage.value,
          valid: false
        })
        return false
      }

      // Check validation rules if they exist
      if (props.question.validation_rules) {
        const rules = props.question.validation_rules
        
        // Check minimum selections
        if (rules.min_selections && selectedOptions.value.length < rules.min_selections) {
          const errorTexts = {
            en: `Please select at least ${rules.min_selections} options`,
            es: `Por favor selecciona al menos ${rules.min_selections} opciones`,
            fr: `Veuillez sélectionner au moins ${rules.min_selections} options`,
            de: `Bitte wählen Sie mindestens ${rules.min_selections} Optionen`,
            it: `Seleziona almeno ${rules.min_selections} opzioni`,
            pt: `Selecione pelo menos ${rules.min_selections} opções`
          }
          errorMessage.value = errorTexts[currentLanguage.value] || errorTexts.en
          emit('validation-error', {
            questionId: props.question.id,
            error: errorMessage.value,
            valid: false
          })
          return false
        }

        // Check maximum selections
        if (rules.max_selections && selectedOptions.value.length > rules.max_selections) {
          const errorTexts = {
            en: `Please select no more than ${rules.max_selections} options`,
            es: `Por favor selecciona no más de ${rules.max_selections} opciones`,
            fr: `Veuillez sélectionner pas plus de ${rules.max_selections} options`,
            de: `Bitte wählen Sie nicht mehr als ${rules.max_selections} Optionen`,
            it: `Seleziona non più di ${rules.max_selections} opzioni`,
            pt: `Selecione no máximo ${rules.max_selections} opções`
          }
          errorMessage.value = errorTexts[currentLanguage.value] || errorTexts.en
          emit('validation-error', {
            questionId: props.question.id,
            error: errorMessage.value,
            valid: false
          })
          return false
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

    const clearSelection = () => {
      selectedOptions.value = []
      emit('update:modelValue', [])
      errorMessage.value = ''
    }

    // Watch for external model value changes
    watch(
      () => props.modelValue,
      (newValue) => {
        if (Array.isArray(newValue)) {
          selectedOptions.value = [...newValue]
        } else {
          selectedOptions.value = []
        }
      },
      { immediate: true }
    )

    // Watch for language changes to re-validate
    watch(currentLanguage, () => {
      if (selectedOptions.value.length > 0) {
        validateAnswer()
      }
    })

    // Initialize component
    onMounted(() => {
      // Set initial value if provided
      if (props.modelValue && Array.isArray(props.modelValue)) {
        selectedOptions.value = [...props.modelValue]
      }
      
      // Validate on mount if there's already a value
      if (selectedOptions.value.length > 0) {
        validateAnswer()
      }
    })

    return {
      selectedOptions,
      errorMessage,
      getQuestionText,
      getOptions,
      getSavingText,
      getSelectionCountText,
      isOptionSelected,
      handleOptionChange,
      validateAnswer,
      clearSelection,
      currentLanguage
    }
  }
}
</script>

<style scoped>
.checkbox {
  display: flex !important;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.checkbox:hover {
  background-color: hsl(0, 0%, 98%);
}

.checkbox input[type="checkbox"] {
  margin-right: 0.5rem !important;
  cursor: pointer;
  transform: scale(1.1);
}

.checkbox input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.field .field {
  margin-bottom: 0 !important;
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
  margin-bottom: 1rem;
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

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .checkbox:hover {
    background-color: hsl(0, 0%, 15%);
  }
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .checkbox {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .label {
    font-size: 1rem;
  }
}

/* Focus styles for accessibility */
.checkbox input[type="checkbox"]:focus {
  outline: 2px solid #3273dc;
  outline-offset: 2px;
}

/* Animation for selection counter */
.help {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>