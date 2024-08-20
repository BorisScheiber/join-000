/**
 * Opens the task details popup for a given task ID.
 * Fetches the task data from Firebase and populates the popup with the task details.
 * 
 * @param {string} taskId - The ID of the task to display in the popup.
 */
async function openTaskDetails(taskId) {
    const task = await getTaskById(taskId);
    if (!task) {
        console.error('Task not found!');
        return;
    }

    // Log task details after it is fetched
    console.log('Fetched task:', task);
    console.log('Assigned_to data:', task.Assigned_to);

    // Call the function to generate the HTML content
    const popupHTML = generateTaskDetailsPopupHTML(task);

    // Get the popup element and set its content
    let popup = document.getElementById('taskDetailsPopup');
    popup.innerHTML = popupHTML;

    // Show the popup
    popup.style.display = 'flex';
    popup.classList.add('show');
    popup.classList.remove('hidden');
}


/**
 * Checks the category of a task and returns the corresponding CSS class for styling.
 * 
 * @param {string} category - The category of the task.
 * @returns {string} The CSS class for the task category.
 */
function checkSingleTaskCategoryPopup(category) {
    if (category === 'Technical Task') {
        return 'technical-task';
    } else if (category === 'User Story') {
        return 'user-story';
    } else {
        return ''; // Default class if needed
    }
}


/**
 * Returns the HTML for the priority icon based on the given priority level.
 * 
 * @param {string} priority - The priority level of the task.
 * @returns {string} The HTML string for the priority icon.
 */
function getPriorityIcon(priority) {
    switch (priority?.toLowerCase()) {
        case 'urgent':
            return `<p>Urgent</p><img src="./assets/icons/priorityUrgent.svg" alt="Urgent Priority">`;
        case 'medium':
            return `<p>Medium</p><img src="./assets/icons/priorityMedium.svg" alt="Medium Priority">`;
        case 'low':
            return `<p>Low</p><img src="./assets/icons/priorityLow.svg" alt="Low Priority">`;
        default:
            return ''; // Or a default icon
    }
}


/**
 * Generates the HTML for displaying the assigned contacts for a task.
 * If there are no assigned contacts, it returns a message indicating that.
 * 
 * @param {Object} contacts - An object containing the assigned contacts for the task.
 * @returns {string} The HTML string for displaying the assigned contacts.
 */
function displayAssignedContacts(contacts) {
    if (!contacts || Object.keys(contacts).length === 0) {
        return '<p class="no-assigned">No one.</p>'; // Return a paragraph if no contacts
    }
    let html = '';
    for (const contactId in contacts) {
        const contact = contacts[contactId];
        const initials = contact.name.split(' ').map(part => part.charAt(0)).join('');

        html += /*html*/ `
        <div class="contact-item-assigned">
          <div class="contact-logo" style="background-color: ${contact.color}">${initials}</div>
          <span>${contact.name}</span>
        </div>
      `;
    }
    return html;
}


/**
 * Toggles the checked state of a subtask in the task details popup and updates the task in Firebase.
 * Also updates the subtask list in the popup and refreshes the main board to reflect the changes.
 * 
 * @param {string} subtaskId - The ID of the subtask to toggle.
 */
// async function toggleSubtaskCheck(subtaskId) {
//     const taskId = document.querySelector('.task-details-content').dataset.taskId;
//     const task = await getTaskById(taskId);
//     if (!task) {
//         console.error('Task not found!');
//         return;
//     }
//     task.Subtasks[subtaskId].isChecked = !task.Subtasks[subtaskId].isChecked;
//     await putData(`tasks/${task.firebaseId}`, task);
//     displaySubtasks(task.Subtasks); // Update popup
//     renderBoard(); // Update the main board 
// }


/**
 * Generates the HTML for displaying the subtasks of a task in the popup.
 * If there are no subtasks, it returns a message indicating that.
 * 
 * @param {Object} subtasks - An object containing the subtasks for the task.
 * @returns {string} The HTML string for displaying the subtasks.
 */
