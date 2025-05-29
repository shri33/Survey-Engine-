// src/main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Import CSS
import 'bulma/css/bulma.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/styles/main.css'

// Import components for routing
import LandingPage from './components/LandingPage.vue'
import SurveyForm from './components/SurveyForm.vue'
import ThankYouPage from './components/ThankYouPage.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/survey',
      name: 'survey',
      component: SurveyForm
    },
    {
      path: '/thank-you',
      name: 'thank-you',
      component: ThankYouPage
    }
  ]
})

// Create and mount the app
const app = createApp(App)

// Use router
app.use(router)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Component info:', info)
  
  // You can add error reporting service here
  // For example, send to Firebase Analytics or Sentry
}

// Global warning handler
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Vue warning:', msg)
  console.warn('Component trace:', trace)
}

// Mount the app
app.mount('#app')

// Make survey configuration available globally if passed via Shopify
if (window.surveyConfig) {
  app.config.globalProperties.$surveyConfig = window.surveyConfig
}

// Log environment info in development
if (import.meta.env.DEV) {
  console.log('Survey Engine initialized in development mode')
  console.log('Environment variables:', {
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_USE_FIREBASE_EMULATOR: import.meta.env.VITE_USE_FIREBASE_EMULATOR
  })
}