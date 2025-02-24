/* global chrome */
console.log('⚙️ Beacon background service worker starting');

// Create alarm for keeping alive
chrome.alarms.create('keepAlive', { periodInMinutes: 0.1 });

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('🟢 Service Worker Active:', new Date().toISOString());
  }
});

// Handle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Received message:', message.type);

  if (message.type === 'TOGGLE_SCRAPING') {
    // Broadcast to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url?.includes('x.com') || tab.url?.includes('twitter.com')) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'TOGGLE_SCRAPING',
            enabled: message.enabled
          }).catch(() => {
            // Ignore errors for tabs that don't have the content script
          });
        }
      });
    });
  }

  if (message.type === 'INTERCEPTED_ACTION') {
    console.log('🎯 Intercepted action:', message.data);
    
    // Get current actions
    chrome.storage.local.get(['interceptedActions'], (result) => {
      const actions = result.interceptedActions || [];
      const newAction = {
        ...message.data,
        browserInfo: {
          tabId: sender.tab?.id,
          url: sender.tab?.url,
          timestamp: new Date().toISOString()
        }
      };
      
      // Add to storage
      actions.push(newAction);
      
      // Keep only last 1000 actions to prevent storage limits
      if (actions.length > 1000) {
        actions.shift();
      }
      
      // Save to storage
      chrome.storage.local.set({ interceptedActions: actions }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving action:', chrome.runtime.lastError);
          return;
        }
        console.log('✅ Stored intercepted action');
        
        // Notify UI about new action
        chrome.runtime.sendMessage({
          type: 'NEW_INTERCEPTED_ACTION',
          data: newAction
        }).catch(() => {
          // Ignore errors if UI is not open
        });
      });
    });
  }

  if (message.type === 'SEND_PROFILE_VISIT') {
    console.log('👤 Profile visit:', message.data);
    // Store the profile visit data
    chrome.storage.local.get(['profileVisits'], (result) => {
      const visits = result.profileVisits || [];
      const newVisit = {
        ...message.data,
        browserInfo: {
          tabId: sender.tab?.id,
          url: sender.tab?.url,
          timestamp: new Date().toISOString()
        }
      };
      
      visits.push(newVisit);
      
      // Keep only last 1000 visits
      if (visits.length > 1000) {
        visits.shift();
      }
      
      chrome.storage.local.set({ profileVisits: visits }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving profile visit:', chrome.runtime.lastError);
          return;
        }
        console.log('✅ Stored profile visit');
      });
    });
  }

  if (message.type === 'VISITED_PROFILES_UPDATED') {
    console.log('📊 Visited profiles updated:', message.data.length);
    // Broadcast to UI if needed
    chrome.runtime.sendMessage({
      type: 'UPDATE_VISITED_PROFILES',
      data: message.data
    }).catch(() => {
      // Ignore errors if UI is not open
    });
  }

  return true;
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && 
      (tab.url?.includes('x.com') || tab.url?.includes('twitter.com'))) {
    // Check if scraping is enabled
    chrome.storage.local.get(['isScrapingEnabled'], (result) => {
      if (result.isScrapingEnabled) {
        // Notify the tab about current scraping state
        chrome.tabs.sendMessage(tabId, {
          type: 'TOGGLE_SCRAPING',
          enabled: true
        }).catch(() => {
          // Ignore errors for tabs that don't have the content script
        });
      }
    });
  }
});

// Handle initial setup
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with default values
  chrome.storage.local.set({
    isScrapingEnabled: false,
    visitedProfiles: [],
    profileVisits: [],
    interceptedActions: [],
    lastVisitedProfile: null,
    lastVisitTime: null,
    stats: {
      totalUnfollows: 0,
      totalUnlikes: 0,
      totalDeletedTweets: 0,
      totalRemovedRetweets: 0,
      lastUpdate: new Date().toISOString()
    }
  });
});

console.log('✅ Beacon background script initialized'); 