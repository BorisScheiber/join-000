
//BORISEDIT TASK ARBEIT
// async function editTask(taskId) {
//     let showEditTask = document.getElementById('editTaskPopup');
//     showEditTask.classList.remove('edit-d-none');
//     try {
//         currentTaskId = taskId;

//         const task = await getTaskIdForEdit(taskId);
//         if (!task) {
//             console.error('Task not found!');
//             return;
//         }

//         document.getElementById('edit-title').value = task.Title;
//         document.getElementById('edit-description').value = task.Description;
//         document.getElementById('edit-due-date').value = task.Due_date;
//         setEditPriority(task.Prio);

//         // Kontakte in das Dropdown und das Zuweisungsfeld laden
//         populateAssignedContactsEdit(contacts);

//         document.getElementById('editTaskPopup').style.display = 'flex';
//         document.getElementById('editTaskPopup').classList.add('show');
//         document.getElementById('editTaskPopup').classList.remove('hidden');

//     } catch (error) {
//         console.error('Error editing task:', error);
//     }
//     closeTaskDetailsPopup();
// }

// function setEditPriority(priority) {
//     document.querySelectorAll('.priority-button').forEach(button => {
//         button.classList.remove('selected'); // Remove selected state from all buttons
//     });

//     const priorityButton = document.getElementById(`edit-${priority}-button`);
//     if (priorityButton) {
//         priorityButton.classList.add('selected'); // Add selected state to the chosen button
//     }
// }

// function populateAssignedContactsEdit(contacts) {
//     // Clear previous contacts
//     const selectedContactsContainer = document.getElementById('selected-contacts-container');
//     selectedContactsContainer.innerHTML = '';

//     if (contacts) {
//         for (const contactId in contacts) {
//             const contact = contacts[contactId];
//             const contactDiv = document.createElement('div');
//             contactDiv.classList.add('contact-item');
//             contactDiv.textContent = contact.name;
//             selectedContactsContainer.appendChild(contactDiv);
//         }
//     }
// }

// function displayEditSubtasks(subtasks) {
//     const subtaskContainer = document.getElementById('subtask-container');
//     subtaskContainer.innerHTML = '';

//     if (subtasks) {
//         for (const subtaskId in subtasks) {
//             const subtask = subtasks[subtaskId];
//             const subtaskDiv = document.createElement('div');
//             subtaskDiv.classList.add('subtask-item');
//             subtaskDiv.innerHTML = `
//                 <input type="checkbox" ${subtask.isChecked ? 'checked' : ''} id="edit-subtask-${subtaskId}">
//                 <label for="edit-subtask-${subtaskId}">${subtask.description}</label>
//             `;
//             subtaskContainer.appendChild(subtaskDiv);
//         }
//     }
// }

// async function saveTask() {
//     const taskTimestamp = document.querySelector('.task-details-content').dataset.taskTimestamp; // Verwende taskTimestamp

//     const updatedTask = {
//         Title: document.getElementById('edit-title').value,
//         Description: document.getElementById('edit-description').value,
//         Due_date: document.getElementById('edit-due-date').value,
//         Prio: document.querySelector('.priority-button.selected').id.replace('edit-', '').replace('-button', ''),
//         Assigned_to: getAssignedContactsFromUI(), // Implementiere diese Funktion basierend auf deiner Auswahl
//         Subtasks: getSubtasksFromUI() // Implementiere diese Funktion basierend auf deiner Unteraufgaben-UI
//     };

//     try {
//         // Update die Aufgabe mit dem timestamp als Pfad
//         await putData(`tasks/${taskTimestamp}`, updatedTask);
//         closeEditTaskPopup();
//         renderBoard(); // Aktualisiere das Board, um die Änderungen widerzuspiegeln
//     } catch (error) {
//         console.error("Error saving task:", error);
//         // Behandle den Fehler entsprechend
//     }
// }

// function getAssignedContactsFromUI() {
//     // Implement this function based on your selected contacts UI
//     return {};
// }

// function getSubtasksFromUI() {
//     // Implement this function based on your subtasks UI
//     return {};
// }

// function closeEditTaskPopup() {
//     let popup = document.getElementById('editTaskPopup');
//     popup.classList.add('hidden');
//     popup.classList.remove('show');
//     setTimeout(() => {
//         popup.style.display = 'none';
//     }, 400);
// }

// let currentTaskId = null;

// async function getTaskIdForEdit(taskId) {
//     try {
//         const allTasks = await getData('tasks');
//         for (const firebaseId in allTasks) {
//             if (firebaseId === taskId) {
//                 return {
//                     firebaseId,
//                     ...allTasks[firebaseId]
//                 };
//             }
//         }
//         console.warn(`Task with ID ${taskId} not found.`);
//         return null;
//     } catch (error) {
//         console.error('Error fetching tasks:', error);
//         return null;
//     }
// }

