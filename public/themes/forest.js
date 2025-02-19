FILE PATH: public/themes/forest.js
CONTENT: 
```javascript
import { css } from "../../../lib/theme.js";

export default {
    name: 'Forest',
    css: css`
        body {
            background: #006400;
            color: #00FF00;
            font-family: "Helvetica", "Arial", sans-serif;
            text-align: center;
        }

        a {
            color: #FFD700;
        }

        h1 {
            margin-bottom: 1.25rem;
            font-size: 2.5rem;
        }

        h2 {
            margin-bottom: 1.25rem;
            font-size: 2rem;
        }

        h3 {
            margin-bottom: 1.25rem;
            font-size: 1.75rem;
        }

        h4 {
            margin-bottom: 1.25rem;
            font-size: 1.5rem;
        }

        h5 {
            margin-bottom: 1.25rem;
            font-size: 1.25rem;
        }

        h6 {
            margin-bottom: 1.25rem;
            font-size: 1.125rem;
        }

        p {
            margin-bottom: 1.25rem;
            font-size: 1rem;
        }

        ul {
            list-style-type: none;
            display: flex;
            padding: 0;
        }

        li {
            margin-right: 1.25rem;
            font-size: 1.25rem;
        }

        a {
            text-decoration: none;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 1.25rem;
        }

        .header {
            margin-bottom: 1.25rem;
        }

        .footer {
            margin-top: 1.25rem;
            text-align: right;
        }

        .success {
            color: #00FF00;
        }

        .error {
            color: #FF0000;
        }

        @media (prefers-color-scheme: dark) {
            body {
                background: #002800;
            }

            a {
                color: #FFD700;
            }
        }
    `
};
```