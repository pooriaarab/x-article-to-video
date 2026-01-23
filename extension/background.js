// Background service worker for Tweet to Video extension

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tweet to Video extension installed');
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'log') {
    console.log('[Tweet to Video]', request.message);
  }
  return true;
});

// Handle download completion
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === 'complete') {
    console.log('Video download completed');
  }
});
