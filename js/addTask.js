
/**
 * Toggles the visibility of the contact list.
 */
function toggleContactList() {
    const contactList = document.getElementById("contact-list");
    const contactSearch = document.getElementById("contact-search");
    const selectedContacts = document.getElementById("selected-contacts");
    const toggleButton = document.getElementById("toggle-list");
    const dropdownIcon = toggleButton.querySelector(".dropdown-icon");

    // Use classList.toggle to consistently manage the hidden class
    contactList.classList.toggle("hidden");
    if (contactList.classList.contains("hidden")) {
        contactSearch.style.borderRadius = "10px";
        dropdownIcon.src = "/assets/icons/arrow_drop_down.svg";
        selectedContacts.style.display = "flex";
        document.removeEventListener('click', closeContactListOnClickOutside);
    } else {
        contactSearch.style.borderRadius = "10px 10px 0 0";
        dropdownIcon.src = "/assets/icons/arrow_drop_up.svg";
        selectedContacts.style.display = "none";
        document.addEventListener('click', closeContactListOnClickOutside);
    }
}


/**
 * Filters the contact list based on the search term entered in the contact search field.
 */
function filterContacts() {
    const searchTerm = document.getElementById("contact-search").value.toLowerCase();
    const contactItems = document.querySelectorAll("#contact-list .contact-item");
    contactItems.forEach(item => {
        const name = item.textContent.toLowerCase();
        item.style.display = name.includes(searchTerm) ? "" : "none";
    });

    // Öffne die Liste, wenn sie versteckt ist
    const contactList = document.getElementById("contact-list");
    const isListOpen = !contactList.classList.contains("hidden");
    if (!isListOpen) {
        toggleContactList(); // Liste öffnen
    }
}


/**
 * Closes the contact list when the user clicks outside of it.
 *
 * @param {Event} event - The click event.
 */
function closeContactListOnClickOutside(event) {
    const contactList = document.getElementById("contact-list");
    const contactSearch = document.getElementById("contact-search");
    const toggleButton = document.getElementById("toggle-list");
    const selectedContacts = document.getElementById("selected-contacts");

    if (!contactList.contains(event.target) && !contactSearch.contains(event.target) && !toggleButton.contains(event.target)) {
        toggleContactList(); // Liste schließen
        selectedContacts.style.display = "flex"; // Selected Contacts anzeigen
    }
}


/**
 * Initializes the contact list on page load.
 * Fetches contacts from Firebase, creates contact items, and sets up event listeners.
 */
