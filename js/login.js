let users = [];

/**
 * Initializes the login page.
 * Checks the previous page, displays the login page, and fetches all users.
 */
async function initLogin() {
  checkPreviousPage();
  displayLoginPage();
  await getAllUsers();
}

/**
 * Fetches all users from the database and stores them in the 'users' array.
 */
async function getAllUsers() {
  try {
    users = await getData("users");
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

/**
 * Checks if the previous page is not the sign-up page.
 * Displays the login animation background and logo if the previous page is not the sign-up page.
 */
function checkPreviousPage() {
  if (!document.referrer.includes("signUp.html")) {
    document.getElementById("loginAnimationBg").style.display = "block";
    document.getElementById("loginJoinLogo").style.display = "block";
    document.getElementById("loginJoinLogoNoAnimation").style.display = "none";
  }
}

/**
 * Displays the login page content.
 */
function displayLoginPage() {
  document.getElementById("loginContent").style.display = "flex";
}

/**
 * Redirects the user to the sign-up page.
 */
function goToSignUp() {
  window.location.href = "signUp.html";
}

/**
 * Logs in as a guest, removes any user-specific data from local storage, saves guest data, and redirects to the summary page.
 */
async function guestLogin() {
  await userLoginRemoveLocalStorage();
  await guestLoginSaveLocalStorage();
  window.location.href = "summary.html";
}

/**
 * Logs in a user, removes any guest-specific data from local storage, saves user data, and redirects to the summary page.
 * 
 * @param {Object} user - The user object containing user details.
 */
async function userLogin(user) {
  await guestLoginRemoveLocalStorage();
  await userLoginSaveLocalStorage(user);
  window.location.href = "summary.html";
}

/**
 * Saves guest login data to local storage.
 */
async function guestLoginSaveLocalStorage() {
  localStorage.setItem("guestInitials", "G");
}

/**
 * Removes guest login data from local storage.
 */
async function guestLoginRemoveLocalStorage() {
  localStorage.removeItem("guestInitials");
}

/**
 * Saves user login data to local storage.
 * 
 * @param {Object} user - The user object containing user details.
 */
async function userLoginSaveLocalStorage(user) {
  let userData = {
    initials: user.initials,
    name: user.name
};
  localStorage.setItem("user", btoa(JSON.stringify(userData)));
}

/**
 * Removes user login data from local storage.
 */
async function userLoginRemoveLocalStorage() {
  localStorage.removeItem("user");
}

/**
 * Validates the login form by checking if the entered email and password match a user.
 * If valid, logs in the user; otherwise, shows an error message.
 */
async function validateLoginForm() {
  let email = getEmailFieldValue();
  let password = getPasswordFieldValue();
  let user = users.find((user) => user.email === email && user.password === password);
  let doesEmailExist = checkIfMailExists();

  if (doesEmailExist && user) {
    removeLoginErrorMessage();
    userLogin(user);
  } else {
    showLoginErrorMessage();
  }
}

/**
 * Checks if the entered email exists in the user list.
 * If it exists, hides the error message; otherwise, shows an error message.
 * 
 * @returns {boolean} - Returns true if the email exists, false otherwise.
 */
function checkIfMailExists() {
  let emailField = document.getElementById("email");
  let errorMessage = document.getElementById("loginEmailExists");
  let emailExists = users.some((user) => user.email === emailField.value.trim());

  if (emailExists) {
    errorMessage.style.display = "none";
    emailField.classList.remove("login-input-error");
    return true;
  } else {
    errorMessage.style.display = "block";
    emailField.classList.add("login-input-error");
    return false;
  }
}

/**
 * Gets the value from the password input field.
 * 
 * @returns {string} - The value of the password input field.
 */
function getPasswordFieldValue() {
  let passwordField = document.getElementById("password");
  return passwordField.value;
}

/**
 * Gets the value from the email input field.
 * 
 * @returns {string} - The value of the email input field.
 */
function getEmailFieldValue() {
  let emailField = document.getElementById("email");
  return emailField.value.trim();
}

/**
 * Shows the login error message and adds an error class to the password input field.
 */
function showLoginErrorMessage() {
  let errorMessage = document.getElementById("loginErrorMessage");
  let passwordField = document.getElementById("password");

  errorMessage.style.visibility = "visible";
  passwordField.classList.add("login-input-error");
}

/**
 * Removes the login error message and the error class from the password input field.
 */
function removeLoginErrorMessage() {
  let errorMessage = document.getElementById("loginErrorMessage");
  let passwordField = document.getElementById("password");

  errorMessage.style.visibility = "hidden";
  passwordField.classList.remove("login-input-error");
}

/**
 * Updates the icon on the password input field based on the input value.
 * 
 * @param {HTMLInputElement} inputField - The password input field.
 */
function updateIconOnInput(inputField) {
  let passwordValue = inputField.value;
  let inputFieldImg = document.getElementById("passwordFieldImg");

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
 * Toggles the visibility of the password input field.
 * 
 * This function changes the input type of the password field between 'password' and 'text'
 * to show or hide the password. It also updates the icon accordingly:
 * - If the icon is 'visibility_off', it changes to 'visibility' and shows the password.
 * - If the icon is 'visibility', it changes to 'visibility_off' and hides the password.
 * - If the icon is 'lock', no action is taken as the field is empty.
 */
function showHidePassword() {
  let inputField = document.getElementById("password");
  let inputFieldImg = document.getElementById("passwordFieldImg");

  if (inputFieldImg.src.includes("lock.svg")) {
    return;
  } else if (inputFieldImg.src.includes("visibility_off.svg")) {
    inputFieldImg.src = "./assets/icons/visibility.svg";
    inputField.type = "text";
  } else if (inputFieldImg.src.includes("visibility.svg")) {
    inputFieldImg.src = "./assets/icons/visibility_off.svg";
    inputField.type = "password";
  }
}
