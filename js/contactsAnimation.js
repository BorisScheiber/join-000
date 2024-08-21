/**
 * Closes the contact editing form.
 * 
 * @function
 * @returns {void}
 */
function closeEditContact() {
    const editContactContainer = document.getElementById('editContact');
    editContactContainer.classList.add('hide');
    editContactContainer.classList.remove('show');
    setTimeout(() => {
        editContactContainer.style.display = 'none';
    }, 400);
}

/**
 * Changes the icon of a button element.
 * 
 * @function
 * @param {HTMLElement} button - The button element to change the icon for.
 * @param {string} newIcon - The new icon file name.
 * @returns {void}
 */
function changeIcon(button, newIcon) {
    const img = button.querySelector('img');
    if (img) {
        img.src = `./assets/icons/${newIcon}`;
    }
}

/**
 * Opens the "Add New Contact" form.
 * 
 * @function
 * @returns {void}
 */
function openNewContactWindow() {
    const newContactContainer = document.getElementById('newContact');
    newContactContainer.classList.add('show');
    newContactContainer.classList.remove('hide');
}

/**
 * Opens the "Edit Contact" form.
 * 
 * @function
 * @returns {void}
 */
function openEditContactWindow() {
    const editContactContainer = document.getElementById('editContact');
    editContactContainer.classList.add('show');
    editContactContainer.classList.remove('hide');
}

/**
 * Checks if a click happened outside the "Add New Contact" form and closes it if so.
 * 
 * @function
 * @param {Event} event - The click event.
 * @returns {void}
 */
function checkClickOutsideAddNewContact(event) {
    const newContactContainer = document.getElementById('newContact');
    if (event.target === newContactContainer) {
        closeNewContact();
    }
}

/**
 * Checks if a click happened outside the "Edit Contact" form and closes it if so.
 * 
 * @function
 * @param {Event} event - The click event.
 * @returns {void}
 */
function checkClickOutsideEditContact(event) {
    const editContactContainer = document.getElementById('editContact');
    if (event.target === editContactContainer) {
        closeEditContact();
    }
}

/**
 * Closes the "Add New Contact" form with an animation.
 * 
 * @function
 * @returns {void}
 */
function closeNewContact() {
    const newContactContainer = document.getElementById('newContact');
    newContactContainer.classList.add('hide');
    newContactContainer.classList.remove('show');
    setTimeout(() => {
        newContactContainer.style.display = 'none';
    }, 400);
}

/**
 * Closes the "Edit Contact" form with an animation.
 * 
 * @function
 * @returns {void}
 */
function closeEditContact() {
    const editContactContainer = document.getElementById('editContact');
    editContactContainer.classList.add('hide');
    editContactContainer.classList.remove('show');
    setTimeout(() => {
        editContactContainer.style.display = 'none';
    }, 400);
}

/**
 * Prevents click events from propagating to parent elements.
 * 
 * @function
 * @param {Event} event - The click event.
 * @returns {void}
 */
function preventClickPropagation(event) {
    event.stopPropagation();
}

/**
 * Closes the contact detail card by reloading the current page.
 */
function closeContactDetailCard() {
    window.location.reload();
}

/**
 * Toggles the visibility of the contact detail edit dropdown menu.
 * If the dropdown is currently visible, it slides out and hides the dropdown.
 * If the dropdown is currently hidden, it slides in and shows the dropdown.
 */
function toggleContactDetailEditDropdown() {
    let dropdown = document.getElementById("contactDetailEditDropDown");
    if (dropdown.style.display === "flex") {
      slideOutContactDropdown(dropdown);
      document.removeEventListener("click", closeContactDetailEditDropdownOnClickOutside);
    } else {
      slideInContactDropdown(dropdown);
      document.addEventListener("click", closeContactDetailEditDropdownOnClickOutside);
    }
}
  
/**
 * Slides in the contact detail edit dropdown menu by adding the appropriate animation class
 * and setting its display to "flex".
 * 
 * @param {HTMLElement} element - The dropdown menu element to slide in.
 */
function slideInContactDropdown(element) {
    element.style.display = "flex";
    element.classList.remove("slide-out-contact-dropdown");
    element.classList.add("slide-in-contact-dropdown");
}
  
/**
 * Slides out the contact detail edit dropdown menu by adding the appropriate animation class.
 * After the animation is complete, the dropdown is hidden by setting its display to "none".
 * 
 * @param {HTMLElement} element - The dropdown menu element to slide out.
 */
function slideOutContactDropdown(element) {
    element.classList.remove("slide-in-contact-dropdown");
    element.classList.add("slide-out-contact-dropdown");
        setTimeout(() => {
     element.style.display = "none";
     element.classList.remove("slide-out-contact-dropdown");
    }, 200);
}
  
/**
 * Closes the contact detail edit dropdown menu if the user clicks outside of it.
 * This function is triggered by a click event listener added when the dropdown is shown.
 * 
 * @param {Event} event - The click event triggered by the user's interaction.
 */
function closeContactDetailEditDropdownOnClickOutside(event) {
    let dropdown = document.getElementById("contactDetailEditDropDown");
    let toggleButton = document.querySelector(".contact-detail-edit-button-mobile");
    if (!dropdown.contains(event.target) && !toggleButton.contains(event.target)) {
      slideOutContactDropdown(dropdown);
      document.removeEventListener("click", closeContactDetailEditDropdownOnClickOutside);
    }
}