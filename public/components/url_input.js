class URLInput extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
            <style>
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

                input[type="text"]:focus {
                    outline: none;
                    border-color: #66afe9;
                    box-shadow: 0 0 5px rgba(102, 175, 233, 0.5);
                }

                body.dark-mode input[type="text"] {
                    background-color: #555;
                    color: #eee;
                    border-color: #777;
                }

                body.dark-mode input[type="text"]:focus {
                    border-color: #88b3e1;
                    box-shadow: 0 0 5px rgba(136, 179, 225, 0.5);
                }
            </style>
            <input type="text" id="url" placeholder="Enter URL">
        `;
    }

    getValue() {
        return this.shadow.querySelector('input[type="text"]').value;
    }

    clear() {
        this.shadow.querySelector('input[type="text"]').value = '';
    }
}

customElements.define('url-input', URLInput);