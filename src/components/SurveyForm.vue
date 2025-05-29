<template>
  <div class="survey-form">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8-desktop is-10-tablet">
          <div class="card">
            <div class="card-content">
              <!-- Survey Header -->
              <div class="survey-header mb-6">
                <h1 class="title is-3">{{ surveyTitle }}</h1>
                <div class="progress-container">
                  <progress 
                    class="progress is-primary" 
                    :value="progressValue" 
                    max="100"
                  >
                    {{ progressValue }}%
                  </progress>
                  <p class="progress-text">
                    {{ progressText }}
                  </p>
                </div>
              </div>

              <!-- Error Display -->
              <div v-if="formError" class="notification is-danger mb-4">
                {{ formError }}
              </div>

              <!-- Questions Container -->
              <div class="questions-container">
                <TransitionGroup name="question" tag="div">
                  <div 
                    v-for="(question, index) in visibleQuestions"
                    :key="question.id"
                    class="question-wrapper"
                    :class="{ 'is-current': index === currentQuestionIndex }"
                  >
                    <!-- Single Line Question -->
                    <SingleLineQuestion
                      v-if="question.question_type === 'single_line'"
                      :question="question"
                      v-model="answers[question.id]"
                      :error="getQuestionError(question.id)"
                      @answer-changed="handleAnswerChanged"
                    />

                    <!-- Multi Line Question -->
                    <MultiLineQuestion
                      v-else-if="question.question_type === 'multi_line'"
                      :question="question"
                      v-model="answers[question.id]"
                      :error="getQuestionError(question.id)"
                      @answer-changed="handleAnswerChanged"
                    />

                    <!-- Dropdown Question -->
                    <DropdownQuestion
                      v-else-if="question.question_type === 'dropdown'"
                      :question="question"
                      v-model="answers[question.id]"
                      :error="getQuestionError(question.id)"
                      @answer-changed="handleAnswerChanged"
                    />

                    <!-- Checkbox Question -->
                    <CheckboxQuestion
                      v-else-if="question.question_type === 'checkbox'"
                      :question="question"
                      v-model="answers[question.id]"
                      :error="getQuestionError(question.id)"
                      @answer-changed="handleAnswerChanged"
                    />
                  </div>
                </TransitionGroup>
              </div>

              <!-- Navigation Buttons -->
              <div class="form-navigation mt-6">
                <div class="buttons is-flex is-justify-content-space-between">
                  <!-- Previous Button -->
                  <button 
                    class="button is-light"
                    @click="goToPreviousQuestion"
                    :disabled="currentQuestionIndex === 0 || isSubmitting"
                  >
                    <span class="icon">
                      <i class="fas fa-arrow-left"></i>
                    </span>
                    <span>{{ previousButtonText }}</span>
                  </button>

                  <!-- Next/Submit Button -->
                  <button 
                    v-if="currentQuestionIndex < questions.length - 1"
                    class="button is-primary"
                    @click="goToNextQuestion"
                    :disabled="!canProceed || isSubmitting"
                  >
                    <span>{{ nextButtonText }}</span>
                    <span class="icon">
                      <i class="fas fa-arrow-right"></i>
                    </span>
                  </button>

                  <button 
                    v-else
                    class="button is-success"
                    @click="submitSurvey"
                    :disabled="!canSubmit || isSubmitting"
                    :class="{ 'is-loading': isSubmitting }"
                  >
                    <span class="icon" v-if="!isSubmitting">
                      <i class="fas fa-check"></i>
                    </span>
                    <span>{{ submitButtonText }}</span>
                  </button>
                </div>
              </div>

              <!-- Auto-save Indicator -->
              <div class="auto-save-indicator mt-4 has-text-centered">
                <span 
                  v-if="saveStatus === 'saving'" 
                  class="tag is-warning is-light"
                >
                  <span class="icon is-small">
                    <i class="fas fa-spinner fa-spin"></i>
                  </span>
                  <span>{{ savingText }}</span>
                </span>
                <span 
                  v-else-if="saveStatus === 'saved'" 
                  class="tag is-success is-light"
                >
                  <span class="icon is-small">
                    <i class="fas fa-check"></i>
                  </span>
                  <span>{{ savedText }}</span>
                </span>
                <span 
                  v-else-if="saveStatus === 'error'" 
                  class="tag is-danger is-light"
                >
                  <span class="icon is-small">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                  <span>{{ saveErrorText }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useSurvey } from '@/composables/useSurvey'
