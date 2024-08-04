/**
 * Initializes the summary page.
 * Sets the greeting, displays the username, and updates the mobile greeting.
 */
function initSummary() {
  getGreeting();
  displayUserName();
  getGreetingAndUserNameMobile();
}

/**
 * Returns a greeting message based on the current time.
 * 
 * @param {number} time - The current hour in 24-hour format.
 * @returns {string} - The appropriate greeting message.
 */
function getGreetingMessage(time) {
  switch (true) {
    case time >= 0 && time < 6:
      return "Good Night";
    case time >= 6 && time < 12:
      return "Good Morning";
    case time >= 12 && time < 14:
      return "Good Noon";
    case time >= 14 && time < 18:
      return "Good Afternoon";
    case time >= 18 && time < 24:
      return "Good Evening";
    default:
      return "Hello";
  }
}

/**
 * Sets the greeting message in the summary based on the current time.
 * Adds a comma if the user is logged in.
 */
function getGreeting() {
  let time = new Date().getHours();
  let greeting = getGreetingMessage(time);
  greeting += addCommaIfUserIsLoggedIn();
  document.getElementById("summaryGreeting").innerHTML = greeting;
}

/**
 * Displays the username from local storage in the summary.
 * If the user is logged in, their name is displayed.
 */
function displayUserName() {
  let user = localStorage.getItem("user");
  if (user) {
    let userData = JSON.parse(atob(user));
    let userName = userData.name;
    document.getElementById("summaryGreetingName").innerHTML = userName;
  }
}

/**
 * Adds a comma to the greeting if the user is logged in.
 * 
 * @returns {string} - A comma if the user is logged in, otherwise an empty string.
 */
function addCommaIfUserIsLoggedIn() {
  return localStorage.getItem("user") ? "," : "";
}

/**
 * Updates the mobile greeting with the greeting and username.
 * If the username is empty, an exclamation mark is added to the greeting.
 */
function getGreetingAndUserNameMobile() {
  let getGreeting = document.getElementById("summaryGreeting").innerText;
  let getUserName = document.getElementById("summaryGreetingName").innerText;
  let greetingElement = document.getElementById("summaryGreetingMobile");
  let getUserNameElement = document.getElementById("summaryGreetingNameMobile");

  if (getUserName === "") {
    greetingElement.innerHTML = getGreeting + "!";
  } else {
    greetingElement.innerHTML = getGreeting;
    getUserNameElement.innerHTML = getUserName;
  }
  addAnimationToGreetingMobile();
}

/**
 * Adds a fade-out animation to the mobile greeting if the previous page was the login page.
 * After the animation, the mobile greeting is hidden.
 */
function addAnimationToGreetingMobile() {
  let loginPage = document.referrer.includes("index.html");
  let greetingContainer = document.querySelector(".summary-greeting-mobile");
  if (loginPage) {
    greetingContainer.style.animation = "fadeOutGreetingMobile 2s forwards";
    setTimeout(() => {
      greetingContainer.classList.add("d-none");
    }, 2000);
  } else {
    greetingContainer.style.display = "none";
  }
}
