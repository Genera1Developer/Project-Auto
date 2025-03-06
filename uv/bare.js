class Bare {
    constructor(opts = {}) {
        this.origin = opts.origin || location.origin;
        this.pathname = opts.pathname || '/bare/';
        this.prefix = this.origin + this.pathname;
    }
    async fetch(url, options = {}) {
        const fetchUrl = this.prefix + encodeURIComponent(url);
        const response = await fetch(fetchUrl, options);
        return response;
    }
    async request(url, options = {}) {
        const fetchUrl = this.prefix + encodeURIComponent(url);
        const response = await fetch(fetchUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
}