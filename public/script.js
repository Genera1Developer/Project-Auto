function generateBinaryEncryptionEffect(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }

    const text = element.innerText;
    const binaryText = Array.from(text)
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');

    element.setAttribute('data-original-text', text);
    element.innerText = binaryText;

    element.addEventListener('mouseover', () => {
        element.innerText = element.getAttribute('data-original-text');
    });

    element.addEventListener('mouseout', () => {
        element.innerText = binaryText;
    });
}

function applyMatrixAnimation(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const originalText = element.innerText;
    let iteration = 0;

    const interval = setInterval(() => {
        element.innerText = originalText
            .split("")
            .map((char, index) => {
                if (index < iteration) {
                    return originalText[index];
                }

                const randomIndex = Math.floor(Math.random() * characters.length);
                return characters[randomIndex];
            })
            .join("");

        if (iteration >= originalText.length) {
            clearInterval(interval);
        }

        iteration += 1 / 3;
    }, 30);
}

function showEncryptionNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 123, 255, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    `;
    notification.innerText = message;
    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);

    // Fade out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, duration);
}