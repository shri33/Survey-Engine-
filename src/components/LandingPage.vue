<template>
  <div class="landing-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="hero is-fullheight is-primary">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="loader is-large"></div>
          <p class="title is-4 mt-4 has-text-white">{{ getLoadingText() }}</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="hero is-fullheight is-danger">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="icon is-large mb-4">
            <i class="fas fa-exclamation-triangle fa-3x"></i>
          </div>
          <h1 class="title is-3 has-text-white">{{ getErrorTitle() }}</h1>
          <p class="subtitle is-5 has-text-white-ter">{{ error }}</p>
          <button @click="reloadPage" class="button is-light is-large mt-4">
            <span class="icon">
              <i class="fas fa-redo"></i>
            </span>
            <span>{{ getRetryText() }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Survey Not Found -->
    <div v-else-if="!survey" class="hero is-fullheight is-warning">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="icon is-large mb-4">
            <i class="fas fa-search fa-3x"></i>
          </div>
          <h1 class="title is-3">{{ getSurveyNotFoundTitle() }}</h1>
          <p class="subtitle is-5">{{ getSurveyNotFoundText() }}</p>
        </div>
      </div>
    </div>

    <!-- Survey Inactive -->
    <div v-else-if="!survey.active" class="hero is-fullheight is-info">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="icon is-large mb-4">
            <i class="fas fa-pause-circle fa-3x"></i>
          </div>
          <h1 class="title is-3 has-text-white">{{ getSurveyInactiveTitle() }}</h1>
          <p class="subtitle is-5 has-text-white-ter">{{ getSurveyInactiveText() }}</p>
        </div>
      </div>
    </div>

    <!-- Main Landing Content -->
    <div v-else class="hero is-fullheight is-primary">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-8-desktop is-10-tablet">
              
              <!-- Survey Header -->
              <div class="card survey-card">
                <div class="card-content has-text-centered">
                  
                  <!-- Survey Icon -->
                  <div class="icon is-large mb-4">
                    <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                  </div>

                  <!-- Survey Title -->
                  <h1 class="title is-2 has-text-primary mb-4">
                    {{ getSurveyTitle() }}
                  </h1>

                  <!-- Survey Description -->
                  <div v-if="getSurveyDescription()" class="content is-medium mb-5">
                    <p class="has-text-grey-dark">{{ getSurveyDescription() }}</p>
                  </div>

                  <!-- Survey Statistics -->
                  <div v-if="questions.length > 0" class="notification is-light mb-5">
                    <div class="columns is-mobile has-text-centered">
                      
                      <!-- Question Count -->
                      <div class="column">
                        <div class="icon-text is-flex-direction-column">
                          <span class="icon has-text-info">
                            <i class="fas fa-question-circle"></i>
                          </span>
                          <div>
                            <p class="is-size-4 has-text-weight-bold has-text-info">{{ questions.length }}</p>
                            <p class="is-size-7 has-text-grey">{{ getQuestionsText() }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Estimated Time -->
                      <div class="column">
                        <div class="icon-text is-flex-direction-column">
                          <span class="icon has-text-success">
                            <i class="fas fa-clock"></i>
                          </span>
                          <div>
                            <p class="is-size-4 has-text-weight-bold has-text-success">{{ getEstimatedTime() }}</p>
                            <p class="is-size-7 has-text-grey">{{ getMinutesText() }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Language -->
                      <div class="column">
                        <div class="icon-text is-flex-direction-column">
                          <span class="icon has-text-warning">
                            <i class="fas fa-language"></i>
                          </span>
                          <div>
                            <p class="is-size-4 has-text-weight-bold has-text-warning">{{ currentLanguage.toUpperCase() }}</p>
                            <p class="is-size-7 has-text-grey">{{ getLanguageText() }}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <!-- Privacy Notice -->
                  <div class="notification is-info is-light mb-5">
                    <div class="icon-text">
                      <span class="icon has-text-info">
                        <i class="fas fa-shield-alt"></i>
                      </span>
                      <div class="content is-small has-text-left">
                        <p><strong>{{ getPrivacyTitle() }}</strong></p>
                        <p>{{ getPrivacyText() }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Language Selector -->
                  <div v-if="availableLanguages.length > 1" class="field mb-5">
                    <label class="label">{{ getSelectLanguageText() }}</label>
                    <div class="control has-icons-left">
                      <div class="select is-large is-fullwidth">
                        <select v-model="selectedLanguage" @change="changeLanguage">
                          <option 
                            v-for="lang in availableLanguages" 
                            :key="lang.code" 
                            :value="lang.code"
                          >
                            {{ lang.name }}
                          </option>
                        </select>
                      </div>
                      <div class="icon is-left">
                        <i class="fas fa-globe"></i>
                      </div>
                    </div>
                  </div>

                  <!-- Start Survey Button -->
                  <div class="field">
                    <div class="control">
                      <button 
                        @click="startSurvey" 
                        class="button is-primary is-large is-fullwidth"
                        :class="{ 'is-loading': isStarting }"
                        :disabled="isStarting"
                      >
                        <span class="icon">
                          <i class="fas fa-play"></i>
                        </span>
                        <span>{{ getStartSurveyText() }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Additional Info -->
                  <div class="content is-small has-text-grey mt-4">
                    <p>
                      <i class="fas fa-info-circle"></i>
                      {{ getAdditionalInfoText() }}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { useSurvey } from '@/composables/useSurvey'
import { SUPPORTED_LANGUAGES } from '@/utils/constants'

export default {
  name: 'LandingPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { currentLanguage, setLanguage } = useLanguage()
    const { survey, questions, isLoading, error, loadSurvey } = useSurvey()
    
    const isStarting = ref(false)
    const selectedLanguage = ref(currentLanguage.value)

    // Computed properties for available languages
    const availableLanguages = computed(() => {
      return Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => ({
        code,
        name
      }))
    })

    // Get survey ID from URL parameters
    const surveyId = computed(() => route.query.survey)
    const sessionId = computed(() => route.query.session)

    // Text methods for internationalization
    const getLoadingText = () => {
      const texts = {
        en: 'Loading survey...',
        es: 'Cargando encuesta...',
        fr: 'Chargement de l\'enquête...',
        de: 'Umfrage wird geladen...',
        it: 'Caricamento sondaggio...',
        pt: 'Carregando pesquisa...'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getErrorTitle = () => {
      const texts = {
        en: 'Error Loading Survey',
        es: 'Error al Cargar la Encuesta',
        fr: 'Erreur de Chargement de l\'Enquête',
        de: 'Fehler beim Laden der Umfrage',
        it: 'Errore nel Caricamento del Sondaggio',
        pt: 'Erro ao Carregar Pesquisa'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getRetryText = () => {
      const texts = {
        en: 'Try Again',
        es: 'Intentar de Nuevo',
        fr: 'Réessayer',
        de: 'Erneut Versuchen',
        it: 'Riprova',
        pt: 'Tentar Novamente'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getSurveyNotFoundTitle = () => {
      const texts = {
        en: 'Survey Not Found',
        es: 'Encuesta No Encontrada',
        fr: 'Enquête Non Trouvée',
        de: 'Umfrage Nicht Gefunden',
        it: 'Sondaggio Non Trovato',
        pt: 'Pesquisa Não Encontrada'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getSurveyNotFoundText = () => {
      const texts = {
        en: 'The requested survey could not be found. Please check the URL and try again.',
        es: 'No se pudo encontrar la encuesta solicitada. Por favor verifica la URL e intenta de nuevo.',
        fr: 'L\'enquête demandée n\'a pas pu être trouvée. Veuillez vérifier l\'URL et réessayer.',
        de: 'Die angeforderte Umfrage konnte nicht gefunden werden. Bitte überprüfen Sie die URL und versuchen Sie es erneut.',
        it: 'Il sondaggio richiesto non è stato trovato. Si prega di controllare l\'URL e riprovare.',
        pt: 'A pesquisa solicitada não foi encontrada. Por favor, verifique a URL e tente novamente.'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getSurveyInactiveTitle = () => {
      const texts = {
        en: 'Survey Currently Unavailable',
        es: 'Encuesta Actualmente No Disponible',
        fr: 'Enquête Actuellement Indisponible',
        de: 'Umfrage Derzeit Nicht Verfügbar',
        it: 'Sondaggio Attualmente Non Disponibile',
        pt: 'Pesquisa Atualmente Indisponível'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getSurveyInactiveText = () => {
      const texts = {
        en: 'This survey is temporarily unavailable. Please try again later.',
        es: 'Esta encuesta no está disponible temporalmente. Por favor intenta más tarde.',
        fr: 'Cette enquête est temporairement indisponible. Veuillez réessayer plus tard.',
        de: 'Diese Umfrage ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.',
        it: 'Questo sondaggio è temporaneamente non disponibile. Si prega di riprovare più tardi.',
        pt: 'Esta pesquisa está temporariamente indisponível. Por favor, tente novamente mais tarde.'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getSurveyTitle = () => {
      if (!survey.value?.title) return ''
      
      if (typeof survey.value.title === 'string') {
        return survey.value.title
      }
      
      return survey.value.title[currentLanguage.value] || 
             survey.value.title['en'] || 
             Object.values(survey.value.title)[0] || ''
    }

    const getSurveyDescription = () => {
      if (!survey.value?.description) return ''
      
      if (typeof survey.value.description === 'string') {
        return survey.value.description
      }
      
      return survey.value.description[currentLanguage.value] || 
             survey.value.description['en'] || 
             Object.values(survey.value.description)[0] || ''
    }

    const getQuestionsText = () => {
      const texts = {
        en: questions.value.length === 1 ? 'Question' : 'Questions',
        es: questions.value.length === 1 ? 'Pregunta' : 'Preguntas',
        fr: questions.value.length === 1 ? 'Question' : 'Questions',
        de: questions.value.length === 1 ? 'Frage' : 'Fragen',
        it: questions.value.length === 1 ? 'Domanda' : 'Domande',
        pt: questions.value.length === 1 ? 'Pergunta' : 'Perguntas'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getEstimatedTime = () => {
      // Estimate 30 seconds per question
      const minutes = Math.max(1, Math.ceil(questions.value.length * 0.5))
      return minutes.toString()
    }

    const getMinutesText = () => {
      const texts = {
        en: 'Minutes',
        es: 'Minutos',
        fr: 'Minutes',
        de: 'Minuten',
        it: 'Minuti',
        pt: 'Minutos'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getLanguageText = () => {
      const texts = {
        en: 'Language',
        es: 'Idioma',
        fr: 'Langue',
        de: 'Sprache',
        it: 'Lingua',
        pt: 'Idioma'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getPrivacyTitle = () => {
      const texts = {
        en: 'Privacy & Data Protection',
        es: 'Privacidad y Protección de Datos',
        fr: 'Confidentialité et Protection des Données',
        de: 'Datenschutz und Datenschutz',
        it: 'Privacy e Protezione dei Dati',
        pt: 'Privacidade e Proteção de Dados'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getPrivacyText = () => {
      const texts = {
        en: 'Your responses are confidential and will only be used to improve our services. We do not share personal information with third parties.',
        es: 'Tus respuestas son confidenciales y solo se utilizarán para mejorar nuestros servicios. No compartimos información personal con terceros.',
        fr: 'Vos réponses sont confidentielles et ne seront utilisées que pour améliorer nos services. Nous ne partageons pas d\'informations personnelles avec des tiers.',
        de: 'Ihre Antworten sind vertraulich und werden nur zur Verbesserung unserer Dienstleistungen verwendet. Wir geben keine persönlichen Informationen an Dritte weiter.',
        it: 'Le tue risposte sono riservate e verranno utilizzate solo per migliorare i nostri servizi. Non condividiamo informazioni personali con terze parti.',
        pt: 'Suas respostas são confidenciais e serão usadas apenas para melhorar nossos serviços. Não compartilhamos informações pessoais com terceiros.'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getSelectLanguageText = () => {
      const texts = {
        en: 'Select Language',
        es: 'Seleccionar Idioma',
        fr: 'Sélectionner la Langue',
        de: 'Sprache Auswählen',
        it: 'Seleziona Lingua',
        pt: 'Selecionar Idioma'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getStartSurveyText = () => {
      const texts = {
        en: 'Start Survey',
        es: 'Comenzar Encuesta',
        fr: 'Commencer l\'Enquête',
        de: 'Umfrage Starten',
        it: 'Inizia Sondaggio',
        pt: 'Iniciar Pesquisa'
      }
      return texts[currentLanguage.value] || texts.en
    }

    const getAdditionalInfoText = () => {
      const texts = {
        en: 'Your progress will be automatically saved as you complete each question.',
        es: 'Tu progreso se guardará automáticamente al completar cada pregunta.',
        fr: 'Votre progression sera automatiquement sauvegardée lorsque vous compléterez chaque question.',
        de: 'Ihr Fortschritt wird automatisch gespeichert, wenn Sie jede Frage beantworten.',
        it: 'I tuoi progressi verranno salvati automaticamente mentre completi ogni domanda.',
        pt: 'Seu progresso será automaticamente salvo conforme você completa cada pergunta.'
      }
      return texts[currentLanguage.value] || texts.en
    }

    // Methods
    const changeLanguage = () => {
      setLanguage(selectedLanguage.value)
      // Update URL with new language
      const newQuery = { ...route.query, lang: selectedLanguage.value }
      router.replace({ query: newQuery })
    }

    const startSurvey = async () => {
      if (!surveyId.value || !sessionId.value) {
        console.error('Missing survey ID or session ID')
        return
      }

      isStarting.value = true

      try {
        // Navigate to survey form
        await router.push({
          name: 'SurveyForm',
          query: {
            survey: surveyId.value,
            session: sessionId.value,
            lang: currentLanguage.value,
            ...route.query
          }
        })
      } catch (error) {
        console.error('Error starting survey:', error)
        isStarting.value = false
      }
    }

    const reloadPage = () => {
      window.location.reload()
    }

    // Lifecycle
    onMounted(async () => {
      if (surveyId.value) {
        await loadSurvey(surveyId.value)
      }
    })

    return {
      // Reactive data
      survey,
      questions,
      isLoading,
      error,
      isStarting,
      selectedLanguage,
      currentLanguage,
      availableLanguages,
      
      // Methods
      getLoadingText,
      getErrorTitle,
      getRetryText,
      getSurveyNotFoundTitle,
      getSurveyNotFoundText,
      getSurveyInactiveTitle,
      getSurveyInactiveText,
      getSurveyTitle,
      getSurveyDescription,
      getQuestionsText,
      getEstimatedTime,
      getMinutesText,
      getLanguageText,
      getPrivacyTitle,
      getPrivacyText,
      getSelectLanguageText,
      getStartSurveyText,
      getAdditionalInfoText,
      changeLanguage,
      startSurvey,
      reloadPage
    }
  }
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.survey-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero.is-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loader {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.loader.is-large {
  width: 4rem;
  height: 4rem;
  border-width: 6px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon-text.is-flex-direction-column {
  flex-direction: column;
  align-items: center;
}

.icon-text.is-flex-direction-column .icon {
  margin-bottom: 0.5rem;
}

.notification.is-light {
  background-color: rgba(245, 245, 245, 0.8);
  backdrop-filter: blur(5px);
}

.button.is-large {
  height: 3.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.button.is-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.select.is-large select {
  height: 3rem;
  font-size: 1.125rem;
  border-radius: 6px;
}

.card-content {
  padding: 3rem 2rem;
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .card-content {
    padding: 2rem 1.5rem;
  }
  
  .title.is-2 {
    font-size: 2rem;
  }
  
  .columns.is-mobile .column {
    padding: 0.5rem;
  }
}

@media screen and (max-width: 480px) {
  .card-content {
    padding: 1.5rem 1rem;
  }
  
  .title.is-2 {
    font-size: 1.75rem;
  }
  
  .button.is-large {
    height: 3rem;
    font-size: 1.125rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .survey-card {
    background: rgba(45, 45, 45, 0.95);
    color: #f5f5f5;
  }
  
  .notification.is-light {
    background-color: rgba(60, 60, 60, 0.8);
    color: #f5f5f5;
  }
  
  .has-text-grey-dark {
    color: #b5b5b5 !important;
  }
  
  .has-text-grey {
    color: #999999 !important;
  }
}

/* Animation for card entrance */
.survey-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading states */
.button.is-loading::after {
  border-color: transparent transparent #ffffff #ffffff;
}

/* Focus states for accessibility */
.button:focus,
.select select:focus {
  box-shadow: 0 0 0 0.125em rgba(255, 255, 255, 0.25);
}

/* Error states */
.hero.is-danger {
  background: linear-gradient(135deg, #ff3860 0%, #ff6b9d 100%);
}

.hero.is-warning {
  background: linear-gradient(135deg, #ffdd57 0%, #ffb347 100%);
}

.hero.is-info {
  background: linear-gradient(135deg, #3298dc 0%, #48cae4 100%);
}
</style>