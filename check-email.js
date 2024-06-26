document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('verificationForm');
    const inputs = document.querySelectorAll('.code-input__box');
    const submitButton = form.querySelector('button');
    const connectionError = document.getElementById('connectionError');
    const codeError = document.getElementById('codeError');

    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && input.value === '' && index !== 0) {
                inputs[index - 1].focus();
            } else if (/^[0-9]$/.test(event.key)) {
                input.value = '';
                setTimeout(() => {
                    if (index !== inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                }, 10);
            }
            checkInputs();
        });

        input.addEventListener('input', () => {
            if (input.value.length > 1) {
                input.value = input.value.slice(0, 1);
            }
            checkInputs();
        });

        input.addEventListener('paste', (event) => {
            event.preventDefault();
            // получает текст из буфера обмена
            const pastedText = event.clipboardData.getData('text');
            // проверяет что вставленный текст содержит шесть цифр
            if (/^\d{6}$/.test(pastedText)) {
                // вставляет цифры в соответствующие input
                for (let i = 0; i < 6; i++) {
                    inputs[i].value = pastedText[i];
                }
                checkInputs();
            }
        });

        input.addEventListener('focus', normalizeInputs);
    });

    inputs[0].focus();

    function checkInputs() {
        const allFilled = Array.from(inputs).every(input => input.value !== '');
        submitButton.disabled = !allFilled;
    }

    function checkCode() {
        let code = '';
        inputs.forEach(input => {
            code += input.value; // добавляет значение каждого input в строку
        });

        if (code.length === 6) {
            // возвращает преобразованный в число код
            return parseInt(code);
        }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        normalizeInputs();

        if (!submitButton.disabled) {
            const code = checkCode();
            console.log("Код подтверждения:", code);

            fetch('http://localhost/cccp.ver2/php/registerNewCabinet.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    myCode: code
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // код введен неправильно
                    if (data == 'code error') {
                        inputs.forEach(input => {
                            input.classList.add('error');
                        });
                        document.getElementById('codeError').style.display = 'block';
                    }
                    // код введен верно
                    // не добавилась строка в CABINET
                    if (data == 'no success') {
                        inputs.forEach(input => {
                            input.classList.add('error');
                        });
                        document.getElementById('connectionError').style.display = 'block';
                    }
                    // человек зарегистрирован, в REGISTRATION такой почты нет
                    if (data == 'registered') {
                        window.location.href = '../html/account.html';
                    }
                    // человек зарегистрирован, в REGISTRATION внесен ID кабинета
                    if (data == 'linked') {
                        window.location.href = '../html/account.html';
                    }
                    // человек зарегистрирован, в REGISTRATION не удалось внести ID кабинета
                    // if (data == 'not linked') {
                    //     window.location.href = '../html/account.html';
                    // }
                })
                .catch(error => {
                    // ошибка подключения
                    console.error('Ошибка:', error);
                    // всем инпутам classList.add('error');
                    inputs.forEach(input => {
                        input.classList.add('error');
                    });
                    document.getElementById('connectionError').style.display = 'block';
                });
        }
    });

    function normalizeInputs() {
        inputs.forEach(input => {
            input.classList.remove('error');
        });
        connectionError.style.display = 'none';
        codeError.style.display = 'none';
    }
});