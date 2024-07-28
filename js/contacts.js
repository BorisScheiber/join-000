users = [
    {
        "name": "Anton Mayer",
        "email": "antom@gmail.com",
        "phone": "+49 1111 111 11 1",
    },
    {
        "name": "Anja Schutz",
        "email": "schulz@hotmail.de",
        "phone": "+49 1111 111 22 2",
    },
    {
        "name": "Benedikt Ziegler",
        "email": "benedikt@gmail.com",
        "phone": "+49 1111 111 33 3",
    },
    {
        "name": "David Eisenberg",
        "email": "davidberg@gmail.com",
        "phone": "+49 1111 111 44 4",
    },
    {
        "name": "Eva Fischer",
        "email": "eva@gmail.com",
        "phone": "+49 1111 111 55 5",
    },
    {
        "name": "Emmanuel Mauer",
        "email": "emmanuelma@gmail.com",
        "phone": "+49 1111 111 66 6",
    },
]


users.sort((a, b) => a.name.localeCompare(b.name));

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function loadColors() {
    let colors = JSON.parse(localStorage.getItem('contactColors'));
    if (!colors) {
        colors = {};
        users.forEach(user => {
            colors[user.name] = getRandomColor();
        });
        localStorage.setItem('contactColors', JSON.stringify(colors));
    }
    return colors;
}

function generateContactHTML(user, color) {
    const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
    return `
        <div class="single-contact" onclick="openEditContact()">
            <div class="single-contact-profile-img" style="background-color: ${color};">
                ${initials}
            </div>
            <div class="single-contact-profile">
                ${user.name}
                <a href="mailto:${user.email}">${user.email}</a>
            </div>
        </div>
    `;
}

const loadContactMenu = document.getElementById('loadContactMenu');
let currentLetter = '';
let html = '';
const colors = loadColors();

users.forEach(user => {
    const firstLetter = user.name.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
        currentLetter = firstLetter;
        html += `
            <div class="contact-sequence">
                <span class="contact-sequence-text">${currentLetter}</span>
            </div>
            <div class="contact-separator"></div>
        `;
    }
    html += generateContactHTML(user, colors[user.name]);
});

loadContactMenu.innerHTML = html;

function openNewContact(){
    let addNew = document.getElementById('newContact');
    addNew.style.display = 'flex';
}

function closeNewContact(){
    let closeNew = document.getElementById('newContact');
    closeNew.style.display ='none';
}