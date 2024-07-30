let users = [];


async function initLogin() {
  checkPreviousPage();
  displayLoginPage();
  await getAllUsers();
}

async function getAllUsers() {
  try {
    users = await getData("users");
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


function checkPreviousPage() {
  if (!document.referrer.includes("signUp.html")) {
    document.getElementById("loginAnimationBg").style.display = "block";
    document.getElementById("loginJoinLogo").style.display = "block";
    document.getElementById("loginJoinLogoNoAnimation").style.display = "none";
  }
}


function displayLoginPage() {
  document.getElementById("loginContent").style.display = "flex";
}


function goToSignUp() {
  window.location.href = "signUp.html";
}


async function guestLogin() {
  await userLoginRemoveLocalStorage();
  await guestLoginSaveLocalStorage();
  window.location.href = "summary.html";
}


async function userLogin(user) {
  await guestLoginRemoveLocalStorage();
  await userLoginSaveLocalStorage(user);
  window.location.href = "summary.html";
}


async function guestLoginSaveLocalStorage() {
  localStorage.setItem("guestInitials", "G");
}


async function guestLoginRemoveLocalStorage() {
  localStorage.removeItem("guestInitials");
}


async function userLoginSaveLocalStorage(user) {
  localStorage.setItem("userInitials", btoa(user.initials));
  localStorage.setItem("userName", btoa(user.name));
}


async function userLoginRemoveLocalStorage() {
  localStorage.removeItem("userInitials");
  localStorage.removeItem("userName");
}


async function validateLoginForm() {
  let email = getEmailFieldValue();
  let password = getPasswordFieldValue();
  let user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    removeLoginErrorMessage();
    userLogin(user);
  } else {
    console.log("Login failed: Incorrect email or password");
    showLoginErrorMessage();
  }
}


function getPasswordFieldValue() {
  let passwordField = document.getElementById("password");
  return passwordField.value;
}


function getEmailFieldValue() {
  let emailField = document.getElementById("email");
  return emailField.value.trim();
}


function showLoginErrorMessage() {
  let errorMessage = document.getElementById("loginErrorMessage");
  let passwordField = document.getElementById("password");

  errorMessage.style.visibility = "visible";
  passwordField.classList.add("login-input-error");
}


function removeLoginErrorMessage() {
  let errorMessage = document.getElementById("loginErrorMessage");
  let passwordField = document.getElementById("password");

  errorMessage.style.visibility = "hidden";
  passwordField.classList.remove("login-input-error");
}


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
