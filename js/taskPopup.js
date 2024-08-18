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

















// const url = `${BASE_URL}tasks/${-O4_8JS5zSIhISMY_U_a}.json`;

// async function getTaskToEdit(taskId) {
//     const url = `${BASE_URL}tasks/${taskId}.json`;
//     console.log('Fetching URL:', url); // Debugging-Statement

//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const task = await response.json();
//         if (!task) {
//             console.error('Task not found in database!');
//         }
//         return task;
//     } catch (error) {
//         console.error('Error fetching task:', error);
//         return null;
//     }
// }

// Diese Funktion wird aufgerufen, wenn der "Edit"-Button geklickt wird
// async function editTask(taskId) {
//     console.log('Editing task with ID:', taskId);

//     try {
//         closeTaskDetailsPopup();

//         const task = await getTaskToEdit(taskId);
//         if (!task) {
//             console.error('Task not found!');
//             return;
//         }

//         console.log('Task details:', task);

//         const assignedToArray = Array.isArray(task.Assigned_to)
//             ? task.Assigned_to
//             : Object.values(task.Assigned_to || {});

//         const subtasksArray = Array.isArray(task.Subtasks)
//             ? task.Subtasks
//             : Object.values(task.Subtasks || {});

//         const formHTML = /*html*/ `
//             <div class="task-details-content" data-task-id="${task.id}">
//                 <div class="popup-header">
//                     <div class="task-category ${checkSingleTaskCategoryPopup(task.Category)}">
//                         <span>${task.Category}</span>
//                     </div>
//                     <img src="./assets/icons/close-contact.svg" alt="Close" class="close-popup-button" onclick="closeTaskDetailsPopup()">
//                 </div>
//                 <div class="popup-content-task">
//                     <form id="editTaskForm">
//                         <label for="title">Title:</label>
//                         <input class="task-title" type="text" id="title" name="title" value="${task.Title || ''}" required>

//                         <label for="description">Description:</label>
//                         <textarea class="task-description" id="description" name="description" required>${task.Description || ''}</textarea>

//                         <label for="dueDate">Due Date:</label>
//                         <input class="due-date" type="date" id="dueDate" name="dueDate" value="${task.Due_date || ''}" required>

//                         <label for="priority">Priority:</label>
// <div class="priority-section">
//     <div class="input-group">
//         <div class="priority-buttons">
//             <button id="urgent-button" class="priority-button" onclick="setPriority('urgent')">
//                 Urgent <img src="./assets/icons/urgent.svg" alt="Urgent">
//             </button>
//             <button id="medium-button" class="priority-button" onclick="setPriority('medium')">
//                 Medium <img src="./assets/icons/medium.svg" alt="Medium">
//             </button>
//             <button id="low-button" class="priority-button" onclick="setPriority('low')">
//                 Low <img src="./assets/icons/low.svg" alt="Low">
//             </button>
//         </div>
//     </div>
// </div>
// <!-- Hidden input field to store the selected priority -->
// <input type="hidden" id="priority" name="priority">

//                         <div class="assigned-to">
//                             <div class="search-container">
//                                 <input type="text" id="contact-search" class="contact-search"
//                                     placeholder="Select contacts to assign" oninput="filterContacts()">
//                                 <button id="toggle-list" class="toggle-list" onclick="toggleContactList()">
//                                     <img src="./assets/icons/arrow_drop_down.svg" alt="Dropdown Icon" id="dropdown-assigned"
//                                         class="dropdown-icon">
//                                 </button>
//                             </div>
//                             <div id="contact-list" class="contact-list hidden"></div>
//                             <div id="selected-contacts" class="selected-contacts"></div>
//                         </div>

//                         <label for="subtasks">Subtasks:</label>
//                         <input class="subtasks-container" type="text" id="subtasks" name="subtasks" value="${subtasksArray.map(subtask => subtask.description).join(', ')}">

//                         <div class="popup-buttons">
//                             <button type="submit">Save</button>
//                             <button type="button" onclick="closeEditTaskPopup()">Cancel</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         `;

//         const container = document.getElementById('editTaskContainer');
//         container.innerHTML = formHTML;

//         document.getElementById('editTaskPopup').style.display = 'block';

//         document.getElementById('editTaskForm').addEventListener('submit', async (event) => {
//             event.preventDefault();
//             await saveTask(taskId);
//         });

//         // Initialisiere die Prioritätsauswahl
//         initializePriorityButtons(task.Prio);

//     } catch (error) {
//         console.error('Error in editTask:', error);
//     }
// }


// let selectedPriority = '';

// function setPriority(priority) {
//     selectedPriority = priority;
//     const priorityInput = document.getElementById('priority');
//     if (!priorityInput) {
//         console.error('Priority input element not found!');
//         return;
//     }
//     priorityInput.value = priority;

//     // Aktualisiere die Button-Stile
//     const buttons = document.querySelectorAll('.priority-button');
//     buttons.forEach(button => {
//         button.classList.remove('selected');
//     });

//     const selectedButton = document.getElementById(`${priority}-button`);
//     if (selectedButton) {
//         selectedButton.classList.add('selected');
//     } else {
//         console.error('Selected priority button not found!');
//     }
// }

// function initializePriorityButtons(initialPriority) {
//     if (initialPriority) {
//         setPriority(initialPriority);
//     }
// }

// async function openContactSelector() {
//     console.log('Opening contact selector...');
//     const contactList = document.getElementById('contact-list');
//     contactList.classList.remove('hidden');

//     // Kontakte abrufen und anzeigen
//     contacts = await getContacts();
//     console.log('Contacts fetched:', contacts);
//     contactList.innerHTML = generateContactListHTML(contacts);
// }

