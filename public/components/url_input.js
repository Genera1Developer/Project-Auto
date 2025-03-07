class URLInput extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.onSubmit = this.onSubmit.bind(this); // Bind onSubmit in constructor
        this.handleKeyDown = this.handleKeyDown.bind(this); // Bind handleKeyDown in constructor
    }

    connectedCallback() {
        this.render();
        this.inputElement = this.shadow.querySelector('input');
        this.buttonElement = this.shadow.querySelector('button');

        this.buttonElement.addEventListener('click', this.onSubmit);
        this.inputElement.addEventListener('keydown', this.handleKeyDown);
    }

    disconnectedCallback() {
        // Remove event listeners when the element is removed
        this.buttonElement.removeEventListener('click', this.onSubmit);
        this.inputElement.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if inside a form
            this.onSubmit();
        }
    }

    onSubmit() {
        const url = this.inputElement.value;
        if (url) {
            try {
                new URL(url); // Basic URL validation
                this.dispatchEvent(new CustomEvent('urlSubmit', { detail: url }));
            } catch (error) {
                alert('Invalid URL'); // Simple error handling
            }

        }
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                .container {
                    display: flex;
                    gap: 5px;
                }

                input[type="text"] {
                    flex-grow: 1;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-size: 1em;
                    background-color: #fff;
                    color: #333;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;
                    width: 100%;
                }

                button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }
            </style>
            <div class="container">
                <input type="text" placeholder="Enter URL">
                <button>Go</button>
            </div>
        `;
    }
}

customElements.define('url-input', URLInput);