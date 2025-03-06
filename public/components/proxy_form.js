class ProxyForm extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.form = this.shadow.querySelector('form');
        this.input = this.shadow.querySelector('input[type="text"]');
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.input.addEventListener('keydown', this.handleKeydown.bind(this));

        // Set focus to the input field when the component is connected
        this.input.focus();
    }

    handleKeydown(event) {
        if (event.key === 'Enter') {
            this.form.requestSubmit();
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let url = this.input.value;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
        }

        try {
            new URL(url); // Validate URL format
        } catch (error) {
            alert('Invalid URL');
            return;
        }

        this.dispatchEvent(new CustomEvent('proxySubmit', { detail: url }));
    }

    render() {
        this.shadow.innerHTML = `
            <style>
            form {
                margin-bottom: 20px;
                display: flex;
                gap: 10px;
                align-items: center;
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
            }
            
            input[type="text"]:focus {
                outline: none;
                border-color: #66afe9;
                box-shadow: 0 0 5px rgba(102, 175, 233, 0.5);
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

            button:hover {
                background-color: #3e8e41;
            }
            button:focus {
                outline: none;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            }
            </style>
            <form>
                <input type="text" placeholder="Enter URL" id="url">
                <button type="submit">Go</button>
            </form>
        `;
    }
}

customElements.define('proxy-form', ProxyForm);