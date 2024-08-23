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
    const task = await getTaskByIdToEdit(taskId);
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
 * Fetches a task from Firebase based on its Firebase document ID.
 * 
 * @param {string} firebaseId - The Firebase document ID of the task to fetch.
 * @returns {Promise<Object|null>} A promise that resolves with the task object if found, or null if not found.
 */
async function getTaskByIdToEdit(firebaseId) {
    try {
        const taskData = await getData(`tasks/${firebaseId}`);
        console.log('Fetched Task:', taskData); // Log the fetched task data
        if (taskData) {
            return {
                firebaseId, // Include firebaseId in the returned object
                ...taskData
            };
        } else {
            console.warn(`Task with ID ${firebaseId} not found.`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching task:', error);
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

















/**
 * Edits the task details within the popup.
 * 
 * @param {string} taskId - The ID of the task to edit.
 */
async function editTask(taskId) {
    const task = await getTaskByIdToEdit(taskId);
    if (!task) {
        console.error('Task not found!');
        return;
    }

    // Clear the existing popup content
    document.getElementById('taskDetailsPopup').innerHTML = '';

    // Create the edit task popup content
    const editTaskPopupHTML = `
         <div id="editTaskDetailsPopup" class="task-details-content" data-task-id="${task.id}">
           
                 <img src="./assets/icons/close-contact.svg" alt="Close" class="close-popup-edit-button" onclick="closeTaskDetailsPopup()">
          
             ${generateEditTaskFormHTML(task)}
         </div>
     `;

    // Append the edit task popup to the main popup container
    document.getElementById('taskDetailsPopup').innerHTML = editTaskPopupHTML;

    // Populate the form fields with existing task data
    populateEditForm(task);
}


/**
 * Generates the HTML for the edit task form.
 * 
 * @param {Object} task - The task object containing the task details.
 * @returns {string} The HTML string for the edit task form.
 */
function generateEditTaskFormHTML(task) {
    // You can reuse the HTML from your existing form (id="recipeForm")
    // and replace the placeholders with the task data using template literals.
    // For example:
    return `
         <form id="editForm" class="add-task-container-popup width-pop-up">
             <div class="popup-content-task">
                 <!-- Title Section -->
                 <div class="input-group">
                     <label for="editTitle">Title<span class="red-color">*</span></label>
                     <input type="text" id="editTitle" class="input-field" required minlength="3" maxlength="50"
                         placeholder="Enter a title" value="${task.Title}">
                 </div>

                 <!-- Description Section -->
                 <div class="input-group">
                     <label for="editDescription">Description</label>
                     <textarea id="editDescription" class="text-area" minlength="10" maxlength="400"
                         placeholder="Enter a description">${task.Description}</textarea>
                 </div>

                 <!-- Assigned to Section -->
                 <div class="assigned-to">
                     <div class="search-container">
                         <input type="text" id="contact-search" class="contact-search"
                             placeholder="Select contacts to assign" oninput="filterContacts()">

                         <button id="toggle-list" class="toggle-list" onclick="toggleContactList()">
                             <img src="./assets/icons/arrow_drop_down.svg" alt="Dropdown Icon"
                                 id="dropdown-assigned" class="dropdown-icon">
                         </button>
                     </div>
                     <div id="contact-list" class="contact-list hidden">
                     </div>
                     <div id="selected-contacts" class="selected-contacts">
                     </div>
                 </div>
       <!-- Due Date Section -->
                 <div class="due-date-section">
                     <div class="input-group">
                         <label for="editDueDate">Due date <span class="required">*</span></label>
                         <input type="text" id="editDueDate" class="input-field" placeholder="dd/mm/yyyy"
                             onfocus="(this.type='date'); this.min = new Date().toISOString().split('T')[0]"
                             onblur="(this.type='text')" required value="${task.Due_date}">
                     </div>
                 </div>

            <!-- Priority Level Section -->
                <div class="priority-section">
                    <div class="input-group">
                        <p>Prio</p>
                        <div class="priority-buttons">
                            <button id="urgent-btn" type="button" class="prio-btn ${task.Prio === 'urgent' ? 'active' : ''}" onclick="setPrio('urgent')">
                                Urgent <img src="./assets/icons/${task.Prio === 'urgent' ? 'urgentWhite' : 'urgent'}.svg" alt="Urgent">
                            </button>
                            <button id="medium-btn" type="button" class="prio-btn ${task.Prio === 'medium' ? 'active' : ''}" onclick="setPrio('medium')">
                                Medium <img src="./assets/icons/${task.Prio === 'medium' ? 'mediumWhite' : 'medium'}.svg" alt="Medium">
                            </button>
                            <button id="low-btn" type="button" class="prio-btn ${task.Prio === 'low' ? 'active' : ''}" onclick="setPrio('low')">
                                Low <img src="./assets/icons/${task.Prio === 'low' ? 'lowWhite' : 'low'}.svg" alt="Low">
                            </button>
                        </div>
                    </div>
                </div>

                     

                 <!-- Subtasks Section -->
                 <form class="subtasks-section">
                     <div class="input-group">
                         <p>Subtasks</p>
                         <div class="subtask-input input-group">
                             <input type="text" id="subtask-input" class="input-field"
                                 placeholder="Add new subtask" minlength="5" maxlength="30">
                             <div class="edit-delete" style="display: none ;">
                                 <img src="./assets/icons/reset.svg" alt="Reset" class="reset-icon"
                                     onclick="resetSubtaskInput()">
                                 <div class="vertical-line"></div>
                                 <img src="./assets/icons/done.svg" alt="Add" class="add-icon"
                                     onclick="addSubtask()">
                             </div>
                             <div class="add-subtask" style="display: flex;">
                                 <img src="./assets/icons/add.svg" alt="Add" class="add-icon">
                             </div>
                         </div>

                         <ul id="subtask-list" class="subtask-list" style="list-style-type:disc">
                             ${generateSubtaskListHTML(task.Subtasks)}
                         </ul>
                     </div>
             </div>

             </form>
             <button onclick="saveEditTask('${task.firebaseId}')" class="create-button" id="delete-button" type="submit">
                 <p>OK</p>
                 <img src="./assets/icons/check.svg" alt="Check">
             </button>
             </div>
         </form>
     `;
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
    document.body.addEventListener('submit', function(event) {
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

    // Populate assigned contacts
    // Assuming you have a function to select contacts
    // selectContacts(task.Assigned_to);

    // Populate subtasks
    // Assuming you have a function to add subtasks to the list
    // addSubtasksToList(task.Subtasks);
}

/**
 * Generates the HTML for the subtask list in the edit task form.
 * 
 * @param {Object} subtasks - The subtasks object containing the subtask details.
 * @returns {string} The HTML string for the subtask list.
 */
function generateSubtaskListHTML(subtasks) {
    let html = '';
    for (const subtaskId in subtasks) {
        const subtask = subtasks[subtaskId];
        html += `
             <li class="subtask-item ${subtask.isChecked ? 'checked' : ''}" data-subtask-id="${subtaskId}">
                 <input type="checkbox" id="subtask-${subtaskId}" ${subtask.isChecked ? 'checked' : ''}>
                 <label for="subtask-${subtaskId}">${subtask.description}</label>
             </li>
         `;
    }
    return html;
}


/**
 * Saves the edited task details to Firebase.
 * 
 * @param {string} taskId - The Firebase ID of the task to update.
 */
async function saveEditTask(taskId) {
    // if (!validateFields()) { // Call validateFields and check the result
    //     return; // Stop saving if validation fails
    // }
    try {
        // 1. Fetch the original task data from Firebase
        const originalTask = await getTaskByIdToEdit(taskId);
        if (!originalTask) {
            console.error('Task not found!');
            return;
        }

        // 2. Create the updatedTask object by copying the original task
        const updatedTask = { ...originalTask };

        // 3. Update only the modified fields
        updatedTask.Title = document.getElementById('editTitle').value;
        updatedTask.Description = document.getElementById('editDescription').value;
        updatedTask.Due_date = document.getElementById('editDueDate').value;
        updatedTask.Prio = currentPriority;
        // ... update other fields that are editable in the popup

        // 4. Update the task in Firebase
        await putData(`tasks/${taskId}`, updatedTask);
        console.log('Task updated successfully!');

        // Close the edit task popup
        closeTaskDetailsPopup();

        // Update the board to reflect the changes
        updateBoard();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

