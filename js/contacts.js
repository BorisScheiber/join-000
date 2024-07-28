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
        <div class="single-contact" onclick="showContactDetail('${user.name}')">
            <div class="single-contact-profile-img" style="background-color: ${color};" id="profile-${user.name.split(' ').join('-')}">
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
    const addNew = document.getElementById('newContact');
    addNew.style.display = 'flex';
}

function closeNewContact(){
    const closeNew = document.getElementById('newContact');
    closeNew.style.display ='none';
}

function showContactDetail(name) {
    const user = users.find(u => u.name === name);
    const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
    const bgColor = colors[user.name];
    const contactDetail = document.getElementById('contactDetail');
    contactDetail.innerHTML = generateContactDetailHTML(user, bgColor); 
    contactDetail.style.display = 'flex';
}

function generateContactDetailHTML(user, bgColor) {
    const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
    return `
        <div class="contact-detail-card-headline">
            <div class="contact-detail-profile-img" style="background-color: ${bgColor};">${initials}</div>
            <div class="contact-detail-card-user">
                <span class="contact-detail-card-name">${user.name}</span>
                <div class="contact-detail-change-section">
                    <button class="contact-detail-edit" onclick="openEditingContact('${user.name}')">
                        <img src="./assets/icons/edit-contact.svg" alt="edit" class="contact-detail-change-icons">
                        <span class="contact-detail-edit-text">Edit</span>
                    </button>
                    <button class="contact-detail-delete">
                        <img src="./assets/icons/delete-contact.svg" alt="delete" class="contact-detail-change-icons">
                        <span class="contact-detail-edit-text">Delete</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="contact-detail-card-subheadline">
            <span>Contact Information</span>
        </div>
        <div class="contact-detail-information-block">
            <div class="contact-detail-information-block-mail">
                <span class="contact-detail-information-block-subheadline">Email</span>
                <a href="mailto:${user.email}" class="contact-detail-information-block-text">${user.email}</a>
            </div>
            <div class="contact-detail-information-block-phone">
                <span class="contact-detail-information-block-subheadline">Phone</span>
                <span class="contact-detail-information-block-text">${user.phone}</span>
            </div>
        </div>
    `;
}

window.openEditingContact = (name) => {
    const user = users.find(u => u.name === name);
    const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
    const editContact = document.getElementById('editContact');
    const bgColor = colors[user.name];

    editContact.innerHTML = `
    <div class="edit-contact">
        <div class="edit-contact-menu">
            <div class="edit-contact-menu-img">
                <img src="./assets/icons/logo-add-new-contact.svg" alt="logo" class="edit-contact-menu-img">
            </div>
            <div>
                <div class="edit-contact-menu-text">
                    <span class="edit-contact-menu-text-headline">Edit contact</span>
                </div>
                <div class="edit-contact-menu-separator"></div>
            </div>
        </div>
        <div class="edit-contact-content">
            <div class="edit-contact-close-button">
                <img src="./assets/icons/close-contact.svg" alt="close" class="close-contact" onclick="closeEditContact()">
            </div>
            <div class="edit-contact-input-fields">
                <div class="icon-profile-edit-contact" style="background-color: ${bgColor};">
                    <span>${initials}</span>
                </div>
                <div class="edit-contact-input-field-section">
                    <div class="contact-input-fields">
                        <input type="text" placeholder="Name" class="input-fields-edit-contact" value="${user.name}">
                        <div class="contact-input-icon">
                            <img src="./assets/icons/contactPersonInput.svg" alt="profile">
                        </div>
                    </div>
                    <div class="input-field-separator"></div>
                    <div class="contact-input-fields">
                        <input type="email" placeholder="Email" class="input-fields-edit-contact" value="${user.email}">
                        <div class="contact-input-icon">
                            <img src="./assets/icons/contactMailInput.svg" alt="mail">
                        </div>
                    </div>
                    <div class="input-field-separator"></div>
                    <div class="contact-input-fields">
                        <input type="tel" placeholder="Phone" class="input-fields-edit-contact" value="${user.phone}">
                        <div class="contact-input-icon">
                            <img src="./assets/icons/contactCallInput.svg" alt="phone">
                        </div>
                    </div>
                </div>
            </div>
            <div class="edit-contact-button-section">
                <div class="edit-contact-buttons">
                    <div class="button-delete-contact">
                        <span>Delete</span>
                    </div>
                    <div class="button-save-contact">
                        <span>Save</span>
                        <img src="./assets/icons/createNewContact.svg" alt="tick">
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
editContact.style.display = 'flex';
};

window.closeEditContact = () => {
const editContact = document.getElementById('editContact');
editContact.style.display = 'none';
};