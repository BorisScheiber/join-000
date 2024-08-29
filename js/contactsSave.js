/**
 * Creates a new contact by validating the inputs, checking for duplicates,
 * and then saving the contact to Firebase.
 * 
 * @async
 * @function createNewContact
 */
async function createNewContact() {
    const { name, email, phone } = getInputValues();
    clearErrorMessages();
    if (checkForDuplicates(email, phone)) return;
    if (validateContactInputs(name, email, phone)) {
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
    return {
        name: document.getElementById('newContactName').value,
        email: document.getElementById('newContactEmail').value,
        phone: document.getElementById('newContactPhone').value
    };
}


/**
 * Checks if the provided email or phone number already exists in the contacts list.
 * If a duplicate is found, an error message is displayed.
 * 
 * @function checkForDuplicates
 * @param {string} email - The email address to check for duplicates.
 * @param {string} phone - The phone number to check for duplicates.
 * @returns {boolean} True if a duplicate is found, otherwise false.
 */
function checkForDuplicates(email, phone) {
    let hasError = false;
    if (isEmailDuplicate(email)) {
        setErrorMessage('emailError', 'This email address is already in use.');
        hasError = true;
    }
    if (isPhoneDuplicate(phone)) {
        setErrorMessage('phoneError', 'This phone number is already in use.');
        hasError = true;
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
    const newContact = createContactObject(name, email, phone, contactId);
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
 * Saves the edited contact data to the database and updates the contact list.
 * Also updates the contact in all assigned tasks.
 * Refreshes the page to reflect changes.
 * 
 * @async
 * @function
 */
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
    // if (!validateContactInputs(name, email, phone)) {
    //     console.error('Please fix the errors before saving.');
    //     return;
    // }
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