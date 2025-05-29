// src/composables/useFirebase.js
import { ref, reactive } from 'vue'
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from '@/utils/firebase'
import { COLLECTIONS } from '@/utils/constants'

export function useFirebase() {
  const loading = ref(false)
  const error = ref(null)

  // Generic error handler
  const handleError = (err, customMessage = null) => {
    console.error('Firebase Error:', err)
    error.value = customMessage || err.message || 'An error occurred'
    loading.value = false
  }

  // Get a single document
  const getDocument = async (collectionName, docId) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() }
        loading.value = false
        return data
      } else {
        loading.value = false
        return null
      }
    } catch (err) {
      handleError(err)
      return null
    }
  }

  // Get multiple documents with query
  const getDocuments = async (collectionName, conditions = [], orderByField = null, orderDirection = 'asc') => {
    loading.value = true
    error.value = null
    
    try {
      let q = collection(db, collectionName)
      
      // Apply where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value))
      })
      
      // Apply ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection))
      }
      
      const querySnapshot = await getDocs(q)
      const documents = []
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() })
      })
      
      loading.value = false
      return documents
    } catch (err) {
      handleError(err)
      return []
    }
  }

  // Create a new document
  const createDocument = async (collectionName, data, customId = null) => {
    loading.value = true
    error.value = null
    
    try {
      const docData = {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      }
      
      let docRef
      
      if (customId) {
        docRef = doc(db, collectionName, customId)
        await setDoc(docRef, docData)
      } else {
        docRef = await addDoc(collection(db, collectionName), docData)
      }
      
      loading.value = false
      return { id: docRef.id, ...docData }
    } catch (err) {
      handleError(err)
      return null
    }
  }

  // Update an existing document
  const updateDocument = async (collectionName, docId, data) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, collectionName, docId)
      const updateData = {
        ...data,
        updated_at: serverTimestamp()
      }
      
      await updateDoc(docRef, updateData)
      loading.value = false
      return true
    } catch (err) {
      handleError(err)
      return false
    }
  }

  // Listen to real-time updates
  const subscribeToDocument = (collectionName, docId, callback) => {
    const docRef = doc(db, collectionName, docId)
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() })
      } else {
        callback(null)
      }
    }, (err) => {
      handleError(err)
    })
  }

  // Survey-specific methods
  const getSurvey = async (surveyId) => {
    return await getDocument(COLLECTIONS.SURVEYS, surveyId)
  }

  const getSurveyQuestions = async (surveyId) => {
    return await getDocuments(
      COLLECTIONS.QUESTIONS,
      [{ field: 'survey_id', operator: '==', value: surveyId }],
      'order_index',
      'asc'
    )
  }

  const createResponseSession = async (sessionData) => {
    return await createDocument(COLLECTIONS.RESPONSE_SESSIONS, sessionData, sessionData.id)
  }

  const updateResponseSession = async (sessionId, data) => {
    return await updateDocument(COLLECTIONS.RESPONSE_SESSIONS, sessionId, data)
  }

  const saveAnswer = async (answerData) => {
    // Check if answer already exists for this session and question
    const existingAnswers = await getDocuments(
      COLLECTIONS.ANSWERS,
      [
        { field: 'session_id', operator: '==', value: answerData.session_id },
        { field: 'question_id', operator: '==', value: answerData.question_id }
      ]
    )

    if (existingAnswers.length > 0) {
      // Update existing answer
      return await updateDocument(COLLECTIONS.ANSWERS, existingAnswers[0].id, {
        answer_text: answerData.answer_text,
        answer_options: answerData.answer_options,
        updated_at: serverTimestamp()
      })
    } else {
      // Create new answer
      return await createDocument(COLLECTIONS.ANSWERS, {
        ...answerData,
        submitted_at: serverTimestamp()
      })
    }
  }

  const getResponseSession = async (sessionId) => {
    return await getDocument(COLLECTIONS.RESPONSE_SESSIONS, sessionId)
  }

  const getSessionAnswers = async (sessionId) => {
    return await getDocuments(
      COLLECTIONS.ANSWERS,
      [{ field: 'session_id', operator: '==', value: sessionId }]
    )
  }

  // Batch operations for better performance
  const batchSaveAnswers = async (answers) => {
    const promises = answers.map(answer => saveAnswer(answer))
    return await Promise.all(promises)
  }

  // Analytics helper
  const incrementSurveyStats = async (surveyId, language) => {
    const today = new Date().toISOString().split('T')[0]
    const statsId = `${surveyId}_${today}`
    
    try {
      const existingStats = await getDocument(COLLECTIONS.SURVEY_STATS, statsId)
      
      if (existingStats) {
        const languageBreakdown = existingStats.language_breakdown || {}
        languageBreakdown[language] = (languageBreakdown[language] || 0) + 1
        
        await updateDocument(COLLECTIONS.SURVEY_STATS, statsId, {
          total_sessions: existingStats.total_sessions + 1,
          language_breakdown: languageBreakdown
        })
      } else {
        await createDocument(COLLECTIONS.SURVEY_STATS, {
          survey_id: surveyId,
          date: today,
          total_sessions: 1,
          completed_sessions: 0,
          completion_rate: 0,
          language_breakdown: { [language]: 1 }
        }, statsId)
      }
    } catch (err) {
      console.warn('Failed to update survey stats:', err)
    }
  }

  const markSurveyCompleted = async (surveyId, sessionId) => {
    // Update session as completed
    await updateResponseSession(sessionId, {
      completed_at: serverTimestamp(),
      is_complete: true
    })

    // Update survey stats
    const today = new Date().toISOString().split('T')[0]
    const statsId = `${surveyId}_${today}`
    
    try {
      const stats = await getDocument(COLLECTIONS.SURVEY_STATS, statsId)
      if (stats) {
        const completedSessions = stats.completed_sessions + 1
        const completionRate = (completedSessions / stats.total_sessions) * 100
        
        await updateDocument(COLLECTIONS.SURVEY_STATS, statsId, {
          completed_sessions: completedSessions,
          completion_rate: Math.round(completionRate * 100) / 100
        })
      }
    } catch (err) {
      console.warn('Failed to update completion stats:', err)
    }
  }

  return {
    loading,
    error,
    getDocument,
    getDocuments,
    createDocument,
    updateDocument,
    subscribeToDocument,
    getSurvey,
    getSurveyQuestions,
    createResponseSession,
    updateResponseSession,
    saveAnswer,
    getResponseSession,
    getSessionAnswers,
    batchSaveAnswers,
    incrementSurveyStats,
    markSurveyCompleted
  }
}