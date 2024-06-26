import { getCookie } from './cookieController.js';

export default async function getID() {
    const email = getCookie('Email');
    if (email) {
        try {
            const response = await fetch('http://localhost/cccp.ver2/php/getChildID.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });
            const data = await response.json();
            // дети еще не зарегистрированы
            if (data == 'no id') {
                return 0;
            } else {
                return data;
            }
        } catch (error) {
            console.error('Ошибка:', error);
            return 0;
        }
    } else {
        const id = getCookie('ID');
        return id ? id : 0;
    }
}