document.addEventListener("DOMContentLoaded", async () => {
    const contactList = document.getElementById("contact-list");
    const contactSearch = document.getElementById("contact-search");
    try {
      const contactsData = await getData("contacts");
      if (contactsData) {
        const firebaseContacts = Object.values(contactsData);
        firebaseContacts.forEach(contact => createContactItem(contact, contactList));
      } else {
        console.log("No contacts found in Firebase.");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
    contactSearch.addEventListener("input", filterContacts);
    setPriority('medium');
  });
  

  /**
   * Creates a contact item element and appends it to the contact list.
   * @param {Object} contact - The contact data.
   * @param {HTMLElement} contactList - The contact list element.
   */
  function createContactItem(contact, contactList) {
    const contactItem = document.createElement("div");
    contactItem.classList.add("contact-item");
    const nameParts = contact.name.split(" ");
    const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
    contactItem.innerHTML = `
      <div class="contact-logo" style="background-color: ${contact.color};" data-background="${contact.color}">
          ${initials} 
      </div>
      <span>${contact.name}</span>
      <div class="contact-checkbox" data-email="${contact.email}"></div>
    `;
    contactList.appendChild(contactItem);
  }


/**
 * Adds a click event listener to the contact list.
 * When a contact item is clicked, it toggles the 'checked' class on the checkbox and the contact item itself,
 * and then updates the display of selected contacts.
 */
document.getElementById("contact-list").addEventListener("click", (event) => {
    const contactItem = event.target.closest(".contact-item");
    if (contactItem) {
        const checkbox = contactItem.querySelector(".contact-checkbox");
        checkbox.classList.toggle("checked");
        contactItem.classList.toggle("checked");
        updateSelectedContacts();
    }
});


/**
 * Updates the display of selected contacts.
 */
function updateSelectedContacts() {
    const selectedContacts = document.getElementById("selected-contacts");
    selectedContacts.innerHTML = ''; // Clear the existing content

    const selectedCheckboxes = document.querySelectorAll("#contact-list .contact-checkbox.checked");
    selectedCheckboxes.forEach(checkbox => {
        const contactItem = checkbox.parentElement;
        const logo = contactItem.querySelector(".contact-logo");

        // Create the selected contact element directly using innerHTML
        selectedContacts.innerHTML += `
            <div class="selected-contact" style="background-color: ${logo.dataset.background}">
                ${logo.innerText}
            </div>
        `;
    });
}


// Open dropdown when typing in search field
document.getElementById('contact-search').addEventListener('input', function () {
    document.getElementById('contact-list').style.display = 'block';
    filterContacts(); // Assuming this function filters contacts based on input
});


/**
 * Clears all input fields, resets styles, and clears error messages.
 */
function clearFields() {
  clearInputFields();
  resetInputBorders();
  removeErrorMessages();
  resetContactCheckboxes();
  clearSelectedContacts();
  clearSubtaskList();
  resetPriority();
}


/**
 * Clears the values of all specified input fields.
 */
function clearInputFields() {
    const inputIds = ["title", "description", "contact-search", "due-date", "category", "subtask-input"];
    inputIds.forEach(id => document.getElementById(id).value = "");
  }
  

  /**
   * Resets the borders of all specified input fields to their default style.
   */
  function resetInputBorders() {
    const inputIds = ["title", "description", "due-date", "category-field", "contact-search", "subtask-input"];
    inputIds.forEach(id => document.getElementById(id).style.border = '1px solid rgba(209, 209, 209, 1)');
  }
  

  /**
   * Removes all error messages from the form.
   */
  function removeErrorMessages() {
    const errorIds = ["title", "category-container", "due-date"];
    errorIds.forEach(id => removeErrorMessage(document.getElementById(id)));
    document.querySelectorAll('.error-message').forEach(errorElement => errorElement.textContent = '');
  }
  

  /**
   * Resets all contact checkboxes in the contact list to their unchecked state.
   */
  function resetContactCheckboxes() {
    document.querySelectorAll(".contact-checkbox").forEach(checkbox => {
      checkbox.classList.remove("checked");
      checkbox.parentElement.classList.remove("checked");
    });
  }
  

  /**
   * Clears the display of selected contacts.
   */
  function clearSelectedContacts() {
    document.getElementById("selected-contacts").innerHTML = "";
  }
  

  /**
   * Clears the subtask list.
   */
  function clearSubtaskList() {
    document.getElementById("subtask-list").innerHTML = "";
  }
  

  /**
   * Resets the priority buttons to the default 'medium' priority.
   */
  function resetPriority() {
    setPriority('medium');
    currentPriority = "medium";
  }
  

/**
 * Removes the error message associated with a specific field.
 *
 * @param {HTMLElement} field - The input field for which to remove the error message.
 */
function removeErrorMessage(field) {
    let errorElement = field.nextElementSibling;
    // if (field.id === 'category') {
    //     errorElement = document.getElementById('category-error');
    // }
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}


/**
 * Validates the due date to ensure it's in the correct format (YYYY-MM-DD) and a future date.
 *
 * @param {string} dueDate - The due date string to validate.
 * @returns {string} An error message if the date is invalid, otherwise an empty string.
 */
function validateDueDate(dueDate) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regular expression for YYYY-MM-DD format
    if (!datePattern.test(dueDate)) {
        return 'Please enter a valid date in YYYY-MM-DD format.';
    }
    const today = new Date();
    const selectedDate = new Date(dueDate);

    if (selectedDate <= today) {
        return 'Please enter a future date.';
    }

    return ''; // No error
}


/**
 * Validates all input fields in the form.
 *
 * @returns {boolean} True if all fields are valid, otherwise false.
 */
function validateFields() {
    const fields = [
      { id: 'title', element: document.getElementById('title') },
      { id: 'category', element: document.getElementById('category'), fieldElement: document.getElementById('category-field') },
      { id: 'due-date', element: document.getElementById('due-date') }
    ];
  
    let isValid = true;
    fields.forEach(field => {
      if (field.element.value.trim() === "") {
        (field.fieldElement || field.element).style.border = '1px solid rgba(255, 129, 144, 1)';
        showErrorMessage(field.element, 'This field is required');
        isValid = false;
      } else if (field.id === 'due-date') {
        const dueDateError = validateDueDate(field.element.value);
        field.element.style.border = dueDateError ? '1px solid rgba(255, 129, 144, 1)' : '1px solid rgba(41, 171, 226, 1)';
        dueDateError ? showErrorMessage(field.element, dueDateError) : removeErrorMessage(field.element);
        isValid = isValid && !dueDateError;
      } else {
        (field.fieldElement || field.element).style.border = '1px solid rgba(41, 171, 226, 1)';
        removeErrorMessage(field.element);
      }
    });
    return isValid;
  }
  

  /**
 * Handles the form submission event.
 * Prevents the default form submission behavior and calls the `createTask` function.
 *
 * @param {Event} event - The form submission event.
 */
document.getElementById('recipeForm').onsubmit = function (event) {
    event.preventDefault();
    createTask();
};


/**
 * Shows an error message for a specific field.
 *
 * @param {HTMLElement} field - The input field for which to show the error message.
 * @param {string} message - The error message to display.
 */
function showErrorMessage(field, message) {
    let errorElement = field.nextElementSibling;
  
    // Check if an error message element already exists
    if (!errorElement || !errorElement.classList.contains('error-message')) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      field.parentNode.insertBefore(errorElement, field.nextSibling); // Insert after the field
    }
    errorElement.textContent = message;
  }
  

  /**
 * Removes the error message associated with a specific field.
 *
 * @param {HTMLElement} field - The input field for which to remove the error message.
 */
  function removeErrorMessage(field) {
    let errorElement = field.nextElementSibling;
    if (field.id === 'category') {
      errorElement = document.getElementById('category-error');
    }
    // Check if errorElement exists and has the 'error-message' class
    if (errorElement && errorElement.classList.contains('error-message')) { 
      errorElement.remove();
    }
  }
  

  /**
 * Sends a POST request to the Firebase database to save data.
 *
 * @param {string} path - The path in the Firebase database where the data should be saved.
 * @param {object} data - The data to be saved.
 * @returns {Promise<object>} A promise that resolves with the response from the Firebase database.
 */
