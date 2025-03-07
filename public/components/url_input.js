class URLInput extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.inputElement = this.shadow.querySelector('input');
        this.buttonElement = this.shadow.querySelector('button');

        this.buttonElement.addEventListener('click', this.onSubmit.bind(this));
        this.inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.onSubmit();
            }
        });
    }

    onSubmit() {
        const url = this.inputElement.value;
        if (url) {
            this.dispatchEvent(new CustomEvent('urlSubmit', { detail: url }));
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