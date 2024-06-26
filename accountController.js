// const email = 'doomlana13@gmail.com';
// walking_person@list.ru    
// 4135
// airis421@mail.ru
// 11902

import { getCookie, setCookie, deleteCookie } from './cookieController.js';
import { createCompletedCourse, createCurrentCourse, createRegisteredCourse, createAppliedCourse, createAppliedNapravlen } from './courseController.js';
import { dateForPay, paymentStatus, parseCourses } from './formatController.js';
import getID from './namesController.js';

export default async function loadAccountContent() {
    const id = await getID();
    // console.log(id);
    if (id == 0) {
        // открыть регистрационную форму
        document.getElementById('loginForm').style.display = 'grid';

        const containerC = document.getElementById('current-courses');
        const h6C = document.createElement('h6');
        h6C.textContent = 'У вас нет курсов на изучении';
        containerC.appendChild(h6C);

        const containerP = document.getElementById('completed-courses');
        const h6P = document.createElement('h6');
        h6P.textContent = 'У вас нет завершенных курсов';
        containerP.appendChild(h6P);

        const container = document.getElementById('payments');
        const h6 = document.createElement('h6');
        h6.textContent = 'У вас нет истории оплат за текущий учебный год';
        container.appendChild(h6);
    } else {
        document.getElementById('main-screen').style.display = 'block';
        getNews();
        // await getApplications(10102);
        await getApplications(id);

        await getCompletedCourses(4135);
        // await getCompletedCourses(id);

        await getCurrentCourses(11902);
        // await getCurrentCourses(id);

        await getPayments(11902);
        // await getPayments(id);
    }
}
async function getApplications(id) {
    try {
        const response = await fetch('http://localhost/cccp.ver2/php/getApplicationsRegisteredCourse.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });
        const data = await response.json();
        if (data == 'no registered courses') {
            try {
                const response = await fetch('http://localhost/cccp.ver2/php/getApplicationsAppliedCourse.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                });
                const data = await response.json();
                console.log(data);
                const courses = parseCourses(data[0].COMP);
                if (courses || data == 'no applied courses') {
                    try {
                        const response = await fetch('http://localhost/cccp.ver2/php/getApplicationsAppliedNapravlen.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id: id })
                        });
                        const data = await response.json();
                        console.log(data);
                        if (data != 'no applications') {
                            // ученик подал заявку на направление
                            createAppliedNapravlen(data[0]);
                        }
                    } catch (error) {
                        console.error('Ошибка:', error);
                    }
                } else {
                    // ученик подал заявку на курс
                    const container = document.getElementById('applicationsContainer');
                    container.style.display = 'flex';
                    container.style.marginBottom = '32px';
                    for (let i = 0; i < courses.length; i++) {
                        createAppliedCourse(courses[i]);
                    }
                }
            } catch (error) {
                console.error('Ошибка:', error);
            }
        } else {
            // ученик зарегистрирован на курс
            const container = document.getElementById('applicationsContainer');
            container.style.display = 'flex';
            container.style.marginBottom = '32px';
            for (let i = 0; i < data.length; i++) {
                createRegisteredCourse(data[i].NAME_COURSE, data[i].COD_COURS, data[i].LVL);
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
async function getCurrentCourses(id) {
    try {
        const response = await fetch('http://localhost/cccp.ver2/php/getCurrentCourses.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });
        const data = await response.json();
        // console.log(data);
        if (data.length == 0) {
            // нет текущих курсов
            const container = document.getElementById('current-courses');
            const h6 = document.createElement('h6');
            h6.textContent = 'У вас нет курсов на изучении';
            container.appendChild(h6);
            return;
        }
        else {
            for (let i = 0; i < data.length; i++) {
                const teacher = `${data[i].LAST_NAME} ${data[i].FIRST_NAME} ${data[i].MIDDLE_NAME}`;
                createCurrentCourse(data[i].NAME_COURSE, data[i].COD_COURS, data[i].LVL, data[i].TEST_GROUP_G, data[i].DAY_LESSON, data[i].TIME_LESSON, teacher, data[i].MOBIL_PHONE, id);
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
async function getCompletedCourses(id) {
    try {
        const response = await fetch('http://localhost/cccp.ver2/php/getPrevCourses.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });
        const data = await response.json();
        if (data.length == 0) {
            // нет законченных курсов
            const container = document.getElementById('completed-courses');
            const h6 = document.createElement('h6');
            h6.textContent = 'У вас нет завершенных курсов';
            container.appendChild(h6);
            return;
        }
        else {
            for (let i = 0; i < data.length; i++) {
                const teacher = `${data[i].LAST_NAME} ${data[i].FIRST_NAME} ${data[i].MIDDLE_NAME}`;
                createCompletedCourse(data[i].NAME_COURSE, data[i].COD_COURS, data[i].LVL, data[i].RESULT, teacher, data[i].MOBIL_PHONE);
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
async function getPayments(id) {
    try {
        const response = await fetch('http://localhost/cccp.ver2/php/getPrevPayments.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });
        const data = await response.json();
        // console.log(data);
        const container = document.getElementById('payments');
        if (data.length == 0) {
            // нет оплат
            const h6 = document.createElement('h6');
            h6.textContent = 'У вас нет истории оплат за текущий учебный год';
            container.appendChild(h6);
            return;
        }
        else {
            const table = document.createElement('div');
            table.classList.add('table');

            // Создаем заголовок таблицы
            const tableHeader = document.createElement('div');
            tableHeader.classList.add('table-header');
            tableHeader.innerHTML = `
                <div>Курс</div>
                <div>Месяц</div>
                <div>Сумма</div>
                <div>Статус</div>
            `;
            table.appendChild(tableHeader);

            // Создаем строки таблицы
            for (let i = 0; i < data.length; i++) {
                const tableRow = document.createElement('div');
                tableRow.classList.add('table-row');
                tableRow.innerHTML = `
                    <div class="course">${data[i].NAME_COURSE}</div>
                    <div>${dateForPay(data[i].DAY_PAY)}</div>
                    <div>${data[i].MONEY} ₽</div>
                    <div>${paymentStatus(data[i].PAY_N)}</div>
                `;
                table.appendChild(tableRow);
            }
            container.appendChild(table);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
function getNews() {
    fetch('http://localhost/cccp.ver2/txt/news.txt')
        .then(response => response.text())
        .then(data => {
            // console.log(data);
            const newsItems = data.split('\n');
            const newsContainer = document.getElementById('newsContainer');
            newsItems.forEach(news => {
                if (news.trim() !== '') {
                    const newsElement = document.createElement('div');
                    newsElement.classList.add('information__item');

                    const p = document.createElement('p');
                    p.classList.add('information__item__text');
                    // if (news.endsWith('Подробнее')) {
                    if (news.includes('Подробнее')) {
                        news = news.slice(0, -('Подробнее'.length + 1)).trim();
                        p.textContent = news;

                        const readMoreElement = document.createElement('a');
                        readMoreElement.href = '#';
                        readMoreElement.textContent = 'Подробнее';
                        readMoreElement.classList.add('link', 'information__item__link', 'information__item__link_active');

                        newsElement.appendChild(p);
                        newsElement.appendChild(readMoreElement);
                    } else {
                        p.textContent = news;
                        newsElement.appendChild(p);
                    }
                    newsContainer.appendChild(newsElement);
                }
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}