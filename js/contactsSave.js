/**
 * Handles the process of adding a new contact.
 * This function collects input data for a new contact, validates the inputs,
 * and then calls the `createNewContact` function if all inputs are valid.
 * The email address is converted to lowercase.
 * If the inputs are invalid, an error message is logged to the console.
 * @returns {void}
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
 * @function getInputValues
 * @returns {Object} An object containing the name, email, and phone values.
 */
function getInputValues() {
    const email = document.getElementById('newContactEmail').value.toLowerCase();
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
 * Checks if the provided email address is a duplicate and updates the UI accordingly.
 * This function checks whether the given email address already exists by calling
 * the `isEmailDuplicate` function. If the email is a duplicate, it sets an error message
 * and adds an error class to the email input field. If the email is not a duplicate, it removes
 * the error class from the input field. The function returns a boolean indicating if an error was found.
 * @param {string} email - The email address to check for duplicates.
 * @returns {boolean} Returns `true` if the email address is a duplicate and `false` otherwise.
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
 * Processes the creation of a new contact.
 * This function generates a unique ID for the new contact, creates a contact object,
 * and then performs the following operations:
 * - Saves the contact data to Firebase.
 * - Updates the contact list.
 * - Closes the new contact form.
 * - Displays a success message to the user.
 * - Loads the updated contact list from the server.
 * @param {string} name - The name of the new contact.
 * @param {string} email - The email address of the new contact.
 * @param {string} phone - The phone number of the new contact.
 * @returns {Promise<void>} A promise that resolves when all asynchronous operations are completed.
 */
async function processNewContact(name, email, phone) {
    const contactId = generateRandomId();
    const newContact = createContactObject(name, email.toLowerCase(), phone, contactId);
    await saveDataToFirebase(contactId, newContact);
    updateContactList(newContact);
    closeNewContact();
    successfullCreationContact();
    await loadContacts();
}


/**
 * Checks if the provided email address is already in use by another contact.
 * @function isEmailDuplicate
 * @param {string} email - The email address to check.
 * @returns {boolean} True if the email address is already in use, otherwise false.
 */
function isEmailDuplicate(email) {
    return contacts.some(contact => contact.email === email);
}


/**
 * Generates a unique identifier (UUID) for a contact.
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
 * Displays a success message to the user and reloads the page after the animation.
 * This function shows a success overlay with an animation indicating that the contact was created successfully.
 * It first animates the overlay and then animates it out before hiding it. After the animation completes, the page is reloaded.
 * The function returns a promise that resolves once the animation is finished and the page is reloaded.
 * @returns {Promise<void>} A promise that resolves when the animation is complete and the page is reloaded.
 */
function successfullCreationContact() {
    return new Promise((resolve) => {
        let overlay = document.getElementById('createContactSuccessfull');
        let container = overlay.querySelector('.create-contact-successfull-container');
        overlay.style.display = 'flex';
        container.style.animation = 'slideInFromRight 0.4s forwards';
        setTimeout(() => {
            container.style.animation = 'slideOutToRight 0.4s forwards';
            setTimeout(() => {
                overlay.style.display = 'none';
                container.style.animation = '';
                resolve();
                location.reload();
            }, 400);
        }, 1500);
    });
}


/**
 * Saves the edited contact details after validating inputs and checking for duplicate email addresses.
 * If the email is a duplicate or inputs are invalid, the process will be halted.
 * This function:
 * 1. Retrieves the contact details from input fields.
 * 2. Validates the inputs.
 * 3. Checks for duplicate email addresses.
 * 4. Updates the contact in the database and tasks if no errors are found.
 * 5. Reloads the page after successful update.
 * @returns {void}
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
 * @async
 * @function
 * @param {Object} updatedTasks - The tasks to save.
 */
async function saveUpdatedTasks(updatedTasks) {
    await putData('tasks', updatedTasks);
}


/**
 * Retrieves the ID of the contact currently being edited from the DOM.
 * @function
 * @returns {string} The ID of the contact being edited.
 */
function getOriginalContactId() {
    return document.getElementById('editContact').dataset.originalContactId;
}


/**
 * Creates a contact data object from the values in the edit contact form.
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