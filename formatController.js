export function grade(g) {
    switch (g) {
        case '5':
            return "Отлично";
        case '4':
            return "Хорошо";
        case '3':
            return "Удовлетворительно";
        case '2':
            return "Неудовлетворительно";
        default:
            return "-";
    }
}
export function dateForPay(d) {
    var inputDate = new Date(d);
    var month = getMonthName((inputDate.getMonth() + 1).toString().padStart(2, '0'));
    var year = inputDate.getFullYear();
    return `${month} ${year}`;
}
function getMonthName(monthStr) {
    const monthNames = {
        '01': 'Январь',
        '02': 'Февраль',
        '03': 'Март',
        '04': 'Апрель',
        '05': 'Май',
        '06': 'Июнь',
        '07': 'Июль',
        '08': 'Август',
        '09': 'Сентябрь',
        '10': 'Октябрь',
        '11': 'Ноябрь',
        '12': 'Декабрь'
    };
    return monthNames[monthStr];
}
export function date(d) {
    const inputDate = new Date(d);

    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear(); // Год

    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
}
export function getLevel(lvl) {
    switch (lvl) {
        case '1':
            return "first-level-course";
        case '2':
            return "second-level-course";
        case '3':
            return "third-level-course";
    }
}
export function dayOfWeek(d) {
    switch (d) {
        case 'ПН':
            return "Понедельник";
        case 'ВТ':
            return "Вторник";
        case 'СР':
            return "Среда";
        case 'ЧТ':
            return "Четверг";
        case 'ПТ':
            return "Пятница";
        case 'СБ':
            return "Суббота";
    }
}
export function getLevelForCourse(code) {
    const courseLevels = {
        "A": 3, "B": 1, "BC": 3, "BM": 1, "BS": 1, "BV": 1, "C": 3, "CS": 3,
        "D": 2, "E": 2, "G": 3, "GE": 2, "GM": 3, "GP": 3, "GS": 3, "H": 3,
        "I": 3, "IG": 3, "JV": 3, "K": 3, "M": 2, "MA": 3, "MD": 3, "N": 2,
        "O": 1, "P": 2, "PH": 3, "R": 3, "SA": 3, "SAM": 3, "SB": 3, "TC": 3,
        "TD": 3, "V": 3, "W": 3
    };

    // Проверяем, существует ли данный курс в списке
    if (courseLevels.hasOwnProperty(code)) {
        return courseLevels[code];
    } else {
        return null; // Возвращаем null, если курс не найден
    }
}
export function getNameForCourse(code) {
    const courseNames = {
        "A": "Основы администрирования операционных систем",
        "B": "Введение в компьютерные технологии (с 9 лет и старше)",
        "BC": "Основы программирования на языке С (с 14 лет)",
        "BM": "Введение в программное и аппаратное обеспечение компьютера (с 11  лет и старше)",
        "BS": "Введение в офисные приложения и Интернет(c 10-11 лет)",
        "BV": "Введение в компьютерную графику (c 9-10 лет)",
        "C": "Основы программирования,  2-й год (C)",
        "CS": "Информатика (для 11 класса, подготовка к ЕГЭ)",
        "D": "Компьютерный дизайн и мультипликация (c 11 лет)",
        "E": "Основы сетевых технологий коммуникаций (коммуникации на английском)",
        "G": "Студия графики (рекомендуется абитуриентам)",
        "GE": "Моделирование и разработка игр в среде Blender",
        "GM": "Разработка игр в 3D-пакетах (Blender, Python) (с 12 лет)",
        "GP": "Программирование компьютерных игр (Python, Blender)",
        "GS": "Студия разработки компьютерных игр (c 13 лет)",
        "H": "Проектирование и разработка 3D виртуальных сред (с 13 лет)",
        "I": "Основы графической композиции",
        "IG": "Инженерная графика для школьников",
        "JV": "Программирование на Java",
        "K": "3D-конструирование и моделирование (SolidWorks)",
        "M": "Основы трехмерного моделирования (с 12 лет)",
        "MA": "3D моделирование в Maya",
        "MD": "Motion Design - Оживщие картины (летний курс)",
        "N": "Сети и Web-проектирование (HTML, CSS, JavaScript) с 12 лет",
        "O": "Программное и аппаратное обеспечение компьютера (с 12 лет)",
        "P": "Основы программирования, 1-й год (Паскаль), с 13 лет",
        "PH": "Студия фото и видеодизайна",
        "R": "Студия робототехники (с 12 лет)",
        "SA": "Студия 2D-анимации",
        "SAM": "Студия 3D-анимации",
        "SB": "Студия мульт-блогов",
        "TC": "Технологии программирования (C++)",
        "TD": "Технологии программирования (среда Delphi)",
        "V": "Студия видеоклипов (с 12 лет)",
        "W": "WEB-технологии (PHP, Apache, MySQL)"
    };

    // Проверяем, существует ли данный курс в списке
    if (courseNames.hasOwnProperty(code)) {
        return courseNames[code];
    } else {
        return null; // Возвращаем null, если курс не найден
    }
}
export function parseCourses(inputString) {
    const coursesList = [
        "A", "B", "BC", "BM", "BS", "BV", "C", "CS", "D", "E", "G", "GE", "GM", "GP", "GS",
        "H", "I", "IG", "JV", "K", "M", "MA", "MD", "N", "O", "P", "PH", "R", "SA", "SAM",
        "SB", "TC", "TD", "V", "W"
    ];
    if (typeof inputString !== 'string') {
        throw new TypeError('inputString must be a string');
    }

    // Создаем регулярное выражение для поиска курсов
    const coursesRegex = new RegExp(`\\b(${coursesList.join('|')})\\b`, 'g');

    // Находим все совпадения курсов в строке
    const foundCourses = inputString.match(coursesRegex) || [];

    return foundCourses;
}
export function paymentStatus(n) {
    if (n == -1) {
        return "На сверке";
    }
    else {
        return "Оплачено";
    }
}
export function parseFullName(fullName) {
    // Разделяем строку по пробелам
    const parts = fullName.trim().split(' ');

    // Проверяем, что у нас три части
    if (parts.length !== 3) {
        throw new Error('ФИО должно состоять из трех частей: фамилии, имени и отчества');
    }

    // Возвращаем объект с фамилией, именем и отчеством
    return {
        lastName: parts[0],
        firstName: parts[1],
        patronymic: parts[2]
    };
}
export function clearJournal() {
    const container = document.getElementById('attendanceCont');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}
export function getDirectionName(id) {
    const directions = {
        1: "Графический дизайн",
        2: "Web-разработка",
        3: "Программирование",
        4: "Информационная безопасность",
        5: "Конструирование и робототехника",
        6: "Технологии виртуальной и дополненной реальности",
        7: "Искусственный интеллект",
        8: "Разработка 2D-игр",
        9: "Разработка 3D-игр"
    };

    // Проверяем, существует ли данное направление в списке
    if (directions.hasOwnProperty(id)) {
        return directions[id];
    } else {
        return null; // Возвращаем null, если направление не найдено
    }
}