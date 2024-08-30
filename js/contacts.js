let contacts = [];
let currentLetter = '';
let html = '';
let selectedContactElement = null;

/**
 * Initializes the contact page by displaying the sidebar, header, and loading contacts.
 * @async
 * @function
 * @returns {void}
 */
async function initContacts() {
    displayDesktopSidebar();
    displayHeader();
    displayMobileNav();
    removeClassesIfNotLoggedIn();
    await getUsersData();
    displayInitialsHeaderUser();
    loadContacts();
}


/**
 * Generates a random hexadecimal color code. 
 * @function
 * @returns {string} A random hexadecimal color code.
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


/**
 * Loads contacts from a data source and renders them on the page.
 * @async
 * @function
 * @returns {void}
 */
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


/**
 * Renders the contact list in the contact menu.
 * @function
 * @returns {void}
 */
function renderContactList() {
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


/**
 * Sets an error message for a specific HTML element.
 * @function
 * @param {string} elementId - The ID of the HTML element.
 * @param {string} message - The error message to set.
 * @returns {void}
 */
function setErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.innerHTML = message;
        errorElement.style.display = 'block';
        errorElement.style.color = 'red';
    } else {
        console.error(`Element with ID ${elementId} not found.`);
    }
}


/**
 * Clears all error messages and input field error states in the form.
 * This function iterates over all elements with the class `form-error-message`, hiding them
 * by setting their `display` style to `none`. It also removes the `input-error` class from all
 * input fields that have this class, effectively resetting the form's error state.
 * @function
 */
function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.form-error-message');
    errorElements.forEach(element => {
        element.style.display = 'none';
    });
    const inputFields = document.querySelectorAll('.input-error');
    inputFields.forEach(field => {
        field.classList.remove('input-error');
    });
}


/**
 * Creates a contact object.
 * @function
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} id - The contact's ID.
 * @returns {Object} The contact object.
 */
function createContactObject(name, email, phone, id) {
    return {
        id,
        name,
        email,
        phone,
        color: getRandomColor(),
    };
}


/**
 * Closes the "Add New Contact" form.
 * @function
 * @returns {void}
 */
function closeEditContact() {
    const addNewContactContainer = document.getElementById('editContact');
    addNewContactContainer.style.display = 'none';
}


/**
 * Handles showing contact details based on screen size.
 * @function
 * @param {string} name - The contact's name.
 * @returns {void}
 */
function handleShowContactDetail(name) {
    if (window.innerWidth >= 850) {
        showContactDetail(name);
    } else {
        hideContactList();
        showContactDetailSmallScreen(name);
    }
}


/**
 * Displays the contact detail view.
 * @function
 * @param {string} name - The contact's name.
 * @returns {void}
 */
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


/**
 * Hides the contact list for small screens.
 * @function
 * @returns {void}
 */
function hideContactList() {
    const contactList = document.getElementById('contactListResponsive');
    if (contactList) {
        contactList.style.display = 'none';
    }
}


/**
 * Displays the contact detail view for small screens.
 * @function
 * @param {string} name - The contact's name.
 * @returns {void}
 */
function showContactDetailSmallScreen(name) {
    const user = contacts.find(u => u.name === name);
    const contactDetail = document.getElementById('contactDetail');
    if (contactDetail) {
        contactDetail.innerHTML = generateContactDetailHTML(user, user.color);
        contactDetail.style.display = 'flex';
    }
}


/**
 * Adds click event listeners to all contact elements once the DOM content is fully loaded.
 * This function waits for the DOM content to be loaded, then it selects all elements with
 * the class `single-contact`. For each of these elements, it sets up a click event handler.
 * When a contact element is clicked, it retrieves the contact's name from a `data-name` attribute
 * and calls the `handleShowContactDetail` function with the retrieved name.
 * @listens DOMContentLoaded - Ensures that the event listener is added only after the DOM content is fully loaded.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.single-contact').forEach(contactElement => {
        contactElement.onclick = function() {
            const name = this.getAttribute('data-name');
            handleShowContactDetail(name);
        };
    });
});


/**
 * Opens the contact editing form.
 * @function
 * @param {string} contactId - The ID of the contact to edit.
 * @returns {void}
 */
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


/**
 * Sorts contacts alphabetically and re-renders the contact list.
 * @function
 * @returns {void}
 */
function sortAndRenderContacts() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    renderContactList();
}


/**
 * Updates the contact list with new or modified contact data.
 * @function
 * @param {(Object|string)} param1 - A contact object or ID.
 * @param {Object} [param2] - The contact data (if the first parameter is an ID).
 * @returns {void}
 */
function updateContactList(param1, param2) {
    if (typeof param1 === 'object' && param1.hasOwnProperty('id')) {
        updateExistingContact(param1.id, param1);
    } else if (typeof param1 === 'string' && typeof param2 === 'object') {
        updateExistingContact(param1, param2);
    } else if (typeof param1 === 'object' && !param1.hasOwnProperty('id')) {
        contacts.push(param1);
    } else {
        console.error('Invalid parameters.');
        return;
    }
    sortAndRenderContacts();
}


/**
 * Clears all contact information input fields and resets the profile container.
 * This function performs the following actions:
 * 1. Sets the value of the input fields for contact name, email, and phone to an empty string.
 * 2. Resets the profile container to its default state by replacing its outer HTML with a default profile icon.
 * Specifically:
 * - `contactName` input field is cleared if it exists.
 * - `contactMailAdress` input field is cleared if it exists.
 * - `contactPhone` input field is cleared if it exists.
 * - `profileEditContact` container is replaced with a default profile icon if it exists.
 * @function
 */
function clearContactInfo() {
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