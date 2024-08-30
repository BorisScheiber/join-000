/**
 * Deletes a contact by ID, removes it from associated tasks, and updates the contact list.
 * 
 * @async
 * @function
 * @param {string} contactId - The ID of the contact to delete.
 * @throws {Error} Throws an error if deleting the contact or updating tasks fails.
 */
async function deleteContactAndUpdateTasks(contactId) {
    try {
        await removeData(`contacts/${contactId}`);
        await removeContactFromTasks(contactId);
        contacts = contacts.filter(contact => contact.id !== contactId);
        renderContactList();
        location.reload();
    } catch (error) {
        console.error('Error deleting contact and updating tasks:', error);
    }
}
/////////////////////////////////////BORIS////////////////////////////////////////

/**
 * Opens the delete confirmation popup for a specific contact.
 * 
 * This function generates the HTML content for the delete confirmation popup
 * by calling `openDeletePopUpHtml` and inserts it into the popup container.
 * It then makes the popup visible by removing the 'd-none-important' class.
 * 
 * @param {string} contactId - The ID of the contact to be deleted.
 */
function openDeletePopUp(contactId) {
    let deletePopUp = document.getElementById('deletePopUp');
    deletePopUp.innerHTML = "";
    deletePopUp.innerHTML = openDeletePopUpHtml(contactId);
    deletePopUp.classList.remove('d-none-important'); 
}


/**
 * Closes the delete confirmation popup.
 * 
 * This function hides the delete confirmation popup, which is 
 * displayed when the user is asked to confirm the deletion of a contact.
 */
function closeDeletePopUp() {
    let deletePopUp = document.getElementById('deletePopUp');
    deletePopUp.classList.add('d-none-important'); 
}

/////////////////////////////////////BORIS END////////////////////////////////////////

/**
 * Removes a contact from all tasks where it is assigned.
 * Updates the tasks data in the database to reflect the removal.
 * 
 * @async
 * @function
 * @param {string} contactId - The ID of the contact to remove from tasks.
 * @throws {Error} Throws an error if removing the contact from tasks fails.
 */
async function removeContactFromTasks(contactId) {
    try {
        const tasks = await getData('tasks');
        if (!tasks) return;
        const updatedTasks = {};
        for (const [taskId, task] of Object.entries(tasks)) {
            let assignedTo = task.Assigned_to || {};
            if (Array.isArray(assignedTo)) {
                assignedTo = assignedTo.filter(contact => contact.id !== contactId);
            } 
            else if (typeof assignedTo === 'object') {
                assignedTo = Object.fromEntries(
                    Object.entries(assignedTo).filter(([key, contact]) => contact.id !== contactId)
                );
            }
            updatedTasks[taskId] = {
                ...task,
                Assigned_to: assignedTo
            };
        }
        await putData('tasks', updatedTasks);
    } catch (error) {
        console.error('Error removing contact from tasks:', error);
    }
}


/**
 * Handles the deletion of a contact by delegating the task to `deleteContactAndUpdateTasks`.
 * 
 * @async
 * @function
 * @param {string} contactId - The ID of the contact to delete.
 */
async function handleDeleteContact(contactId) {
    await deleteContactAndUpdateTasks(contactId);
}

