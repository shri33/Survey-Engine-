// src/composables/useLanguage.js
import { ref, computed } from 'vue'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_NAMES } from '@/utils/constants'

const currentLanguage = ref(DEFAULT_LANGUAGE)

export function useLanguage() {
  // Set language from URL parameter or default
  const initializeLanguage = (langParam) => {
    const lang = langParam?.toLowerCase()
    if (lang && Object.values(SUPPORTED_LANGUAGES).includes(lang)) {
      currentLanguage.value = lang
    } else {
      currentLanguage.value = DEFAULT_LANGUAGE
    }
  }

  // Change current language
  const setLanguage = (lang) => {
    if (Object.values(SUPPORTED_LANGUAGES).includes(lang)) {
      currentLanguage.value = lang
    }
  }

  // Get text in current language from multilingual object
  const getText = (textObject, fallbackLang = 'en') => {
    if (!textObject) return ''
    
    if (typeof textObject === 'string') {
      return textObject
    }
    
    if (typeof textObject === 'object') {
      // Try current language first
      if (textObject[currentLanguage.value]) {
        return textObject[currentLanguage.value]
      }
      
      // Fallback to specified fallback language
      if (textObject[fallbackLang]) {
        return textObject[fallbackLang]
      }
      
      // Fallback to first available language
      const availableKeys = Object.keys(textObject)
      if (availableKeys.length > 0) {
        return textObject[availableKeys[0]]
      }
    }
    
    return ''
  }

  // Get language display name
  const getLanguageName = (langCode = currentLanguage.value) => {
    return LANGUAGE_NAMES[langCode] || langCode
  }

  // Check if language is RTL
  const isRTL = computed(() => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']
    return rtlLanguages.includes(currentLanguage.value)
  })

  // Get available languages for selector
  const availableLanguages = computed(() => {
    return Object.entries(LANGUAGE_NAMES).map(([code, name]) => ({
      code,
      name,
      isActive: code === currentLanguage.value
    }))
  })

  // Format date according to current language
  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }
    
    try {
      return new Intl.DateTimeFormat(currentLanguage.value, defaultOptions).format(date)
    } catch (error) {
      return new Intl.DateTimeFormat('en', defaultOptions).format(date)
    }
  }

  // Format number according to current language
  const formatNumber = (number, options = {}) => {
    try {
      return new Intl.NumberFormat(currentLanguage.value, options).format(number)
    } catch (error) {
      return new Intl.NumberFormat('en', options).format(number)
    }
  }

  // Get language direction class
  const getDirectionClass = () => {
    return isRTL.value ? 'rtl' : 'ltr'
  }

  // Get language-specific CSS classes
  const getLanguageClasses = () => {
    return [
      `lang-${currentLanguage.value}`,
      getDirectionClass()
    ]
  }

  return {
    currentLanguage: computed(() => currentLanguage.value),
    initializeLanguage,
    setLanguage,
    getText,
    getLanguageName,
    isRTL,
    availableLanguages,
    formatDate,
    formatNumber,
    getDirectionClass,
    getLanguageClasses
  }
}