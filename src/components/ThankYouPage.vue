<template>
  <div class="thank-you-page">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8-desktop is-10-tablet">
          <div class="card">
            <div class="card-content has-text-centered">
              <!-- Success Animation -->
              <div class="success-animation mb-6">
                <div class="checkmark-circle">
                  <div class="checkmark"></div>
                </div>
              </div>

              <!-- Thank You Message -->
              <div class="thank-you-content">
                <h1 class="title is-2 has-text-success">{{ thankYouTitle }}</h1>
                <h2 class="subtitle is-4">{{ thankYouSubtitle }}</h2>
                
                <div class="content">
                  <p class="is-size-5">{{ thankYouMessage }}</p>
                </div>
              </div>

              <!-- Survey Summary -->
              <div class="survey-summary mt-6 mb-6">
                <div class="columns is-mobile">
                  <div class="column">
                    <div class="box">
                      <p class="heading">{{ questionsAnsweredLabel }}</p>
                      <p class="title is-4 has-text-primary">{{ questionsAnswered }}</p>
                    </div>
                  </div>
                  <div class="column">
                    <div class="box">
                      <p class="heading">{{ timeSpentLabel }}</p>
                      <p class="title is-4 has-text-primary">{{ timeSpent }}</p>
                    </div>
                  </div>
                  <div class="column">
                    <div class="box">
                      <p class="heading">{{ completionLabel }}</p>
                      <p class="title is-4 has-text-primary">{{ completionRate }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Session Information -->
              <div class="session-info mb-6">
                <div class="notification is-light">
                  <p class="has-text-weight-semibold">{{ sessionInfoTitle }}</p>
                  <p class="is-size-7 mt-2">
                    {{ sessionIdLabel }}: <code>{{ sessionId }}</code>
                  </p>
                  <p class="is-size-7">
                    {{ submittedAtLabel }}: {{ submittedAt }}
                  </p>
                </div>
              </div>

              <!-- Additional Information -->
              <div class="additional-info mb-6">
                <div class="content">
                  <h3 class="title is-5">{{ nextStepsTitle }}</h3>
                  <ul class="has-text-left">
                    <li>{{ nextStep1 }}</li>
                    <li>{{ nextStep2 }}</li>
                    <li>{{ nextStep3 }}</li>
                  </ul>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <div class="buttons is-centered">
                  <button 
                    class="button is-primary is-medium"
                    @click="returnToSite"
                  >
                    <span class="icon">
                      <i class="fas fa-home"></i>
                    </span>
                    <span>{{ returnButtonText }}</span>
                  </button>
                  
                  <button 
                    class="button is-light is-medium"
                    @click="takeSurveyAgain"
                  >
                    <span class="icon">
                      <i class="fas fa-redo"></i>
                    </span>
                    <span>{{ retakeButtonText }}</span>
                  </button>
                </div>
              </div>

              <!-- Social Sharing (Optional) -->
              <div class="social-sharing mt-6" v-if="showSocialSharing">
                <p class="has-text-weight-semibold mb-3">{{ shareText }}</p>
                <div class="buttons is-centered">
                  <button class="button is-info is-small" @click="shareOnTwitter">
                    <span class="icon">
                      <i class="fab fa-twitter"></i>
                    </span>
                    <span>Twitter</span>
                  </button>
                  <button class="button is-primary is-small" @click="shareOnFacebook">
                    <span class="icon">
                      <i class="fab fa-facebook"></i>
                    </span>
                    <span>Facebook</span>
                  </button>
                  <button class="button is-success is-small" @click="shareOnWhatsApp">
                    <span class="icon">
                      <i class="fab fa-whatsapp"></i>
                    </span>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useSurvey } from '@/composables/useSurvey'

const props = defineProps({
  showSocialSharing: {
    type: Boolean,
    default: false
  },
  returnUrl: {
    type: String,
    default: '/'
  }
})

const emit = defineEmits(['return-to-site', 'retake-survey'])

const { currentLanguage } = useLanguage()
const { 
  survey, 
  questions, 
  answers, 
  sessionId, 
  surveyStartTime, 
  surveyEndTime 
} = useSurvey()

// Computed properties
const questionsAnswered = computed(() => {
  return Object.keys(answers.value).filter(key => {
    const answer = answers.value[key]
    return answer !== '' && answer !== null && answer !== undefined && 
           (Array.isArray(answer) ? answer.length > 0 : true)
  }).length
})

