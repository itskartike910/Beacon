/* global chrome */
console.log('🚀 Beacon content script loaded');

let urlObserver = null;
let lastProcessedUrl = '';

// Track interceptor injection status
let unfollowInterceptorInjected = false;
let unlikeTweetInterceptorInjected = false;
let deleteTweetInterceptorInjected = false;
let removeRetweetInterceptorInjected = false;

// Setup unfollow interceptor
function setupUnfollowInterceptor() {
  if (unfollowInterceptorInjected) return;

  console.log('💉 Setting up unfollow interceptor...');

  // Listen for unfollow events
  window.addEventListener('unfollowProfileCaptured', async (event) => {
    console.log('📥 Received unfollow event:', event.detail);
    
    try {
      const storage = await new Promise((resolve) => {
        chrome.storage.local.get(['unfollowedUsers', 'userAuth', 'userId'], resolve);
      });

      const existingUnfollows = storage.unfollowedUsers || [];
      const unfollowData = event.detail.data;

      // Check if we already have this unfollow
      if (!existingUnfollows.some(user => user.userId === unfollowData.userId)) {
        // Add to unfollowed users list
        const updatedUnfollows = [...existingUnfollows, unfollowData];
        
        // Store in chrome.storage
        await chrome.storage.local.set({ unfollowedUsers: updatedUnfollows });

        // Send to background script
        chrome.runtime.sendMessage({
          type: 'INTERCEPTED_ACTION',
          data: {
            type: 'unfollow',
            ...unfollowData,
            userId: storage.userId
          }
        });
      }
    } catch (error) {
      console.error('❌ Error processing unfollow data:', error);
    }
  });

  // Inject the interceptor script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('interceptors/unfollowinterceptor.js');
  script.onload = () => {
    console.log('✅ Unfollow interceptor loaded');
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  unfollowInterceptorInjected = true;
}

// Setup unlike tweet interceptor
function setupUnlikeTweetInterceptor() {
  if (unlikeTweetInterceptorInjected) return;

  console.log('💉 Setting up unlike tweet interceptor...');

  // Listen for unlike tweet events
  window.addEventListener('unlikeTweetRequestDataCaptured', async (event) => {
    console.log('📥 Received unlike tweet event:', event.detail);
    
    try {
      const storage = await new Promise((resolve) => {
        chrome.storage.local.get(['unlikedTweets', 'userAuth', 'userId'], resolve);
      });

      const existingUnlikes = storage.unlikedTweets || [];
      const unlikeData = event.detail.data;

      // Check if we already have this unlike
      if (!existingUnlikes.some(tweet => tweet.tweetId === unlikeData.tweetId)) {
        // Add to unliked tweets list
        const updatedUnlikes = [...existingUnlikes, unlikeData];
        
        // Store in chrome.storage
        await chrome.storage.local.set({ unlikedTweets: updatedUnlikes });

        // Send to background script
        chrome.runtime.sendMessage({
          type: 'INTERCEPTED_ACTION',
          data: {
            type: 'unlike',
            ...unlikeData,
            userId: storage.userId
          }
        });
      }
    } catch (error) {
      console.error('❌ Error processing unlike tweet data:', error);
    }
  });

  // Inject the interceptor script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('interceptors/unliketweetinterceptor.js');
  script.onload = () => {
    console.log('✅ Unlike tweet interceptor loaded');
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  unlikeTweetInterceptorInjected = true;
}

// Setup delete tweet interceptor
function setupDeleteTweetInterceptor() {
  if (deleteTweetInterceptorInjected) return;

  console.log('💉 Setting up delete tweet interceptor...');

  // Listen for delete tweet events
  window.addEventListener('deleteTweetDataCaptured', async (event) => {
    console.log('📥 Received delete tweet event:', event.detail);
    
    try {
      const storage = await new Promise((resolve) => {
        chrome.storage.local.get(['deletedTweets', 'userAuth', 'userId'], resolve);
      });

      const existingDeletes = storage.deletedTweets || [];
      const deleteData = event.detail.data;

      // Check if we already have this delete
      if (!existingDeletes.some(tweet => tweet.tweetId === deleteData.tweetId)) {
        // Add to deleted tweets list
        const updatedDeletes = [...existingDeletes, deleteData];
        
        // Store in chrome.storage
        await chrome.storage.local.set({ deletedTweets: updatedDeletes });

        // Send to background script
        chrome.runtime.sendMessage({
          type: 'INTERCEPTED_ACTION',
          data: {
            type: 'delete_tweet',
            ...deleteData,
            userId: storage.userId
          }
        });
      }
    } catch (error) {
      console.error('❌ Error processing delete tweet data:', error);
    }
  });

  // Inject the interceptor script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('interceptors/deletetweetinterceptor.js');
  script.onload = () => {
    console.log('✅ Delete tweet interceptor loaded');
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  deleteTweetInterceptorInjected = true;
}

// Setup remove retweet interceptor
function setupRemoveRetweetInterceptor() {
  if (removeRetweetInterceptorInjected) return;

  console.log('💉 Setting up remove retweet interceptor...');

  // Listen for remove retweet events
  window.addEventListener('removeRetweetRequestDataCaptured', async (event) => {
    console.log('📥 Received remove retweet event:', event.detail);
    
    try {
      const storage = await new Promise((resolve) => {
        chrome.storage.local.get(['removedRetweets', 'userAuth', 'userId'], resolve);
      });

      const existingRemoves = storage.removedRetweets || [];
      const removeData = event.detail.data;

      // Check if we already have this remove
      if (!existingRemoves.some(tweet => tweet.tweetId === removeData.tweetId)) {
        // Add to removed retweets list
        const updatedRemoves = [...existingRemoves, removeData];
        
        // Store in chrome.storage
        await chrome.storage.local.set({ removedRetweets: updatedRemoves });

        // Send to background script
        chrome.runtime.sendMessage({
          type: 'INTERCEPTED_ACTION',
          data: {
            type: 'remove_retweet',
            ...removeData,
            userId: storage.userId
          }
        });
      }
    } catch (error) {
      console.error('❌ Error processing remove retweet data:', error);
    }
  });

  // Inject the interceptor script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('interceptors/removeretweetinterceptor.js');
  script.onload = () => {
    console.log('✅ Remove retweet interceptor loaded');
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  removeRetweetInterceptorInjected = true;
}

// Initialize all interceptors
function initializeInterceptors() {
  try {
    if (window.location.href.includes('x.com')) {
      setupUnfollowInterceptor();
      setupUnlikeTweetInterceptor();
      setupDeleteTweetInterceptor();
      setupRemoveRetweetInterceptor();
      console.log('🎯 All interceptors initialized');
    }
  } catch (error) {
    console.error('Error initializing interceptors:', error);
  }
}

async function handleProfileVisitScraping() {
  console.log("🔄 Starting profile visit scraping");

  // Check if profile visit scraping is enabled and get user info
  const storage = await new Promise((resolve) => {
    chrome.storage.local.get(
      [
        "isScrapingEnabled",
        "initialUsername",
        "userHandle",
        "visitedProfiles",
        "lastVisitedProfile",
        "lastVisitTime",
      ],
      resolve
    );
  });

  if (!storage.isScrapingEnabled) {
    console.log("🚫 Profile visit scraping is disabled");
    return;
  }

  // Get current URL and extract handle
  const currentUrl = window.location.href;
  const match = currentUrl.match(/x\.com\/([^/?#]+)$/);

  if (!match) {
    console.log("🚫 Not a valid x.com profile URL");
    return;
  }

  const visitedHandle = match[1];
  const userHandle = storage.initialUsername || storage.userHandle;

  // Skip special paths and own profile
  if (
    !visitedHandle ||
    visitedHandle === userHandle ||
    visitedHandle === storage.initialUsername ||
    visitedHandle === storage.userHandle ||
    [
      "home",
      "explore",
      "notifications",
      "messages",
      "i",
      "settings",
      "jobs",
      "search",
      "lists",
      "communities",
      "login",
      "signup",
      "privacy",
      "tos",
      "help",
      "about",
      "developers",
      "status",
      "account",
      "logout",
      "intent",
      "compose",
      "analytics",
      "moment_maker",
      "live",
      "topics",
      "events",
      "safety",
      "ads",
      "verified",
      "subscriptions",
      "connect",
      "support",
      "download",
      "business",
      "security",
      "pricing",
      "profile",
      "following",
      "followers",
    ].includes(visitedHandle)
  ) {
    console.log(
      "👤 Skipping special path or own profile:",
      visitedHandle
    );
    return;
  }

  // Check for duplicate visit within debounce period (5 seconds)
  const now = Date.now();
  if (
    visitedHandle === storage.lastVisitedProfile &&
    now - (storage.lastVisitTime || 0) < 5000
  ) {
    console.log(
      "🔄 Skipping duplicate visit within debounce period:",
      visitedHandle
    );
    return;
  }

  // Update last visit data
  chrome.storage.local.set({
    lastVisitedProfile: visitedHandle,
    lastVisitTime: now,
  });

  // Initialize visited profiles if not exists
  const visitedProfiles = storage.visitedProfiles || [];

  console.log("👤 Processing profile visit:", {
    visitor: userHandle,
    visited: visitedHandle,
  });

  // Get profile photo URL from the page
  const profilePhotoElement = document.querySelector(
    'img[src*="profile_images"]'
  );
  const profilePhotoUrl = profilePhotoElement ? profilePhotoElement.src : null;

  // Get user's name from the page
  const nameElement = document.querySelector(
    '[data-testid="UserName"] div span'
  );
  const userName = nameElement ? nameElement.textContent.trim() : null;

  // Create enriched profile data
  const profileVisitData = {
    handle: visitedHandle,
    visitTime: new Date().toISOString(),
    profileUrl: `https://x.com/${visitedHandle}`,
    profilePhotoUrl: profilePhotoUrl,
    userName: userName,
  };

  // Update visited profiles list with enriched data
  if (!visitedProfiles.some((profile) => profile.handle === visitedHandle)) {
    visitedProfiles.push(profileVisitData);
    chrome.storage.local.set({ visitedProfiles });
    // Notify UI about the update
    chrome.runtime.sendMessage({
      type: "VISITED_PROFILES_UPDATED",
      data: visitedProfiles,
    });
  }

  // Send profile visit data to background script
  chrome.runtime.sendMessage({
    type: "SEND_PROFILE_VISIT",
    data: {
      visitedHandle,
      userHandle: userHandle,
      timestamp: new Date().toISOString(),
    },
  });
}

// Function to observe URL changes
function observeUrlChanges() {
  if (urlObserver) {
    urlObserver.disconnect();
  }

  let lastUrl = window.location.href;
  
  urlObserver = new MutationObserver(() => {
    const url = window.location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      handleProfileVisitScraping();
    }
  });

  urlObserver.observe(document, { subtree: true, childList: true });
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📨 Content script received message:", message);

  if (message.type === "TOGGLE_SCRAPING") {
    console.log("🔄 Scraping toggled:", message.enabled);
    
    if (message.enabled) {
      // Start URL observation and check current URL
      observeUrlChanges();
      handleProfileVisitScraping();
      initializeInterceptors(); // Initialize interceptors when scraping is enabled
    } else {
      // Stop URL observation
      if (urlObserver) {
        urlObserver.disconnect();
        urlObserver = null;
      }
    }
  }

  return true;
});

// Initialize immediately
initializeInterceptors();
console.log('✅ Beacon content script initialized'); 