import { fetchData } from "./fetch";
/**
* GET Logeed in user's data and returns user_id based on token in local storage 
*
* @param {string} url - apiendpoint url
* @param {Object} options - 
*
*/
async function getMe() {
    const token = localStorage.getItem('token');
    const Bearer = `Bearer ${token}`;
    console.log(Bearer);

    const url = 'http://127.0.0.1:3000/api/auth/me'

    const options = {
        method: "GET",
        headers: {
            "Authorization" : Bearer,
        },
        redirect: "follow",
        referrerPolicy: "origin",
    };

    const user_info = fetchData(url, options).then((data) => {
        document.getElementById('displayUsername').innerHTML = data.user.username;
        const user_id = data.user.user_id;
        const user_level = data.user.user_level;
        return {"user_id": user_id, "user_level": user_level}
    });
    console.log(user_info)
    return user_info
};

export {getMe};