/**
 * Validates the input values for a contact form based on the form type (new or edit).
 * This function checks the validity of the provided name, email, and phone values. It uses
 * the appropriate form-specific input IDs and error IDs to validate each input and display
 * any error messages. The function returns a boolean indicating whether all inputs are valid.
 * @function
 * @param {string} name - The name of the contact to validate.
 * @param {string} email - The email address of the contact to validate.
 * @param {string} phone - The phone number of the contact to validate.
 * @param {string} formType - The type of form being used, either 'new' for adding a new contact or 'edit' for editing an existing contact.
 * @returns {boolean} Returns true if all inputs are valid, otherwise returns false.
 */
function validateContactInputs(name, email, phone, formType) {
    let valid = true;
    const nameErrorId = formType === 'new' ? 'nameError' : 'nameError';
    const emailErrorId = formType === 'new' ? 'emailError' : 'emailError';
    const phoneErrorId = formType === 'new' ? 'phoneError' : 'phoneError';
    const nameError = validateName(name, { 
        inputId: formType === 'new' ? 'newContactName' : 'contactName', 
        errorId: nameErrorId 
    });
    const emailError = validateEmail(email, { 
        inputId: formType === 'new' ? 'newContactEmail' : 'contactMailAdress', 
        errorId: emailErrorId 
    });
    const phoneError = validatePhone(phone, { 
        inputId: formType === 'new' ? 'newContactPhone' : 'contactPhone', 
        errorId: phoneErrorId 
    });
    if (nameError) {
        setErrorMessage(nameErrorId, nameError);
        valid = false;
    }
    if (emailError) {
        setErrorMessage(emailErrorId, emailError);
        valid = false;
    }
    if (phoneError) {
        setErrorMessage(phoneErrorId, phoneError);
        valid = false;
    }
    return valid;
}


/**
 * Validates a name input field.
 * The name must contain both a first and last name, start with a capital letter, and contain only letters.
 * @function
 * @param {string} name - The name input to validate.
 * @param {Object} [elementIds={inputId: 'newContactName', errorId: 'nameError'}] - Object containing the IDs of the input and error elements.
 * @param {string} elementIds.inputId - The ID of the input element.
 * @param {string} elementIds.errorId - The ID of the error message element.
 * @returns {string} An error message if the name is invalid, or an empty string if valid.
 */
function validateName(name, elementIds = { inputId: 'newContactName', errorId: 'nameError' }) {
    const NAME_PATTERN = /^[A-ZÄÖÜ][a-zäöü]+(?: [A-ZÄÖÜ][a-zäöü]+)$/;
    if (!name) {
        addErrorClass(elementIds.inputId, elementIds.errorId);
        return 'Please enter a first and last name.';
    }
    if (!NAME_PATTERN.test(name)) {
        addErrorClass(elementIds.inputId, elementIds.errorId);
        return 'The name needs to be changed to: Max Muster.';
    }
    removeErrorClass(elementIds.inputId, elementIds.errorId);
    return '';
}


/**
 * Validates an email address input field.
 * The email address must follow the standard email format.
 * @function
 * @param {string} email - The email address to validate.
 * @param {Object} [elementIds={inputId: 'newContactEmail', errorId: 'emailError'}] - Object containing the IDs of the input and error elements.
 * @param {string} elementIds.inputId - The ID of the input element.
 * @param {string} elementIds.errorId - The ID of the error message element.
 * @returns {string} An error message if the email is invalid, or an empty string if valid.
 */
function validateEmail(email, elementIds = { inputId: 'newContactEmail', errorId: 'emailError' }) {
    const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!EMAIL_PATTERN.test(email)) {
        addErrorClass(elementIds.inputId, elementIds.errorId);
        return 'Please enter a valid email address.';
    }
    removeErrorClass(elementIds.inputId, elementIds.errorId);
    return '';
}


/**
 * Validates a phone number input field.
 * The phone number must not be empty, can only contain numbers, spaces, and the plus sign (+), and must be at least 9 digits long.
 * @function
 * @param {string} phone - The phone number to validate.
 * @param {Object} [elementIds={inputId: 'newContactPhone', errorId: 'phoneError'}] - Object containing the IDs of the input and error elements.
 * @param {string} elementIds.inputId - The ID of the input element.
 * @param {string} elementIds.errorId - The ID of the error message element.
 * @returns {string} An error message if the phone number is invalid, or an empty string if valid.
 */
function validatePhone(phone, elementIds = { inputId: 'newContactPhone', errorId: 'phoneError' }) {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
        addErrorClass(elementIds.inputId, elementIds.errorId);
        return 'Please enter a phone number.';
    }
    const PHONE_PATTERN = /^[\+\d\s]+$/;
    if (!PHONE_PATTERN.test(trimmedPhone)) {
        addErrorClass(elementIds.inputId, elementIds.errorId);
        return 'The phone number can only contain numbers, the plus sign (+), and spaces.';
    }
    const digitsOnly = trimmedPhone.replace(/\D+/g, '');
    if (digitsOnly.length < 9) {
        addErrorClass(elementIds.inputId, elementIds.errorId);
        return 'The phone number must be at least 9 digits long.';
    }
    removeErrorClass(elementIds.inputId, elementIds.errorId);
    return '';
}


/**
 * Adds an error class to the input field and displays the corresponding error message.
 * @function
 * @param {string} inputId - The ID of the input element to highlight.
 * @param {string} errorId - The ID of the error message element to display.
 * @returns {void}
 */
function addErrorClass(inputId, errorId) {
    document.getElementById(inputId).classList.add('input-error');
    document.getElementById(errorId).style.display = 'block';
}


/**
 * Removes the error class from the input field and hides the corresponding error message.
 * @function
 * @param {string} inputId - The ID of the input element to remove the highlight from.
 * @param {string} errorId - The ID of the error message element to hide.
 * @returns {void}
 */
function removeErrorClass(inputId, errorId) {
    document.getElementById(inputId).classList.remove('input-error');
    document.getElementById(errorId).style.display = 'none';
}