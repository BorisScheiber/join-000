let users = [];


/**
 * Initializes the sign-up page.
 * Fetches all users from firebase.
 */
async function initSignUp() {
  await getAllUsers();
}


/**
 * Fetches all users from firebase and stores them in the 'users' array.
 */
async function getAllUsers() {
  try {
    users = await getData("users");
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


/**
 * Adds a new user to firebase.
 * 
 * @param {Object} newUser - The new user object to add.
 * @returns {Object} - An object containing the new user ID.
 */
async function addNewUser(newUser) {
  let usersResponse = await getData("users");
  let userKeysArray = usersResponse ? Object.keys(usersResponse) : [];
  let newUserId = userKeysArray.length;

  await fetch(`${BASE_URL}users/${newUserId}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });
  return { newUserId };
}


/**
 * Changes the icon next to the input field based on the text entered.
 *
 * - If the input field is empty, it shows a lock icon and keeps the input type as "password".
 * - If the input field has text and the icon is a lock, it changes to the "visibility_off" icon.
 *
 * @param {HTMLInputElement} inputField - The input field to check.
 */
function updateIconOnInput(inputField) {
  let passwordValue = inputField.value;
  let inputIconDiv = inputField.nextElementSibling;
  let inputFieldImg = inputIconDiv.querySelector("img");

  if (passwordValue === "") {
    inputFieldImg.src = "./assets/icons/lock.svg";
    inputFieldImg.classList.remove("cursor-pointer");
    inputField.type = "password";
  } else if (inputFieldImg.src.includes("lock.svg")) {
    inputFieldImg.src = "./assets/icons/visibility_off.svg";
    inputFieldImg.classList.add("cursor-pointer");
  }
}


/**
 * Toggles the visibility of the password in the input field.
 *
 * - If the icon is a lock, it does nothing.
 * - If the icon is "visibility_off", it changes to "visibility" and shows the password.
 * - If the icon is "visibility", it changes to "visibility_off" and hides the password.
 *
 * @param {HTMLImageElement} inputFieldImg - The icon next to the input field that is clicked.
 */
function showHidePassword(inputFieldImg) {
  let inputField = inputFieldImg.parentNode.previousElementSibling;
  switch (true) {
    case inputFieldImg.src.includes("lock.svg"):
      break;
    case inputFieldImg.src.includes("visibility_off.svg"):
      inputFieldImg.src = "./assets/icons/visibility.svg";
      inputField.type = "text";
      break;
    case inputFieldImg.src.includes("visibility.svg"):
      inputFieldImg.src = "./assets/icons/visibility_off.svg";
      inputField.type = "password";
      break;
  }
}


/**
 * Validates the sign-up form by checking if the email and passwords are valid.
 * If valid, creates a new user object and adds the user to firebase.
 * Shows a success overlay and redirects to the login page.
 */
async function validateSignUpForm() {
    let isEmailValid = checkIfMailExists();
    let isPasswordValid = checkIfPasswordsMatch();
    if (isEmailValid && isPasswordValid) {
        let newUser = createNewUserObject();
        try {
            successfullSignUpOverlay();
            await addNewUser(newUser);
            redirectToLogin();
        } catch (error) {
            console.error('Error adding new user:', error);
        }
    }
}


/**
* Shows a success overlay when the sign-up is successful.
*/
function successfullSignUpOverlay() {
  let overlay = document.getElementById('signUpSuccessfull');
  let container = overlay.querySelector('.signup-successfull-container');
  overlay.style.display = 'flex';
  container.classList.add('slide-up');
}


/**
* Redirects the user to the login page after a successful sign-up.
*/
function redirectToLogin() {
  setTimeout(() => {
      window.location.href = './index.html';
    }, 1500);
}


/**
* Creates a new user object with the email, id, initials, name, and password from the input fields.
* 
* @returns {Object} - The new user object.
*/
function createNewUserObject() {
    let newUser = {
        id: generateUUID(),
        email: document.getElementById("email").value.trim(),
        initials: setUserInitials(),
        name: formatUserName(),
        password: document.getElementById("password").value,
    };
    return newUser;
}


/**
 * Checks if the passwords in the input fields match.
 * If they match, hides the error message; otherwise, shows the error message.
 * 
 * @returns {boolean} - Returns true if the passwords match, false otherwise.
 */
function checkIfPasswordsMatch() {
  let passwordField = document.getElementById("password");
  let confirmPasswordField = document.getElementById("confirmPassword");
  let errorMessage = document.getElementById("signUpErrorMessage");
  if (passwordField.value === confirmPasswordField.value) {
    errorMessage.style.visibility = "hidden";
    confirmPasswordField.classList.remove("signup-input-error");
    return true;
  } else {
    errorMessage.style.visibility = "visible";
    confirmPasswordField.classList.add("signup-input-error");
    return false;
  }
}


/**
 * Checks if the email entered in the input field already exists in the user list.
 * If it does not exist, hides the error message; otherwise, shows the error message.
 * 
 * @returns {boolean} - Returns true if the email does not exist, false otherwise.
 */
function checkIfMailExists() {
  let emailField = document.getElementById("email");
  let errorMessage = document.getElementById("signUpEmailTaken");
  let emailExists = users.some((user) => user.email === emailField.value.trim());
  if (!emailExists) {
    errorMessage.style.display = "none";
    emailField.classList.remove("signup-input-error");
    return true;
  } else {
    errorMessage.style.display = "block";
    emailField.classList.add("signup-input-error");
    return false;
  }
}


/**
 * Sets the initials of the user based on the name entered in the input field.
 * 
 * @returns {string} - The initials of the user.
 */
function setUserInitials() {
  let userName = document.getElementById("name").value.toLowerCase();
  let nameParts = userName.split(" ");
  let initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");

  return initials;
}


/**
 * Formats the user's name by capitalizing the first letter of each word.
 * 
 * @returns {string} - The formatted user name.
 */
function formatUserName() {
  let userNameInput = document.getElementById("name");
  let userName = userNameInput.value.trim();
  let formattedUserName = userName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  return formattedUserName;
}


/**
 * Generates a random UUID (Universally Unique Identifier).
 *
 * This function creates a unique ID string that looks like this: 
 * 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
 * The ID is made up of 32 characters (numbers and letters) and is split into five parts by hyphens.
 *
 * @returns {string} A randomly generated UUID.
 */
function generateUUID() { 
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
