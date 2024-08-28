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
 * Validates a contact's name.
 * @function
 * @param {string} name - The contact's name.
 * @returns {string} An error message if the name is invalid, or an empty string if valid.
 */
function validateName(name) {
    const NAME_PATTERN = /^[A-ZÄÖÜ][a-zäöü]+(?: [A-ZÄÖÜ][a-zäöü]+)$/;
    if (!name) {
        return 'Please enter a first and last name.';
    }
    if (!NAME_PATTERN.test(name)) {
        return 'The name may only contain letters and must begin with a capital letter and must contain both first and last names.';
    }
    return '';
}


/**
 * Validates an email address.
 * @function
 * @param {string} email - The email address.
 * @returns {string} An error message if the email is invalid, or an empty string if valid.
 */
function validateEmail(email) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!emailPattern.test(email)) {
        return 'Please enter a valid email address.';
    }
    return '';
}


/**
 * Validates a phone number.
 * This function checks if the provided phone number is not empty, contains only valid characters (numbers, plus sign, and spaces),
 * and has at least 9 digits.
 * @param {string} phone - The phone number to be validated.
 * @returns {string} - An error message if the phone number is invalid; otherwise, an empty string.
 * @example
 * // Valid phone number
 * const result = validatePhone('+123 456 789');
 * console.log(result); // Output: ''
 * @example
 * // Phone number too short
 * const result = validatePhone('123 45');
 * console.log(result); // Output: 'The phone number must be at least 9 digits long.'
 * @example
 * // Phone number contains invalid characters
 * const result = validatePhone('123-456-7890');
 * console.log(result); // Output: 'The phone number can only contain numbers, the plus sign (+), and spaces.'
 * @example
 * // Phone number is empty
 * const result = validatePhone('   ');
 * console.log(result); // Output: 'Please enter a phone number.'
 */
function validatePhone(phone) {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
        return 'Please enter a phone number.';
    }
    const PHONE_PATTERN = /^[\+\d\s]+$/;
    if (!PHONE_PATTERN.test(trimmedPhone)) {
        return 'The phone number can only contain numbers, the plus sign (+), and spaces.';
    }
    const digitsOnly = trimmedPhone.replace(/\D+/g, '');
    if (digitsOnly.length < 9) {
        return 'The phone number must be at least 9 digits long.';
    }
    return '';
}