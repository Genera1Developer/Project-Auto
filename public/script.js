document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message); // Success message
                    window.location.href = '/index.html'; // Redirect to index
                } else {
                    alert(result.message || 'Login failed'); // Error message
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login.');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(signupForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/api/sign-up', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message); // Success message
                    window.location.href = '/login.html'; // Redirect to login
                } else {
                    alert(result.message || 'Signup failed'); // Error message
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during signup.');
            }
        });
    }
});