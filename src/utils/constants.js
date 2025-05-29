// src/utils/constants.js

// Question types supported by the survey engine
export const QUESTION_TYPES = {
  SINGLE_LINE: 'single_line',
  MULTI_LINE: 'multi_line',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox'
}

// Supported languages
export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  ZH: 'zh',
  JA: 'ja'
}

// Language display names
export const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  zh: '中文',
  ja: '日本語'
}

// Default language
export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.EN

// Firebase collection names
export const COLLECTIONS = {
  SURVEYS: 'surveys',
  QUESTIONS: 'questions',
  RESPONSE_SESSIONS: 'response_sessions',
  ANSWERS: 'answers',
  SURVEY_STATS: 'survey_stats'
}

// Survey states
export const SURVEY_STATES = {
  LANDING: 'landing',
  QUESTIONS: 'questions',
  THANK_YOU: 'thank_you'
}

// Auto-save debounce delay (milliseconds)
export const AUTO_SAVE_DELAY = 500

// Validation rules
export const VALIDATION_RULES = {
  MIN_TEXT_LENGTH: 1,
  MAX_TEXT_LENGTH: 1000,
  MAX_TEXTAREA_LENGTH: 5000,
  REQUIRED_FIELD_MESSAGE: {
    en: 'This field is required',
    es: 'Este campo es obligatorio',
    fr: 'Ce champ est obligatoire',
    de: 'Dieses Feld ist erforderlich',
    it: 'Questo campo è obbligatorio',
    pt: 'Este campo é obrigatório',
    zh: '此字段为必填项',
    ja: 'この項目は必須です'
  }
}

// UI Messages
export const UI_MESSAGES = {
  LOADING: {
    en: 'Loading...',
    es: 'Cargando...',
    fr: 'Chargement...',
    de: 'Laden...',
    it: 'Caricamento...',
    pt: 'Carregando...',
    zh: '加载中...',
    ja: '読み込み中...'
  },
  ERROR: {
    en: 'An error occurred. Please try again.',
    es: 'Ocurrió un error. Por favor intenta de nuevo.',
    fr: 'Une erreur s\'est produite. Veuillez réessayer.',
    de: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    it: 'Si è verificato un errore. Riprova.',
    pt: 'Ocorreu um erro. Tente novamente.',
    zh: '发生错误。请重试。',
    ja: 'エラーが発生しました。もう一度お試しください。'
  },
  NEXT: {
    en: 'Next',
    es: 'Siguiente',
    fr: 'Suivant',
    de: 'Weiter',
    it: 'Avanti',
    pt: 'Próximo',
    zh: '下一步',
    ja: '次へ'
  },
  PREVIOUS: {
    en: 'Previous',
    es: 'Anterior',
    fr: 'Précédent',
    de: 'Zurück',
    it: 'Precedente',
    pt: 'Anterior',
    zh: '上一步',
    ja: '前へ'
  },
  START_SURVEY: {
    en: 'Start Survey',
    es: 'Comenzar Encuesta',
    fr: 'Commencer l\'enquête',
    de: 'Umfrage starten',
    it: 'Inizia Sondaggio',
    pt: 'Iniciar Pesquisa',
    zh: '开始调查',
    ja: 'アンケートを開始'
  },
  SUBMIT: {
    en: 'Submit',
    es: 'Enviar',
    fr: 'Soumettre',
    de: 'Senden',
    it: 'Invia',
    pt: 'Enviar',
    zh: '提交',
    ja: '送信'
  },
  SURVEY_NOT_FOUND: {
    en: 'Survey not found',
    es: 'Encuesta no encontrada',
    fr: 'Enquête non trouvée',
    de: 'Umfrage nicht gefunden',
    it: 'Sondaggio non trovato',
    pt: 'Pesquisa não encontrada',
    zh: '未找到调查',
    ja: 'アンケートが見つかりません'
  },
  THANK_YOU_DEFAULT: {
    en: 'Thank you for completing the survey!',
    es: '¡Gracias por completar la encuesta!',
    fr: 'Merci d\'avoir complété l\'enquête!',
    de: 'Vielen Dank für die Teilnahme an der Umfrage!',
    it: 'Grazie per aver completato il sondaggio!',
    pt: 'Obrigado por completar a pesquisa!',
    zh: '感谢您完成调查！',
    ja: 'アンケートへのご協力ありがとうございました！'
  }
}

// Placeholder text for different question types
export const PLACEHOLDERS = {
  SINGLE_LINE: {
    en: 'Enter your answer...',
    es: 'Ingresa tu respuesta...',
    fr: 'Entrez votre réponse...',
    de: 'Geben Sie Ihre Antwort ein...',
    it: 'Inserisci la tua risposta...',
    pt: 'Digite sua resposta...',
    zh: '输入您的答案...',
    ja: '回答を入力してください...'
  },
  MULTI_LINE: {
    en: 'Please provide your detailed response...',
    es: 'Por favor proporciona tu respuesta detallada...',
    fr: 'Veuillez fournir votre réponse détaillée...',
    de: 'Bitte geben Sie Ihre detaillierte Antwort...',
    it: 'Si prega di fornire la risposta dettagliata...',
    pt: 'Forneça sua resposta detalhada...',
    zh: '请提供您的详细回答...',
    ja: '詳細な回答をご記入ください...'
  },
  DROPDOWN: {
    en: 'Select an option...',
    es: 'Selecciona una opción...',
    fr: 'Sélectionnez une option...',
    de: 'Wählen Sie eine Option...',
    it: 'Seleziona un\'opzione...',
    pt: 'Selecione uma opção...',
    zh: '选择一个选项...',
    ja: 'オプションを選択してください...'
  }
}

// CSS class names
export const CSS_CLASSES = {
  QUESTION_CONTAINER: 'question-container',
  QUESTION_TITLE: 'question-title',
  QUESTION_INPUT: 'question-input',
  REQUIRED_FIELD: 'required-field',
  ERROR_MESSAGE: 'error-message',
  SUCCESS_MESSAGE: 'success-message'
}

// Local storage keys
export const STORAGE_KEYS = {
  SURVEY_PROGRESS: 'survey_progress',
  SESSION_DATA: 'session_data'
}

// API endpoints (if using external APIs)
export const API_ENDPOINTS = {
  BASE_URL: process.env.VITE_API_BASE_URL || 'https://api.yourdomain.com',
  SURVEYS: '/surveys',
  QUESTIONS: '/questions',
  RESPONSES: '/responses'
}

// Development/Debug settings
export const DEBUG_MODE = process.env.NODE_ENV === 'development'
export const ENABLE_ANALYTICS = process.env.VITE_ENABLE_ANALYTICS === 'true'
export const FIREBASE_EMULATOR_HOST = process.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost'