document.addEventListener('DOMContentLoaded', function() {
    const captchaTextElement = document.getElementById('captcha-text');
    const captchaInputElement = document.getElementById('captcha-input');
    const errorMessageElement = document.getElementById('error-message');

    let captchaText = '';

    function generateCaptcha() {
        // Generate a simple arithmetic problem
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        let answer;

        switch (operator) {
            case '+':
                answer = num1 + num2;
                break;
            case '-':
                answer = num1 - num2;
                break;
            case '*':
                answer = num1 * num2;
                break;
        }

        captchaText = answer.toString();
        captchaTextElement.textContent = `${num1} ${operator} ${num2} = ?`;
    }

    window.validateCaptcha = function() {
        const userInput = captchaInputElement.value;

        if (userInput === captchaText) {
            // CAPTCHA is correct
            errorMessageElement.textContent = '';
            // Redirect or perform further actions here
            window.location.href = '/public/index.html'; // Example: Redirect to the main page
        } else {
            // CAPTCHA is incorrect
            errorMessageElement.textContent = 'Incorrect CAPTCHA. Please try again.';
            generateCaptcha(); // Generate a new CAPTCHA
            captchaInputElement.value = ''; // Clear the input field
        }
    };

    // Initial CAPTCHA generation
    generateCaptcha();
});