import { getCookie, deleteCookie } from './cookieController.js';
import getID from './namesController.js';

document.addEventListener('DOMContentLoaded', function () {
    if (!(getCookie('Email') || getCookie('ID'))) {
        location.href = "sign-in.html";
    }
    loadHeader();

    document.getElementById('exitButton').addEventListener('click', function () {
        if (getCookie('Email')) {
            deleteCookie('Email');
        }
        if (getCookie('ID')) {
            deleteCookie('ID');
        }
    })

    const profile = document.querySelector('.header__profile');
    const profileMenu = document.getElementById('profileMenu');

    profile.addEventListener('click', function () {
        profileMenu.classList.toggle('active');
        profile.classList.toggle('active');
    });

    document.addEventListener('click', function (event) {
        if (!profile.contains(event.target)) {
            profileMenu.classList.remove('active');
            profile.classList.remove('active');
        }
    });

    async function loadHeader() {
        const id = await getID();
        if (id != 0) {
            await getName(id);
        }
    }

    
    async function getName(id) {
        try {
            const response = await fetch('http://localhost/cccp.ver2/php/getName.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });
            const data = await response.json();
            if (data.length > 0) {
                const name = `${data[0].FIRSTNAME} ${data[0].LASTNAME.slice(0, 1)}.`;
                document.getElementById('profile__name').textContent = name;
                document.getElementById('profile__avatar').textContent = name.slice(0, 1);

            } else {
                console.error('Ошибка: Data is empty');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

});