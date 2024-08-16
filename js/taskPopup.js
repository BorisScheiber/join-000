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
           <div class="task-category ${checkSingleTaskCategory(task.Category)}"><span >${task.Category}</span></div>
                <img src="./assets/icons/close-contact.svg" alt="Close" class="close-popup" onclick="closeTaskDetailsPopup()">
            </div>
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


function checkSingleTaskCategory(category) {
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
      const randomColor = getRandomColor();
  
      html += /*html*/ `
        <div class="contact-item-assigned">
          <div class="contact-logo" style="background-color: ${randomColor}">${initials}</div>
          <span>${contact.name}</span>
        </div>
      `;
    }
    return html;
  }
  
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let  index = 0; index < 6; index++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
        return '<p>You don`t have any subtasks</p>';
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

function editTask(taskId) {
    // Redirect to the edit task page with the task ID
    window.location.href = `editTask.html?id=${taskId}`;
}

// Event listener for clicking outside the popup to close it
window.addEventListener('click', (event) => {
    const popup = document.getElementById('taskDetailsPopup');
    if (event.target === popup) {
        closeTaskDetailsPopup();
    }
});
