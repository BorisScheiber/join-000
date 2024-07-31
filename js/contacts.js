let contacts = [];
let currentLetter = '';
let html = '';

async function initContatcs(){
    displayDesktopSidebar();
    displayHeader();
    displayMobileNav();
    removeClassesIfNotLoggedIn();
    displayInitialsHeaderUser();
    loadContacts();
  }

contacts.sort((a, b) => a.name.localeCompare(b.name));

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function loadContacts() {
    try {
        const data = await getData('contacts');
        if (data) {
            contacts = Object.values(data);
            contacts.sort((a, b) => a.name.localeCompare(b.name));
            renderContactList();
        } else {
            contacts = [];
            renderContactList();
        }
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

const loadContactMenu = document.getElementById('loadContactMenu');

contacts.forEach(user => {
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

function generateContactHTML(user) {
    const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
    return `
        <div class="single-contact" onclick="showContactDetail('${user.name}')">
            <div class="single-contact-profile-img" style="background-color: ${user.color};" id="profile-${user.name.split(' ').join('-')}">
                ${initials}
            </div>
            <div class="single-contact-profile">
                ${user.name}
                <a href="#">${user.email}</a>
            </div>
        </div>
    `;
}

function renderContactList() {
    loadContactMenu.innerHTML = '';
    currentLetter = '';
    html = '';
    contacts.forEach(user => {
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
        html += generateContactHTML(user);
    });
    loadContactMenu.innerHTML = html;
}

loadContactMenu.innerHTML = html;

function openNewContact() {
    const addNewContactContainer = document.getElementById('newContact');
    addNewContactContainer.innerHTML = `
        <div class="add-new-contact">
            <div class="add-new-contact-menu">
                <div class="add-new-contact-menu-img">
                    <img src="./assets/icons/logo-add-new-contact.svg" alt="logo" class="add-new-contact-menu-img">
                </div>
                <div>
                    <div class="add-new-contact-menu-text">
                        <span class="add-new-contact-menu-text-headline">Add contact</span>
                        <span class="add-new-contact-menu-text-subtext">Tasks are better with a team!</span>
                    </div>
                    <div class="add-new-contact-menu-separator"></div>
                </div>
            </div>
            <div class="add-new-contact-content">
                <div class="add-new-contact-close-button">
                    <img src="./assets/icons/close-contact.svg" alt="close" class="close-contact" onclick="closeNewContact()">
                </div>
                <div class="add-new-contact-input-fields">
                    <div class="icon-profile-add-new-contact">
                        <img src="./assets/icons/personContact.svg" alt="profile" class="img-profile-add-new-contact">
                    </div>
                    <div class="add-new-contact-input-field-section">
                        <div class="contact-input-fields">
                            <input type="text" placeholder="Name" class="input-fields-add-new-contact" id="newContactName">
                            <div class="contact-input-icon">
                                <img src="./assets/icons/contactPersonInput.svg" alt="profile">
                            </div>
                            <div id="nameError" class="form-error-message"></div>
                        </div>
                        <div class="input-field-separator"></div>
                        <div class="contact-input-fields">
                            <input type="email" placeholder="Email" class="input-fields-add-new-contact" id="newContactEmail"
                            pattern="[a-z0-9._%+\-]+@[a-z0-9\-]+\.[a-z]{2,63}$">
                            <div class="contact-input-icon">
                                <img src="./assets/icons/contactMailInput.svg" alt="mail">
                            </div>
                            <div id="emailError" class="form-error-message"></div>
                        </div>
                        <div class="input-field-separator"></div>
                        <div class="contact-input-fields">
                            <input type="tel" placeholder="Phone" class="input-fields-add-new-contact" id="newContactPhone">
                            <div class="contact-input-icon">
                                <img src="./assets/icons/contactCallInput.svg" alt="phone">
                            </div>
                            <div id="phoneError" class="form-error-message"></div>
                        </div>
                    </div>
                </div>
                <div class="add-new-contact-button-section">
                    <div class="add-new-contact-buttons">
                        <div class="button-cancel-new-contact" onclick="closeNewContact()">
                            <span>Cancel</span>
                            <img src="./assets/icons/cancelNewContact.svg" alt="cancel">
                        </div>
                        <div class="button-create-new-contact" onclick="createNewContact()">
                            <span>Create contact</span>
                            <img src="./assets/icons/createNewContact.svg" alt="tick">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    addNewContactContainer.style.display = 'flex';
}

function validateName(name) {
    const NAME_PATTERN = /^[A-ZÄÖÜ][a-zäöü]+(?: [A-ZÄÖÜ][a-zäöü]+)$/;
    if (!name) {
        return 'Please enter a first and last name.';
    }
    if (!NAME_PATTERN.test(name)) {
        return 'The name may only contain letters and must begin with a capital letter and must contain both first and last names.';
    }
    return '';
}

function validateEmail(email) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/;
    if (!emailPattern.test(email)) {
        return 'Please enter a valid email address.';
    }
    return '';
}

function validatePhone(phone) {
    const PHONE_PATTERN = /^[\+\d]+$/;
    if (!phone) {
        return 'Please enter a phone number.';
    }
    if (!PHONE_PATTERN.test(phone)) {
        return 'The phone number can only contain numbers and the plus sign (+).';
    }
    return '';
}

function setErrorMessage(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearErrorMessages() {
    setErrorMessage('nameError', '');
    setErrorMessage('emailError', '');
    setErrorMessage('phoneError', '');
}

async function createNewContact() {
    const name = document.getElementById('newContactName').value;
    const email = document.getElementById('newContactEmail').value;
    const phone = document.getElementById('newContactPhone').value;
    clearErrorMessages();
    if (validateContactInputs(name, email, phone)) {
        const newContact = createContactObject(name, email, phone);
        const contactId = generateContactId(name);
        await saveDataToFirebase(contactId, newContact);
        updateContactList(newContact);
        closeNewContact();
        location.reload();
    }
    successfullCreationContact();
}

function generateContactId(name) {
    if (typeof name !== 'string') {
        console.error('Invalid name for ID generation:', name);
        return '';
    }
    return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function successfullCreationContact() {
    let overlay = document.getElementById('createContactSuccessfull');
    let container = overlay.querySelector('.create-contact-successfull-container');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => {
        container.classList.add('slide-in');
    });
    setTimeout(() => {
        container.classList.add('slide-out');
        setTimeout(() => {
            overlay.style.display = 'none';
            container.classList.remove('slide-in', 'slide-out');
        }, 400);
    }, 1500);
}

function validateContactInputs(name, email, phone) {
    const validations = [
        { error: validateName(name), elementId: 'nameError' },
        { error: validateEmail(email), elementId: 'emailError' },
        { error: validatePhone(phone), elementId: 'phoneError' },
    ];
    let valid = true;
    validations.forEach(({ error, elementId }) => {
        if (error) {
            setErrorMessage(elementId, error);
            valid = false;
        }
    });
    return valid;
}

function createContactObject(name, email, phone) {
    return {
        name,
        email,
        phone,
        color: getRandomColor(),
    };
}

function updateContactList(newContact) {
    contacts.push(newContact);
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    renderContactList();
}

function closeNewContact() {
    const addNewContactContainer = document.getElementById('newContact');
    addNewContactContainer.style.display = 'none';
}

function showContactDetail(name) {
    const user = contacts.find(u => u.name === name);
    const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
    const bgColor = user.color;
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
                    <button class="contact-detail-delete" onclick="deleteContact('${user.name}')">
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

async function deleteContact(contactName) {
    try {
        const contactId = contactName.split(' ').join('-').toLowerCase();
        await removeData(`contacts/${contactId}`);
        contacts = contacts.filter(contact => contact.name !== contactName);
        renderContactList();
        location.reload();
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
        alert('Es gab ein Problem beim Löschen des Kontakts. Bitte versuchen Sie es erneut.');
    }
}

{/* <button class="contact-detail-edit-active" onclick="openEditingContact('${user.name}')">
<img src="./assets/icons/editContactsActive.svg" alt="edit" class="edit-contact-active">
<span class="contact-detail-edit-text">Edit</span>
</button> */}

{/* <button class="contact-detail-delete-active" onclick="deleteContact()">
<img src="./assets/icons/deleteContactActive.svg" alt="delete" class="delete-contact-active">
<span class="contact-detail-edit-text">Delete</span>
</button> */}

function openEditingContact(name) {
    const user = contacts.find(u => u.name === name);
    if (!user) {
        console.error('User not found:', name);
        return;
    }
    const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
    const bgColor = user.color;
    const editContact = document.getElementById('editContact');
    editContact.dataset.originalContactId = generateContactId(user.name);
    editContact.innerHTML = generateEditContactHTML(user, initials, bgColor);
    editContact.style.display = 'flex';
}

function generateEditContactHTML(user, initials, bgColor) {
    return `
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
                            <input type="text" placeholder="Name" class="input-fields-edit-contact" value="${user.name}" id="contactName">
                            <div class="contact-input-icon">
                                <img src="./assets/icons/contactPersonInput.svg" alt="profile">
                            </div>
                        </div>
                        <div class="input-field-separator"></div>
                        <div class="contact-input-fields">
                            <input type="email" placeholder="Email" class="input-fields-edit-contact" value="${user.email}"
                            pattern="[a-z0-9._%+\-]+@[a-z0-9\-]+\.[a-z]{2,63}$" id="contactMailAdress">
                            <div class="contact-input-icon">
                                <img src="./assets/icons/contactMailInput.svg" alt="mail">
                            </div>
                        </div>
                        <div class="input-field-separator"></div>
                        <div class="contact-input-fields">
                            <input type="tel" placeholder="Phone" class="input-fields-edit-contact" value="${user.phone}" id="contactPhone">
                            <div class="contact-input-icon">
                                <img src="./assets/icons/contactCallInput.svg" alt="phone">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="edit-contact-button-section">
                    <div class="edit-contact-buttons">
                        <div class="button-delete-contact" onclick="clearContactInfo()">
                            <span>Delete</span>
                        </div>
                        <div class="button-save-contact" onclick="saveEditingContact()">
                            <span>Save</span>
                            <img src="./assets/icons/createNewContact.svg" alt="tick">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function saveEditingContact() {
    const originalContactId = getOriginalContactId();
    if (!originalContactId) {
        console.error('Original Contact ID is undefined.');
        return;
    }
    const contactData = createContactData();
    const newContactId = generateContactId(contactData.name);
    try {
        await updateContactInDatabase(originalContactId, newContactId, contactData);
        updateContactList(newContactId, contactData);
        renderContactList();
        closeEditContact();
        location.reload();
    } catch (error) {
        console.error('Error saving contact:', error);
    }
}

function getOriginalContactId() {
    return document.getElementById('editContact').dataset.originalContactId;
}

function createContactData() {
    return {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactMailAdress').value,
        phone: document.getElementById('contactPhone').value,
        color: getRandomColor()
    };
}

async function updateContactInDatabase(originalContactId, newContactId, contactData) {
    if (newContactId !== originalContactId) {
        await removeData(`contacts/${originalContactId}`);
    }
    await saveDataToFirebase(newContactId, contactData);
}

function updateContactList(newContactId, contactData) {
    contacts = contacts.filter(contact => generateContactId(contact.name) !== newContactId);
    contacts.push(contactData);
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function clearContactInfo() {
    const userName = document.getElementById('contactName');
    const userMail = document.getElementById('contactMailAdress');
    const userPhone = document.getElementById('contactPhone');
    if (userName) userName.value = '';
    if (userMail) userMail.value = '';
    if (userPhone) userPhone.value = '';
}

function closeEditContact(){
    const editContact = document.getElementById('editContact');
    editContact.style.display = 'none';
}
