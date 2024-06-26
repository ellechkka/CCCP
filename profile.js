import { getCookie, setCookie, deleteCookie } from './cookieController.js';
import { parseFullName } from './formatController.js';
import getID from './namesController.js';

document.addEventListener('DOMContentLoaded', function () {
    if (!(getCookie('Email') || getCookie('ID'))) {
        location.href = "sign-in.html";
    }

    if (!getCookie('Email')) {
        const changeStudentButton = document.getElementById('changeStudentButton');
        changeStudentButton.style.visibility = 'hidden';

        const buttons = document.querySelectorAll('.block__header__edit');
        buttons.forEach(button => {
            button.style.visibility = 'hidden';
        });
    }

    loaProfileContent();

    async function loaProfileContent() {
        const id = await getID();
        if (id == 0) {
            // пока ничего не заполнено
            const container = document.getElementById('profileContainer');
            clearProfile(container);
            const h2 = document.createElement('h2');
            h2.textContent = 'Профиль';
            container.appendChild(h2);

            const p = document.createElement('p');
            p.textContent = 'Чтобы посмотреть профиль, заполните анкету на Главной странице';
            p.style.fontSize = 'larger';
            container.appendChild(p);
        } else {
            await getPerson(id);
            getAllChildren();
            await getEducation(id);
            await getStudent(id);
            await getPayer(id);
            await getAccount(id);
        }
    }
    async function reloadPage(id) {
        await getPerson(id);
        getAllChildren();
        await getEducation(id);
        await getStudent(id);
        await getPayer(id);
        await getAccount(id);
    }
    async function getPerson(id) {
        const idInput = document.getElementById('studentID');
        idInput.textContent = `ID: ${id}`;
        try {
            const response = await fetch('http://localhost/cccp.ver2/php/getPersonInfo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            const data = await response.json();
            // console.log(data);
            if (data.length > 0) {
                const name = `${data[0].LASTNAME} ${data[0].FIRSTNAME} ${data[0].MIDNAME}`;
                document.getElementById('studentNamr').textContent = name;
                const year = data[0].BYEAR;
                document.getElementById('studentBirthYear').textContent = `${year} г.р.`;
            } else {
                console.error('Ошибка: Data is empty');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    function getAllChildren() {
        const email = getCookie('Email');
        fetch('http://localhost/cccp.ver2/php/getAllChildren.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.length > 1) {
                    const container = document.getElementById('addStudentsHere');
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }
                    for (let i = 0; i < data.length; i++) {
                        const studentCard = document.createElement('a');
                        studentCard.id = data[i].ID_NAME;
                        studentCard.className = "student-card reloadContent";
                        // studentCard.classList.add('');
                        
                        studentCard.href = "";
                        

                        const avatarDiv = document.createElement('div');
                        avatarDiv.className = "avatar";

                        const avatarImg = document.createElement('img');
                        avatarImg.src = "../img/content/avatar.png";
                        avatarImg.alt = "";
                        avatarDiv.appendChild(avatarImg);

                        const studentName = document.createElement('p');
                        studentName.textContent = `${data[i].LASTNAME} ${data[i].FIRSTNAME} ${data[i].MIDNAME}`;
                        studentCard.appendChild(avatarDiv);
                        studentCard.appendChild(studentName);

                        container.appendChild(studentCard);
                    }

                    document.querySelectorAll('.reloadContent').forEach(person => {
                        person.addEventListener('click', function(event) {
                            event.preventDefault();
                            console.log(person.id);
                            reloadPage(person.id);
                        });
                    });
                }
            })
            .catch(error => console.error('Ошибка:', error));
    }
    async function getEducation(id) {
        try {
            const response = await fetch('http://localhost/cccp.ver2/php/getEducationInfo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            const data = await response.json();
            // console.log(data);
            const napravlenCont = document.getElementById('napravlenCont');
            if (data.length > 0) {
                napravlenCont.classList.add('block__item__subtitle');
                napravlenCont.classList.remove('block__item__subtitle_disabled');
            } else {

            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    async function getStudent(id) {
        try {
            const response = await fetch('http://localhost/cccp.ver2/php/getStudentInfo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            const data = await response.json();
            // console.log(data);
            const studentTel = document.getElementById('studentTel');
            const studentSchool = document.getElementById('studentSchool');
            const studentClass = document.getElementById('studentClass');
            if (data.length > 0) {
                if (data[0].TEL != '') {
                    studentTel.textContent = data[0].TEL;
                    studentTel.classList.add('block__item__subtitle');
                    studentTel.classList.remove('block__item__subtitle_disabled');
                }
                else {
                    studentTel.textContent = "не указано";
                    studentTel.classList.add('block__item__subtitle_disabled');
                    studentTel.classList.remove('block__item__subtitle');
                }
                if (data[0].SCHOOL != '') {
                    studentSchool.textContent = data[0].SCHOOL;
                    studentSchool.classList.add('block__item__subtitle');
                    studentSchool.classList.remove('block__item__subtitle_disabled');
                }
                else {
                    studentSchool.textContent = "не указано";
                    studentSchool.classList.add('block__item__subtitle_disabled');
                    studentSchool.classList.remove('block__item__subtitle');
                }
                if (data[0].NCLASS != '') {
                    studentClass.textContent = data[0].NCLASS;
                    studentClass.classList.add('block__item__subtitle');
                    studentClass.classList.remove('block__item__subtitle_disabled');
                }
                else {
                    studentClass.textContent = "не указано";
                    studentClass.classList.add('block__item__subtitle_disabled');
                    studentClass.classList.remove('block__item__subtitle');
                }
            } else {
                const fields = [studentTel, studentSchool, studentClass];
                fields.forEach(field => {
                    field.textContent = "не указано";
                    field.classList.add('block__item__subtitle_disabled');
                    field.classList.remove('block__item__subtitle');
                })
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    async function getPayer(id) {
        try {
            const response = await fetch('http://localhost/cccp.ver2/php/getPayerInfo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            const data = await response.json();
            // console.log(data);
            const napravlenCont = document.getElementById('napravlenCont');
            if (data.length > 0) {
                const { lastName, firstName, patronymic } = parseFullName(data[0].MOTHER);
                document.getElementById('payerSurname').textContent = lastName;
                document.getElementById('payerName').textContent = firstName;
                document.getElementById('payerMidame').textContent = patronymic;
                document.getElementById('payerPhone').textContent = data[0].TELMAMA;
                document.getElementById('payerMail').textContent = data[0].EMAIL;
            } else {
                console.error('Ошибка: Data is empty');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    async function getAccount(id) {
        try {
            const response = await fetch('http://localhost/cccp.ver2/php/getCabinetInfo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            const data = await response.json();
            // console.log(data);
            document.getElementById('accountMail').textContent = data.Email;
            document.getElementById('accountPassword').textContent = data.Password;
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    function clearProfile(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.style.display = 'block';
    }
});