import './style.css';
import { fetchData } from './fetch';
import { logOutEvent } from './logout.js';
import { getMe } from './getme.js';

// Selectors for Buttons
const logout = document.querySelector('#logout');
const PostDiaryEntry = document.querySelector('#postDiaryBtn');
const getDiaryEntries = document.querySelector('#getdiary');
const getTrainingEntries = document.querySelector('#gettraining');

const user_info = await getMe(); 
const user_id = user_info.user_id;
const user_level = user_info.user_level;

// Logout: remove token in local.storage and replace page to index.html
logout.addEventListener('click', () => {
    logOutEvent();
});

getDiaryEntries.addEventListener('click', () => {
    getDiaryEntriesByUserId()
}); 

// Collect Diaryentry form and POST it
PostDiaryEntry.addEventListener('click', async (evt) => {
    evt.preventDefault();
    const form = document.querySelector('.formDiary');

    const url = 'http://127.0.0.1:3000/api/entries'

    const mood = form.querySelector('input[name=mood]').value;
    const weight = form.querySelector('input[name=weight]').value;
    const sleep = form.querySelector('input[name=sleep_hours]').value;
    const notes = form.querySelector('input[name=notes]').value;
    const id = user_id
    const date = new Date();
    const year = date.getFullYear(); 
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const entryDate =`${year}-${month}-${day}`;

    if (mood && weight && sleep && notes && date && user_id ){
        const body = {
            "entry_date": entryDate,
            "mood": mood,
            "weight": weight,
            "sleep_hours": sleep,
            "notes": notes,
            "user_id": id
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }, 
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(body),
        };

        await fetchData(url, options).then((data) => {
            if (data) {
                alert('Diary entry saved')
            } else {
                alert('Unable to save data! Try again later')
            }
        });
    } else {
        alert('Fill all the fields!')
    }

}); 

async function getDiaryEntriesByUserId() {
    const url = 'http://127.0.0.1:3000/api/entries';

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
        //Empty .gendiaryentries div
        const tArea = document.querySelector('.gendiaryentries');
        tArea.innerHTML = '';

        if (response.length > 0) {
            // New table created if data is found
            const table = document.createElement('table');
            table.classList.add('diaryentries');
            tArea.appendChild(table);

            const thead = document.createElement('thead');
            table.appendChild(thead);

            const headings = [
                'Entry ID:',
                'User ID:',
                'Entry Date:',
                'Mood:',
                'Weight:',
                'Hours slept:',
                'Notes:',
                'Date of creation:'
            ];
            const tr = document.createElement('tr');
            // Create table headers
            headings.forEach((element) => {
                const th = document.createElement('th');
                th.textContent = element;
                tr.appendChild(th);
            });
            thead.appendChild(tr);

            // Create and populate table
            const tbody = document.createElement('tbody');
            response.forEach(entry => {
                const entryRow = document.createElement('tr');
                Object.entries(entry).forEach(([key, value]) => {
                    const td = document.createElement('td');
                    td.classList.add('datatd');
                    td.textContent = value;
                    entryRow.appendChild(td);
                });

                // Create Edit button for each data row and set attributes
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.setAttribute('user_id', entry.entry_id);
                editButton.classList.add('entryEditButton');
                editButton.addEventListener('click', () => {
                    // GET the data to edit
                    getDiaryEntriesById(entry.entry_id);
                });
                const tdEdit = document.createElement('td');
                tdEdit.appendChild(editButton);
                entryRow.appendChild(tdEdit);


                // Create Delete button for each data row and set attribute
                const delButton = document.createElement('button');
                delButton.textContent = 'Delete';
                delButton.setAttribute('entry_id', entry.entry_id);
                delButton.classList.add('DiaryDelButton');
                delButton.addEventListener('click', () => {
                    delDiaryById(entry.entry_id);
                });
                const tdDelete = document.createElement('td');
                tdDelete.appendChild(delButton);
                entryRow.appendChild(tdDelete);

                tbody.appendChild(entryRow);
            });

            table.appendChild(tbody);

        } else {
            //Displayd text if entries not found
            tArea.innerHTML = '';
            const paragraph = document.createElement('p');
            paragraph.classList.add('nodata');
            tArea.appendChild(paragraph);
            const message = 'No data found';
            paragraph.textContent = message;
        }
    });
}

// DELETE Training entries by ID
async function delDiaryById(entryId) {
    if (window.confirm(`Are you sure you want to delete entry${entryId}`)) {
        const url = `http://localhost:3000/api/entries/${entryId}`;
        const options = {
            method: "DELETE",
            headers: {
            },
            redirect: "follow",
            referrerPolicy: "origin",
        };
        
        // Fetch delete on entry, then reload table
        fetchData(url, options).then(
            getDiaryEntriesById()
        );

    } else {
    window.alert(`Entry ${entryId} not deleted!`);
    }

}


async function getDiaryEntriesById(entryId) {
    const url = `http://127.0.0.1:3000/api/entries/${entryId}`

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
        createPutFrom(response)
        const form = document.querySelector('.putformdiary');
        const submitBtn = form.querySelector('#putDiaryBtn'); 
        submitBtn.addEventListener('click', (evt) => {
            evt.preventDefault();
            putEntryById(entryId);
        });

    });

}

function createPutFrom(response) {
    const gendiaryentries = document.querySelector('.gendiaryentries');
    const form = document.createElement('form');
    form.classList.add('putformdiary');

    const labels = ['Mood', 'Weight (kg)', 'Sleep (hours)', 'Notes', 'ID'];
    const keys = ['mood', 'weight', 'sleep_hours', 'notes', 'entry_id'];

    keys.forEach((key, index) => {
        const label = document.createElement('label');
        label.setAttribute('for', 'put' + key);
        label.textContent = labels[index];
        form.appendChild(label);
        form.appendChild(document.createElement('br'));

        const input = document.createElement('input');
        input.setAttribute('type', (key === 'entry_id') ? 'number' : 'text');
        input.setAttribute('name', 'put' + key);
        input.value = (key === 'entry_id') ? response[key] : response[key].toString();
        form.appendChild(input);
        form.appendChild(document.createElement('br'));
    });

    const submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.setAttribute('value', 'Save');
    submitBtn.setAttribute('id', 'putDiaryBtn');

    form.appendChild(submitBtn);

    gendiaryentries.appendChild(form);
}

async function putEntryById(entryId) {

    const form = document.querySelector('.putformdiary');

    const url = `http://127.0.0.1:3000/api/entries/${entryId}`

    const putmood = form.querySelector('input[name=putmood]').value;
    const putweight = form.querySelector('input[name=putweight]').value;
    const putsleep = form.querySelector('input[name=putsleep_hours]').value;
    const putnotes = form.querySelector('input[name=putnotes]').value;
    const putuserid = fetchUserId;
    const date = new Date();
    const year = date.getFullYear();
    // Months start from zero = january ... 
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const entry_date = `${year}-${month}-${day}`;

    const body = {
        "entry_date": entry_date,
        "mood": putmood,
        "weight": putweight,
        "sleep_hours": putsleep,
        "notes": putnotes,
        "user_id": putuserid
    }

    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }, 
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(body),
    };

    await fetchData(url, options).then((response) => {
        const message = response.message;
        window.alert(message); 
    });
    
}


getTrainingEntries.addEventListener('click', () => {
    console.log('GET TRAINING');
    // const url = '';
});


// delDiaryEntry.addEventListener('click', () => {
//     console.log("delete:")
// });