function displaySubtasks(subtasks) {
    if (!subtasks || Object.keys(subtasks).length === 0) {
        return '<p>You don`t have any subtasks .</p>';
    }
    let html = '';
    for (const subtaskId in subtasks) {
        const subtask = subtasks[subtaskId];
        const checkboxImg = subtask.isChecked ? './assets/icons/checkedBox.svg' : './assets/icons/uncheckedBox.svg';
        html += /*html*/ `
            <div class="subtask-item-popup ${subtask.isChecked ? 'checked' : ''}" data-subtask-id="${subtaskId}">
                <div class="subtask-checkbox" onclick="toggleSubtaskCheck('${subtaskId}');"> 
                    <img src="${checkboxImg}" alt="" id="checkbox-img-${subtaskId}">
                </div>
                <span>${subtask.description}</span> 
            </div>
        `;
    }
    return html;
}


/**
 * Toggles the checked state of a subtask in the task details popup and updates the task in Firebase.
 * Also updates the subtask list in the popup and refreshes the main board to reflect the changes.
 * 
 * @param {string} subtaskId - The ID of the subtask to toggle.
 */
async function toggleSubtaskCheck(subtaskId) {
    const taskId = document.querySelector('.task-details-content').dataset.taskId;
    const task = await getTaskById(taskId);
    if (!task) {
        console.error('Task not found!');
        return;
    }
    task.Subtasks[subtaskId].isChecked = !task.Subtasks[subtaskId].isChecked;

    // Update the checkbox image immediately
    const checkboxImg = document.getElementById(`checkbox-img-${subtaskId}`);
    checkboxImg.src = task.Subtasks[subtaskId].isChecked ? './assets/icons/checkedBox.svg' : './assets/icons/uncheckedBox.svg';

    await putData(`tasks/${task.firebaseId}`, task);
    await updateBoard();
}


/**
 * Toggles the checkbox image between checked and unchecked states.
 * 
 * @param {HTMLElement} checkboxDiv - The div element containing the checkbox image.
 */
function toggleCheckboxImage(checkboxDiv) {
    const img = checkboxDiv.querySelector('img');
    img.src = img.src.includes('checkedBox.svg') ? './assets/icons/uncheckedBox.svg' : './assets/icons/checkedBox.svg';
}


/**
 * Fetches a task from Firebase based on its ID.
 * 
 * @param {number} taskId - The ID of the task to fetch.
 * @returns {Promise<Object|null>} A promise that resolves with the task object if found, or null if not found.
 */
async function getTaskById(taskId) {
    try {
        const allTasks = await getData('tasks');
        console.log('All Tasks:', allTasks); // Log all tasks
        for (const firebaseId in allTasks) {
            if (allTasks[firebaseId].id === parseInt(taskId)) {
                return {
                    firebaseId,
                    ...allTasks[firebaseId]
                };
            }
        }
        console.warn(`Task with ID ${taskId} not found.`);
        return null;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return null;
    }
}


/**
 * Closes the task details popup with a smooth animation.
 */
function closeTaskDetailsPopup() {
    let popup = document.getElementById('taskDetailsPopup');
    popup.classList.add('hidden');
    popup.classList.remove('show');
    setTimeout(() => {
        popup.style.display = 'none';
    }, 400);
}


/**
 * Deletes a task from Firebase after confirming with the user.
 * 
 * @param {string} taskId - The Firebase ID of the task to delete.
 */
async function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        try {
            await deleteData(`tasks/${taskId}`);
            // Update the UI or reload the page as needed
            closeTaskDetailsPopup();
            location.reload(); // This will reload the entire page
        } catch (error) {
            console.error("Error deleting task:", error);
            // Handle the error appropriately, e.g., show an error message to the user
        }
    }
}


// Event listener for clicking outside the popup to close it
window.addEventListener('click', (event) => {
    const popup = document.getElementById('taskDetailsPopup');
    if (event.target === popup) {
        closeTaskDetailsPopup();
    }
});








