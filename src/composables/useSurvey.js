// src/composables/useSurvey.js
import { ref, computed, reactive, nextTick } from 'vue'
import { useFirebase } from './useFirebase'
import { useLanguage } from './useLanguage'
import { SURVEY_STATES, AUTO_SAVE_DELAY, VALIDATION_RULES } from '@/utils/constants'
import { debounce } from 'lodash-es'

export function useSurvey() {
  const firebase = useFirebase()
  const { currentLanguage, getText } = useLanguage()

  // Reactive state
  const currentState = ref(SURVEY_STATES.LANDING)
  const survey = ref(null)
  const questions = ref([])
  const currentQuestionIndex = ref(0)
  const answers = reactive({})
  const sessionId = ref(null)
  const isSubmitting = ref(false)
  const validationErrors = reactive({})

  // Computed properties
  const currentQuestion = computed(() => {
    return questions.value[currentQuestionIndex.value] || null
  })

  const progress = computed(() => {
    if (questions.value.length === 0) return 0
    return Math.round(((currentQuestionIndex.value + 1) / questions.value.length) * 100)
  })

  const isFirstQuestion = computed(() => currentQuestionIndex.value === 0)
  const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)

  const canProceed = computed(() => {
    const question = currentQuestion.value
    if (!question) return false
    
    const answer = answers[question.id]
    
    if (question.required) {
      if (question.question_type === 'checkbox') {
        return answer && Array.isArray(answer) && answer.length > 0
      } else {
        return answer && answer.trim && answer.trim().length > 0
      }
    }
    
    return true
  })

  // Initialize survey from URL parameters
  const initializeSurvey = async (surveyId, sessionIdentifier, language = 'en') => {
    try {
      sessionId.value = sessionIdentifier
      
      // Load survey data
      const surveyData = await firebase.getSurvey(surveyId)
      if (!surveyData) {
        throw new Error('Survey not found')
      }
      
      survey.value = surveyData
      
      // Load questions
      const questionsData = await firebase.getSurveyQuestions(surveyId)
      questions.value = questionsData
      
      // Initialize session
      await createOrUpdateSession(surveyId, language)
      
      // Load existing answers if any
      await loadExistingAnswers()
      
      return true
    } catch (error) {
      console.error('Failed to initialize survey:', error)
      return false
    }
  }

  const createOrUpdateSession = async (surveyId, language) => {
    const sessionData = {
      id: sessionId.value,
      survey_id: surveyId,
      language: language,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      metadata: {
        window_width: window.innerWidth,
        window_height: window.innerHeight,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        url_params: Object.fromEntries(new URLSearchParams(window.location.search))
      }
    }

    // Track analytics
    await firebase.incrementSurveyStats(surveyId, language)
    
    return await firebase.createResponseSession(sessionData)
  }

  const loadExistingAnswers = async () => {
    if (!sessionId.value) return
    
    const existingAnswers = await firebase.getSessionAnswers(sessionId.value)
    
    existingAnswers.forEach(answer => {
      if (answer.answer_text) {
        answers[answer.question_id] = answer.answer_text
      } else if (answer.answer_options) {
        answers[answer.question_id] = answer.answer_options
      }
    })
  }

  // Debounced auto-save function
  const debouncedSaveAnswer = debounce(async (questionId, answerValue) => {
    if (!sessionId.value || !questionId) return
    
    const answerData = {
      session_id: sessionId.value,
      question_id: questionId,
      answer_text: typeof answerValue === 'string' ? answerValue : null,
      answer_options: Array.isArray(answerValue) ? answerValue : null
    }
    
    await firebase.saveAnswer(answerData)
  }, AUTO_SAVE_DELAY)

  // Update answer and trigger auto-save
  const updateAnswer = (questionId, value) => {
    answers[questionId] = value
    clearValidationError(questionId)
    debouncedSaveAnswer(questionId, value)
  }

  // Validation functions
  const validateQuestion = (question) => {
    const answer = answers[question.id]
    const errors = []

    // Required field validation
    if (question.required) {
      if (question.question_type === 'checkbox') {
        if (!answer || !Array.isArray(answer) || answer.length === 0) {
          errors.push(getText(VALIDATION_RULES.REQUIRED_FIELD_MESSAGE))
        }
      } else {
        if (!answer || (typeof answer === 'string' && answer.trim().length === 0)) {
          errors.push(getText(VALIDATION_RULES.REQUIRED_FIELD_MESSAGE))
        }
      }
    }

    // Length validation for text inputs
    if (answer && typeof answer === 'string') {
      if (question.validation_rules?.min_length && answer.length < question.validation_rules.min_length) {
        errors.push(`Minimum ${question.validation_rules.min_length} characters required`)
      }
      
      if (question.validation_rules?.max_length && answer.length > question.validation_rules.max_length) {
        errors.push(`Maximum ${question.validation_rules.max_length} characters allowed`)
      }
    }

    return errors
  }

  const setValidationError = (questionId, errors) => {
    if (errors.length > 0) {
      validationErrors[questionId] = errors
    } else {
      delete validationErrors[questionId]
    }
  }

  const clearValidationError = (questionId) => {
    delete validationErrors[questionId]
  }

  const validateCurrentQuestion = () => {
    const question = currentQuestion.value
    if (!question) return true
    
    const errors = validateQuestion(question)
    setValidationError(question.id, errors)
    
    return errors.length === 0
  }

  // Navigation functions
  const startSurvey = () => {
    currentState.value = SURVEY_STATES.QUESTIONS
    currentQuestionIndex.value = 0
  }

  const goToNextQuestion = () => {
    if (!validateCurrentQuestion()) {
      return false
    }
    
    if (isLastQuestion.value) {
      completeSurvey()
    } else {
      currentQuestionIndex.value += 1
    }
    return true
  }

  const goToPreviousQuestion = () => {
    if (!isFirstQuestion.value) {
      currentQuestionIndex.value -= 1
    }
  }

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.value.length) {
      currentQuestionIndex.value = index
    }
  }

  const completeSurvey = async () => {
    if (isSubmitting.value) return
    
    isSubmitting.value = true
    
    try {
      // Validate all questions
      let allValid = true
      questions.value.forEach(question => {
        const errors = validateQuestion(question)
        setValidationError(question.id, errors)
        if (errors.length > 0) allValid = false
      })
      
      if (!allValid) {
        isSubmitting.value = false
        return false
      }
      
      // Mark survey as completed
      await firebase.markSurveyCompleted(survey.value.id, sessionId.value)
      
      // Transition to thank you page
      currentState.value = SURVEY_STATES.THANK_YOU
      
      return true
    } catch (error) {
      console.error('Failed to complete survey:', error)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  // Reset survey state
  const resetSurvey = () => {
    currentState.value = SURVEY_STATES.LANDING
    survey.value = null
    questions.value = []
    currentQuestionIndex.value = 0
    Object.keys(answers).forEach(key => delete answers[key])
    sessionId.value = null
    isSubmitting.value = false
    Object.keys(validationErrors).forEach(key => delete validationErrors[key])
  }

  // Get survey title in current language
  const getSurveyTitle = () => {
    if (!survey.value?.title) return ''
    return getText(survey.value.title) || survey.value.title.en || 'Survey'
  }

  const getSurveyDescription = () => {
    if (!survey.value?.description) return ''
    return getText(survey.value.description) || survey.value.description.en || ''
  }

  const getSurveyInstructions = () => {
    if (!survey.value?.instructions) return ''
    return getText(survey.value.instructions) || survey.value.instructions.en || ''
  }

  const getThankYouMessage = () => {
    if (!survey.value?.thank_you_message) return ''
    return getText(survey.value.thank_you_message) || survey.value.thank_you_message.en || 'Thank you for completing the survey!'
  }

  // Question helpers
  const getQuestionText = (question) => {
    if (!question?.question_text) return ''
    return getText(question.question_text) || question.question_text.en || ''
  }

  const getQuestionOptions = (question) => {
    if (!question?.options) return []
    const options = getText(question.options) || question.options.en || []
    return Array.isArray(options) ? options : []
  }

  const getQuestionPlaceholder = (question) => {
    if (!question?.placeholder) return ''
    return getText(question.placeholder) || question.placeholder.en || ''
  }

  return {
    // State
    currentState,
    survey,
    questions,
    currentQuestion,
    currentQuestionIndex,
    answers,
    sessionId,
    isSubmitting,
    validationErrors,
    
    // Computed
    progress,
    isFirstQuestion,
    isLastQuestion,
    canProceed,
    
    // Methods
    initializeSurvey,
    updateAnswer,
    validateCurrentQuestion,
    startSurvey,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    completeSurvey,
    resetSurvey,
    
    // Helpers
    getSurveyTitle,
    getSurveyDescription,
    getSurveyInstructions,
    getThankYouMessage,
    getQuestionText,
    getQuestionOptions,
    getQuestionPlaceholder
  }
}