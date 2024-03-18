//removes Bearertoken from localstorage and moves the user to index.html
export function logOutEvent() {
    console.log('logout func')
    localStorage.removeItem('token');
    window.location.replace("/index.html");
};

