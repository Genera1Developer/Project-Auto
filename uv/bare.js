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
                console.error(`Bare fetch error: HTTP error! status: ${response.status} - ${fetchUrl}`);
                throw new Error(`Bare fetch error: HTTP error! status: ${response.status}`);
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
                console.error(`Bare request error: HTTP error! status: ${response.status} - ${fetchUrl}`);
                throw new Error(`Bare request error: HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Bare request error:", error);
            throw error;
        }
    }

    createProxy(url) {
        return this.prefix + encodeURIComponent(url);
    }

	/**
	 * Resolves a URL to an absolute URL.
	 * @param {string} url The URL to resolve.
	 * @param {string} base The base URL to resolve against.
	 * @returns {string} The absolute URL.
	 */
	resolve(url, base) {
		try {
			return new URL(url, base || this.origin).href;
		} catch (error) {
			console.warn("Bare resolve error:", error);
			return undefined;
		}
	}
}