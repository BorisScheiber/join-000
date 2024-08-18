async function openTaskDetails(taskId) {
    const task = await getTaskById(taskId);
    if (!task) {
        console.error('Task not found!');
        return;
    }

    // Log task details after it is fetched
    console.log('Fetched task:', task);
    console.log('Assigned_to data:', task.Assigned_to);

    let popup = document.getElementById('taskDetailsPopup');
    popup.innerHTML = ''; // Clear previous content
    popup.innerHTML = /*html*/ `
        <div class="task-details-content " data-task-id="${task.id}">
            <div class="popup-header">
           <div class="task-category ${checkSingleTaskCategoryPopup(task.Category)}"><span >${task.Category}</span></div>
                <img src="./assets/icons/close-contact.svg" alt="Close" class="close-popup-button" onclick="closeTaskDetailsPopup()">
            </div>
            <div class="popup-content-task">
            <span class="task-title">${task.Title}</span>
            <span class="task-description">${task.Description}</span>
                <div class="due-date">
                    <p>Due Date:</p>
                    <span>${task.Due_date}</span>
                </div>
                <div class="priority">
                    <p>Priority:</p>
                   <div class="priority-choice"> ${getPriorityIcon(task.Prio)} </div>
            </div>
            <div class="assigned-to">
                <p class="assigned-to-title">Assigned To:</p>
                <div class="contacts">
                    ${displayAssignedContacts(task.Assigned_to)}
                </div>
            </div>
            <div class="subtasks-container" id="subtask-container">
                <p class="subtasks-title">Subtasks:</p>
                <div class="subtasks" id="subtask-list">
                    ${displaySubtasks(task.Subtasks)} 
                </div>
            </div>
            </div>
            <div class="popup-buttons">
                <div class="delete-button" onclick="deleteTask('${task.firebaseId}')">
                    <img src="./assets/icons/delete.svg" alt="Delete">
                    <span>Delete</span>
                </div>
                <div class="vertical-line"></div>
                <div class="edit-button" onclick="editTask('${task.firebaseId}')">
                    <img src="./assets/icons/edit.svg" alt="Edit">
                    <span>Edit</span>
                </div>
            </div>
        </div>
    `;
    popup.style.display = 'flex';
    popup.classList.add('show');
    popup.classList.remove('hidden');
}


function checkSingleTaskCategoryPopup(category) {
    if (category === 'Technical Task') {
        return 'technical-task';
    } else if (category === 'User Story') {
        return 'user-story';
    } else {
        return ''; // Default class if needed
    }
}

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


async function toggleSubtaskCheck(subtaskId) {
    const taskId = document.querySelector('.task-details-content').dataset.taskId;
    const task = await getTaskById(taskId);
    if (!task) {
        console.error('Task not found!');
        return;
    }

    task.Subtasks[subtaskId].isChecked = !task.Subtasks[subtaskId].isChecked;

    await putData(`tasks/${task.firebaseId}`, task);

    displaySubtasks(task.Subtasks); // Update popup
    renderBoard(); // Update the main board 
}

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

function toggleCheckboxImage(checkboxDiv) {
    const img = checkboxDiv.querySelector('img');
    img.src = img.src.includes('checkedBox.svg') ? './assets/icons/uncheckedBox.svg' : './assets/icons/checkedBox.svg';
}


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

function closeTaskDetailsPopup() {
    let popup = document.getElementById('taskDetailsPopup');
    popup.classList.add('hidden');
    popup.classList.remove('show');
    setTimeout(() => {
        popup.style.display = 'none';
    }, 400);
}

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











let currentTaskId = null;

let assignedTo;
if (typeof task.Assigned_to === 'object' && !Array.isArray(task.Assigned_to)) {
    // Assigned_to is an object, handle it accordingly
    assignedTo = Object.values(task.Assigned_to).map(contact => contact.name).join(', ');
} else if (Array.isArray(task.Assigned_to)) {
    // If by any chance it's an array, handle this case as well
    assignedTo = task.Assigned_to.join(', ');
} else {
    assignedTo = ''; // Default value
}
document.getElementById('edit-assigned-to').value = assignedTo;

async function getTaskIdForEdit(taskId) {
    try {
        const allTasks = await getData('tasks');
        console.log('All Tasks:', allTasks); // Log all tasks to verify they are fetched correctly

        // Prüfe die IDs der Aufgaben, um sicherzustellen, dass die ID existiert
        for (const firebaseId in allTasks) {
            console.log(`Checking task ID: ${firebaseId}`); // Log task IDs for debugging
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

// Open the edit task popup and load task data
async function editTask(taskId) {
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

        const assignedToHTML = displayAssignedContactsForEdit(task.Assigned_to);
        document.getElementById('edit-assigned-to').innerHTML = assignedToHTML;

        document.getElementById('editTaskPopup').style.display = 'flex';
        document.getElementById('editTaskPopup').classList.add('show');
        document.getElementById('editTaskPopup').classList.remove('hidden');

    } catch (error) {
        console.error('Error editing task:', error);
    }
}

// Priorität für das Bearbeitungsformular setzen
function setEditPriority(priority) {
    const priorityButtons = document.querySelectorAll('.priority-button');
    priorityButtons.forEach(button => button.classList.remove('selected'));
    
    const selectedButton = document.getElementById(`edit-${priority}-button`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
}

// Änderungen an der Aufgabe speichern
async function saveTask() {
    if (currentTaskId === null) return;

    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-description').value;
    const dueDate = document.getElementById('edit-due-date').value;
    const priority = Array.from(document.querySelectorAll('.priority-button.selected'))
                          .map(button => button.textContent.trim().toLowerCase())[0];
    
    // This assumes you have a way of gathering contact data from the edit form
    const contactElements = document.querySelectorAll('.contact-item-assigned');
    const assignedTo = {};
    contactElements.forEach((contactElement, index) => {
        const name = contactElement.querySelector('span').textContent;
        const color = contactElement.querySelector('.contact-logo').style.backgroundColor;
        assignedTo[`contact${index + 1}`] = { name, color }; // Customize the key as needed
    });

    if (!title || !description || !dueDate || !priority) {
        alert('Please fill in all required fields.');
        return;
    }

    const updatedTask = {
        Title: title,
        Description: description,
        Due_date: dueDate,
        Prio: priority,
        Assigned_to: assignedTo,
    };

    await putData(`tasks/${currentTaskId}`, updatedTask);

    closeEditTaskPopup();
    renderBoard();
}

function displayAssignedContactsForEdit(contacts) {
    if (!contacts || Object.keys(contacts).length === 0) {
        return '<p class="no-assigned">No one.</p>'; 
    }

    let html = '';
    for (const contactId in contacts) {
        const contact = contacts[contactId];
        const initials = contact.name.split(' ').map(part => part.charAt(0)).join('');

        html += `
        <div class="contact-item-assigned">
          <div class="contact-logo" style="background-color: ${contact.color}">${initials}</div>
          <span class="contacts">${contact.name}</span>
        </div>
      `;
    }
    return html;
}

// Use this function when setting the inner HTML for contacts in the edit form.
document.getElementById('edit-assigned-to').innerHTML = displayAssignedContactsForEdit(task.Assigned_to);

// Bearbeitungs-Popup schließen
function closeEditTaskPopup() {
    const popup = document.getElementById('editTaskPopup');
    popup.classList.add('hidden');
    popup.classList.remove('show');
    setTimeout(() => {
        popup.style.display = 'none';
    }, 400);
}

console.log('Fetched task:', task);
console.log('Assigned_to data:', task.Assigned_to);
console.log(task);






