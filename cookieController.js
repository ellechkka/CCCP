export function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}
export function setCookie(name, value) {
    let date = new Date(Date.now() + 86400e3);
    date = date.toUTCString();
    document.cookie = `${name}=${value};  path=/; expires=${date}`;
}
export function deleteCookie(name) {
    // Удаление куки путем установки времени истечения в прошлое
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}