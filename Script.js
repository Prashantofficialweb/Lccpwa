
        // ============================================
        // PRE-SAVED ADMIN CREDENTIALS
        // ============================================
        const ADMIN_CREDENTIALS = {
            email: "admin@lcc.com",
            password: "goludon"
        };

        // Session duration: 24 hours in milliseconds
        const SESSION_DURATION = 24 * 60 * 60 * 1000;

        // ============================================
        // REDIRECT URL - ADD YOUR LINK HERE
        // ============================================
        const REDIRECT_URL = "https://laxmi-coaching.blogspot.com/p/admin.html";

        // ============================================
        // DOM ELEMENTS
        // ============================================
        const loginForm = document.getElementById('loginForm');
        const loginContainer = document.getElementById('loginContainer');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rememberMe = document.getElementById('rememberMe');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const successMessage = document.getElementById('successMessage');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        const togglePassword = document.getElementById('togglePassword');
        const eyeIcon = document.getElementById('eyeIcon');

        // ============================================
        // CHECK EXISTING SESSION ON PAGE LOAD
        // ============================================
        document.addEventListener('DOMContentLoaded', () => {
            checkExistingSession();
        });

        function checkExistingSession() {
            const session = localStorage.getItem('lcc_admin_session');
            if (session) {
                const sessionData = JSON.parse(session);
                const now = new Date().getTime();
                
                if (now < sessionData.expiry) {
                    // Session is still valid - redirect to admin panel
                    window.location.href = REDIRECT_URL;
                } else {
                    // Session expired, clear it
                    localStorage.removeItem('lcc_admin_session');
                }
            }
        }

        // ============================================
        // TOGGLE PASSWORD VISIBILITY
        // ============================================
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });

        // ============================================
        // FORM SUBMISSION
        // ============================================
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Hide previous messages
            errorMessage.classList.add('hidden');
            successMessage.classList.add('hidden');

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Show loading state
            setLoadingState(true);

            // Simulate network delay for realistic feel
            await delay(1500);

            // Validate credentials
            if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                // Success
                successMessage.classList.remove('hidden');
                
                // Save session if remember me is checked
                if (rememberMe.checked) {
                    const expiry = new Date().getTime() + SESSION_DURATION;
                    const sessionData = {
                        email: email,
                        expiry: expiry,
                        loginTime: new Date().toISOString()
                    };
                    localStorage.setItem('lcc_admin_session', JSON.stringify(sessionData));
                }

                await delay(1000);
                
                // Redirect to admin panel
                window.location.href = REDIRECT_URL;
            } else {
                // Error
                setLoadingState(false);
                
                if (email !== ADMIN_CREDENTIALS.email) {
                    errorText.textContent = 'Email address not found';
                } else {
                    errorText.textContent = 'Incorrect password';
                }
                
                errorMessage.classList.remove('hidden');
                loginForm.classList.add('shake');
                
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
            }
        });

        // ============================================
        // HELPER FUNCTIONS
        // ============================================
        function setLoadingState(loading) {
            if (loading) {
                submitBtn.classList.add('loading');
                btnText.textContent = 'Authenticating...';
                btnIcon.classList.remove('fa-arrow-right');
                btnIcon.classList.add('spinner');
                btnIcon.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                btnIcon.style.borderTop = '2px solid white';
                btnIcon.style.borderRadius = '50%';
                btnIcon.style.width = '20px';
                btnIcon.style.height = '20px';
                btnIcon.style.animation = 'spin 0.8s linear infinite';
            } else {
                submitBtn.classList.remove('loading');
                btnText.textContent = 'Access Admin Panel';
                btnIcon.classList.add('fa-arrow-right');
                btnIcon.classList.remove('spinner');
                btnIcon.style = '';
            }
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Clear inputs on page unload for security (if not remembered)
        window.addEventListener('beforeunload', () => {
            if (!rememberMe.checked) {
                loginForm.reset();
            }
        });
    

