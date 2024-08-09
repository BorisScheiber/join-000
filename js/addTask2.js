/**
 * Gets an array of names of the assigned contacts.
 * It selects all checked checkboxes in the contact list,
 * extracts the name from the parent element of each checkbox,
 * and returns an array of these names.
 *
 * @returns {Array<string>} An array of assigned contact names.
 */
function getAssignedContacts() {
    return Array.from(document.querySelectorAll(".contact-list .contact-checkbox.checked"))
      .map(checkbox => checkbox.parentElement.querySelector("span:nth-child(2)").textContent);
  }
  

  /**
   * Gets an array of subtask texts from the subtask list.
   * It selects all subtask items in the list,
   * extracts the text content from the 'subtask-text' element within each item,
   * and returns an array of these texts.
   *
   * @returns {Array<string>} An array of subtask texts.
   */
  function getSubtasks() {
    return Array.from(document.querySelectorAll("#subtask-list .subtask-item"))
      .map(item => item.querySelector('.subtask-text').innerText);
  }
  

/**
 * Shows a popup message indicating that the task has been created successfully.
 */
function showTaskCreatedPopup() {
    const popup = document.getElementById('taskCreatedPopup');
    popup.classList.add('show'); // Add the 'show' class to trigger the animation

    // Hide the popup after 2 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}


/**
 * Handles the input event on input fields, resetting the border color and removing error messages.
 *
 * @param {Event} event - The input event.
 */
function handleInput(event) {
    const field = event.target;
    if (field.value.trim() !== "") {
        field.style.border = '1px solid rgba(41, 171, 226, 1)';
        removeErrorMessage(field);
    }
}


/**
 * Handles the blur event on input fields, validating the input and displaying error messages if necessary.
 *
 * @param {Event} event - The blur event.
 */
function handleBlur(event) {
    const field = event.target;
    if (field.value.trim() !== "") {
        field.style.border = '1px solid rgba(209, 209, 209, 1)';
    } else {
        if (field.id !== 'description') {
            field.style.border = '1px solid rgba(255, 129, 144, 1)';
            showErrorMessage(field, 'This field is required');
        } else {
            field.style.border = '1px solid rgba(209, 209, 209, 1)';
            removeErrorMessage(field);
        }
    }
    // Reset category-field border when focusing out of any field
  if (field.id !== 'category') {
    document.getElementById('category-field').style.border = '1px solid rgba(209, 209, 209, 1)';
  }
}


/**
 * Adds input event listeners to the 'title', 'description', 'due-date', and 'category-field' input fields.
 * The `handleInput` function will be called whenever the user types into these fields.
 */
document.getElementById('title').addEventListener('input', handleInput);
document.getElementById('description').addEventListener('input', handleInput);
document.getElementById('due-date').addEventListener('input', handleInput);
document.getElementById('category-field').addEventListener('input', handleInput);


/**
 * Adds blur event listeners to the 'title', 'description', 'due-date', and 'category-field' input fields.
 * The `handleBlur` function will be called when the user moves focus away from these fields.
 */
document.getElementById('title').addEventListener('blur', handleBlur);
document.getElementById('description').addEventListener('blur', handleBlur);
document.getElementById('due-date').addEventListener('blur', handleBlur);
document.getElementById('category-field').addEventListener('blur', handleBlur);


/**
 * Prevents the default form submission behavior for the form with the ID 'recipeForm'.
 * This is likely used to handle form submission using JavaScript instead of the default browser behavior.
 */
document.getElementById('recipeForm').onsubmit = function (event) {
    event.preventDefault();
};


// //for Prio buttons
// let currentPriority = "medium";

// /**
//  * Sets the priority level for the task.
//  *
//  * @param {string} level - The priority level ('urgent', 'medium', or 'low').
//  */
// function setPriority(level) {
//     const buttons = document.querySelectorAll('.priority-button');

//     // Reset all buttons first
//     buttons.forEach(button => resetButtonStyles(button));

//     // Set the styles for the clicked button
//     const activeButton = document.getElementById(`${level}-button`);
//     activeButton.style.backgroundColor = getPriorityColor(level);
//     activeButton.style.color = 'rgba(255, 255, 255, 1)'; // Change text color
//     activeButton.style.fontFamily = 'Inter'; // Change font family
//     activeButton.style.fontSize = '21px'; // Change font size
//     activeButton.style.fontWeight = '700'; // Change font weight
//     activeButton.style.lineHeight = '25.2px'; // Change line height
//     activeButton.style.textAlign = 'left'; // Change text align
//     activeButton.querySelector('img').src = `/assets/icons/${level}White.svg`;

//     // Remove hover effect from the selected button
//     activeButton.classList.add('selected'); // Add a class to the selected button
//     // Update the current priority
//     currentPriority = level;
// }


// /**
//  * Resets the styles of a priority button to their default state.
//  *
//  * @param {HTMLElement} button - The priority button to reset.
//  */
// function resetButtonStyles(button) {
//     button.classList.remove('selected'); // Remove the class when resetting

//     button.style.backgroundColor = 'rgba(255, 255, 255, 1)'; // Reset background color
//     button.style.color = 'rgba(0, 0, 0, 1)'; // Reset text color
//     button.style.fontFamily = 'Inter'; // Reset font family
//     button.style.fontSize = '20px'; // Reset font size
//     button.style.fontWeight = '400'; // Reset font weight
//     button.style.lineHeight = '24px'; // Reset line height
//     button.style.textAlign = 'left'; // Reset text align
//     const img = button.querySelector('img');
//     switch (button.id) {
//         case 'urgent-button':
//             img.src = '/assets/icons/urgent.svg';
//             break;
//         case 'medium-button':
//             img.src = '/assets/icons/medium.svg';
//             break;
//         case 'low-button':
//             img.src = '/assets/icons/low.svg';
//             break;
//     }
// }


// /**
//  * Gets the background color for a priority level.
//  *
//  * @param {string} level - The priority level ('urgent', 'medium', or 'low').
//  * @returns {string} The background color for the priority level.
//  */
// function getPriorityColor(level) {
//     switch (level) {
//         case 'urgent':
//             return 'rgba(255, 61, 0, 1)';
//         case 'medium':
//             return 'rgba(255, 168, 0, 1)';
//         case 'low':
//             return 'rgba(122, 226, 41, 1)';
//         default:
//             return 'rgba(255, 255, 255, 1)';
//     }
// }
//for Prio buttons
let currentPriority = "medium";

/**
 * Sets the priority level for the task.
 *
 * @param {string} level - The priority level ('urgent', 'medium', or 'low').
 */
function setPriority(level) {
    const buttons = document.querySelectorAll('.priority-button');

    // Reset all buttons first
    buttons.forEach(button => resetButtonStyles(button));

    // Set the styles for the clicked button
    const activeButton = document.getElementById(`${level}-button`);
    activeButton.classList.add(level); // Add the level as a class for styling
    activeButton.querySelector('img').src = `/assets/icons/${level}White.svg`;

    // Remove hover effect from the selected button
    activeButton.classList.add('selected'); 
    // Update the current priority
    currentPriority = level;
}


/**
 * Resets the styles of a priority button to their default state.
 *
 * @param {HTMLElement} button - The priority button to reset.
 */
function resetButtonStyles(button) {
    button.classList.remove('selected'); // Remove the class when resetting
    button.classList.remove('urgent', 'medium', 'low'); // Remove all priority classes

    const img = button.querySelector('img');
    switch (button.id) {
        case 'urgent-button':
            img.src = '/assets/icons/urgent.svg';
            break;
        case 'medium-button':
            img.src = '/assets/icons/medium.svg';
            break;
        case 'low-button':
            img.src = '/assets/icons/low.svg';
            break;
    }
}


/**
 * Gets the background color for a priority level.
 *
 * @param {string} level - The priority level ('urgent', 'medium', or 'low').
 * @returns {string} The background color for the priority level.
 */
function getPriorityColor(level) {
    switch (level) {
        case 'urgent':
            return 'rgba(255, 61, 0, 1)';
        case 'medium':
            return 'rgba(255, 168, 0, 1)';
        case 'low':
            return 'rgba(122, 226, 41, 1)';
        default:
            return 'rgba(255, 255, 255, 1)';
    }
}


// For Category

/**
 * Shows an error message for the category field.
 *
 * @param {string} message - The error message to display.
 */
function showErrorMessageCategory(message) {
    const categoryField = document.getElementById('category-dropdown');
    let errorElement = categoryField.nextElementSibling;
  
    if (!errorElement || !errorElement.classList.contains('error-message')) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      categoryField.parentNode.insertBefore(errorElement, categoryField.nextSibling);
    }
  
    errorElement.textContent = message;
  }
  

  /**
   * Removes the error message for the category field.
   */
  function removeErrorMessageCategory() {
    const categoryField = document.getElementById('category-dropdown');
    const errorElement = categoryField.nextElementSibling;
  
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.remove();
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
  const categoryField = document.getElementById('category-field');
  categoryInput.value = category;
  toggleCategoryDropdown();
  categoryField.style.border = '1px solid rgba(41, 171, 226, 1)';
  removeErrorMessageCategory(); // Remove the error message
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