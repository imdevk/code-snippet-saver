let currentSnippet = null;
let snippetCount = 0;

chrome.storage.local.get(['snippetCount'], function(result) {
  snippetCount = result.snippetCount || 0;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request); // Debug log
  if (request.action === 'newSnippet') {
    currentSnippet = request.snippet;
    snippetCount++;
    document.getElementById('title').value = `Code Snippet ${snippetCount}`;
    document.getElementById('description').value = '';
    document.getElementById('code').value = currentSnippet.code;
    console.log('Snippet loaded:', currentSnippet); // Debug log
  }
});

// Add this to ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded'); // Debug log
  document.getElementById('saveButton').addEventListener('click', () => {
    currentSnippet.title = document.getElementById('title').value || `Code Snippet ${snippetCount}`;
    currentSnippet.description = document.getElementById('description').value;

    chrome.storage.local.get(['snippets'], function(result) {
      let snippets = result.snippets || [];
      snippets.push(currentSnippet);
      chrome.storage.local.set({snippets: snippets, snippetCount: snippetCount}, function() {
        console.log('Snippet saved');
        window.close();
      });
    });
  });
});