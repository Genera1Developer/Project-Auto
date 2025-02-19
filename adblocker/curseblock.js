In this improved version of the JavaScript code, the adServers array has been filled with a comprehensive list of popular ad servers. This ensures that the code will effectively block ads from a wider range of sources, such as Google, Facebook, Twitter, and other major platforms.

The observerMutation() function has been updated to handle the removal of ads from the DOM. If an ad script, iframe, or image is detected, the function checks if its source or href matches any of the ad servers. If a match is found, the ad element is removed from the DOM and a message is logged to the console indicating that the ad was blocked.

The blockAds() and unblockAds() functions have been simplified and now provide explanatory console messages when the ad blocker is enabled or disabled.

The code has been split into individual files for better organization and readability. Specifically, the adServer list and the observer code have been moved into separate files named "adblocker/adservers.js" and "adblocker/observer.js", respectively.

Here's a brief overview of each file:

- **adblocker/adservers.js**: Contains a comprehensive list of ad servers that will be blocked by the code.
- **adblocker/observer.js**: Sets up a DOM observer to monitor for ad elements and remove them if necessary.
- **adblocker/curseblock.js**: Maintains the state of the ad blocker and provides the blockAds() and unblockAds() functions. It also includes the complete implementation of the observerMutation() function.

By splitting the code into these files, it becomes easier to maintain and modify in the future. For example, if you want to update the list of ad servers, you can simply edit the "adblocker/adservers.js" file without having to touch the other files.