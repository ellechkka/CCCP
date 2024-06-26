document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = form.querySelector('button');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const connectionError = document.getElementById('connectionError');
    const notRegistered = document.getElementById('notRegistered');

    emailInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);
    emailInput.addEventListener('focus', normalizeInput);
    passwordInput.addEventListener('focus', normalizeInput);

    function checkInputs() {
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        let isFormValid = true;

        emailError.style.display = 'none';
        emailInput.classList.remove('error');

        // Validate email
        if (!validateEmail(emailValue)) {
            emailError.style.display = 'block';
            emailInput.classList.add('error');
            isFormValid = false;
        }

        if (passwordValue.length === 0) {
            isFormValid = false;
        }


        submitButton.disabled = !isFormValid;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const id = /^\d{5}$/;
        return (re.test(String(email).toLowerCase())) || (id.test(String(email)));
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        normalizeInput();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        if (!submitButton.disabled) {
            fetch('http://localhost/cccp.ver2/php/signIn.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: emailValue,
                    password: passwordValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    const emailInput = document.getElementById('email');
                    const passwordInput = document.getElementById('password');
                    if (data == 'empty') {
                        // пользователь не зарегистрирован
                        emailInput.classList.add('error');
                        passwordInput.classList.add('error');
                        document.getElementById('notRegistered').style.display = 'block';
                    }
                    else if (data == 'success') {
                        // успешный вход в аккаунт
                        window.location.href = '../html/account.html';
                    }
                    else if (data == 'no success') {
                        // пароли не совпали
                        emailInput.classList.add('error');
                        passwordInput.classList.add('error');
                        document.getElementById('passwordError').style.display = 'block';
                    }
                    else {
                        // cтрока не является ни почтой, ни идентификатором
                        console.log('Некорректный email-адрес или ID');
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
        notRegistered.style.display = 'none';
    }
});