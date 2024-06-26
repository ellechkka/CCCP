import { getCookie, setCookie, deleteCookie } from './cookieController.js';
import loadAccountContent from './accountController.js';

document.addEventListener('DOMContentLoaded', function () {
    if (!(getCookie('Email') || getCookie('ID'))) {
        location.href = "sign-in.html";
    }

    loadAccountContent();

    // document.getElementById('exitButton').addEventListener('click', function () {
    //     if (getCookie('Email')) {
    //         deleteCookie('Email');
    //     }
    //     if (getCookie('ID')) {
    //         deleteCookie('ID');
    //     }
    // })

    document.querySelectorAll('#loginForm input').forEach(input => {
        input.addEventListener('focus', function () {
            input.classList.remove('error');
            const errorElement = input.nextElementSibling;
            if (errorElement && errorElement.classList.contains('input__error')) {
                errorElement.style.display = 'none';
            }
        });
    });

    const div = document.getElementById('chooseYearContainer');
    div.addEventListener('focus', function () {
        div.classList.remove('error');
        const errorElement = div.nextElementSibling;
        if (errorElement && errorElement.classList.contains('input__error')) {
            errorElement.style.display = 'none';
        }
    });

    document.querySelectorAll('.select__checkbox').forEach(select => {
        select.querySelectorAll('.option').forEach(option => {
            option.style.display = 'flex';
        });
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('tab-button_active'));
            button.classList.add('tab-button_active');

            tabContents.forEach(content => {
                if (content.id === tab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;

        // Получаем все обязательные поля
        const requiredFields = document.querySelectorAll('#loginForm input[required]');

        // Проверяем, что все обязательные поля заполнены
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('input__error');
            }
        });

        // Проверка корректности заполнения русскими буквами
        const russianPattern = /^[А-Яа-яЁё\s]+$/;
        const textFields = ['studentSurname', 'studentName', 'studentPatronymic', 'parentSurname', 'parentName', 'parentPatronymic'];

        textFields.forEach(id => {
            const field = document.getElementById(id);
            if (field && !russianPattern.test(field.value.trim())) {
                field.classList.add('error');
                field.nextElementSibling.style.display = 'block';
                isValid = false;
            }
        });

        // Проверка корректности номера телефона
        const telPattern = /^\+?\d{0,3}\s?\(?\d{1,4}?\)?\s?\d{1,4}\s?\d{1,4}\s?\d{1,4}$/;
        const studentTel = document.getElementById('studentTel');
        const parentTel = document.getElementById('parentTel');
        if (studentTel.value && !telPattern.test(studentTel.value)) {
            studentTel.classList.add('error');
            document.getElementById('studentTelError').style.display = 'block';
            isValid = false;
        }
        if (!parentTel.value.trim() || !telPattern.test(parentTel.value)) {
            parentTel.classList.add('error');
            document.getElementById('parentTelError').style.display = 'block';
            isValid = false;
        }

        // Проверка корректности email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const parentEmail = document.getElementById('parentEmail');
        if (!emailPattern.test(parentEmail.value)) {
            parentEmail.classList.add('error');
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }

        // Проверка выбора года рождения
        const chooseYear = document.querySelector('input[name="chooseYear"]:checked');
        if (!chooseYear || chooseYear.id === 'chooseYear') {
            const chooseYearContainer = document.getElementById('chooseYearContainer');
            chooseYearContainer.classList.add('error');
            document.getElementById('yearError').style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            console.log('отправляем форму');

            const formData = {};

            // Собираем данные из всех текстовых полей
            formData.studentSurname = document.getElementById('studentSurname').value;
            formData.studentName = document.getElementById('studentName').value;
            formData.studentPatronymic = document.getElementById('studentPatronymic').value;
            formData.studentTel = document.getElementById('studentTel').value;
            formData.parentSurname = document.getElementById('parentSurname').value;
            formData.parentName = document.getElementById('parentName').value;
            formData.parentPatronymic = document.getElementById('parentPatronymic').value;
            formData.parentTel = document.getElementById('parentTel').value;
            formData.parentEmail = document.getElementById('parentEmail').value;

            // Получаем значение выбранного года рождения
            const yearElement = document.querySelector('input[name="chooseYear"]:checked');
            formData.chooseYear = yearElement ? yearElement.id : '';

            // Получаем значение выбранного направления
            const trackElement = document.querySelector('input[name="chooseTrack"]:checked');
            formData.chooseTrack = trackElement ? trackElement.id : '';

            // Получаем значения выбранных курсов
            const selectedCourses = Array.from(document.querySelectorAll('input[name="chooseCourses"]:checked'))
                .map(input => input.id);
            formData.chooseCourses = selectedCourses;

            fetch('http://localhost/cccp.ver2/php/registerChild.php', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data == 'registered') {
                        document.getElementById('loginForm').style.display = 'grid';
                        loadAccountContent();
                    }
                    else {
                        alert('Что-то пошло не так, попробуйте позже');
                    }
                })
                .catch(error => console.error('Ошибка:', error));
        }
    });

});