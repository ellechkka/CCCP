document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('newPasswordForm');
    const passwordInput = document.getElementById('password');
    const submitButton = form.querySelector('button');
    const passwordError = document.getElementById('passwordError');
    const connectionError = document.getElementById('connectionError');
    const verificationError = document.getElementById('verificationError');

    const queryString = window.location.search;  // параметры запроса URL
    const urlParams = new URLSearchParams(queryString); // создаем объект URLSearchParams из строки запроса
    const code = urlParams.get('code');     // Пзначение параметра 'code' из объекта URLSearchParams

    passwordInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('focus', normalizeInput);

    function checkInputs() {
        const passwordValue = passwordInput.value.trim();
        // проверка наличия как минимум одной цифры, одной строчной буквы и одной заглавной буквы
        const passwordPattern = /^(?=.*\d)(?=.*[a-zа-я])(?=.*[A-ZА-Я]).{8,}$/;
        let isFormValid = true;

        passwordError.style.display = 'none';
        passwordInput.classList.remove('error');

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

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        normalizeInput();

        const passwordValue = passwordInput.value.trim();
        console.log(code + ' ' + passwordValue);
        if (!submitButton.disabled) {
            fetch('http://localhost/cccp.ver2/php/recoverPassword.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code,
                    password: passwordValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data == 'code error') {
                        verificationError.style.display = 'block';
                        document.getElementById('recoveryMessage').style.display = 'none';
                        document.getElementById('newPasswordForm').style.display = 'none';
                    }
                    // пароль успешно изменен
                    if (data == 'changed') {
                        document.getElementById('recoveryMessage').style.display = 'none';
                        document.getElementById('newPasswordForm').style.display = 'none';
                        document.getElementById('passwordChanged').style.display = 'block';
                        
                    }
                    // не получилось поменять
                    if (data == 'not changed') {
                        passwordInput.classList.add('error');
                        document.getElementById('connectionError').style.display = 'block';
                    }
                })
                .catch(error => {
                    // ошибка подключения
                    console.error('Ошибка:', error);
                    passwordInput.classList.add('error');
                    document.getElementById('connectionError').style.display = 'block';
                });
        }
    });
    // убирает индикацию ошибок
    function normalizeInput() {
        passwordInput.classList.remove('error');

        passwordError.style.display = 'none';
        connectionError.style.display = 'none';
    }
});