import SingleLineQuestion from './QuestionTypes/SingleLineQuestion.vue'
import MultiLineQuestion from './QuestionTypes/MultiLineQuestion.vue'
import DropdownQuestion from './QuestionTypes/DropdownQuestion.vue'
import CheckboxQuestion from './QuestionTypes/CheckboxQuestion.vue'

const emit = defineEmits(['survey-completed'])

const { currentLanguage } = useLanguage()
const { 
  survey, 
  questions, 
  answers, 
  saveStatus,
  currentQuestionIndex,
  submitSurvey: submitSurveyAction,
  saveAnswer,
  validateQuestion,
  goToNextQuestion: nextQuestion,
  goToPreviousQuestion: prevQuestion
} = useSurvey()

const isSubmitting = ref(false)
const formError = ref('')
const questionErrors = ref({})

// Computed properties
const surveyTitle = computed(() => {
  return survey.value?.title?.[currentLanguage.value] || 
         survey.value?.title?.en || 
         'Survey'
})

const visibleQuestions = computed(() => {
  // Show all questions for now - can be modified for single-question view
  return questions.value || []
})

const progressValue = computed(() => {
  if (!questions.value?.length) return 0
  const answered = Object.keys(answers.value).filter(key => {
    const answer = answers.value[key]
    return answer !== '' && answer !== null && answer !== undefined && 
           (Array.isArray(answer) ? answer.length > 0 : true)
  }).length
  return Math.round((answered / questions.value.length) * 100)
})

const progressText = computed(() => {
  const current = currentQuestionIndex.value + 1
  const total = questions.value?.length || 0
  const texts = {
    en: `Question ${current} of ${total}`,
    es: `Pregunta ${current} de ${total}`,
    fr: `Question ${current} sur ${total}`,
    de: `Frage ${current} von ${total}`
  }
  return texts[currentLanguage.value] || texts.en
})

const canProceed = computed(() => {
  const currentQuestion = questions.value?.[currentQuestionIndex.value]
  if (!currentQuestion) return false
  
  if (currentQuestion.required) {
    const answer = answers.value[currentQuestion.id]
    if (currentQuestion.question_type === 'checkbox') {
      return Array.isArray(answer) && answer.length > 0
    }
    return answer !== '' && answer !== null && answer !== undefined
  }
  return true
})

const canSubmit = computed(() => {
  if (!questions.value?.length) return false
  
  return questions.value.every(question => {
    if (!question.required) return true
    
    const answer = answers.value[question.id]
    if (question.question_type === 'checkbox') {
      return Array.isArray(answer) && answer.length > 0
    }
    return answer !== '' && answer !== null && answer !== undefined
  })
})

// Text translations
const translations = computed(() => {
  const texts = {
    en: {
      previousButtonText: 'Previous',
      nextButtonText: 'Next',
      submitButtonText: 'Submit Survey',
      savingText: 'Saving...',
      savedText: 'Saved',
      saveErrorText: 'Save Error'
    },
    es: {
      previousButtonText: 'Anterior',
      nextButtonText: 'Siguiente',
      submitButtonText: 'Enviar Encuesta',
      savingText: 'Guardando...',
      savedText: 'Guardado',
      saveErrorText: 'Error al Guardar'
    },
    fr: {
      previousButtonText: 'Précédent',
      nextButtonText: 'Suivant',
      submitButtonText: 'Soumettre le Sondage',
      savingText: 'Sauvegarde...',
      savedText: 'Sauvegardé',
      saveErrorText: 'Erreur de Sauvegarde'
    },
    de: {
      previousButtonText: 'Zurück',
      nextButtonText: 'Weiter',
      submitButtonText: 'Umfrage Senden',
      savingText: 'Speichern...',
      savedText: 'Gespeichert',
      saveErrorText: 'Speicherfehler'
    }
  }
  
  return texts[currentLanguage.value] || texts.en
})

