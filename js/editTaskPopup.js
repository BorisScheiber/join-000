/**
 * Edits the task details within a popup.
 * 
 * @param {string} taskId - The ID of the task to edit.
 */
async function editTask(taskId) {
    const task = await fetchTaskData(taskId);
    if (!task) return;

    clearPopupContent();
    renderEditPopup(task);
    populateEditForm(task);
    selectedContactsDataEdit = { ...task.Assigned_to };

    await populateContactList(task);
    setupContactListListeners();
    setupSubtaskInputListener();
    setupEditFormListeners();
}


/**
 * Fetches the task data from Firebase.
 * 
 * @param {string} taskId - The ID of the task to fetch.
 * @returns {Promise<Object|null>} A promise that resolves with the task object if found, otherwise null.
 */
async function fetchTaskData(taskId) {
    const task = await getTaskByIdToEdit(taskId);
    if (!task) {
        console.error('Task not found!');
        return null;
    }
    return task;
}


/**
 * Clears the existing content of the task details popup.
 */
function clearPopupContent() {
    document.getElementById('taskDetailsPopup').innerHTML = '';
}


/**
 * Renders the edit task popup with the task data.
 * 
 * @param {Object} task - The task object containing the task details.
 */
function renderEditPopup(task) {
    const editTaskPopupHTML = `
        <div id="editTaskDetailsPopup" class="task-details-content" 
             data-task-id="${task.id}" 
             data-firebase-id="${task.firebaseId}"> 
            <img src="./assets/icons/close-contact.svg" alt="Close" class="close-popup-edit-button" onclick="closeTaskDetailsPopup()">
            ${generateEditTaskFormHTML(task)}
        </div>
    `;
    document.getElementById('taskDetailsPopup').innerHTML = editTaskPopupHTML;
}


/**
 * Populates the edit task form with the existing task data.
 * 
 * @param {Object} task - The task object containing the task details.
 */
function populateEditForm(task) {
    document.getElementById('editTitle').value = task.Title;
    document.getElementById('editDescription').value = task.Description;
    document.getElementById('editDueDate').value = task.Due_date;
    setPrio(task.Prio); 
}


/**
 * Populates the contact list in the edit popup with contacts from Firebase.
 * 
 * @param {Object} task - The task object containing the assigned contacts.
 */
