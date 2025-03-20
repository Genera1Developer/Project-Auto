// Function to generate a simple encrypted CAPTCHA
function generateCaptcha() {
    const captchaText = Math.random().toString(36).substring(2, 7).toUpperCase(); // Generate a random string
    const encryptedText = CryptoJS.AES.encrypt(captchaText, 'SecretPassphrase').toString(); // Encrypt the captcha
    document.getElementById('captcha-text').innerText = encryptedText; // Display the encrypted captcha

    return captchaText; // Return the plain text captcha for later validation (server-side in real implementation)
}

let expectedCaptcha = generateCaptcha(); // Generate initial captcha

// Function to validate the CAPTCHA
function validateCaptcha() {
    const userInput = document.getElementById('captcha-input').value.toUpperCase();
    const errorMessage = document.getElementById('error-message');
    const encryptedCaptcha = document.getElementById('captcha-text').innerText;

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedCaptcha, 'SecretPassphrase');
        const decryptedCaptcha = bytes.toString(CryptoJS.enc.Utf8);

         if (userInput === decryptedCaptcha.toUpperCase()) {
            errorMessage.innerText = 'Captcha Matched!';
            errorMessage.style.color = 'green';
            //Re-enable button after successful verification
            const verifyButton = document.querySelector('button');
            verifyButton.disabled = false;

        } else {
            errorMessage.innerText = 'Captcha does not match. Please try again.';
            errorMessage.style.color = 'red';
            expectedCaptcha = generateCaptcha(); // Generate a new captcha
            document.getElementById('captcha-input').value = ''; // Clear the input field
        }
    } catch (e) {
        errorMessage.innerText = 'Decryption Error. Please try again.';
        errorMessage.style.color = 'red';
        expectedCaptcha = generateCaptcha(); // Generate a new captcha
        document.getElementById('captcha-input').value = ''; // Clear the input field
    }

}

//Disable button while loading
document.addEventListener('DOMContentLoaded', function() {
    const verifyButton = document.querySelector('button');
    verifyButton.disabled = false;
});