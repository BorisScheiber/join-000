// For Category

/**
 * Toggles the visibility of the category dropdown.
 */
function toggleCategoryDropdown() {
    const dropdown = document.getElementById('category-dropdown');
    const catField = document.getElementById('category-field');
    const dropdownIcon = document.querySelector('.dropdown-icon-category');
    if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
        dropdownIcon.src = '/assets/icons/arrow_drop_down.svg';
        catField.style.borderRadius = "10px";
    } else {
        dropdown.style.display = 'flex';
        dropdownIcon.src = '/assets/icons/arrow_drop_up.svg';
        catField.style.borderRadius = "10px 10px 0 0";
    }
}


/**
 * Selects a category from the dropdown and updates the input field and styles.
 *
 * @param {string} category - The selected category.
 */
function selectCategory(category) {
    const categoryInput = document.getElementById('category');
    const categoryField = document.getElementById('category-field'); // Get the category-field div
    categoryInput.value = category;
    toggleCategoryDropdown();
    categoryField.style.border = '1px solid rgba(41, 171, 226, 1)'; // Change border of category-field
    removeErrorMessage(categoryInput); // Remove any error message
  }


// Optionale Initialisierung um sicherzustellen, dass das Icon beim Laden korrekt gesetzt wird
/**
 * Ensures the category dropdown icon is set correctly on page load.
 * If the dropdown is displayed, it sets the icon to 'arrow_drop_up.svg', otherwise to 'arrow_drop_down.svg'.
 */
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('category-dropdown');
    const dropdownIcon = document.querySelector('.dropdown-icon-category');
    if (dropdown.style.display === 'flex') {
        dropdownIcon.src = '/assets/icons/arrow_drop_up.svg';
    } else {
        dropdownIcon.src = '/assets/icons/arrow_drop_down.svg';
    }
});


/**
 * Hides the category dropdown when the user clicks outside of it.
 * 
 * @param {Event} event - The click event.
 */
document.addEventListener('click', function (event) {
    const categoryField = document.querySelector('.category-field');
    const dropdown = document.getElementById('category-dropdown');
    if (!categoryField.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});


// // For subtasks

/**
 * Adds a new subtask to the subtask list.
 */
function addSubtask() {
    const subtaskInput = document.getElementById('subtask-input');
    const subtaskList = document.getElementById('subtask-list');
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText === '') return;
  
    const li = createSubtaskItem(subtaskText);
    subtaskList.appendChild(li);
    subtaskInput.value = '';
    toggleEditDeleteVisibility();
  }
  

/**
 * Deletes a subtask from the list.
 *
 * @param {HTMLElement} element - The element that triggered the delete action (e.g., the delete icon).
 */
function deleteSubtask(element) {
    element.closest('li').remove();
}


/**
 * Edits a subtask, replacing its text with an input field for editing.
 *
 * @param {HTMLElement} element - The element that triggered the edit action.
 */
function editSubtask(element) {
    const subtask = document.getElementById("subtask-list");
    const li = element.closest('li');
    const subtaskText = element.tagName.toLowerCase() === 'div' ? element.innerText : element.closest('li').querySelector('.subtask-text').innerText;
  
    subtask.style.paddingLeft = '0px';
    li.style.paddingLeft = '0';
    li.innerHTML = generateEditSubtaskHTML(subtaskText);
  
    const subtaskInput = li.querySelector('input');
    subtaskInput.focus();
  }
  
 
/**
 * Saves the edited subtask, replacing the input field with the updated text.
 *
 * @param {HTMLElement} element - The element that triggered the save action.
 */
function saveSubtask(element) {
    const subtask = document.getElementById("subtask-list");
    const li = element.closest('li');
    const subtaskInput = li.querySelector('input');
    const newText = subtaskInput.value.trim();
    if (newText === '') return;
  
    subtask.style.paddingLeft = '20px';
    li.style.paddingLeft = '20px';
    li.innerHTML = generateSavedSubtaskHTML(newText);
  }
  

/**
 * Toggles the visibility of the edit/delete icons for subtasks.
 * When a subtask item is clicked, its edit/delete icons are shown.
 * For all other subtask items, the edit/delete icons are hidden.
 */
document.addEventListener('click', (event) => {
    const isSubtaskItem = event.target.closest('.subtask-item');
    document.querySelectorAll('.subtask-item').forEach(item => {
        if (item === isSubtaskItem) {
            const editDelete = item.querySelector('.edit-delete-icons');
            if (editDelete) editDelete.style.display = 'flex';
        } else {
            const editDelete = item.querySelector('.edit-delete-icons');
            if (editDelete) editDelete.style.display = 'none';
        }
    });
});


/**
 * Resets the subtask input field to an empty string.
 */
function resetSubtaskInput() {
    const subtaskInput = document.getElementById('subtask-input');
    subtaskInput.value = '';
    toggleEditDeleteVisibility();
}


/**
 * Toggles the visibility of the edit/delete icons for subtasks based on the input field's content.
 */
function toggleEditDeleteVisibility() {
    const subtaskInput = document.getElementById('subtask-input');
    const editDelete = subtaskInput.nextElementSibling;
    if (subtaskInput.value.trim() !== '') {
        editDelete.style.display = 'flex';
    } else {
        editDelete.style.display = 'none';
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