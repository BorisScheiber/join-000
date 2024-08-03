let contacts = [];
let currentLetter = '';
let html = '';
let selectedContactElement = null;

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
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!emailPattern.test(email)) {
        return 'Please enter a valid email address.';
    }
    return '';
}

function validatePhone(phone) {
    const PHONE_PATTERN = /^[\+\d\s]+$/;
    if (!phone) {
        return 'Please enter a phone number.';
    }
    if (phone.length < 9) {
        return 'The phone number must be at least 9 characters long.';
    }
    if (!PHONE_PATTERN.test(phone)) {
        return 'The phone number can only contain numbers, the plus sign (+), and spaces.';
    }
    return '';
}

function setErrorMessage(elementId, message) {
    document.getElementById(elementId).innerHTML = message;
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
    const contactDetail = document.getElementById('contactDetail');
    contactDetail.innerHTML = generateContactDetailHTML(user, user.color);
    contactDetail.style.display = 'flex';
    if (selectedContactElement) {
        selectedContactElement.classList.remove('selected-contact');
    }
    const contactElement = document.querySelector(`.single-contact[data-name="${name}"]`);
    if (contactElement) {
        contactElement.classList.add('selected-contact');
        selectedContactElement = contactElement;
    }
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

async function saveEditingContact() {
    const originalContactId = getOriginalContactId();
    if (!originalContactId) {
        console.error('Original Contact ID is undefined.');
        return;
    }
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactMailAdress').value;
    const phone = document.getElementById('contactPhone').value;
    clearErrorMessages();
    if (!validateContactInputs(name, email, phone)) {
        console.error('Please fix the errors before saving.');
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
