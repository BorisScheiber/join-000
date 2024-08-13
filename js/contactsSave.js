// function to save a new contact. The contact list is updated in this function

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
            updateContactList(contactId, newContact);
            closeNewContact();
            successfullCreationContact();
            setTimeout(() => {
                location.reload(); 
            }, 2000);
        } catch (error) {
            console.error('Error creating new contact:', error);
        }
    }
}

// function to generate a unique ID for each individual contact

function generateRandomId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// function for calling a pop-up after a contact has been successfully created

function successfullCreationContact(){
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

// function for oversaving an existing contact. the contact list is updated

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

// help function for retrieving an existing contact

function getOriginalContactId(){
    return document.getElementById('editContact').dataset.originalContactId;
}

// help function for retrieving contacts - new and existing 

function createContactData() {
    return {
        id: getOriginalContactId(),
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactMailAdress').value,
        phone: document.getElementById('contactPhone').value,
        color: getRandomColor()
    };
}

// function for updating a contact in the database

async function updateContactInDatabase(originalContactId, contactData) {
    await saveDataToFirebase(originalContactId, contactData);
}

// help function for retrieving an existing contact

function updateExistingContact(id, contactData) {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
        contacts[index] = { id, ...contactData };
    } else {
        console.error('Contact not found for update.');
    }
}