async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseAsJson = await response.json();
}


/**
 * Creates a new task object and saves it to Firebase.
 */
async function createTask() {
    if (!validateFields()) return;
  
    const newTask = {
      id: Date.now(),
      Title: document.getElementById('title').value.trim(),
      Description: document.getElementById('description').value.trim(),
      Assigned_to: getAssignedContacts(),
      Due_date: document.getElementById('due-date').value,
      Prio: currentPriority,
      Category: document.getElementById('category').value.trim(),
      Subtasks: getSubtasks()
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
    activeButton.style.backgroundColor = getPriorityColor(level);
    activeButton.style.color = 'rgba(255, 255, 255, 1)'; // Change text color
    activeButton.style.fontFamily = 'Inter'; // Change font family
    activeButton.style.fontSize = '21px'; // Change font size
    activeButton.style.fontWeight = '700'; // Change font weight
    activeButton.style.lineHeight = '25.2px'; // Change line height
    activeButton.style.textAlign = 'left'; // Change text align
    activeButton.querySelector('img').src = `/assets/icons/${level}White.svg`;

    // Remove hover effect from the selected button
    activeButton.classList.add('selected'); // Add a class to the selected button
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

    button.style.backgroundColor = 'rgba(255, 255, 255, 1)'; // Reset background color
    button.style.color = 'rgba(0, 0, 0, 1)'; // Reset text color
    button.style.fontFamily = 'Inter'; // Reset font family
    button.style.fontSize = '20px'; // Reset font size
    button.style.fontWeight = '400'; // Reset font weight
    button.style.lineHeight = '24px'; // Reset line height
    button.style.textAlign = 'left'; // Reset text align
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
