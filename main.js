import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { fetchData } from './fetch.js';

 const loginUser = document.querySelector('.loginuser');

loginUser.addEventListener('click', async (evt) => {
  evt.preventDefault();

  const url = 'http://127.0.0.1:3000/api/auth/login';

  const form = document.querySelector('.login-form');
  const username = form.querySelector('input[name=login-username]').value;
  const password = form.querySelector('input[name=login-pw]').value;

  if (username && password) {

  const body = {
    "username": username,
    "password": password
  }

  const options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(body), // body data type must match "Content-Type" header
  };

  fetchData(url, options).then((data) => {
    if (data.token) {
      console.log(data.token);
      localStorage.setItem('token', data.token);
      window.location.replace("/home.html");
    } else {
      alert('wrong username or password!')
    }
  })} else {
    alert("Give username and password");
  }
  ;
});

