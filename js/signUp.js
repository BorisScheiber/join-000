let users = [];

async function initSignUp() {
  await getAllUsers();
}

async function getAllUsers() {
  try {
    users = await getData("users");
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

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

async function validateSignUpForm() {
    let isEmailValid = checkIfMailExists();
    let isPasswordValid = checkIfPasswordsMatch();
    
    if (isEmailValid && isPasswordValid) {
        let newUser = createNewUserObject();
        
        try {
            successfullSignUpOverlay();
            let response = await addNewUser(newUser);
            console.log('User successfully added:', response);
            redirectToLogin();
            
        } catch (error) {
            console.error('Error adding new user:', error);
        }
    }
}

  function successfullSignUpOverlay() {
    let overlay = document.getElementById('signUpSuccessfull');
    let container = overlay.querySelector('.signup-successfull-container');
    
    overlay.style.display = 'flex';
    container.classList.add('slide-up');
  }

  function redirectToLogin() {
    setTimeout(() => {
        window.location.href = './index.html';
      }, 1500);
  }

function createNewUserObject() {
    let newUser = {
        email: document.getElementById("email").value.trim(),
        initials: setUserInitials(),
        name: formatUserName(),
        password: document.getElementById("password").value,
    };
    return newUser;
}

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

function setUserInitials() {
  let userName = document.getElementById("name").value.toLowerCase();
  let nameParts = userName.split(" ");
  let initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");

  return initials;
}

function formatUserName() {
    let userNameInput = document.getElementById("name");
    let userName = userNameInput.value.trim();
    let formattedUserName = userName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    return formattedUserName;
}