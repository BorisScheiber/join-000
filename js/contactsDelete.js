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
        // Remove contact data from the database
        await removeData(`contacts/${contactId}`);
        // Remove contact from tasks
        await removeContactFromTasks(contactId);
        // Update local contacts list
        contacts = contacts.filter(contact => contact.id !== contactId);
        // Render updated contact list
        renderContactList();
        // Reload the page to reflect changes
        location.reload();
    } catch (error) {
        console.error('Error deleting contact and updating tasks:', error);
    }
}

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
        // Retrieve current tasks data
        const tasks = await getData('tasks');
        if (!tasks) return;
        // Create a new object to store updated tasks
        const updatedTasks = {};
        // Iterate over all tasks to remove the contact from assignments
        for (const [taskId, task] of Object.entries(tasks)) {
            let assignedTo = task.Assigned_to || {};
            // Filter out the contact from assignedTo if it's an array
            if (Array.isArray(assignedTo)) {
                assignedTo = assignedTo.filter(contact => contact.id !== contactId);
            } 
            // Remove the contact if it's assigned as an object
            else if (typeof assignedTo === 'object') {
                assignedTo = Object.fromEntries(
                    Object.entries(assignedTo).filter(([key, contact]) => contact.id !== contactId)
                );
            }
            // Update the task with the new assignments
            updatedTasks[taskId] = {
                ...task,
                Assigned_to: assignedTo
            };
        }
        // Save the updated tasks data back to the database
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