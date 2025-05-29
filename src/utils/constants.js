// Survey Engine Constants
// Configuration file for Vue.js 3 + Firebase Survey Engine

// =============================================================================
// LANGUAGE CONFIGURATION
// =============================================================================

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  ar: 'العربية'
}

export const DEFAULT_LANGUAGE = 'en'

export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur']

// Language detection priority order
export const LANGUAGE_DETECTION_ORDER = [
  'url', // URL parameter
  'localStorage', // Stored preference
  'navigator', // Browser language
  'default' // Fallback
]

// =============================================================================
// QUESTION TYPES
// =============================================================================

export const QUESTION_TYPES = {
  SINGLE_LINE: 'single_line',
  MULTI_LINE: 'multi_line',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  EMAIL: 'email',
  NUMBER: 'number',
  DATE: 'date',
  TIME: 'time',
  URL: 'url',
  PHONE: 'phone',
  RATING: 'rating',
  SLIDER: 'slider',
  FILE_UPLOAD: 'file_upload',
  MATRIX: 'matrix',
  RANKING: 'ranking'
}

// Question type metadata
export const QUESTION_TYPE_CONFIG = {
  [QUESTION_TYPES.SINGLE_LINE]: {
    component: 'SingleLineQuestion',
    icon: 'fas fa-minus',
    label: 'Single Line Text',
    description: 'Short text input field',
    maxLength: 255,
    validation: ['required', 'minLength', 'maxLength', 'pattern']
  },
  [QUESTION_TYPES.MULTI_LINE]: {
    component: 'MultiLineQuestion',
    icon: 'fas fa-align-left',
    label: 'Multi-Line Text',
    description: 'Large text area for longer responses',
    maxLength: 2000,
    validation: ['required', 'minLength', 'maxLength', 'wordCount']
  },
  [QUESTION_TYPES.DROPDOWN]: {
    component: 'DropdownQuestion',
    icon: 'fas fa-chevron-down',
    label: 'Dropdown',
    description: 'Select one option from a dropdown list',
    requiresOptions: true,
    validation: ['required']
  },
  [QUESTION_TYPES.CHECKBOX]: {
    component: 'CheckboxQuestion',
    icon: 'fas fa-check-square',
    label: 'Checkbox',
    description: 'Select multiple options',
    requiresOptions: true,
    validation: ['required', 'minSelected', 'maxSelected']
  },
  [QUESTION_TYPES.RADIO]: {
    component: 'RadioQuestion',
    icon: 'fas fa-dot-circle',
    label: 'Radio Buttons',
    description: 'Select one option from multiple choices',
    requiresOptions: true,
    validation: ['required']
  },
  [QUESTION_TYPES.EMAIL]: {
    component: 'EmailQuestion',
    icon: 'fas fa-envelope',
    label: 'Email',
    description: 'Email address input with validation',
    validation: ['required', 'email']
  },
  [QUESTION_TYPES.NUMBER]: {
    component: 'NumberQuestion',
    icon: 'fas fa-hashtag',
    label: 'Number',
    description: 'Numeric input field',
    validation: ['required', 'min', 'max', 'step']
  },
  [QUESTION_TYPES.RATING]: {
    component: 'RatingQuestion',
    icon: 'fas fa-star',
    label: 'Rating',
    description: 'Star or numeric rating scale',
    validation: ['required', 'min', 'max']
  }
}

// =============================================================================
// VALIDATION RULES
// =============================================================================

export const VALIDATION_RULES = {
  REQUIRED: 'required',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  MIN_SELECTED: 'minSelected',
  MAX_SELECTED: 'maxSelected',
  EMAIL: 'email',
  URL: 'url',
  PHONE: 'phone',
  NUMBER: 'number',
  MIN: 'min',
  MAX: 'max',
  PATTERN: 'pattern',
  WORD_COUNT: 'wordCount',
  FILE_SIZE: 'fileSize',
  FILE_TYPE: 'fileType'
}

// Validation error messages
export const VALIDATION_MESSAGES = {
  en: {
    required: 'This field is required',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be no more than {max} characters',
    minSelected: 'Please select at least {min} options',
    maxSelected: 'Please select no more than {max} options',
    email: 'Please enter a valid email address',
    url: 'Please enter a valid URL',
    phone: 'Please enter a valid phone number',
    number: 'Please enter a valid number',
    min: 'Value must be at least {min}',
    max: 'Value must be no more than {max}',
    pattern: 'Please enter a valid format',
    wordCount: 'Must be between {min} and {max} words',
    fileSize: 'File size must be less than {max}MB',
    fileType: 'File type not allowed'
  },
  es: {
    required: 'Este campo es obligatorio',
    minLength: 'Debe tener al menos {min} caracteres',
    maxLength: 'Debe tener como máximo {max} caracteres',
    minSelected: 'Por favor selecciona al menos {min} opciones',
    maxSelected: 'Por favor selecciona como máximo {max} opciones',
    email: 'Por favor ingresa un email válido',
    url: 'Por favor ingresa una URL válida',
    phone: 'Por favor ingresa un número de teléfono válido',
    number: 'Por favor ingresa un número válido',
    min: 'El valor debe ser al menos {min}',
    max: 'El valor debe ser como máximo {max}',
    pattern: 'Por favor ingresa un formato válido',
    wordCount: 'Debe tener entre {min} y {max} palabras',
    fileSize: 'El tamaño del archivo debe ser menor a {max}MB',
    fileType: 'Tipo de archivo no permitido'
  }
}