async function editTask(taskId) {
    let showEditTask = document.getElementById('editTaskPopup');
    showEditTask.classList.remove('edit-d-none');
    try {
        currentTaskId = taskId;

        const task = await getTaskIdForEdit(taskId);
        if (!task) {
            console.error('Task not found!');
            return;
        }

        document.getElementById('edit-title').value = task.Title;
        document.getElementById('edit-description').value = task.Description;
        document.getElementById('edit-due-date').value = task.Due_date;
        setEditPriority(task.Prio);

        // Kontakte in das Dropdown und das Zuweisungsfeld laden
        populateAssignedContactsEdit(contacts);

        document.getElementById('editTaskPopup').style.display = 'flex';
        document.getElementById('editTaskPopup').classList.add('show');
        document.getElementById('editTaskPopup').classList.remove('hidden');

    } catch (error) {
        console.error('Error editing task:', error);
    }
    closeTaskDetailsPopup();
}

function setEditPriority(priority) {
    document.querySelectorAll('.priority-button').forEach(button => {
        button.classList.remove('selected'); // Remove selected state from all buttons
    });

    const priorityButton = document.getElementById(`edit-${priority}-button`);
    if (priorityButton) {
        priorityButton.classList.add('selected'); // Add selected state to the chosen button
    }
}

function populateAssignedContactsEdit(contacts) {
    // Clear previous contacts
    const selectedContactsContainer = document.getElementById('selected-contacts-container');
    selectedContactsContainer.innerHTML = '';

    if (contacts) {
        for (const contactId in contacts) {
            const contact = contacts[contactId];
            const contactDiv = document.createElement('div');
            contactDiv.classList.add('selected-contact');
            contactDiv.textContent = contact.name;
            selectedContactsContainer.appendChild(contactDiv);
        }
    }
}

function displayEditSubtasks(subtasks) {
    const subtaskContainer = document.getElementById('subtask-container');
    subtaskContainer.innerHTML = '';

    if (subtasks) {
        for (const subtaskId in subtasks) {
            const subtask = subtasks[subtaskId];
            const subtaskDiv = document.createElement('div');
            subtaskDiv.classList.add('subtask-item');
            subtaskDiv.innerHTML = `
                <input type="checkbox" ${subtask.isChecked ? 'checked' : ''} id="edit-subtask-${subtaskId}">
                <label for="edit-subtask-${subtaskId}">${subtask.description}</label>
            `;
            subtaskContainer.appendChild(subtaskDiv);
        }
    }
}

async function saveTask() {
    const taskTimestamp = document.querySelector('.task-details-content').dataset.taskTimestamp; // Verwende taskTimestamp

    const updatedTask = {
        Title: document.getElementById('edit-title').value,
        Description: document.getElementById('edit-description').value,
        Due_date: document.getElementById('edit-due-date').value,
        Prio: document.querySelector('.priority-button.selected').id.replace('edit-', '').replace('-button', ''),
        Assigned_to: getAssignedContactsFromUI(), // Implementiere diese Funktion basierend auf deiner Auswahl
        Subtasks: getSubtasksFromUI() // Implementiere diese Funktion basierend auf deiner Unteraufgaben-UI
    };

    try {
        // Update die Aufgabe mit dem timestamp als Pfad
        await putData(`tasks/${taskTimestamp}`, updatedTask);
        closeEditTaskPopup();
        renderBoard(); // Aktualisiere das Board, um die Änderungen widerzuspiegeln
    } catch (error) {
        console.error("Error saving task:", error);
        // Behandle den Fehler entsprechend
    }
}

function getAssignedContactsFromUI() {
    // Implement this function based on your selected contacts UI
    return {};
}

function getSubtasksFromUI() {
    // Implement this function based on your subtasks UI
    return {};
}

function closeEditTaskPopup() {
    let popup = document.getElementById('editTaskPopup');
    popup.classList.add('hidden');
    popup.classList.remove('show');
    setTimeout(() => {
        popup.style.display = 'none';
    }, 400);
}

let currentTaskId = null;

async function getTaskIdForEdit(taskId) {
    try {
        const allTasks = await getData('tasks');
        for (const firebaseId in allTasks) {
            if (firebaseId === taskId) {
                return {
                    firebaseId,
                    ...allTasks[firebaseId]
                };
            }
        }
        console.warn(`Task with ID ${taskId} not found.`);
        return null;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return null;
    }
}

