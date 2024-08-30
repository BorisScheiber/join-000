/**
 * Handles the addition of a new contact by validating inputs and processing the contact creation.
 * 
 * @function handleAddNewContact
 */
function handleAddNewContact() {
    const name = document.getElementById('newContactName').value;
    let email = document.getElementById('newContactEmail').value;
    const phone = document.getElementById('newContactPhone').value;
    const isValid = validateContactInputs(name, email, phone, 'new');
    if (!isValid) {
        console.error('Please fix the errors before saving.');
        return;
    }
    email = email.toLowerCase();
    console.log('Lowercased Email in handleAddNewContact:', email);
    createNewContact(name, email, phone);
}


/**
 * Creates a new contact by validating the input values, checking for duplicates,
 * and then processing the new contact creation.
 * This function retrieves the input values for the contact, clears any existing error messages,
 * checks if the provided email or phone number already exists, validates the inputs,
 * and processes the new contact creation if all validations pass.
 * @async
 * @function
 * @throws {Error} Throws an error if the contact creation fails during processing.
 */
async function createNewContact() {
    const { name, email, phone } = getInputValues();
    clearErrorMessages();
    if (checkForDuplicates(email, phone)) return;
    if (validateContactInputs(name, email, phone, 'new')) {
        try {
            await processNewContact(name, email, phone);
        } catch (error) {
            console.error('Error creating new contact:', error);
        }
    }
}


/**
 * Retrieves the input values for the new contact from the form fields.
 * 
 * @function getInputValues
 * @returns {Object} An object containing the name, email, and phone values.
 */
function getInputValues() {
    const email = document.getElementById('newContactEmail').value.toLowerCase();
    console.log('Lowercased Email in getInputValues:', email);
    return {
        name: document.getElementById('newContactName').value,
        email: email,
        phone: document.getElementById('newContactPhone').value
    };
}


/**
 * Initializes the event listeners once the DOM content is fully loaded.
 * This ensures that the form submission handler is attached only after the
 * HTML elements are available in the DOM.
 * @function
 * @param {Event} event - The event object representing the DOMContentLoaded event.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('addNewContactForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            handleAddNewContact();
        });
    }
});


/**
 * Checks if the provided email is a duplicate and sets an error message if it is.
 * If a duplicate is found, the 'input-error' class is added to the email input field.
 * If no duplicate is found, the 'input-error' class is removed.
 * 
 * @function
 * @param {string} email - The email address to check for duplicates.
 * @returns {boolean} True if a duplicate is found, otherwise false.
 */
function checkForDuplicates(email) {
    let hasError = false;
    const emailInputField = document.getElementById('newContactEmail');
    if (isEmailDuplicate(email)) {
        setErrorMessage('emailError', 'This email address is already taken.');
        if (emailInputField) {
            emailInputField.classList.add('input-error');
        }
        hasError = true;
    } else {
        if (emailInputField) {
            emailInputField.classList.remove('input-error');
        }
    }
    return hasError;
}


/**
 * Processes the creation of a new contact by generating an ID, creating a contact object,
 * saving it to Firebase, updating the contact list, and closing the form.
 * 
 * @async
 * @function processNewContact
 * @param {string} name - The name of the new contact.
 * @param {string} email - The email address of the new contact.
 * @param {string} phone - The phone number of the new contact.
 */
async function processNewContact(name, email, phone) {
    const contactId = generateRandomId();
    const newContact = createContactObject(name, email.toLowerCase(), phone, contactId);
    console.log('Lowercased Email in processNewContact:', newContact.email);
    await saveDataToFirebase(contactId, newContact);
    updateContactList(newContact);
    closeNewContact();
    successfullCreationContact();
    await loadContacts();
}


/**
 * Checks if the provided email address is already in use by another contact.
 * 
 * @function isEmailDuplicate
 * @param {string} email - The email address to check.
 * @returns {boolean} True if the email address is already in use, otherwise false.
 */
function isEmailDuplicate(email) {
    return contacts.some(contact => contact.email === email);
}


/**
 * Checks if the provided phone number is already in use by another contact.
 * 
 * @function isPhoneDuplicate
 * @param {string} phone - The phone number to check.
 * @returns {boolean} True if the phone number is already in use, otherwise false.
 */
function isPhoneDuplicate(phone) {
    return contacts.some(contact => contact.phone === phone);
}


/**
 * Generates a unique identifier (UUID) for a contact.
 * 
 * @function
 * @returns {string} A unique ID string in the format 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
 */
function generateRandomId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/**
 * Displays a success message pop-up when a new contact is successfully created.
 * 
 * @function
 */
function successfullCreationContact() {
    let overlay = document.getElementById('createContactSuccessfull');
    let container = overlay.querySelector('.create-contact-successfull-container');
    overlay.style.display = 'flex';
    container.style.animation = 'slideInFromRight 0.4s forwards';
    setTimeout(() => {
        container.style.animation = 'slideOutToRight 0.4s forwards';
        setTimeout(() => {
            overlay.style.display = 'none';
            container.style.animation = '';
        }, 400);
    }, 1500);
}


