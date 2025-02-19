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
            // Remove the script tag
            node.parentNode.removeChild(node);
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