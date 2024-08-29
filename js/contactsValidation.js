/**
 * Validates the contact input fields for name, email, and phone.
 * @param {string} name - The name input value to validate.
 * @param {string} email - The email input value to validate.
 * @param {string} phone - The phone input value to validate.
 * @returns {boolean} - Returns `true` if all inputs are valid, otherwise `false`.
 */
function validateContactInputs(name, email, phone) {
    const validations = [
        { error: validateName(name), elementId: 'nameError' },
        { error: validateEmail(email), elementId: 'emailError' },
        { error: validatePhone(phone), elementId: 'phoneError' },
    ];
    let valid = true;
    validations.forEach(({ error, elementId }) => {
        if (error) {
            setErrorMessage(elementId, error);
            valid = false;
        }
    });
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
        return 'The name may only contain letters and must begin with a capital letter and must contain both first and last names.';
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