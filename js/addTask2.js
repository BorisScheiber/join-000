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
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('category-dropdown');
    const dropdownIcon = document.querySelector('.dropdown-icon-category');
    if (dropdown.style.display === 'flex') {
        dropdownIcon.src = '/assets/icons/arrow_drop_up.svg';
    } else {
        dropdownIcon.src = '/assets/icons/arrow_drop_down.svg';
    }
});


// Hide dropdown on clicking outside
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

    const li = document.createElement('li');
    li.className = 'subtask-item';
    li.innerHTML = `
        <div ondblclick="editSubtask(this)" class="subtask-text"><li>${subtaskText}</li>
</div>
        <div class="edit-delete-icons" style="display: none;">
            <img src="/assets/icons/edit.svg" alt="Edit" onclick="editSubtask(this)">
            <div class="vertical-line"></div>
            <img src="/assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(this)">
        </div>
    `;
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
 * @param {HTMLElement} element - The element that triggered the edit action (e.g., the subtask text or edit icon).
 */
function editSubtask(element) {
    const subtask = document.getElementById("subtask-list");
    const li = element.closest('li');
    const subtaskText = element.tagName.toLowerCase() === 'div' ? element.innerText : element.closest('li').querySelector('.subtask-text').innerText;

    // Setze Padding auf 0 beim Bearbeiten
    subtask.style.paddingLeft = '0px';
    li.style.paddingLeft = '0';

    li.innerHTML = `
        <div class="subtask-content">
            <div class="edit-div">
                <input type="text" class="input-field-editing" value="${subtaskText}">
                <div class="edit-delete">
                    <img src="/assets/icons/done.svg" alt="Done" onclick="saveSubtask(this)">
                    <div class="vertical-line"></div>
                    <img src="/assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(this)">
                </div>
            </div>
        </div>
    `;
    const subtaskInput = li.querySelector('input');
    subtaskInput.focus();
}


/**
 * Saves the edited subtask, replacing the input field with the updated text.
 *
 * @param {HTMLElement} element - The element that triggered the save action (e.g., the done icon).
 */
function saveSubtask(element) {
    const subtask = document.getElementById("subtask-list");
    const li = element.closest('li');
    const subtaskInput = li.querySelector('input');
    const newText = subtaskInput.value.trim();
    if (newText === '') return;

    // Setze Padding auf 20px nach dem Speichern
    subtask.style.paddingLeft = '20px';
    li.style.paddingLeft = '20px';

    li.innerHTML = `
        <div ondblclick="editSubtask(this)" class="subtask-text"><li>${newText}</li></div>
        <div class="edit-delete-icons" style="display: none;">
            <img src="/assets/icons/edit.svg" alt="Edit" onclick="editSubtask(this)">
            <div class="vertical-line"></div>
            <img src="/assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(this)">
        </div>
    `;
}

// Optional: Add CSS to make the edit-delete div visible when its parent li is in edit mode
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


//Dieser hört auf Änderungen im Eingabefeld und ruft toggleEditDeleteVisibility auf, 
//um die edit-delete-Div je nach Inhalt des Eingabefelds anzuzeigen oder auszublenden.
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
document.getElementById('subtask-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSubtask();
    }
});
