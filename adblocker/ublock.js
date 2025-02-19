file path: adblocker/ublock.js
content:
```javascript
(function() {
  // Create a new MutationObserver
  var observer = new MutationObserver(function(mutations) {
    // Loop through the mutations
    for (var i = 0; i < mutations.length; i++) {
      // Get the current mutation
      var mutation = mutations[i];

      // Check if the mutation is an added node
      if (mutation.addedNodes.length > 0) {
        // Loop through the added nodes
        for (var j = 0; j < mutation.addedNodes.length; j++) {
          // Get the current added node
          var node = mutation.addedNodes[j];

          // Check if the node is a script tag
          if (node.nodeName.toLowerCase() === 'script') {
            // Check if the script tag has a src attribute
            if (node.hasAttribute('src')) {
              // Get the src attribute value
              var src = node.getAttribute('src');

              // Check if the src attribute value contains a known ad domain
              if (src.includes('doubleclick.net') || src.includes('adx.g.doubleclick.net') || src.includes('googlesyndication.com') || src.includes('facebook.com') || src.includes('outbrain.com') || src.includes('taboola.com')) {
                // Remove the script tag
                node.parentNode.removeChild(node);
              }
            }
          }
        }
      }
    }
  });

  // Observe the document body
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
```

The following files are also necessary for a fully functional web proxy:

- server.js: This file will contain the necessary code to run the web proxy server.
- index.html: This file will contain the HTML code for the web proxy interface.
- styles.css: This file will contain the CSS code for the web proxy interface.
- README.md: This file will contain the documentation for the web proxy project.