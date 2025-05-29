<template>
  <div id="app">
    <!-- Loading Screen -->
    <div v-if="isInitializing" class="loading-screen">
      <div class="container">
        <div class="has-text-centered">
          <div class="loading-spinner"></div>
          <h2 class="title is-4 mt-4">{{ loadingText }}</h2>
          <p class="subtitle">{{ initializingText }}</p>
        </div>
      </div>
    </div>

    <!-- Error Screen -->
    <div v-else-if="initializationError" class="error-screen">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6">
            <div class="notification is-danger">
              <h2 class="title is-4">{{ errorTitle }}</h2>
              <p>{{ initializationError }}</p>
              <button class="button is-light mt-4" @click="retryInitialization">
                {{ retryText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Application -->
    <div v-else class="survey-app">
      <!-- Landing Page -->
      <LandingPage 
        v-if="currentView === 'landing'" 
        @start-survey="handleStart<div class="survey-form">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <div class="box">
              <div class="survey-header">
                <h1 class="title is-3">{{ surveyTitle }}</h1>
                <p class="subtitle is-5">{{ surveyDescription }}</p>
                <div class="progress-container">
                  <progress 
                    class="progress is-primary" 
                    :value="currentQuestionIndex + 1" 
                    :max="questions.length"
                  >
                    {{ Math.round(((currentQuestionIndex + 1) / questions.length) * 100) }}%
                  </progress>
                  <p class="has-text-centered mt-2">
                    Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
                  </p>
                </div>
              </div>

              <div v-if="loading" class="has-text-centered">
                <div class="loader"></div>
                <p>Loading survey...</p>
              </div>

              <div v-else-if="error" class="notification is-danger">
                <p>{{ error }}</p>
                <button @click="loadSurvey" class="button is-primary mt-3">
                  Retry
                </button>
              </div>

              <div v-else-if="questions.length > 0" class="survey-content">
                <div class="question-container">
                  <component 
                    :is="currentQuestionComponent"
                    :question="currentQuestion"
                    :modelValue="currentAnswer"
                    @update:modelValue="handleAnswerChange"
                    @submit="handleQuestionSubmit"
                    :key="currentQuestion.id"
                  />
                </div>

                <div class="survey-navigation mt-5">
                  <div class="buttons is-centered">
                    <button 
                      v-if="currentQuestionIndex > 0"
                      @click="goToPreviousQuestion"
                      class="button is-light"
                      :disabled="submitting"
                    >
                      <span class="icon">
                        <i class="fas fa-arrow-left"></i>
                      </span>
                      <span>Previous</span>
                    </button>

                    <button 
                      v-if="currentQuestionIndex < questions.length - 1"
                      @click="goToNextQuestion"
                      class="button is-primary"
                      :disabled="!isCurrentQuestionValid || submitting"
                      :class="{ 'is-loading': submitting }"
                    >
                      <span>Next</span>
                      <span class="icon">
                        <i class="fas fa-arrow-right"></i>
                      </span>
                    </button>

                    <button 
                      v-if="currentQuestionIndex === questions.length - 1"
                      @click="completeSurvey"
                      class="button is-success"
                      :disabled="!isCurrentQuestionValid || submitting"
                      :class="{ 'is-loading': submitting }"
                    >
                      <span class="icon">
                        <i class="fas fa-check"></i>
                      </span>
                      <span>Complete Survey</span>
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="has-text-centered">
                <p>No questions found for this survey.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>