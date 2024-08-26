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
 * Validates a contact's name.
 * @function
 * @param {string} name - The contact's name.
 * @returns {string} An error message if the name is invalid, or an empty string if valid.
 */
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

/**
 * Validates an email address.
 * @function
 * @param {string} email - The email address.
 * @returns {string} An error message if the email is invalid, or an empty string if valid.
 */
function validateEmail(email) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!emailPattern.test(email)) {
        return 'Please enter a valid email address.';
    }
    return '';
}

/**
 * Validates a phone number.
 * This function checks if the provided phone number is not empty, contains only valid characters (numbers, plus sign, and spaces),
 * and has at least 9 digits.
 * @param {string} phone - The phone number to be validated.
 * @returns {string} - An error message if the phone number is invalid; otherwise, an empty string.
 * @example
 * // Valid phone number
 * const result = validatePhone('+123 456 789');
 * console.log(result); // Output: ''
 * @example
 * // Phone number too short
 * const result = validatePhone('123 45');
 * console.log(result); // Output: 'The phone number must be at least 9 digits long.'
 * @example
 * // Phone number contains invalid characters
 * const result = validatePhone('123-456-7890');
 * console.log(result); // Output: 'The phone number can only contain numbers, the plus sign (+), and spaces.'
 * @example
 * // Phone number is empty
 * const result = validatePhone('   ');
 * console.log(result); // Output: 'Please enter a phone number.'
 */
function validatePhone(phone) {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
        return 'Please enter a phone number.';
    }
    const PHONE_PATTERN = /^[\+\d\s]+$/;
    if (!PHONE_PATTERN.test(trimmedPhone)) {
        return 'The phone number can only contain numbers, the plus sign (+), and spaces.';
    }
    const digitsOnly = trimmedPhone.replace(/\D+/g, '');
    if (digitsOnly.length < 9) {
        return 'The phone number must be at least 9 digits long.';
    }
    return '';
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
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = 'red';
    } else {
        console.error(`Element with ID ${elementId} not found.`);
    }
}

/**
 * Clears all error messages in the contact form.
 * This function iterates over the predefined list of error message element IDs,
 * clears the text content of each element, and hides the element to ensure that
 * no error messages are visible to the user.
 * Array of IDs corresponding to the error message elements for name, email, and phone fields.
 * @type {string[]}
 * The DOM element corresponding to the current error ID.
 * @type {HTMLElement|null}
 */
function clearErrorMessages() {
    const errorIds = ['nameError', 'emailError', 'phoneError'];
    errorIds.forEach(id => {
        const errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    });
}

/**
 * Validates the contact input fields for name, email, and phone.
 * @param {string} name - The name input value to validate.
 * @param {string} email - The email input value to validate.
 * @param {string} phone - The phone input value to validate.
 * @returns {boolean} - Returns `true` if all inputs are valid, otherwise `false`.
 */
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
function closeNewContact() {
    const addNewContactContainer = document.getElementById('newContact');
    addNewContactContainer.style.display = 'none';
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
 * Clears the contact information fields in the editing form.
 * @function
 * @returns {void}
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