// =============================================================================
// SURVEY CONFIGURATION
// =============================================================================

export const SURVEY_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
}

export const RESPONSE_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
}

// Survey settings
export const SURVEY_SETTINGS = {
  AUTO_SAVE_INTERVAL: 2000, // milliseconds
  SESSION_TIMEOUT: 1800000, // 30 minutes in milliseconds
  MAX_QUESTIONS_PER_PAGE: 10,
  MAX_OPTIONS_PER_QUESTION: 20,
  MAX_CHARACTERS_PER_OPTION: 100,
  MAX_SURVEYS_PER_USER: 50,
  PAGINATION_ENABLED: true,
  PROGRESS_BAR_ENABLED: true,
  BACK_BUTTON_ENABLED: true
}

// =============================================================================
// UI CONFIGURATION
// =============================================================================

export const UI_THEMES = {
  DEFAULT: 'default',
  DARK: 'dark',
  LIGHT: 'light',
  MINIMAL: 'minimal',
  BRAND: 'brand'
}

export const UI_SIZES = {
  SMALL: 'is-small',
  NORMAL: 'is-normal',
  MEDIUM: 'is-medium',
  LARGE: 'is-large'
}

export const UI_COLORS = {
  PRIMARY: 'is-primary',
  INFO: 'is-info',
  SUCCESS: 'is-success',
  WARNING: 'is-warning',
  DANGER: 'is-danger',
  DARK: 'is-dark',
  LIGHT: 'is-light'
}

// Animation settings
export const ANIMATIONS = {
  FADE_DURATION: 300,
  SLIDE_DURATION: 400,
  BOUNCE_DURATION: 600,
  ENABLED: true
}

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_ENDPOINTS = {
  SURVEYS: 'surveys',
  QUESTIONS: 'questions',
  RESPONSES: 'responses',
  ANSWERS: 'answers',
  USERS: 'users',
  ANALYTICS: 'analytics'
}

export const FIREBASE_COLLECTIONS = {
  SURVEYS: 'surveys',
  QUESTIONS: 'questions',
  RESPONSES: 'responses',
  ANSWERS: 'answers',
  USERS: 'users',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings'
}

// =============================================================================
// URL PARAMETERS
// =============================================================================

export const URL_PARAMS = {
  SURVEY_ID: 'survey',
  LANGUAGE: 'lang',
  SESSION_ID: 'session',
  USER_ID: 'user',
  THEME: 'theme',
  MODE: 'mode',
  PREVIEW: 'preview',
  DEBUG: 'debug'
}

// =============================================================================
// STORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  LANGUAGE_PREFERENCE: 'survey_language',
  THEME_PREFERENCE: 'survey_theme',
  USER_SESSION: 'survey_session',
  DRAFT_RESPONSES: 'survey_drafts',
  USER_PREFERENCES: 'survey_preferences',
  DEBUG_MODE: 'survey_debug'
}

// =============================================================================
// ERROR CODES
// =============================================================================

export const ERROR_CODES = {
  SURVEY_NOT_FOUND: 'SURVEY_NOT_FOUND',
  QUESTION_NOT_FOUND: 'QUESTION_NOT_FOUND',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED'
}

