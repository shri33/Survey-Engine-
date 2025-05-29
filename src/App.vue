<template>
  <div id="app" :class="languageClasses">
    <!-- Language Selector -->
    <div class="language-selector" v-if="showLanguageSelector">
      <div class="language-dropdown">
        <label for="language-select" class="sr-only">
          {{ getText(UI_TEXT.SELECT_LANGUAGE) }}
        </label>
        <select 
          id="language-select"
          v-model="currentLanguage" 
          @change="handleLanguageChange"
          class="select"
          :aria-label="getText(UI_TEXT.SELECT_LANGUAGE)"
        >
          <option 
            v-for="lang in availableLanguages" 
            :key="lang.code" 
            :value="lang.code"
            :selected="lang.code === currentLanguage"
          >
            {{ lang.name }}
          </option>
        </select>
        <div class="select-arrow" aria-hidden="true">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isInitializing" class="loading-container" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <div class="loading-content">
        <p class="loading-text">{{ getText(UI_TEXT.LOADING) }}</p>
        <div class="loading-progress" v-if="loadingProgress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: loadingProgress + '%' }"
              :aria-valuenow="loadingProgress"
              aria-valuemin="0"
              aria-valuemax="100"
              role="progressbar"
            ></div>
          </div>
          <span class="progress-text">{{ loadingProgress }}%</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="initializationError" class="section" role="alert">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <div class="notification is-danger error-container">
              <div class="error-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="error-content">
                <h3 class="title is-4 error-title">{{ getText(UI_TEXT.ERROR_LOADING_SURVEY) }}</h3>
                <p class="error-message">{{ initializationError }}</p>
                <div class="error-actions">
                  <button 
                    class="button is-light retry-button" 
                    @click="initializeApp"
                    :disabled="isRetrying"
                  >
                    <span v-if="isRetrying" class="button-spinner" aria-hidden="true"></span>
                    {{ isRetrying ? getText(UI_TEXT.RETRYING) : getText(UI_TEXT.TRY_AGAIN) }}
                  </button>
                  <button 
                    class="button is-text report-button" 
                    @click="reportError"
                    v-if="canReportError"
                  >
                    {{ getText(UI_TEXT.REPORT_ISSUE) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Router View -->
    <main v-else class="main-content" role="main">
      <router-view 
        :key="$route.fullPath"
        @notification="showNotification"
        @loading-state="updateLoadingState"
      />
    </main>

    <!-- Global Notifications -->
    <transition name="notification-slide">
      <div 
        v-if="globalNotification" 
        class="notification-container"
        :class="notificationClass"
        role="alert"
        :aria-live="notificationLevel"
      >
        <div class="notification-content">
          <div class="notification-icon" aria-hidden="true" v-if="notificationIcon">
            <component :is="notificationIcon" />
          </div>
          <div class="notification-message">
            <h4 v-if="globalNotification.title" class="notification-title">
              {{ globalNotification.title }}
            </h4>
            <p class="notification-text">{{ globalNotification.message }}</p>
          </div>
          <button 
            class="notification-close" 
            @click="clearNotification"
            :aria-label="getText(UI_TEXT.CLOSE_NOTIFICATION)"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div 
          v-if="globalNotification.autoClose" 
          class="notification-timer"
          :style="{ animationDuration: autoCloseDelay + 'ms' }"
        ></div>
      </div>
    </transition>

    <!-- Accessibility Skip Link -->
    <a href="#main-content" class="skip-link">
      {{ getText(UI_TEXT.SKIP_TO_MAIN_CONTENT) }}
    </a>

    <!-- Screen Reader Announcements -->
    <div 
      id="sr-announcements" 
      class="sr-only" 
      aria-live="polite" 
      aria-atomic="true"
    >
      {{ screenReaderAnnouncement }}
    </div>
  </div>
</template>

<style scoped>
/* Base Styles */
#app {
  min-height: 100vh;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Language Selector */
.language-selector {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
}

.language-dropdown {
  position: relative;
  display: inline-block;
}

.select {
  appearance: none;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.select:hover {
  border-color: #d1d5db;
}

.select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-color: #3b82f6;
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
}

/* Loading State */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  flex-direction: column;
  gap: 1.5rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-content {
  text-align: center;
  max-width: 400px;
}

.loading-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 1rem;
}

.loading-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-container {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 2rem;
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.error-icon {
  flex-shrink: 0;
  color: #dc2626;
  margin-top: 0.25rem;
}

.error-content {
  flex: 1;
}

.error-title {
  color: #dc2626;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.error-message {
  color: #991b1b;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.retry-button:hover:not(:disabled) {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.retry-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #d1d5db;
  border-top: 2px solid #374151;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.report-button {
  color: #6b7280;
  text-decoration: underline;
  font-size: 0.875rem;
}

.report-button:hover {
  color: #374151;
}

/* Main Content */
.main-content {
  min-height: 100vh;
}

/* Notifications */
.notification-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  max-width: 400px;
  z-index: 1001;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.notification-container.is-success {
  background: rgba(16, 185, 129, 0.95);
  color: white;
}

.notification-container.is-warning {
  background: rgba(245, 158, 11, 0.95);
  color: white;
}

.notification-container.is-danger {
  background: rgba(239, 68, 68, 0.95);
  color: white;
}

.notification-container.is-info {
  background: rgba(59, 130, 246, 0.95);
  color: white;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
}

.notification-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.notification-message {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.notification-text {
  font-size: 0.875rem;
  line-height: 1.5;
  opacity: 0.9;
}

.notification-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: opacity 0.2s ease;
}

.notification-close:hover {
  opacity: 0.8;
}

.notification-timer {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.notification-timer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.6);
  animation: timer-progress linear forwards;
}

@keyframes timer-progress {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Notification Transitions */
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.3s ease;
}

.notification-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1002;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 6px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .language-selector {
    position: relative;
    top: 0;
    right: 0;
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
  }

  .notification-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }

  .error-container {
    flex-direction: column;
    text-align: center;
  }

  .error-actions {
    justify-content: center;
  }

  .loading-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .notification-content {
    padding: 1rem;
  }
  
  .loading-text {
    font-size: 1rem;
  }
  
  .select {
    font-size: 0.8rem;
    padding: 0.4rem 2rem 0.4rem 0.8rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .select {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }
  
  .select:hover {
    border-color: #4b5563;
  }
  
  .loading-text {
    color: #f9fafb;
  }
  
  .progress-bar {
    background: #374151;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .select {
    border-width: 3px;
  }
  
  .notification-container {
    border: 2px solid currentColor;
  }
  
  .retry-button {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spinner,
  .button-spinner,
  .notification-slide-enter-active,
  .notification-slide-leave-active,
  .notification-timer::before {
    animation: none;
  }
  
  .retry-button:hover:not(:disabled) {
    transform: none;
  }
}
</style>