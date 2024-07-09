document.addEventListener('DOMContentLoaded', function() {
    const snippetList = document.getElementById('snippetList');
  
    function displaySnippets() {
        chrome.storage.local.get(['snippets'], function(result) {
          snippetList.innerHTML = '';
          const snippets = result.snippets || [];
          if (snippets.length === 0) {
            snippetList.innerHTML = '<p class="no-snippets">No snippets saved yet. Select some code on a webpage and use the context menu to save a snippet!</p>';
            return;
          }
          snippets.forEach(function(snippet, index) {
            const snippetElement = document.createElement('div');
            snippetElement.classList.add('snippet');
            snippetElement.innerHTML = `
              <div class="snippet-header">
                ${escapeHtml(snippet.title)}
              </div>
              <div class="snippet-content">
                <p>${escapeHtml(snippet.description)}</p>
                <pre><code>${escapeHtml(snippet.code)}</code></pre>
              </div>
              <div class="snippet-footer">
                <small>From: ${snippet.source}</small>
                <small>Date: ${new Date(snippet.date).toLocaleString()}</small>
              </div>
              <div class="snippet-footer">
                <button class="copySnippet" data-index="${index}">Copy</button>
                <button class="deleteSnippet" data-index="${index}">Delete</button>
              </div>
            `;
            snippetList.appendChild(snippetElement);
          });
        });
      }
  
    function escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  
    displaySnippets();
  
    snippetList.addEventListener('click', function(e) {
      if (e.target.classList.contains('deleteSnippet')) {
        const index = e.target.getAttribute('data-index');
        chrome.storage.local.get(['snippets'], function(result) {
          let snippets = result.snippets || [];
          snippets.splice(index, 1);
          chrome.storage.local.set({snippets: snippets}, function() {
            displaySnippets();
          });
        });
      } else if (e.target.classList.contains('copySnippet')) {
        const index = e.target.getAttribute('data-index');
        chrome.storage.local.get(['snippets'], function(result) {
          const snippets = result.snippets || [];
          const code = snippets[index].code;
          navigator.clipboard.writeText(code).then(function() {
            alert('Snippet copied to clipboard!');
          });
        });
      }
    });
  });