async function populateContactList(task) {
    const contactList = document.getElementById("contact-list-edit");
    try {
        const contactsData = await getData("contacts");
        if (contactsData) {
            const firebaseContacts = Object.values(contactsData);
            const assignedContacts = task.Assigned_to && typeof task.Assigned_to === 'object'
                ? Object.values(task.Assigned_to)
                : []; 
            firebaseContacts.forEach(contact =>
                createContactItemEdit(contact, contactList, assignedContacts)
            );
            updateSelectedContactsEdit();
        } else {
            console.log("No contacts found in Firebase.");
        }
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
}


/**
 * Sets up event listeners for the contact list elements in the edit popup.
 */
function setupContactListListeners() {
    const contactSearch = document.getElementById("contact-search-edit");
    contactSearch.addEventListener("input", filterContactsEdit);

    document.getElementById("contact-list-edit").addEventListener("click", (event) => {
        const contactItem = event.target.closest(".contact-item");
        if (contactItem) {
            const checkbox = contactItem.querySelector(".contact-checkbox");
            checkbox.classList.toggle("checked");
            contactItem.classList.toggle("checked");
            updateSelectedContactsEdit();
        }
    });

    document.querySelectorAll(".contact-checkbox").forEach(checkbox => {
        checkbox.addEventListener("click", (event) => {
            checkbox.classList.toggle("checked");
            checkbox.parentElement.classList.toggle("checked");
            updateSelectedContacts();
        });
    });

    const contactListEdit = document.getElementById("contact-list-edit");
    contactListEdit.addEventListener("click", handleContactCheckboxClickEdit);
}


/**
 * Sets up the event listener for the subtask input field in the edit popup.
 */
function setupSubtaskInputListener() {
    document.getElementById('subtask-input-edit').addEventListener('keydown', (event) => {
        handleEnterKey(event, addSubtaskEditTask);
    });
}


/**
 * Sets up event listeners for the edit form elements in the edit popup.
 */
function setupEditFormListeners() {
    document.addEventListener('DOMContentLoaded', (event) => {
        const editForm = document.getElementById('editForm');
        if (editForm) { 
            editForm.addEventListener('input', (event) => {
                if (event.target.matches('#editTitle, #editDescription, #editDueDate')) {
                    handleInputEdit(event);
                }
            });
        } else {
            console.error("Element with ID 'editForm' not found!");
        }
    });
}


/**
 * Sets the priority level for the task.
 *
 * @param {string} level - The priority level ('urgent', 'medium', or 'low').
 */
function setPrio(level) {
    const buttons = document.querySelectorAll('.prio-btn');
    // Reset all buttons first
    buttons.forEach(button => resetBtnsStyles(button));
    // Set the styles for the clicked button
    const activeButton = document.getElementById(`${level}-btn`);
    activeButton.classList.add(level); // Add the level as a class for styling
    activeButton.querySelector('img').src = `./assets/icons/${level}White.svg`;
    // Remove hover effect from the selected button
    activeButton.classList.add('selected');
    // Update the current priority
    currentPriority = level;
}


/**
 * Resets the styles of a priority button to their default state.
 *
 * @param {HTMLElement} button - The priority button to reset.
 */
function resetBtnsStyles(button) {
    button.classList.remove('selected'); // Remove the class when resetting
    button.classList.remove('urgent', 'medium', 'low'); // Remove all priority classes

    const img = button.querySelector('img');
    switch (button.id) {
        case 'urgent-btn':
            img.src = './assets/icons/urgent.svg';
            break;
        case 'medium-btn':
            img.src = './assets/icons/medium.svg';
            break;
        case 'low-btn':
            img.src = './assets/icons/low.svg';
            break;
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    document.body.addEventListener('submit', function (event) {
        if (event.target.id === 'editForm') {
            event.preventDefault();
            // Your form submission logic here
        }
    });
});


/**
 * Populates the edit task form with the existing task data.
 * 
 * @param {Object} task - The task object containing the task details.
 */
function populateEditForm(task) {
    document.getElementById('editTitle').value = task.Title;
    document.getElementById('editDescription').value = task.Description;
    document.getElementById('editDueDate').value = task.Due_date;
    setPrio(task.Prio); // Assuming you have a function to set the priority

}


/**
 * Saves the edited task details to Firebase.
 * 
 * @param {string} taskId - The ID of the task to update.
 * @param {string} firebaseId - The Firebase ID of the task to update.
 */
async function saveEditTask(taskId, firebaseId) {
    if (!validateFieldsEditTask()) return; 

    const originalTask = await fetchOriginalTask(taskId);
    if (!originalTask) return;

    if (!validateSubtasks(originalTask)) return;

    const updatedTask = createUpdatedTask(originalTask);
    await updateTaskInFirebase(firebaseId, updatedTask);

    closeTaskDetailsPopup();
    updateBoard();
}


/**
 * Fetches the original task data from Firebase.
 * 
 * @param {string} taskId - The ID of the task to fetch.
 * @returns {Promise<Object|null>} A promise that resolves with the task object if found, otherwise null.
 */
async function fetchOriginalTask(taskId) {
    const originalTask = await getTaskByIdToEdit(taskId);
    if (!originalTask) {
        console.error('Task not found!');
        return null;
    }
    return originalTask;
}


/**
 * Validates subtask descriptions to ensure they are not empty.
 * 
 * @param {Object} originalTask - The original task object containing the subtasks.
 * @returns {boolean} True if all subtask descriptions are valid, otherwise false.
 */
function validateSubtasks(originalTask) {
    const subtasks = getSubtasksEditTask(originalTask);
    for (const subtaskId in subtasks) {
        if (subtasks[subtaskId].description.trim() === '') {
            highlightEmptySubtask(subtaskId);
            return false; 
        }
    }
    return true;
}


/**
 * Highlights the input field of an empty subtask with a red border.
 * 
 * @param {string} subtaskId - The ID of the subtask with the empty description.
 */
function highlightEmptySubtask(subtaskId) {
    const subtaskItem = document.querySelector(`.subtask-item[data-subtask-id="${subtaskId}"]`);
    const subtaskInput = subtaskItem.querySelector('.input-field-editing'); 
    subtaskInput.style.borderBottom = '2px solid rgb(255, 129, 144)'; 
    console.log('Error: Subtask description cannot be empty.');
}


/**
 * Creates an updated task object with the edited values.
 * 
 * @param {Object} originalTask - The original task object.
 * @returns {Object} The updated task object.
 */
function createUpdatedTask(originalTask) {
    const updatedTask = { ...originalTask };
    updatedTask.Title = document.getElementById('editTitle').value;
    updatedTask.Description = document.getElementById('editDescription').value;
    updatedTask.Due_date = document.getElementById('editDueDate').value;
    updatedTask.Prio = currentPriority;
    updatedTask.Assigned_to = Object.keys(selectedContactsDataEdit).length > 0 
        ? { ...selectedContactsDataEdit } 
        : {}; 
    updatedTask.Subtasks = getSubtasksEditTask(originalTask);
    return updatedTask;
}


/**
 * Updates the task in Firebase with the edited data.
 * 
 * @param {string} firebaseId - The Firebase ID of the task to update.
 * @param {Object} updatedTask - The updated task object.
 */
async function updateTaskInFirebase(firebaseId, updatedTask) {
    try {
        await putData(`tasks/${firebaseId}`, updatedTask);
        console.log('Task updated successfully!');
    } catch (error) {
        console.error('Error updating task:', error);
    }
}


/**
 * Validates the due date to ensure it's in the correct format (YYYY-MM-DD) and a future date.
 *
 * @param {string} dueDate - The due date string to validate.
 * @returns {string} An error message if the date is invalid, otherwise an empty string.
 */
function validateDueDateEdit(editDueDate) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regular expression for YYYY-MM-DD format
    if (!datePattern.test(editDueDate)) {
        return 'Please enter a valid date in YYYY-MM-DD format.';
    }
    const today = new Date();
    const selectedDate = new Date(editDueDate);

    if (selectedDate <= today) {
        return 'Please enter a future date.';
    }

    return ''; // No error
}


/**
 * Validates the title and due date fields in the edit task form.
 * Highlights invalid fields and displays error messages.
 * 
 * @returns {boolean} True if all fields are valid, otherwise false.
 */
function validateFieldsEditTask() {
    let isValid = true;
    isValid = validateField('editTitle') && isValid;
    isValid = validateDueDateField('editDueDate') && isValid;
    return isValid;
}


/**
 * Validates a single input field in the edit task form.
 * 
 * @param {string} fieldId - The ID of the field to validate.
 * @returns {boolean} True if the field is valid, otherwise false.
 */
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.value.trim() === "") {
        field.style.border = '1px solid rgba(255, 129, 144, 1)';
        showErrorMessage(field, 'This field is required');
        return false;
    }
    field.style.border = '1px solid rgba(41, 171, 226, 1)';
    removeErrorMessage(field);
    return true;
}


/**
 * Validates the due date field in the edit task form.
 * 
 * @param {string} fieldId - The ID of the due date field to validate.
 * @returns {boolean} True if the due date is valid, otherwise false.
 */
function validateDueDateField(fieldId) {
    return validateField(fieldId) && !validateDueDateEdit(document.getElementById(fieldId).value);
}
