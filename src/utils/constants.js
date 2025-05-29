// src/utils/constants.js

// Supported languages configuration
export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de'
}

export const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch'
}

export const DEFAULT_LANGUAGE = 'en'

// Survey states
export const SURVEY_STATES = {
  LANDING: 'landing',
  QUESTIONS: 'questions',
  THANK_YOU: 'thank_you',
  ERROR: 'error'
}

// Question types
export const QUESTION_TYPES = {
  SINGLE_LINE: 'single_line',
  MULTI_LINE: 'multi_line',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  RADIO: 'radio'
}

// Firebase collections
export const COLLECTIONS = {
  SURVEYS: 'surveys',
  QUESTIONS: 'questions',
  RESPONSE_SESSIONS: 'response_sessions',
  ANSWERS: 'answers',
  SURVEY_STATS: 'survey_stats'
}

// Auto-save configuration
export const AUTO_SAVE_DELAY = 1000 // milliseconds

// Validation rules
export const VALIDATION_RULES = {
  REQUIRED_FIELD_MESSAGE: {
    en: 'This field is required',
    es: 'Este campo es obligatorio',
    fr: 'Ce champ est requis',
    de: 'Dieses Feld ist erforderlich'
  },
  MIN_LENGTH_MESSAGE: {
    en: 'Minimum {length} characters required',
    es: 'Se requieren mínimo {length} caracteres',
    fr: 'Minimum {length} caractères requis',
    de: 'Mindestens {length} Zeichen erforderlich'
  },
  MAX_LENGTH_MESSAGE: {
    en: 'Maximum {length} characters allowed',
    es: 'Máximo {length} caracteres permitidos',
    fr: 'Maximum {length} caractères autorisés',
    de: 'Maximal {length} Zeichen erlaubt'
  },
  EMAIL_INVALID: {
    en: 'Please enter a valid email address',
    es: 'Por favor ingrese un email válido',
    fr: 'Veuillez saisir une adresse e-mail valide',
    de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
  }
}

// UI Text constants
export const UI_TEXT = {
  LOADING: {
    en: 'Loading...',
    es: 'Cargando...',
    fr: 'Chargement...',
    de: 'Laden...'
  },
  SUBMIT: {
    en: 'Submit',
    es: 'Enviar',
    fr: 'Soumettre',
    de: 'Senden'
  },
  NEXT: {
    en: 'Next',
    es: 'Siguiente',
    fr: 'Suivant',
    de: 'Weiter'
  },
  PREVIOUS: {
    en: 'Previous',
    es: 'Anterior',
    fr: 'Précédent',
    de: 'Zurück'
  },
  START_SURVEY: {
    en: 'Start Survey',
    es: 'Comenzar Encuesta',
    fr: 'Commencer l\'enquête',
    de: 'Umfrage starten'
  },
  COMPLETE_SURVEY: {
    en: 'Complete Survey',
    es: 'Completar Encuesta',
    fr: 'Terminer l\'enquête',
    de: 'Umfrage abschließen'
  },
  THANK_YOU_TITLE: {
    en: 'Thank You!',
    es: '¡Gracias!',
    fr: 'Merci!',
    de: 'Danke!'
  },
  THANK_YOU_MESSAGE: {
    en: 'Your response has been recorded. Thank you for your time!',
    es: 'Su respuesta ha sido registrada. ¡Gracias por su tiempo!',
    fr: 'Votre réponse a été enregistrée. Merci pour votre temps!',
    de: 'Ihre Antwort wurde aufgezeichnet. Vielen Dank für Ihre Zeit!'
  },
  ERROR_LOADING_SURVEY: {
    en: 'Error loading survey. Please try again.',
    es: 'Error cargando la encuesta. Por favor intente de nuevo.',
    fr: 'Erreur lors du chargement de l\'enquête. Veuillez réessayer.',
    de: 'Fehler beim Laden der Umfrage. Bitte versuchen Sie es erneut.'
  },
  PROGRESS_TEXT: {
    en: 'Question {current} of {total}',
    es: 'Pregunta {current} de {total}',
    fr: 'Question {current} sur {total}',
    de: 'Frage {current} von {total}'
  }
}

// Survey configuration defaults
export const SURVEY_DEFAULTS = {
  MAX_QUESTION_LENGTH: 500,
  MAX_ANSWER_LENGTH: 2000,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  AUTO_ADVANCE_DELAY: 500 // milliseconds
}

// Local storage keys
export const STORAGE_KEYS = {
  SURVEY_SESSION: 'survey_session',
  LANGUAGE_PREFERENCE: 'language_preference',
  SURVEY_DRAFT: 'survey_draft'
}

// Event types for analytics
export const ANALYTICS_EVENTS = {
  SURVEY_STARTED: 'survey_started',
  QUESTION_ANSWERED: 'question_answered',
  SURVEY_COMPLETED: 'survey_completed',
  SURVEY_ABANDONED: 'survey_abandoned',
  LANGUAGE_CHANGED: 'language_changed'
}

// HTTP status codes for error handling
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

// Firebase error codes
export const FIREBASE_ERRORS = {
  PERMISSION_DENIED: 'permission-denied',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  RESOURCE_EXHAUSTED: 'resource-exhausted',
  FAILED_PRECONDITION: 'failed-precondition',
  ABORTED: 'aborted',
  OUT_OF_RANGE: 'out-of-range',
  UNIMPLEMENTED: 'unimplemented',
  INTERNAL: 'internal',
  UNAVAILABLE: 'unavailable',
  DATA_LOSS: 'data-loss',
  UNAUTHENTICATED: 'unauthenticated'
}

// Regex patterns for validation
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
}

// Survey question configuration
export const QUESTION_CONFIG = {
  [QUESTION_TYPES.SINGLE_LINE]: {
    component: 'SingleLineQuestion',
    hasOptions: false,
    hasPlaceholder: true,
    defaultValidation: { max_length: 255 }
  },
  [QUESTION_TYPES.MULTI_LINE]: {
    component: 'MultiLineQuestion',
    hasOptions: false,
    hasPlaceholder: true,
    defaultValidation: { max_length: 2000 }
  },
  [QUESTION_TYPES.DROPDOWN]: {
    component: 'DropdownQuestion',
    hasOptions: true,
    hasPlaceholder: true,
    defaultValidation: {}
  },
  [QUESTION_TYPES.CHECKBOX]: {
    component: 'CheckboxQuestion',
    hasOptions: true,
    hasPlaceholder: false,
    defaultValidation: { min_selections: 0, max_selections: null }
  },
  [QUESTION_TYPES.RADIO]: {
    component: 'RadioQuestion',
    hasOptions: true,
    hasPlaceholder: false,
    defaultValidation: {}
  }
}