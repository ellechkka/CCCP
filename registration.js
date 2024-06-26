document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = form.querySelector('button');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const emailSubtitle = document.getElementById('emailSubtitle');
    const connectionError = document.getElementById('connectionError');
    const alreadyRegistered = document.getElementById('alreadyRegistered');

    emailInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);
    emailInput.addEventListener('focus', normalizeInput);
    passwordInput.addEventListener('focus', normalizeInput);

    function checkInputs() {
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        // проверка наличия как минимум одной цифры, одной строчной буквы и одной заглавной буквы
        const passwordPattern = /^(?=.*\d)(?=.*[a-zа-я])(?=.*[A-ZА-Я]).{8,}$/;
        let isFormValid = true;

        emailError.style.display = 'none';
        emailInput.classList.remove('error');
        passwordError.style.display = 'none';
        passwordInput.classList.remove('error');

        // Validate email
        if (!validateEmail(emailValue)) {
            emailError.style.display = 'block';
            emailSubtitle.style.display = 'none';
            emailInput.classList.add('error');
            isFormValid = false;
        }

        // Validate password
        if ((passwordValue.length > 0) && (passwordValue.length < 8) || !passwordPattern.test(passwordValue)) {
            passwordError.style.display = 'block';
            passwordInput.classList.add('error');
            isFormValid = false;
        }
      
        if (passwordValue.length === 0) {
            isFormValid = false;
        }

        submitButton.disabled = !isFormValid;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        normalizeInput();
        
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        if (!submitButton.disabled) {
            fetch('http://localhost/cccp.ver2/php/registerNewCabinet.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    // такой пользователь уже был зарегистрирован
                    if (data == 'already registered') {
                        emailInput.classList.add('error');
                        passwordInput.classList.add('error');
                        document.getElementById('alreadyRegistered').style.display = 'block';
                    }
                    // не получилось отправить письмо с кодом или не получилось зарегистрировать
                    if (data == 'not sent' || data == 'no success') {
                        emailInput.classList.add('error');
                        passwordInput.classList.add('error');
                        document.getElementById('connectionError').style.display = 'block';
                    }
                    // письмо с кодом отправлено
                    if (data == 'sent') {
                        window.location.href = '../html/check-email.html';
                    }
                })
                .catch(error => {
                    // ошибка подключения
                    console.error('Ошибка:', error);
                    emailInput.classList.add('error');
                    passwordInput.classList.add('error');
                    document.getElementById('connectionError').style.display = 'block';
                });
        }
    });
    // убирает индикацию ошибок
    function normalizeInput() {
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');

        emailError.style.display = 'none';
        passwordError.style.display = 'none';
        connectionError.style.display = 'none';
        alreadyRegistered.style.display = 'none';
    }
});