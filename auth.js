import './style.css';
import { fetchData } from './fetch.js';

// Haetaan nappi, josta lähetetään formi ja luodaan käyttäjä
const createUser = document.querySelector('.signupuser');

createUser.addEventListener('click', async (evt) => {
  evt.preventDefault();

  const url = 'http://127.0.0.1:3000/api/users';
  const form = document.querySelector('.signup-form');

  const username = form.querySelector('input[name=signup-username]').value;
  const password = form.querySelector('input[name=signup-pw]').value;
  const checkpassword = form.querySelector('input[name=check-pw]').value;
  const email = form.querySelector('input[name=signup-email]').value;

if (username && password && checkpassword && email) {

  if (password === checkpassword) {

    const body = {
      "username": username,
      "password": password,
      "email": email
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(body),
    };

    fetchData(url, options).then((data) => {
      console.log(data);
      if (data) {
        window.location.replace("/index.html");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    
  } else {
    alert('Passwords did not match!')
  }};
});


// haetaan nappi josta haetaan formi ja logataan sisään
// tästä saadaan TOKEN
/*const loginUser = document.querySelector('.loginuser');

loginUser.addEventListener('click', async (evt) => {
  evt.preventDefault();
  console.log('Nyt logataan sisään');

  const url = 'http://127.0.0.1:3000/api/auth/login';

  
    const form = document.querySelector('.login_form');
    const username = form.querySelector('input[name=username]').value;
    const password = form.querySelector('input[name=password]').value;


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
    console.log(data);
    console.log(data.token);
    localStorage.setItem('token', data.token);

  });
});

// Haetaan nappi josta testataan TOKENIN käyttöä, /auth/me
const meRequest = document.querySelector('#meRequest');
meRequest.addEventListener('click', async () => {
  console.log('Testataan TOKENIA ja haetaan käyttäjän tiedot');
  const url = 'http://localhost:3000/api/auth/me';
  const JWTtoken = localStorage.getItem('token');
  console-log('This is the token:', JWTtoken);

  const options = {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: 'Bearer: ' + muntokeni,
    }, //promleatic, ?
  };

  console.log(options);

  fetchData(url, options).then((data) => {
    // käsitellään fetchData funktiosta tullut JSON
    console.log(data);
    console.log(data.token); 

    if (data.token == undefined) {
      alert.apply('Unauthorized user: incorrect username or password'); 
    } else {
      alert.apply('Succesfull login!');
      window.location.replace = ('start-api-harjoituspohja.html'); 
    };
    logResponse('meResponse', `Authorized user info: ${JSON.stringify(data)}`);
  });

});

// Haetaan nappi josta tyhjennetään localStorage
const clear = document.querySelector('#clearButton');
clear.addEventListener('click', clearLocalStorage);

// Apufunktio, kirjoittaa halutin koodiblokin sisään halutun tekstin
function logResponse(codeblock, text) {
  document.getElementById(codeblock).innerText = text;
}

// Apufunktio, Tyhjennä local storage
function clearLocalStorage() {
  localStorage.removeItem('token');
  logResponse('clearResponse', 'localStorage cleared!');
}*/

