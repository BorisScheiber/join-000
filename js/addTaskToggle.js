/**
 * Toggles the visibility of the edit/delete icons for subtasks based on the input field's content.
 */
function toggleEditDeleteVisibility() {
    const subtaskInput = document.getElementById('subtask-input');
    const editDelete = subtaskInput.nextElementSibling;
    const addTask = editDelete.nextElementSibling;
    if (subtaskInput.value.trim() !== '') {
        editDelete.style.display = 'flex';
        addTask.style.display = 'none';
    } else {
        editDelete.style.display = 'none';
        addTask.style.display = 'flex';
    }
}

/**
 * Toggles the visibility of the category dropdown.
 */
function toggleCategoryDropdown() {
    const dropdown = document.getElementById('category-dropdown');
    const catField = document.getElementById('category-field');
    const dropdownIcon = document.querySelector('.dropdown-icon-category');
    if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
        dropdownIcon.src = './assets/icons/arrow_drop_down.svg';
        catField.style.borderRadius = "10px";
    } else {
        dropdown.style.display = 'flex';
        dropdownIcon.src = './assets/icons/arrow_drop_up.svg';
        catField.style.borderRadius = "10px 10px 0 0";
    }
}


/**
 * Listens for input changes in the subtask input field and calls `toggleEditDeleteVisibility` to show or hide the edit/delete icons based on the input field's content.
 */
document.getElementById('subtask-input').addEventListener('input', toggleEditDeleteVisibility);


/**
 * Handles the Enter key press in the subtask input field, adding a new subtask.
 *
 * @param {Event} event - The keyboard event.
 * @param {function} callback - The function to call when Enter is pressed (e.g., addSubtask).
 */
function handleEnterKey(event, callback) {
    if (event.key === 'Enter') {
        event.preventDefault();
        callback();
    }
}


/**
 * Listens for the 'keydown' event on the subtask input field.
 * If the pressed key is 'Enter', it prevents the default action (form submission) and calls the `addSubtask` function.
 */
document.getElementById('subtask-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSubtask();
    }
});