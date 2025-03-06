class Bare {
    constructor(opts = {}) {
        this.origin = opts.origin || location.origin;
        this.pathname = opts.pathname || '/bare/';
        this.prefix = this.origin + this.pathname;
    }
    async fetch(url, options = {}) {
        const fetchUrl = this.prefix + encodeURIComponent(url);
        try {
            const response = await fetch(fetchUrl, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.error("Bare fetch error:", error);
            throw error;
        }
    }
    async request(url, options = {}) {
        const fetchUrl = this.prefix + encodeURIComponent(url);
        try {
            const response = await fetch(fetchUrl, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Bare request error:", error);
            throw error;
        }
    }
}