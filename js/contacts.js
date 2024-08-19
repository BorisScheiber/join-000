let contacts = [];
let currentLetter = '';
let html = '';
let selectedContactElement = null;

// initiates the content of contact.html

async function initContacts(){
    displayDesktopSidebar();
    displayHeader();
    displayMobileNav();
    removeClassesIfNotLoggedIn();
    displayInitialsHeaderUser();
    loadContacts();
}

contacts.sort((a, b) => a.name.localeCompare(b.name));

function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function loadContacts(){
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

function renderContactList(){
    loadContactMenu.innerHTML = '';
    currentLetter = '';
    html = '';
    contacts.forEach(user => {
        const firstLetter = user.name.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            html += /*html*/`
                <div class="contact-sequence" id="contactList">
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

function validateName(name){
    const NAME_PATTERN = /^[A-ZÄÖÜ][a-zäöü]+(?: [A-ZÄÖÜ][a-zäöü]+)$/;
    if (!name) {
        return 'Please enter a first and last name.';
    }
    if (!NAME_PATTERN.test(name)) {
        return 'The name may only contain letters and must begin with a capital letter and must contain both first and last names.';
    }
    return '';
}

function validateEmail(email){
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!emailPattern.test(email)) {
        return 'Please enter a valid email address.';
    }
    return '';
}

function validatePhone(phone){
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

function setErrorMessage(elementId, message){
    document.getElementById(elementId).innerHTML = message;
}

function clearErrorMessages(){
    setErrorMessage('nameError', '');
    setErrorMessage('emailError', '');
    setErrorMessage('phoneError', '');
}

function validateContactInputs(name, email, phone){
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

function createContactObject(name, email, phone, id) {
    return {
        id, 
        name,
        email,
        phone,
        color: getRandomColor(),
    };
}

function closeNewContact(){
    const addNewContactContainer = document.getElementById('newContact');
    addNewContactContainer.style.display = 'none';
}

function handleShowContactDetail(name) {
    if (window.innerWidth >= 850) {
        showContactDetail(name); // Für größere Bildschirme
    } else {
        hideContactList(); // Kontaktliste ausblenden
        showContactDetailSmallScreen(name); // Für kleinere Bildschirme
    }
}

function showContactDetail(name){
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

function hideContactList() {
    const contactList = document.getElementById('contactListResponsive');
    if (contactList) {
        contactList.style.display = 'none';
        console.log('Kontaktliste ausgeblendet');
        console.log('Aktueller Display-Status:', window.getComputedStyle(contactList).display);
    }
}

function showContactDetailSmallScreen(name) {
    const user = contacts.find(u => u.name === name);
    const contactDetail = document.getElementById('contactDetail');
    if (contactDetail) {
        contactDetail.innerHTML = generateContactDetailHTML(user, user.color);
        contactDetail.style.display = 'flex';
        console.log('Kontakt-Detail angezeigt');
        console.log('Aktueller Display-Status:', window.getComputedStyle(contactDetail).display);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.single-contact').forEach(contactElement => {
        contactElement.onclick = function() {
            const name = this.getAttribute('data-name');
            handleShowContactDetail(name);
        };
    });
});



function openEditingContact(contactId) {

    const user = contacts.find(u => u.id === contactId);
    if (user) {
        const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
        const bgColor = user.color;
        const editContact = document.getElementById('editContact');
        editContact.dataset.originalContactId = contactId;
        editContact.innerHTML = generateEditContactHTML(user, initials, bgColor);
        editContact.style.display = 'flex';
        openEditContactWindow();
    }
}

function sortAndRenderContacts() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    renderContactList();
}

function updateContactList(param1, param2) {
    if (typeof param1 === 'object' && param1.hasOwnProperty('id')) {
        updateExistingContact(param1.id, param1);
    } else if (typeof param1 === 'string' && typeof param2 === 'object') {
        updateExistingContact(param1, param2);
    } else if (typeof param1 === 'object') {
        contacts.push(param1);
    } else {
        console.error('Invalid parameters.');
        return;
    }
    sortAndRenderContacts();
}

function clearContactInfo(){
    const userName = document.getElementById('contactName');
    const userMail = document.getElementById('contactMailAdress');
    const userPhone = document.getElementById('contactPhone');
    const profileContainer = document.getElementById('profileEditContact');
    if (userName) userName.value = '';
    if (userMail) userMail.value = '';
    if (userPhone) userPhone.value = '';
    if (profileContainer) {
        profileContainer.outerHTML = /*html*/`
            <div class="icon-profile-add-new-contact">
                <img src="./assets/icons/personContact.svg" alt="profile" class="img-profile-add-new-contact">
            </div>
        `;
    }
}

function closeEditContact(){
    const editContact = document.getElementById('editContact');
    editContact.style.display = 'none';
}

function changeIcon(button, newIcon) {
    const img = button.querySelector('img');
    if (img) {
        img.src = `./assets/icons/${newIcon}`;
    }
}

function openNewContactWindow(){
    const newContactContainer = document.getElementById('newContact');
    newContactContainer.classList.add('show');
    newContactContainer.classList.remove('hide');
}

function openEditContactWindow(){
    const editContactContainer = document.getElementById('editContact');
    editContactContainer.classList.add('show');
    editContactContainer.classList.remove('hide');
}

function checkClickOutsideAddNewContact(event) {
    const newContactContainer = document.getElementById('newContact');
    if (event.target === newContactContainer) {
        closeNewContact();
    }
}

function checkClickOutsideEditContact(event) {
    const editContactContainer = document.getElementById('editContact');
    if (event.target === editContactContainer) {
        closeEditContact();
    }
}

function closeNewContact() {
    const newContactContainer = document.getElementById('newContact');
    newContactContainer.classList.add('hide');
    newContactContainer.classList.remove('show');
    setTimeout(() => {
        newContactContainer.style.display = 'none';
    }, 400);
}

function closeEditContact() {
    const editContactContainer = document.getElementById('editContact');
    editContactContainer.classList.add('hide');
    editContactContainer.classList.remove('show');
    setTimeout(() => {
        editContactContainer.style.display = 'none';
    }, 400);
}

function preventClickPropagation(event) {
    event.stopPropagation();
}


// function detailedContactResponsive(){
//     let contactResponsive = document.getElementById('singleCardResponsive');
//     let contactMenuResponsive = document.getElementById('contactList');
//     contactResponsive.classList.remove('display-none');
//     contactMenuResponsive.classList.add('display-none');
// }

////////////////////////////////////////// BORIS ////////////////////////////////////////

/**
 * Closes the contact detail card by reloading the current page.
 */
function closeContactDetailCard() {
    window.location.reload();
}


/**
 * Toggles the visibility of the contact detail edit dropdown menu.
 * If the dropdown is currently visible, it slides out and hides the dropdown.
 * If the dropdown is currently hidden, it slides in and shows the dropdown.
 */
function toggleContactDetailEditDropdown() {
    let dropdown = document.getElementById("contactDetailEditDropDown");
  
    if (dropdown.style.display === "flex") {
      slideOutContactDropdown(dropdown);
      document.removeEventListener("click", closeContactDetailEditDropdownOnClickOutside);
    } else {
      slideInContactDropdown(dropdown);
      document.addEventListener("click", closeContactDetailEditDropdownOnClickOutside);
    }
}
  

/**
 * Slides in the contact detail edit dropdown menu by adding the appropriate animation class
 * and setting its display to "flex".
 * 
 * @param {HTMLElement} element - The dropdown menu element to slide in.
 */
function slideInContactDropdown(element) {
    element.style.display = "flex";
    element.classList.remove("slide-out-contact-dropdown");
    element.classList.add("slide-in-contact-dropdown");
}
  

/**
 * Slides out the contact detail edit dropdown menu by adding the appropriate animation class.
 * After the animation is complete, the dropdown is hidden by setting its display to "none".
 * 
 * @param {HTMLElement} element - The dropdown menu element to slide out.
 */
function slideOutContactDropdown(element) {
    element.classList.remove("slide-in-contact-dropdown");
    element.classList.add("slide-out-contact-dropdown");
        setTimeout(() => {
     element.style.display = "none";
     element.classList.remove("slide-out-contact-dropdown");
    }, 200);
}
  

/**
 * Closes the contact detail edit dropdown menu if the user clicks outside of it.
 * This function is triggered by a click event listener added when the dropdown is shown.
 * 
 * @param {Event} event - The click event triggered by the user's interaction.
 */
function closeContactDetailEditDropdownOnClickOutside(event) {
    let dropdown = document.getElementById("contactDetailEditDropDown");
    let toggleButton = document.querySelector(".contact-detail-edit-button-mobile");
  
    if (!dropdown.contains(event.target) && !toggleButton.contains(event.target)) {
      slideOutContactDropdown(dropdown);
      document.removeEventListener("click", closeContactDetailEditDropdownOnClickOutside);
    }
}
  