const previousButtonText = computed(() => translations.value.previousButtonText)
const nextButtonText = computed(() => translations.value.nextButtonText)
const submitButtonText = computed(() => translations.value.submitButtonText)
const savingText = computed(() => translations.value.savingText)
const savedText = computed(() => translations.value.savedText)
const saveErrorText = computed(() => translations.value.saveErrorText)

// Methods
const handleAnswerChanged = async (answerData) => {
  try {
    // Clear any existing error for this question
    questionErrors.value[answerData.questionId] = ''
    
    // Save the answer
    await saveAnswer(answerData.questionId, answerData.answer)
    
    // Validate the answer
    const validation = validateQuestion(answerData.questionId, answerData.answer)
    if (!validation.isValid) {
      questionErrors.value[answerData.questionId] = validation.error
    }
  } catch (error) {
    console.error('Error handling answer change:', error)
    questionErrors.value[answerData.questionId] = 'Failed to save answer'
  }
}

const getQuestionError = (questionId) => {
  return questionErrors.value[questionId] || ''
}

const goToNextQuestion = () => {
  const currentQuestion = questions.value[currentQuestionIndex.value]
  if (currentQuestion) {
    const validation = validateQuestion(currentQuestion.id, answers.value[currentQuestion.id])
    if (!validation.isValid) {
      questionErrors.value[currentQuestion.id] = validation.error
      return
    }
    questionErrors.value[currentQuestion.id] = ''
  }
  
  nextQuestion()
}

const goToPreviousQuestion = () => {
  prevQuestion()
}

const submitSurvey = async () => {
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  formError.value = ''
  
  try {
    // Validate all questions one more time
    let hasErrors = false
    questions.value.forEach(question => {
      const validation = validateQuestion(question.id, answers.value[question.id])
      if (!validation.isValid) {
        questionErrors.value[question.id] = validation.error
        hasErrors = true
      }
    })
    
    if (hasErrors) {
      formError.value = 'Please fix the errors above before submitting'
      return
    }
    
    // Submit the survey
    await submitSurveyAction()
    
    // Emit completion event
    emit('survey-completed')
    
  } catch (error) {
    console.error('Error submitting survey:', error)
    formError.value = 'Failed to submit survey. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Keyboard navigation
const handleKeyPress = (event) => {
  if (event.key === 'Enter' && event.ctrlKey) {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      goToNextQuestion()
    } else if (canSubmit.value) {
      submitSurvey()
    }
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.survey-form {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

.card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  border: none;
}

.card-content {
  padding: 3rem;
}

.survey-header .title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.progress-container {
  margin-bottom: 1rem;
}

.progress {
  height: 0.75rem;
  border-radius: 10px;
}

.progress-text {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.questions-container {
  min-height: 200px;
}

.question-wrapper {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease;
}

.question-wrapper:not(.is-current) {
  display: none;
}

.form-navigation .buttons {
  margin-top: 2rem;
}

.button {
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button.is-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.button.is-success {
  background: linear-gradient(45deg, #56ab2f, #a8e6cf);
}

.auto-save-indicator {
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag {
  border-radius: 20px;
  font-size: 0.85rem;
}

/* Question transition animations */
.question-enter-active,
.question-leave-active {
  transition: all 0.3s ease;
}

.question-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.question-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Mobile responsiveness */
@media screen and (max-width: 768px) {
  .card-content {
    padding: 2rem 1.5rem;
  }
  
  .buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .buttons .button {
    margin-bottom: 0.5rem;
  }
  
  .buttons .button:last-child {
    margin-bottom: 0;
  }
}

/* Accessibility improvements */
.button:focus {
  outline: 2px solid #3273dc;
  outline-offset: 2px;
}

.question-wrapper:focus-within {
  background-color: rgba(50, 115, 220, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin: -1rem;
}
</style>