/**
 * Saves the edited contact information to the database, updates the contact list,
 * and refreshes the page to reflect the changes.
 * This function retrieves the values from the input fields, validates them, and
 * performs the following actions:
 * 1. Validates the input values.
 * 2. Retrieves the original contact ID.
 * 3. Creates the contact data object.
 * 4. Updates the contact information in the database.
 * 5. Updates the contact information in associated tasks.
 * 6. Updates the contact list in the UI.
 * 7. Closes the edit contact form and reloads the page.
 * @async
 * @function
 * @throws {Error} Throws an error if any issue occurs while saving the contact or updating related data.
 */
async function saveEditingContact() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactMailAdress').value;
    const phone = document.getElementById('contactPhone').value;
    const isValid = validateContactInputs(name, email, phone, 'edit');
    if (!isValid) {
        console.error('Please fix the errors before saving.');
        return;
    }
    const originalContactId = getOriginalContactId();
    if (!originalContactId) {
        console.error('Original Contact ID is undefined.');
        return;
    }
    const contactData = createContactData();
    try {
        await updateContactInDatabase(originalContactId, contactData);
        await updateContactInTasks(originalContactId, contactData);
        updateContactList(originalContactId, contactData);
        closeEditContact();
        location.reload();
    } catch (error) {
        console.error('Error saving contact:', error);
    }
}


/**
 * Updates the assigned contacts in all tasks based on the updated contact data.
 *
 * @async
 * @function
 * @param {string} contactId - The ID of the contact to update.
 * @param {Object} updatedContactData - The updated contact data.
 */
async function updateContactInTasks(contactId, updatedContactData) {
    try {
        const tasks = await getData('tasks');
        if (!tasks) return;

        const updatedTasks = processTasks(tasks, contactId, updatedContactData);

        await saveUpdatedTasks(updatedTasks);
    } catch (error) {
        console.error('Error updating contact in tasks:', error);
    }
}


/**
 * Processes tasks to update the assigned contact information.
 *
 * @function
 * @param {Object} tasks - The tasks to process.
 * @param {string} contactId - The ID of the contact to update.
 * @param {Object} updatedContactData - The updated contact data.
 * @returns {Object} The tasks with updated assigned contact information.
 */
function processTasks(tasks, contactId, updatedContactData) {
    const updatedTasks = {};

    for (const [taskId, task] of Object.entries(tasks)) {
        const updatedAssignedTo = updateAssignedTo(task.Assigned_to, contactId, updatedContactData);

        updatedTasks[taskId] = {
            ...task,
            Assigned_to: updatedAssignedTo
        };
    }
    return updatedTasks;
}


/**
 * Updates the assigned contact information in a task.
 *
 * @function
 * @param {Object|Array} assignedTo - The current assigned contacts.
 * @param {string} contactId - The ID of the contact to update.
 * @param {Object} updatedContactData - The updated contact data.
 * @returns {Object|Array} The updated assigned contacts.
 */
function updateAssignedTo(assignedTo, contactId, updatedContactData) {
    if (Array.isArray(assignedTo)) {
        return assignedTo.map(contact =>
            contact.id === contactId ? { ...contact, ...updatedContactData } : contact
        );
    } else if (typeof assignedTo === 'object') {
        return Object.fromEntries(
            Object.entries(assignedTo).map(([key, contact]) =>
                contact.id === contactId ? [key, { ...contact, ...updatedContactData }] : [key, contact]
            )
        );
    }
    return assignedTo;
}


/**
 * Saves the updated tasks to the database.
 *
 * @async
 * @function
 * @param {Object} updatedTasks - The tasks to save.
 */
async function saveUpdatedTasks(updatedTasks) {
    await putData('tasks', updatedTasks);
}


/**
 * Retrieves the ID of the contact currently being edited from the DOM.
 * 
 * @function
 * @returns {string} The ID of the contact being edited.
 */
function getOriginalContactId() {
    return document.getElementById('editContact').dataset.originalContactId;
}


/**
 * Creates a contact data object from the values in the edit contact form.
 * 
 * @function
 * @returns {Object} An object containing the contact data with id, name, email, phone, and color properties.
 */
function createContactData() {
    return {
        id: getOriginalContactId(),
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactMailAdress').value,
        phone: document.getElementById('contactPhone').value,
        color: getRandomColor()
    };
}


/**
 * Updates a contact in the database with the given contact data.
 * 
 * @async
 * @function
 * @param {string} originalContactId - The ID of the contact to update.
 * @param {Object} contactData - The data to update the contact with.
 */
async function updateContactInDatabase(originalContactId, contactData) {
    await saveDataToFirebase(originalContactId, contactData);
}


/**
 * Updates an existing contact in the contact list.
 * If the contact with the specified ID exists, it is updated with the new data.
 * 
 * @function
 * @param {string} id - The ID of the contact to update.
 * @param {Object} contactData - The new data for the contact.
 */
function updateExistingContact(id, contactData) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        contacts[index] = { id, ...contactData };
    }
}