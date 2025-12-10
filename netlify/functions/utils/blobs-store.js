/**
 * Netlify Blobs Store Helper
 * 
 * Properly initializes Blobs stores within the request handler context
 * This ensures Blobs can access the Netlify function context
 */

let csrfTokenStore = null
let botBlacklistStore = null
let behavioralPatternsStore = null
let unsubscribeStore = null

/**
 * Initialize all Blobs stores within the handler context
 * Must be called from inside the request handler (where context is available)
 */
function initBlobsStores(context) {
  // If stores already initialized, return them
  if (csrfTokenStore && botBlacklistStore && behavioralPatternsStore && unsubscribeStore) {
    return {
      csrfTokenStore,
      botBlacklistStore,
      behavioralPatternsStore,
      unsubscribeStore,
      initialized: true
    }
  }
  
  try {
    const { getStore } = require('@netlify/blobs')
    
    // Try to initialize stores - getStore automatically uses function context
    // In Netlify Functions, the context provides site ID automatically
    try {
      if (!csrfTokenStore) {
        csrfTokenStore = getStore('csrf-tokens')
        console.log('✅ CSRF token Blobs store initialized')
      }
    } catch (error) {
      console.warn('⚠️ Failed to initialize CSRF token store:', error.message)
      csrfTokenStore = null
    }
    
    try {
      if (!botBlacklistStore) {
        botBlacklistStore = getStore('bot-blacklist')
        console.log('✅ Bot blacklist Blobs store initialized')
      }
    } catch (error) {
      console.warn('⚠️ Failed to initialize bot blacklist store:', error.message)
      botBlacklistStore = null
    }
    
    try {
      if (!behavioralPatternsStore) {
        behavioralPatternsStore = getStore('behavioral-patterns')
        console.log('✅ Behavioral patterns Blobs store initialized')
      }
    } catch (error) {
      console.warn('⚠️ Failed to initialize behavioral patterns store:', error.message)
      behavioralPatternsStore = null
    }
    
    try {
      if (!unsubscribeStore) {
        unsubscribeStore = getStore('unsubscribes')
        console.log('✅ Unsubscribe Blobs store initialized')
      }
    } catch (error) {
      console.warn('⚠️ Failed to initialize unsubscribe store:', error.message)
      unsubscribeStore = null
    }
    
    const initialized = csrfTokenStore !== null && botBlacklistStore !== null && behavioralPatternsStore !== null && unsubscribeStore !== null
    
    if (!initialized) {
      console.warn('⚠️ Some Blobs stores failed to initialize - using in-memory fallback')
    }
    
    return {
      csrfTokenStore,
      botBlacklistStore,
      behavioralPatternsStore,
      unsubscribeStore,
      initialized
    }
  } catch (error) {
    // Critical error - Blobs package not available
    console.warn('⚠️ Netlify Blobs package not available:', error.message)
    return {
      csrfTokenStore: null,
      botBlacklistStore: null,
      behavioralPatternsStore: null,
      unsubscribeStore: null,
      initialized: false,
      error: error.message
    }
  }
}

/**
 * Get CSRF token store (must be initialized first)
 */
function getCsrfTokenStore() {
  return csrfTokenStore
}

/**
 * Get bot blacklist store (must be initialized first)
 */
function getBotBlacklistStore() {
  return botBlacklistStore
}

/**
 * Get behavioral patterns store (must be initialized first)
 */
function getBehavioralPatternsStore() {
  return behavioralPatternsStore
}

/**
 * Get unsubscribe store (must be initialized first)
 */
function getUnsubscribeStore() {
  return unsubscribeStore
}

/**
 * Check if Blobs stores are available
 */
function isBlobsAvailable() {
  return csrfTokenStore !== null && botBlacklistStore !== null && behavioralPatternsStore !== null && unsubscribeStore !== null
}

module.exports = {
  initBlobsStores,
  getCsrfTokenStore,
  getBotBlacklistStore,
  getBehavioralPatternsStore,
  getUnsubscribeStore,
  isBlobsAvailable
}

