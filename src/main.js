// src/main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Import CSS
import 'bulma/css/bulma.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/styles/main.css'

// Import components
import LandingPage from './components/LandingPage.vue'
import SurveyForm from './components/SurveyForm.vue'
import ThankYouPage from './components/ThankYouPage.vue'

// Router configuration
const routes = [
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create and mount the app
const app = createApp(App)
app.use(router)
app.mount('#app')