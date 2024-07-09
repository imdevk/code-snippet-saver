chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      id: "saveCodeSnippet",
      title: "Save Code Snippet",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveCodeSnippet") {
      chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
      }, (selection) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        if (selection && selection[0]) {
          chrome.windows.create({
            url: 'snippetEditor.html',
            type: 'popup',
            width: 400,
            height: 500
          }, (window) => {
            // Wait for the new window to load before sending the message
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (tabId === window.tabs[0].id && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.tabs.sendMessage(tabId, {
                  action: 'newSnippet',
                  snippet: {
                    code: selection[0],
                    source: tab.url,
                    date: new Date().toISOString()
                  }
                }, function(response) {
                  console.log('Message sent, response:', response);
                });
              }
            });
          });
        }
      });
    }
  });