// function toggleContactList() {
//     const contactList = document.getElementById('contact-list');
//     const isHidden = contactList.classList.contains('hidden');
//     contactList.classList.toggle('hidden', !isHidden);

//     // Toggle the dropdown icon
//     const dropdownIcon = document.getElementById('dropdown-assigned');
//     dropdownIcon.src = isHidden ? './assets/icons/arrow_drop_up.svg' : './assets/icons/arrow_drop_down.svg';
// }

// function filterContacts() {
//     const searchInput = document.getElementById('contact-search').value.toLowerCase();
//     const contactItems = document.querySelectorAll('#contact-list .contact-item');
//     contactItems.forEach(item => {
//         const contactName = item.querySelector('label').textContent.toLowerCase();
//         item.style.display = contactName.includes(searchInput) ? 'block' : 'none';
//     });
// }

// function closeContactSelector() {
//     const contactSelector = document.getElementById('contactSelector');
//     contactSelector.classList.add('hidden');
// }

// function generateContactListHTML(contacts) {
//     if (!contacts || Object.keys(contacts).length === 0) {
//         return '<p>No contacts available.</p>';
//     }

//     return Object.values(contacts).map(contact => `
//         <div class="contact-item">
//             <input type="checkbox" id="contact-${contact.id}" 
//                    ${isContactSelected(contact.id) ? 'checked' : ''}>
//             <label for="contact-${contact.id}">${contact.name}</label>
//         </div>
//     `).join('');
// }

// function isContactSelected(contactId) {
//     const selectedContacts = document.querySelectorAll('#selected-contacts .contact-item');
//     return Array.from(selectedContacts).some(contact => contact.dataset.contactId === contactId);
// }

// function updateSelectedContacts() {
//     const contactList = document.getElementById('contact-list');
//     const selectedContacts = Array.from(contactList.querySelectorAll('input[type="checkbox"]:checked'))
//         .map(checkbox => checkbox.id.replace('contact-', ''));

//     const selectedContactsDiv = document.getElementById('selected-contacts');
//     selectedContactsDiv.innerHTML = selectedContacts.map(contactId => {
//         const contact = contacts[contactId];
//         const color = contact.color || '#cccccc'; // Default color
//         const initials = contact.name.split(' ').map(part => part.charAt(0)).join('');
//         return `
//             <div class="contact-item" data-contact-id="${contactId}">
//                 <div class="contact-logo" style="background-color: ${color}">${initials}</div>
//                 <span>${contact.name}</span>
//                 <button onclick="removeContact('${contactId}')">Remove</button>
//             </div>
//         `;
//     }).join('');
// }

// function removeContact(contactId) {
//     const selectedContactsDiv = document.getElementById('selected-contacts');
//     const contactItem = selectedContactsDiv.querySelector(`[data-contact-id="${contactId}"]`);
//     if (contactItem) {
//         contactItem.remove();
//         // Uncheck the checkbox in the contact list
//         const checkbox = document.getElementById(`contact-${contactId}`);
//         if (checkbox) {
//             checkbox.checked = false;
//         }
//     }
// }

// async function getContacts() {
//     try {
//         const response = await fetch(`${BASE_URL}contacts.json`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching contacts:', error);
//         return {};
//     }
// }

// function isContactAssigned(contactId) {
//     const assignedContacts = document.querySelectorAll('#assignedContactsList .contact-item-assigned');
//     return Array.from(assignedContacts).some(contact => contact.dataset.contactId === contactId);
// }

// async function updateAssignedContacts() {
//     const selectedContactIds = Array.from(document.querySelectorAll('#selected-contacts .contact-item'))
//         .map(item => item.dataset.contactId);

//     const taskId = document.querySelector('.task-details-content').dataset.taskId;
//     const task = await getTaskById(taskId);

//     task.Assigned_to = {};
//     selectedContactIds.forEach(contactId => {
//         if (contacts[contactId]) {
//             task.Assigned_to[contactId] = contacts[contactId];
//         }
//     });

//     await putData(`tasks/${task.firebaseId}`, task);
//     alert('Contacts updated successfully!');
//     closeContactSelector();
//     renderBoard(); // Update the board view
// }

// // Funktion zum Speichern der Aufgabe
// async function saveTask(taskId) {
//     const updatedTask = {
//         Title: document.getElementById('title').value,
//         Description: document.getElementById('description').value,
//         Due_date: document.getElementById('dueDate').value,
//         Prio: selectedPriority, // Verwende die ausgewählte Priorität
//         Assigned_to: Array.from(document.querySelectorAll('#contactList input[type="checkbox"]:checked')).map(checkbox => {
//             const contactId = checkbox.id.replace('contact-', '');
//             return { id: contactId }; // Stellen Sie sicher, dass nur die IDs gespeichert werden
//         }),
//         Subtasks: document.getElementById('subtasks').value.split(',').map(description => ({ description, isChecked: false }))
//     };

//     await fetch(`${BASE_URL}tasks/${taskId}.json`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedTask)
//     });

//     alert('Task updated successfully!');
//     closeEditTaskPopup();
//     renderBoard(); // Aktualisiere die Board-Seite
// }

// // Funktion zum Schließen des Editierformulars
// function closeEditTaskPopup() {
//     document.getElementById('editTaskPopup').style.display = 'none';
// }

// (async () => {
//     const testTaskId = '-O4_8JS5zSIhISMY_U_a'; // Beispiel-Id
//     try {
//         const task = await getTaskToEdit(testTaskId);
//         console.log('Fetched task:', task);
//     } catch (error) {
//         console.error('Error during test fetch:', error);
//     }
// })();