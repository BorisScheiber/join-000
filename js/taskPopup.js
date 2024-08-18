async function openTaskDetails(taskId) {
    const task = await getTaskById(taskId);
    if (!task) {
        console.error('Task not found!');
        return;
    }

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
    const allTasks = await getData('tasks');
    for (const firebaseId in allTasks) {
        if (allTasks[firebaseId].id === parseInt(taskId)) {
            return {
                firebaseId,
                ...allTasks[firebaseId]
            };
        }
    }
    return null;
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

// function editTask(taskId) {
//     // Redirect to the edit task page with the task ID
//     window.location.href = `editTask.html?id=${taskId}`;
// }

// Event listener for clicking outside the popup to close it
window.addEventListener('click', (event) => {
    const popup = document.getElementById('taskDetailsPopup');
    if (event.target === popup) {
        closeTaskDetailsPopup();
    }
});



// const url = `${BASE_URL}tasks/${-O4_8JS5zSIhISMY_U_a}.json`;

async function getTaskToEdit(taskId) {
    const url = `${BASE_URL}tasks/${taskId}.json`;
    console.log('Fetching URL:', url); // Debugging-Statement
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const task = await response.json();
        if (!task) {
            console.error('Task not found in database!');
        }
        return task;
    } catch (error) {
        console.error('Error fetching task:', error);
        return null;
    }
}

// Diese Funktion wird aufgerufen, wenn der "Edit"-Button geklickt wird
async function editTask(taskId) {
    console.log('Editing task with ID:', taskId); // Debugging-Statement

    try {
        // Schließe das Detailfenster, bevor das Editierformular geöffnet wird
        closeTaskDetailsPopup();

        const task = await getTaskToEdit(taskId);
        if (!task) {
            console.error('Task not found!');
            return;
        }

        console.log('Task details:', task);

        // Überprüfe und konvertiere `Assigned_to` in ein Array, falls nötig
        const assignedToArray = Array.isArray(task.Assigned_to)
            ? task.Assigned_to
            : Object.values(task.Assigned_to || {});

        // Konvertiere `task.Subtasks` in ein Array, falls nötig
        const subtasksArray = Array.isArray(task.Subtasks)
            ? task.Subtasks
            : Object.values(task.Subtasks || {});

        // Erstelle das Editierformular HTML
        const formHTML = /*html*/ `
            <div id="editTaskPopup" class="task-details-content">
                <div class="popup-content">
                    <h2>Edit Task</h2>
                    <form id="editTaskForm">
                        <label for="title">Title:</label>
                        <input type="text" id="title" name="title" value="${task.Title || ''}" required>

                        <label for="description">Description:</label>
                        <textarea id="description" name="description" required>${task.Description || ''}</textarea>

                        <label for="dueDate">Due Date:</label>
                        <input type="date" id="dueDate" name="dueDate" value="${task.Due_date || ''}" required>

                        <label for="priority">Priority:</label>
                        <select id="priority" name="priority" required>
                            <option value="urgent" ${task.Prio === 'urgent' ? 'selected' : ''}>Urgent</option>
                            <option value="medium" ${task.Prio === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="low" ${task.Prio === 'low' ? 'selected' : ''}>Low</option>
                        </select>

                        <label for="assignedTo">Assigned To:</label>
                        <input type="text" id="assignedTo" name="assignedTo" value="${assignedToArray.map(contact => contact.name).join(', ')}">

                        <label for="subtasks">Subtasks:</label>
                        <input type="text" id="subtasks" name="subtasks" value="${subtasksArray.map(subtask => subtask.description).join(', ')}">

                        <button type="submit">Save</button>
                        <button type="button" onclick="closeEditTaskPopup()">Cancel</button>
                    </form>
                </div>
            </div>
        `;

        // Füge das Formular HTML in die bestehende Seite ein
        const container = document.getElementById('editTaskContainer');
        container.innerHTML = formHTML;

        // Zeige das Popup an
        document.getElementById('editTaskPopup').style.display = 'block';

        // Event-Listener für das Formular speichern
        document.getElementById('editTaskForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            await saveTask(taskId);
        });

    } catch (error) {
        console.error('Error in editTask:', error);
    }
}
// Funktion zum Speichern der Aufgabe
async function saveTask(taskId) {
    const updatedTask = {
        Title: document.getElementById('title').value,
        Description: document.getElementById('description').value,
        Due_date: document.getElementById('dueDate').value,
        Prio: document.getElementById('priority').value,
        Assigned_to: document.getElementById('assignedTo').value.split(',').map(name => ({ name })),
        Subtasks: document.getElementById('subtasks').value.split(',').map(description => ({ description, isChecked: false }))
    };

    await fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    });

    alert('Task updated successfully!');
    closeEditTaskPopup();
    renderBoard(); // Aktualisiere die Board-Seite
}

// Funktion zum Schließen des Editierformulars
function closeEditTaskPopup() {
    document.getElementById('editTaskPopup').style.display = 'none';
}

(async () => {
    const testTaskId = '-O4_8JS5zSIhISMY_U_a'; // Beispiel-Id
    try {
        const task = await getTaskToEdit(testTaskId);
        console.log('Fetched task:', task);
    } catch (error) {
        console.error('Error during test fetch:', error);
    }
})();