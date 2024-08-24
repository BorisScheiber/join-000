/**
 * Generates the HTML content for the task details popup.
 * 
 * @param {Object} task - The task object containing the details.
 * @returns {string} The HTML string for the popup content.
 */
function generateTaskDetailsPopupHTML(task) {
    return /*html*/ `
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
                <div class="edit-button" onclick="editTask('${task.id}')">
                    <img src="./assets/icons/edit.svg" alt="Edit">
                    <span>Edit</span>
                </div>
            </div>
        </div>
    `;
}