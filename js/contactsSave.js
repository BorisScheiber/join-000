/**
 * Creates a new contact, saves it to the database, and updates the contact list.
 * Displays a success message and reloads the contact list.
 * 
 * @async
 * @function
 */
async function createNewContact() {
    const name = document.getElementById('newContactName').value;
    const email = document.getElementById('newContactEmail').value;
    const phone = document.getElementById('newContactPhone').value;
    clearErrorMessages();
    if (validateContactInputs(name, email, phone)) {
        const contactId = generateRandomId();
        const newContact = createContactObject(name, email, phone, contactId);
        try {
            await saveDataToFirebase(contactId, newContact);
            updateContactList(newContact);
            closeNewContact();
            successfullCreationContact();
            await loadContacts();
        } catch (error) {
            console.error('Error creating new contact:', error);
        }
    }
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
    if (!validateContactInputs(name, email, phone)) {
        console.error('Please fix the errors before saving.');
        return;
    }
    const contactData = createContactData();
    try {
        await updateContactInDatabase(originalContactId, contactData);
        updateContactList(originalContactId, contactData);
        closeEditContact();
        location.reload();
    } catch (error) {
        console.error('Error saving contact:', error);
    }
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