const timeSpent = computed(() => {
  if (!surveyStartTime.value || !surveyEndTime.value) return '0 min'
  
  const timeDiff = surveyEndTime.value - surveyStartTime.value
  const minutes = Math.floor(timeDiff / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
  
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`
  } else {
    return `${seconds} sec`
  }
})

const completionRate = computed(() => {
  const total = questions.value?.length || 0
  const answered = questionsAnswered.value
  return total > 0 ? `${Math.round((answered / total) * 100)}%` : '0%'
})

const submittedAt = computed(() => {
  if (!surveyEndTime.value) return ''
  
  const date = new Date(surveyEndTime.value)
  return date.toLocaleDateString(currentLanguage.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Text translations
const translations = computed(() => {
  const texts = {
    en: {
      thankYouTitle: 'Thank You!',
      thankYouSubtitle: 'Your response has been recorded',
      thankYouMessage: 'We appreciate you taking the time to complete this survey. Your feedback is valuable and will help us improve our services.',
      questionsAnsweredLabel: 'Questions Answered',
      timeSpentLabel: 'Time Spent',
      completionLabel: 'Completion Rate',
      sessionInfoTitle: 'Submission Details',
      sessionIdLabel: 'Session ID',
      submittedAtLabel: 'Submitted At',
      nextStepsTitle: 'What happens next?',
      nextStep1: 'Your responses will be analyzed along with others',
      nextStep2: 'Results may be used to improve our products and services',
      nextStep3: 'You may receive follow-up communications if you opted in',
      returnButtonText: 'Return to Site',
      retakeButtonText: 'Take Survey Again',
      shareText: 'Share this survey with others:'
    },
    es: {
      thankYouTitle: '¡Gracias!',
      thankYouSubtitle: 'Su respuesta ha sido registrada',
      thankYouMessage: 'Agradecemos que se haya tomado el tiempo para completar esta encuesta. Sus comentarios son valiosos y nos ayudarán a mejorar nuestros servicios.',
      questionsAnsweredLabel: 'Preguntas Respondidas',
      timeSpentLabel: 'Tiempo Empleado',
      completionLabel: 'Tasa de Finalización',
      sessionInfoTitle: 'Detalles de Envío',
      sessionIdLabel: 'ID de Sesión',
      submittedAtLabel: 'Enviado El',
      nextStepsTitle: '¿Qué sigue?',
      nextStep1: 'Sus respuestas serán analizadas junto con otras',
      nextStep2: 'Los resultados pueden usarse para mejorar nuestros productos y servicios',
      nextStep3: 'Puede recibir comunicaciones de seguimiento si optó por participar',
      returnButtonText: 'Volver al Sitio',
      retakeButtonText: 'Tomar Encuesta Otra Vez',
      shareText: 'Comparte esta encuesta con otros:'
    },
    fr: {
      thankYouTitle: 'Merci !',
      thankYouSubtitle: 'Votre réponse a été enregistrée',
      thankYouMessage: 'Nous apprécions que vous ayez pris le temps de compléter ce sondage. Vos commentaires sont précieux et nous aideront à améliorer nos services.',
      questionsAnsweredLabel: 'Questions Répondues',
      timeSpentLabel: 'Temps Passé',
      completionLabel: 'Taux de Completion',
      sessionInfoTitle: 'Détails de Soumission',
      sessionIdLabel: 'ID de Session',
      submittedAtLabel: 'Soumis Le',
      nextStepsTitle: 'Que se passe-t-il ensuite ?',
      nextStep1: 'Vos réponses seront analysées avec d\'autres',
      nextStep2: 'Les résultats peuvent être utilisés pour améliorer nos produits et services',
      nextStep3: 'Vous pourriez recevoir des communications de suivi si vous avez opté',
      returnButtonText: 'Retour au Site',
      retakeButtonText: 'Reprendre le Sondage',
      shareText: 'Partagez ce sondage avec d\'autres :'
    },
    de: {
      thankYouTitle: 'Vielen Dank!',
      thankYouSubtitle: 'Ihre Antwort wurde aufgezeichnet',
      thankYouMessage: 'Wir schätzen es, dass Sie sich die Zeit genommen haben, diese Umfrage zu vervollständigen. Ihr Feedback ist wertvoll und wird uns helfen, unsere Dienstleistungen zu verbessern.',
      questionsAnsweredLabel: 'Beantwortete Fragen',
      timeSpentLabel: 'Aufgewendete Zeit',
      completionLabel: 'Abschlussrate',
      sessionInfoTitle: 'Übermittlungsdetails',
      sessionIdLabel: 'Sitzungs-ID',
      submittedAtLabel: 'Übermittelt Am',
      nextStepsTitle: 'Was passiert als nächstes?',
      nextStep1: 'Ihre Antworten werden zusammen mit anderen analysiert',
      nextStep2: 'Ergebnisse können zur Verbesserung unserer Produkte und Dienstleistungen verwendet werden',
      nextStep3: 'Sie erhalten möglicherweise Folgemitteilungen, wenn Sie sich dafür entschieden haben',
      returnButtonText: 'Zurück zur Site',
      retakeButtonText: 'Umfrage Erneut Machen',
      shareText: 'Teilen Sie diese Umfrage mit anderen:'
    }
  }
  
  return texts[currentLanguage.value] || texts.en
})

// Extract individual text properties
const thankYouTitle = computed(() => translations.value.thankYouTitle)
const thankYouSubtitle = computed(() => translations.value.thankYouSubtitle)
const thankYouMessage = computed(() => translations.value.thankYouMessage)
const questionsAnsweredLabel = computed(() => translations.value.questionsAnsweredLabel)
const timeSpentLabel = computed(() => translations.value.timeSpentLabel)
const completionLabel = computed(() => translations.value.completionLabel)
const sessionInfoTitle = computed(() => translations.value.sessionInfoTitle)
const sessionIdLabel = computed(() => translations.value.sessionIdLabel)
const submittedAtLabel = computed(() => translations.value.submittedAtLabel)
const nextStepsTitle = computed(() => translations.value.nextStepsTitle)
const nextStep1 = computed(() => translations.value.nextStep1)
const nextStep2 = computed(() => translations.value.nextStep2)
const nextStep3 = computed(() => translations.value.nextStep3)
const returnButtonText = computed(() => translations.value.returnButtonText)
const retakeButtonText = computed(() => translations.value.retakeButtonText)
const shareText = computed(() => translations.value.shareText)

// Methods
const returnToSite = () => {
  emit('return-to-site')
  window.location.href = props.returnUrl
}

const takeSurveyAgain = () => {
  emit('retake-survey')
  // Reload the page to restart the survey
  window.location.reload()
}

const shareOnTwitter = () => {
  const text = `I just completed a survey! ${survey.value?.title?.en || 'Survey'}`
  const url = encodeURIComponent(window.location.href)
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank')
}

const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

const shareOnWhatsApp = () => {
  const text = `I just completed a survey: ${survey.value?.title?.en || 'Survey'}`
  const url = encodeURIComponent(window.location.href)
  window.open(`https://wa.me/?text=${encodeURIComponent(text)} ${url}`, '_blank')
}

// Lifecycle
onMounted(() => {
  // Add any completion tracking or analytics here
  console.log('Survey completed successfully')
})
</script>

<style scoped>
.thank-you-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.success-animation {
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #48c774;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: scaleIn 0.5s ease-in-out;
}

.checkmark {
  width: 25px;
  height: 45px;
  border: solid #48c774;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
  animation: checkmarkDraw 0.3s ease-in-out 0.2s both;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes checkmarkDraw {
  0% {
    height: 0;
  }
  100% {
    height: 45px;
  }
}

.title.is-2 {
  color: #48c774;
  margin-bottom: 1rem;
  font-weight: 700;
}

.subtitle.is-4 {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.box {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.box:hover {
  transform: translateY(-2px);
}

.session-info code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.buttons.is-centered {
  justify-content: center;
  flex-wrap: wrap;
}

.button {
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0.25rem;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button.is-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.social-sharing .button {
  margin: 0.25rem;
  border-radius: 20px;
}

/* Mobile responsiveness */
@media screen and (max-width: 768px) {
  .card-content {
    padding: 2rem 1.5rem;
  }
  
  .columns.is-mobile .column {
    padding: 0.5rem;
  }
  
  .buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .button {
    width: 100%;
    max-width: 300px;
    margin-bottom: 0.5rem;
  }
}

/* Print styles */
@media print {
  .action-buttons,
  .social-sharing {
    display: none;
  }
  
  .thank-you-page {
    background: white;
  }
}
</style>