document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const submitButton = form.querySelector('button');
    const emailError = document.getElementById('emailError');
    const notRegistered = document.getElementById('notRegistered');
    const connectionError = document.getElementById('connectionError');

    emailInput.addEventListener('input', checkInputs);

    function checkInputs() {
        const emailValue = emailInput.value.trim();
        let isFormValid = true;

        emailError.style.display = 'none';
        emailInput.classList.remove('error');

        // Validate email
        if (!validateEmail(emailValue)) {
            emailError.style.display = 'block';;
            emailInput.classList.add('error');
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

        if (!submitButton.disabled) {
            const emailValue = emailInput.value.trim();
            fetch('http://localhost/cccp.ver2/php/recoverPassword.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // такой пользователь не зарегистрирован
                    if (data == 'not registered') {
                        emailInput.classList.add('error');
                        document.getElementById('notRegistered').style.display = 'block';
                    }
                    // такой пользователь есть и письмо отправлено
                    if (data == 'success') {
                        window.location.href = '../html/instruction-send.html';
                    }
                    // такой пользователь есть но письмо отправить не удалось
                    else {
                        emailInput.classList.add('error');
                        document.getElementById('connectionError').style.display = 'block';
                    }
                })
                .catch(error => {
                    // ошибка подключения
                    console.error('Ошибка:', error);
                    emailInput.classList.add('error');
                    document.getElementById('connectionError').style.display = 'block';
                });
        }
    });

    // убирает индикацию ошибок
    function normalizeInput() {
        emailInput.classList.remove('error');

        emailError.style.display = 'none';
        notRegistered.style.display = 'none';
        connectionError.style.display = 'none';
    }
});