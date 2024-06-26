import { getLevel, grade, dayOfWeek, clearJournal, date, getLevelForCourse, getNameForCourse, getDirectionName } from './formatController.js';

export function createCurrentCourse(courseTitle, code, lvl, group, day, time, teacher, phone, id) {
    const container = document.getElementById('current-courses');
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    courseCard.classList.add(getLevel(lvl));

    // Создание элемента h3 с классом course-card__icon
    const h3 = document.createElement('h3');
    h3.classList.add('course-card__icon');
    h3.textContent = code;

    // Создание вложенного div
    const innerDiv = document.createElement('div');

    // Создание элемента div с классом course-card__info
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('course-card__info');

    // Создание элемента h6 с классом course-card__title
    const h6 = document.createElement('h6');
    h6.classList.add('course-card__title');
    h6.textContent = courseTitle;

    // Создание элемента p с классом course-card__group
    const groupP = document.createElement('p');
    groupP.classList.add('course-card__group');
    groupP.textContent = `Группа ${group.split('_')[0]}`;

    // Создание элемента div с классом course-card__details
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('course-card__details');

    // Создание первого вложенного div с классом course-card__detail и scheduale
    const schedualeDiv = document.createElement('div');
    schedualeDiv.classList.add('course-card__detail', 'scheduale');

    // Создание вложенного div с классом course-card__detail__title
    const schedualeTitleDiv = document.createElement('div');
    schedualeTitleDiv.classList.add('course-card__detail__title');

    // Создание элемента img
    const schedualeImg = document.createElement('img');
    schedualeImg.src = '../img/icons/calendare.svg';
    schedualeImg.alt = '';

    // Создание элемента p с классом bold
    const schedualeBoldP = document.createElement('p');
    schedualeBoldP.classList.add('bold');
    schedualeBoldP.textContent = 'День и время';

    // Создание вложенного div с классом course-card__detail__description
    const schedualeDescDiv = document.createElement('div');
    schedualeDescDiv.classList.add('course-card__detail__description');

    // Создание вложенных p
    const schedualeDayP = document.createElement('p');
    schedualeDayP.textContent = dayOfWeek(day);
    const schedualeTimeP = document.createElement('p');
    schedualeTimeP.textContent = time.replace('-', ':');

    // Добавление элементов в DOM
    schedualeTitleDiv.appendChild(schedualeImg);
    schedualeTitleDiv.appendChild(schedualeBoldP);
    schedualeDescDiv.appendChild(schedualeDayP);
    schedualeDescDiv.appendChild(schedualeTimeP);
    schedualeDiv.appendChild(schedualeTitleDiv);
    schedualeDiv.appendChild(schedualeDescDiv);

    // Создание второго вложенного div с классом course-card__detail и teacher
    const teacherDiv = document.createElement('div');
    teacherDiv.classList.add('course-card__detail', 'teacher');

    // Создание вложенного div с классом course-card__detail__title
    const teacherTitleDiv = document.createElement('div');
    teacherTitleDiv.classList.add('course-card__detail__title');

    // Создание элемента img
    const teacherImg = document.createElement('img');
    teacherImg.src = '../img/icons/teacher.png';
    teacherImg.alt = '';

    // Создание элемента p с классом bold
    const teacherBoldP = document.createElement('p');
    teacherBoldP.classList.add('bold');
    teacherBoldP.textContent = 'Преподаватель';

    // Создание вложенного div с классом course-card__detail__description
    const teacherDescDiv = document.createElement('div');
    teacherDescDiv.classList.add('course-card__detail__description');

    // Создание вложенных p
    const teacherNameP = document.createElement('p');
    teacherNameP.textContent = teacher;
    const teacherPhoneP = document.createElement('p');
    teacherPhoneP.textContent = phone;

    // Добавление элементов в DOM
    teacherTitleDiv.appendChild(teacherImg);
    teacherTitleDiv.appendChild(teacherBoldP);
    teacherDescDiv.appendChild(teacherNameP);
    teacherDescDiv.appendChild(teacherPhoneP);
    teacherDiv.appendChild(teacherTitleDiv);
    teacherDiv.appendChild(teacherDescDiv);

    // Добавление элементов во вложенный div
    infoDiv.appendChild(h6);
    infoDiv.appendChild(groupP);
    detailsDiv.appendChild(schedualeDiv);
    detailsDiv.appendChild(teacherDiv);
    innerDiv.appendChild(infoDiv);
    innerDiv.appendChild(detailsDiv);

    // Добавление элементов в родительский div
    courseCard.appendChild(h3);
    courseCard.appendChild(innerDiv);

    // тут надо добавить кноку с посещаемостью
    const button = document.createElement('button');
    button.textContent = "Посещаемость";
    button.id = group;
    button.classList.add('account__popup');
    button.setAttribute('data-popup-id', 'attendance-popup');
    innerDiv.appendChild(button);

    button.addEventListener("click", function () {
        clearJournal();
        window.attendance.showModal();
        document.body.style.overflow = 'hidden';
        getAttendance(id, button.id);
    });

    // Добавление родительского div в HTML документ
    container.appendChild(courseCard);
}
function getAttendance(id, group) {
    console.log(id + ' ' + group);
    fetch('http://localhost/cccp.ver2/php/getAttendance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            group: group
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const d = document.getElementById('attendanceCont');
            // clearJournal();

            const table = document.createElement('table');
            // Создаем заголовок таблицы
            const headerRow = table.insertRow();
            const columnsToShow = ['Дата', 'Посещаемость']; // Здесь указываете нужные вам ключи
            columnsToShow.forEach(key => {
                const headerCell = document.createElement('th');
                headerCell.textContent = key;
                headerRow.appendChild(headerCell);
            });

            // Заполняем таблицу данными
            for (var i = 1; i < data.length; i++) {
                const row = table.insertRow();

                var cell = row.insertCell();
                cell.textContent = date(data[i].DATE_J);

                cell = row.insertCell();
                cell.textContent = data[i].PRESENCE;
            }

            // Добавляем таблицу в контейнер
            d.appendChild(table);
            console.log(d);
            const cells = document.querySelectorAll('table td:nth-child(2)');

            // Устанавливаем паддинг для каждой ячейки
            cells.forEach(cell => {
                cell.style.padding = '12px'; // Здесь можно указать нужные вам значения отступов
                cell.style.textAlign = "center";
            });

            // Close the popup when clicking outside of the popup content
            window.addEventListener('click', function (event) {
                const attendance = document.getElementById('attendance');
                if (event.target === attendance) {
                    document.body.style.overflow = 'auto';
                    window.attendance.close();
                }

            });
        })
        .catch(error => console.error('Ошибка:', error));

}
export function createCompletedCourse(courseTitle, code, lvl, g, teacher, phone) {
    const container = document.getElementById('completed-courses');
    const course = document.createElement('div');
    course.classList.add('course-card');
    course.classList.add(getLevel(lvl));

    const icon = document.createElement('h3');
    icon.classList.add('course-card__icon');
    icon.textContent = code;
    course.appendChild(icon);

    const div = document.createElement('div');
    const info = document.createElement('div');
    info.classList.add('course-card__info');

    const title = document.createElement('h6');
    title.classList.add('course-card__title');
    title.textContent = courseTitle;
    info.appendChild(title);

    const groupP = document.createElement('p');
    groupP.textContent = 'Группа';
    groupP.classList.add('course-card__group');
    groupP.style.visibility = 'hidden';
    info.appendChild(groupP);
    div.appendChild(info);

    const details = document.createElement('div');
    details.classList.add('course-card__details');

    const gradeCont = document.createElement('div');
    gradeCont.classList.add('course-card__detail', 'grade');

    const gradeHeader = document.createElement('div');
    gradeHeader.classList.add('course-card__detail__title');
    const gradeImg = document.createElement('img');
    gradeImg.src = '../img/icons/check.svg';
    gradeImg.alt = '';

    const boldP = document.createElement('p');
    boldP.textContent = 'Оценка';
    boldP.classList.add('bold');
    gradeHeader.appendChild(gradeImg);
    gradeHeader.appendChild(boldP);
    gradeCont.appendChild(gradeHeader);

    const gradeDescDiv = document.createElement('div');
    gradeDescDiv.classList.add('course-card__detail__description');
    const gradeP = document.createElement('p');
    gradeP.textContent = grade(g);
    gradeDescDiv.appendChild(gradeP);

    gradeCont.appendChild(gradeDescDiv);
    details.appendChild(gradeCont);

    const teacherCont = document.createElement('div');
    teacherCont.classList.add('course-card__detail', 'teacher');

    const teacherHeader = document.createElement('div');
    teacherHeader.classList.add('course-card__detail__title');
    const teacherImg = document.createElement('img');
    teacherImg.src = '../img/icons/teacher.png';
    teacherImg.alt = '';

    const teacherBoldP = document.createElement('p');
    teacherBoldP.textContent = 'Преподаватель';
    teacherBoldP.classList.add('bold');
    teacherHeader.appendChild(teacherImg);
    teacherHeader.appendChild(teacherBoldP);
    teacherCont.appendChild(teacherHeader);

    const teacherDescDiv = document.createElement('div');
    teacherDescDiv.classList.add('course-card__detail__description');

    const teacherNameP = document.createElement('p');
    teacherNameP.textContent = teacher;
    teacherDescDiv.appendChild(teacherNameP);

    const teacherPhoneP = document.createElement('p');
    teacherPhoneP.textContent = phone;
    teacherDescDiv.appendChild(teacherPhoneP);

    teacherCont.appendChild(teacherDescDiv);
    details.appendChild(teacherCont);

    div.appendChild(details);
    course.appendChild(div);
    container.appendChild(course);
}
export function createRegisteredCourse(courseTitle, code, lvl) {
    const container = document.getElementById('applicationsContainer');

    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    courseCard.classList.add(getLevel(lvl));
    courseCard.style.marginBottom = '0';

    // Создание элемента h3 с классом course-card__icon
    const h3 = document.createElement('h3');
    h3.classList.add('course-card__icon');
    h3.textContent = code;

    // Создание вложенного div
    const innerDiv = document.createElement('div');

    // Создание элемента div с классом course-card__info
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('course-card__info');

    // Создание элемента h6 с классом course-card__title
    const h6 = document.createElement('h6');
    h6.classList.add('course-card__title');
    h6.textContent = courseTitle;

    // Создание элемента p с классом course-card__group
    const groupP = document.createElement('p');
    groupP.classList.add('course-card__group');

    groupP.textContent = 'Зарегистрирован на курс';

    infoDiv.appendChild(h6);
    infoDiv.appendChild(groupP);

    innerDiv.appendChild(infoDiv);

    courseCard.appendChild(h3);
    courseCard.appendChild(innerDiv);

    container.appendChild(courseCard);
}
export function createAppliedNapravlen(num) {
    console.log(num);
    const name = getDirectionName(num);
    console.log(name);
    if (name && num != 10) {
        const container = document.getElementById('applicationsContainer');
        container.style.display = 'flex';
        container.style.marginBottom = '32px';
    }
}
export function createAppliedCourse(course) {
    const lvl = getLevelForCourse(course);
    const name = getNameForCourse(course);
    if (lvl && name) {
        const container = document.getElementById('applicationsContainer');
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        courseCard.classList.add(getLevel(lvl.toString()));
        courseCard.style.marginBottom = '0';

        // Создание элемента h3 с классом course-card__icon
        const h3 = document.createElement('h3');
        h3.classList.add('course-card__icon');
        h3.textContent = course;

        // Создание вложенного div
        const innerDiv = document.createElement('div');

        // Создание элемента div с классом course-card__info
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('course-card__info');

        // Создание элемента h6 с классом course-card__title
        const h6 = document.createElement('h6');
        h6.classList.add('course-card__title');
        h6.textContent = name;

        // Создание элемента p с классом course-card__group
        const groupP = document.createElement('p');
        groupP.classList.add('course-card__group');

        groupP.textContent = 'Подана заявка на курс';

        infoDiv.appendChild(h6);
        infoDiv.appendChild(groupP);

        innerDiv.appendChild(infoDiv);

        courseCard.appendChild(h3);
        courseCard.appendChild(innerDiv);

        container.appendChild(courseCard);
    }
}