import './style.css'
import { fetchData } from './fetch';
import { logOutEvent } from './logout';
import { getMe } from './getme';

const getuser = document.querySelector('.getuser');
const logout = document.querySelector('#logout');

const user_info = await getMe(); 
const user_id = user_info.user_id;
const user_level = user_info.user_level;
console.log(user_id);

// Logout: remove token in local.storage and replace page to index.html
logout.addEventListener('click', () => {
    logOutEvent();
});

getuser.addEventListener('click', () => {
    if (user_level === 'admin') {
        GetAllUsers()
    } else {
        getUserbyId(user_id)
    }
});

async function GetAllUsers() {
    const url='http://localhost:3000/api/users';

    const token = localStorage.getItem('token');
    const Bearer = `Bearer ${token}`;

    const options = {
        method: "GET",
        headers: {
            "Authorization": Bearer
        },
        redirect: "follow",
        referrerPolicy: "origin",
    };

    await fetchData(url, options).then((response) => {
        // Emptying .genuser div
        const tArea = document.querySelector('.genuser');
        tArea.innerHTML = '';
        if (response.length > 0) {
            const table = document.createElement('table');
            table.classList.add('userstable');
            tArea.appendChild(table);

            const thead = document.createElement('thead');
            table.appendChild(thead);
            
            // Creating table headings 
            const tr = document.createElement('tr');
            const th1 = document.createElement('th');
            th1.textContent = 'User ID:';
            tr.appendChild(th1);

            const th2 = document.createElement('th');
            th2.textContent = 'Username:'
            tr.appendChild(th2);

            const th3 = document.createElement('th');
            th3.textContent = 'User level:';
            tr.appendChild(th3);

            thead.appendChild(tr);

            //Create table body and populate table
            const tbody = document.createElement('tbody');

            response.forEach(user => {
                const row = document.createElement('tr');
                Object.entries(user).forEach(([key, value]) => {
                    const td = document.createElement('td');
                    td.classList.add('datatd');
                    td.textContent = value;
                    row.appendChild(td); 
                });

                //Create edit button and add attributes (user_id)
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.setAttribute('user_id', user.user_id);
                editButton.classList.add('userEditButton');
                editButton.addEventListener('click', () => {
                    putUserById(user.user_id);
                });
                const tdEdit = document.createElement('td');
                tdEdit.appendChild(editButton);
                row.appendChild(tdEdit);

                //Create delete button and add attributes (user_id)
                const delButton = document.createElement('button');
                delButton.textContent = 'Delete';
                delButton.setAttribute('user_id', user.user_id);
                delButton.classList.add('userDelButton');
                delButton.addEventListener('click', () => {
                    delUserById(user.user_id);
                });
                const tdDelete = document.createElement('td');
                tdDelete.appendChild(delButton);
                row.append(tdDelete);
            
                tbody.appendChild(row);
            
            });
            
            table.appendChild(tbody);

        } else {

        }
        

    });
}

async function getUserbyId(user_id) {
    const url = `http://127.0.0.1:3000/api/users/${user_id}`;

    const token = localStorage.getItem('token');
    const Bearer = `Bearer ${token}`;
    
    const options = {
        method: "GET",
        headers: {
            "Authorization": Bearer 
        },
        redirect: "follow",
        referrerPolicy: "origin",
    };

    await fetchData(url, options).then((response) => {
            console.log(response);
            const tArea = document.querySelector('.genuser');
        tArea.innerHTML = '';
        if (response.username) {
            const table = document.createElement('table');
            table.classList.add('userstable');
            const thead = document.createElement('thead');
            table.appendChild(thead);
            
            // Creating table headings 
            const tr = document.createElement('tr');
            const th1 = document.createElement('th');
            th1.textContent = 'User ID:';
            tr.appendChild(th1);

            const th2 = document.createElement('th');
            th2.textContent = 'Username:'
            tr.appendChild(th2);

            const th3 = document.createElement('th');
            th3.textContent = 'User level:';
            tr.appendChild(th3);

            thead.appendChild(tr);

            //Create table body and populate table
            const tbody = document.createElement('tbody');
            tbody.classList.add('gettbody');

            // const tableBody = document.querySelector('.gettbody');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${response.user_id}</td>
                <td>${response.username}</td>
                <td>${response.user_level}</td>
                <td><button id="edituser")">Edit</button></td>
                <td><button id="deluser"">Delete</button></td>
            `;

            tbody.appendChild(row);
            table.appendChild(tbody); 
            tArea.appendChild(table);

            const editUserBtn = document.querySelector('#edituser');
            const delUserBtn = document.querySelector('#deluser');

            editUserBtn.addEventListener('click', () => {
                putUserById(user_id)
            })

            delUserBtn.addEventListener('click', () => {
                delUserById(user_id)
            });
        }
    
    });
}

async function putUserById(userId) {
    // console.log(`PUT user_id: ${userId}`);
    const formArea = document.querySelector('.putuser');

    const labels = [
        'username',
        'password',
        'email'
    ];

    const form = document.createElement('form');

    labels.forEach((element) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', element);
        const label = document.createElement('label');
        label.setAttribute('for', element); 
        label.textContent = element;
        const linebrake1 = document.createElement('br');
        const linebrake2 = document.createElement('br');

        form.appendChild(label);
        form.appendChild(linebrake1);
        form.appendChild(input);
        form.appendChild(linebrake2);

    });

    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('id', 'putuser');
    form.appendChild(submitButton);

    formArea.appendChild(form);

    const putUserBtn = document.querySelector('#putuser');

    putUserBtn.addEventListener('click', (evt) => {
        evt.preventDefault()
        const url = `http://localhost:3000/api/users/19${userId}`;
        console.log(url);

        const token = localStorage.getItem('token');
        const Bearer = `Bearer ${token}`;
    
        const username = document.querySelector('input[name=username]').value;
        const password = document.querySelector('input[name=password]').value;
        const email = document.querySelector('input[name=email]').value;
    
        if (username && password && email) {
    
        const body = {
            "username": username,
            "password": password,
            "email": email
        }
    
        console.log(`PUT: ${body}`);
    
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", 
                "Authorization": Bearer, 
            },
            redirect: "follow",
            referrerPolicy: "origin",
            body: JSON.stringify(body),
        };
        
        fetchData(url, options).then((response) => {
            console.log(response)
        });
        }
    });
}

async function delUserById(user_id) {
    if (window.confirm(`Are you sure you want to delete user ${user_id}`)) {
        const token = localStorage.getItem('token');
        const Bearer = `Bearer ${token}`;

        const url = `http://localhost:3000/api/users/${user_id}`;
        
        const options = {
            method: "DELETE",
            headers: {
                "Authorization" : Bearer,
            },
            redirect: "follow",
            referrerPolicy: "origin",
        };

        await fetchData(url, options).then((response) => {
            console.log(response)
            // logOutEvent()
        });
    } else {
        window.alert(`User ${user_id} not deleted!`);
    }
}