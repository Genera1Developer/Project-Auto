function isValidURL(url) {
    try {
        // Check if the URL starts with a valid protocol (http/https)
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return false;
        }
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

module.exports = { isValidURL };