// Error messages
export const ERROR_MESSAGES = {
  en: {
    [ERROR_CODES.SURVEY_NOT_FOUND]: 'Survey not found or no longer available',
    [ERROR_CODES.QUESTION_NOT_FOUND]: 'Question not found',
    [ERROR_CODES.INVALID_RESPONSE]: 'Invalid response format',
    [ERROR_CODES.VALIDATION_FAILED]: 'Please check your answers and try again',
    [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection',
    [ERROR_CODES.PERMISSION_DENIED]: 'Permission denied',
    [ERROR_CODES.QUOTA_EXCEEDED]: 'Usage limit exceeded',
    [ERROR_CODES.SESSION_EXPIRED]: 'Your session has expired. Please refresh the page',
    [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized access',
    [ERROR_CODES.RATE_LIMITED]: 'Too many requests. Please try again later'
  },
  es: {
    [ERROR_CODES.SURVEY_NOT_FOUND]: 'Encuesta no encontrada o ya no disponible',
    [ERROR_CODES.QUESTION_NOT_FOUND]: 'Pregunta no encontrada',
    [ERROR_CODES.INVALID_RESPONSE]: 'Formato de respuesta inválido',
    [ERROR_CODES.VALIDATION_FAILED]: 'Por favor revisa tus respuestas e intenta nuevamente',
    [ERROR_CODES.NETWORK_ERROR]: 'Error de red. Por favor verifica tu conexión',
    [ERROR_CODES.PERMISSION_DENIED]: 'Permiso denegado',
    [ERROR_CODES.QUOTA_EXCEEDED]: 'Límite de uso excedido',
    [ERROR_CODES.SESSION_EXPIRED]: 'Tu sesión ha expirado. Por favor recarga la página',
    [ERROR_CODES.UNAUTHORIZED]: 'Acceso no autorizado',
    [ERROR_CODES.RATE_LIMITED]: 'Demasiadas solicitudes. Por favor intenta más tarde'
  }
}

// =============================================================================
// ANALYTICS EVENTS
// =============================================================================

export const ANALYTICS_EVENTS = {
  SURVEY_STARTED: 'survey_started',
  SURVEY_COMPLETED: 'survey_completed',
  SURVEY_ABANDONED: 'survey_abandoned',
  QUESTION_ANSWERED: 'question_answered',
  QUESTION_SKIPPED: 'question_skipped',
  LANGUAGE_CHANGED: 'language_changed',
  ERROR_OCCURRED: 'error_occurred',
  PAGE_VIEWED: 'page_viewed',
  BUTTON_CLICKED: 'button_clicked',
  FORM_SUBMITTED: 'form_submitted'
}

// =============================================================================
// REGEX PATTERNS
// =============================================================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHANUMERIC_SPACES: /^[a-zA-Z0-9\s]+$/,
  NUMBERS_ONLY: /^\d+$/,
  LETTERS_ONLY: /^[a-zA-Z]+$/,
  NO_SPECIAL_CHARS: /^[a-zA-Z0-9\s]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
}

// =============================================================================
// DATE/TIME FORMATS
// =============================================================================

export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  US: 'MM/DD/YYYY',
  EU: 'DD/MM/YYYY',
  LONG: 'MMMM DD, YYYY',
  SHORT: 'MMM DD, YY',
  TIMESTAMP: 'YYYY-MM-DD HH:mm:ss'
}

export const TIME_FORMATS = {
  TWELVE_HOUR: 'h:mm A',
  TWENTY_FOUR_HOUR: 'HH:mm',
  WITH_SECONDS: 'HH:mm:ss'
}

// =============================================================================
// SHOPIFY INTEGRATION
// =============================================================================

export const SHOPIFY_SETTINGS = {
  LIQUID_TEMPLATES: {
    LANDING: 'survey-landing.liquid',
    FORM: 'survey-form.liquid',
    THANK_YOU: 'survey-thank-you.liquid'
  },
  ASSET_PATHS: {
    CSS: 'assets/survey-engine.css',
    JS: 'assets/survey-engine.js',
    VENDOR: 'assets/survey-vendor.js'
  },
  METAFIELDS: {
    NAMESPACE: 'survey_engine',
    KEYS: {
      SURVEY_ID: 'survey_id',
      LANGUAGE: 'language',
      THEME: 'theme'
    }
  }
}

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export const FEATURES = {
  MULTI_LANGUAGE: true,
  AUTO_SAVE: true,
  PROGRESS_BAR: true,
  ANALYTICS: true,
  FILE_UPLOAD: false,
  ADVANCED_VALIDATION: true,
  THEMES: true,
  EXPORT: false,
  REAL_TIME_VALIDATION: true,
  KEYBOARD_NAVIGATION: true,
  ACCESSIBILITY: true,
  MOBILE_OPTIMIZED: true
}

// =============================================================================
// DEVELOPMENT/DEBUG
// =============================================================================

export const DEBUG_SETTINGS = {
  ENABLED: import.meta.env.DEV,
  LOG_LEVEL: 'info', // 'error', 'warn', 'info', 'debug'
  SHOW_CONSOLE_LOGS: import.meta.env.DEV,
  SHOW_NETWORK_LOGS: false,
  MOCK_DATA: false,
  PERFORMANCE_MONITORING: true
}

// Version information
export const VERSION = {
  MAJOR: 1,
  MINOR: 0,
  PATCH: 0,
  BUILD: Date.now(),
  get FULL() {
    return `${this.MAJOR}.${this.MINOR}.${this.PATCH}`
  }
}

// =============================================================================
// EXPORT ALL CONSTANTS
// =============================================================================

export default {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  RTL_LANGUAGES,
  LANGUAGE_DETECTION_ORDER,
  QUESTION_TYPES,
  QUESTION_TYPE_CONFIG,
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
  SURVEY_STATUS,
  RESPONSE_STATUS,
  SURVEY_SETTINGS,
  UI_THEMES,
  UI_SIZES,
  UI_COLORS,
  ANIMATIONS,
  API_ENDPOINTS,
  FIREBASE_COLLECTIONS,
  URL_PARAMS,
  STORAGE_KEYS,
  ERROR_CODES,
  ERROR_MESSAGES,
  ANALYTICS_EVENTS,
  REGEX_PATTERNS,
  DATE_FORMATS,
  TIME_FORMATS,
  SHOPIFY_SETTINGS,
  FEATURES,
  DEBUG_SETTINGS,
  VERSION
}