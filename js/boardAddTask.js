let createTaskFunction = createTask; // Default function

/**
 * Sets the global `createTaskFunction` variable based on the provided task status.
 * This function is used to determine which task creation function should be called 
 * when the "Create task" button is clicked in the popup.
 *
 * @param {string} taskStatus - The status of the task (e.g., 'in progress', 'await feedback', or any other valid status).
 */
function openAddTaskPopup(taskStatus) {
    document.getElementById('addTaskPopup').classList.add('show');
    document.getElementById('addTaskPopup').classList.remove('hidden');

    // Set the createTaskFunction based on taskStatus
    switch (taskStatus) {
        case 'in progress':
            createTaskFunction = createTaskInProgress;
            break;
        case 'await feedback':
            createTaskFunction = createTaskAwaitFeedback;
            break;
        default:
            createTaskFunction = createTask;
    }
}


/**
 * Closes the "Add Task" popup with a smooth animation.
 * It first adds the 'hidden' class to trigger the animation, then sets a timeout to 
 * hide the popup completely after the animation duration.
 */
function closeAddTaskPopup() {
    document.getElementById('addTaskPopup').classList.remove('show');
    setTimeout(() => {
        document.getElementById('addTaskPopup').style.display = 'none';
    }, 400);
    document.getElementById('addTaskPopup').classList.add('hidden');
}


// Event listener for clicking outside the popup to close the popup
window.addEventListener('click', (event) => {
    const popup = document.getElementById('addTaskPopup');
    if (event.target === popup) {
        closeAddTaskPopup();
    }
});


/**
 * Creates a new task object with the status "Await feedback" and saves it to Firebase.
 * This function is called when the "Create task" button is clicked in the popup 
 * and the `taskStatus` is set to 'await feedback'.
 */
async function createTaskAwaitFeedback() {
    if (!validateFields()) return;
    const newTask = {
        id: Date.now(),
        Title: document.getElementById('title').value.trim(),
        Description: document.getElementById('description').value.trim(),
        Assigned_to: getAssignedContacts(),
        Due_date: document.getElementById('due-date').value,
        Prio: currentPriority,
        Category: document.getElementById('category').value.trim(),
        Subtasks: getSubtasks(),
        Status: 'await feedback'
    };
    try {
        await postData("tasks", newTask);
        console.log("Task created successfully:", newTask);
        clearFields();
        showTaskCreatedPopup();
        setTimeout(() => { window.location.href = 'board.html'; }, 2000);
    } catch (error) {
        console.error("Error creating task:", error);
    }
}


/**
 * Creates a new task object with the status "In progress" and saves it to Firebase.
 * This function is called when the "Create task" button is clicked in the popup 
 * and the `taskStatus` is set to 'in progress'.
 */
async function createTaskInProgress() {
    if (!validateFields()) return;
    const newTask = {
        id: Date.now(),
        Title: document.getElementById('title').value.trim(),
        Description: document.getElementById('description').value.trim(),
        Assigned_to: getAssignedContacts(),
        Due_date: document.getElementById('due-date').value,
        Prio: currentPriority,
        Category: document.getElementById('category').value.trim(),
        Subtasks: getSubtasks(),
        Status: 'in progress'
    };
    try {
        await postData("tasks", newTask);
        console.log("Task created successfully:", newTask);
        clearFields();
        showTaskCreatedPopup();
        setTimeout(() => { window.location.href = 'board.html'; }, 2000);
    } catch (error) {
        console.error("Error creating task:", error);
    }
}

