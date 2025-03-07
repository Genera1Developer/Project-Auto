class URLInput extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.onSubmit = this.onSubmit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.validateURL = this.validateURL.bind(this);
        this.inputElement = null;
        this.buttonElement = null;
    }

    connectedCallback() {
        this.render();
        this.inputElement = this.shadow.querySelector('input');
        this.buttonElement = this.shadow.querySelector('button');

        this.buttonElement.addEventListener('click', this.onSubmit);
        this.inputElement.addEventListener('keydown', this.handleKeyDown);
        this.inputElement.addEventListener('blur', this.validateURL); // Validate on blur
    }

    disconnectedCallback() {
        this.buttonElement.removeEventListener('click', this.onSubmit);
        this.inputElement.removeEventListener('keydown', this.handleKeyDown);
        this.inputElement.removeEventListener('blur', this.validateURL);
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.onSubmit();
        }
    }

    validateURL() {
        const url = this.inputElement.value;
        if (url && !this.isValidURL(url)) {
            this.inputElement.classList.add('invalid');
        } else {
            this.inputElement.classList.remove('invalid');
        }
    }

    onSubmit() {
        const url = this.inputElement.value;
        if (url) {
            if (this.isValidURL(url)) {
                this.dispatchEvent(new CustomEvent('urlSubmit', { detail: url }));
            } else {
                this.displayError('Invalid URL');
            }
        }
    }

    isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    displayError(message) {
        alert(message); // Replace with a more user-friendly error display if desired
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                .container {
                    display: flex;
                    gap: 5px;
                    width: 100%; /* Added width for better responsiveness */
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

                input[type="text"].invalid {
                    border-color: red;
                    box-shadow: 0 0 5px red;
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

                /* Add responsive styling */
                @media (max-width: 600px) {
                    .container {
                        flex-direction: column; /* Stack input and button on smaller screens */
                    }

                    button {
                        width: 100%; /* Make the button full-width */
                    }
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