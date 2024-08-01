function initSummary() {
  getGreeting();
  displayUserName();
}

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

function getGreeting() {
  let time = new Date().getHours();
  let greeting = getGreetingMessage(time);
  greeting += addCommaIfUserIsLoggedIn();
  document.getElementById("summaryGreeting").innerHTML = greeting;
}


function displayUserName() {
  let user = localStorage.getItem("user");
  if (user) {
    let userData = JSON.parse(atob(user));
    let userName = userData.name;
    document.getElementById("summaryGreetingName").innerHTML = userName;
  }
}


function addCommaIfUserIsLoggedIn() {
  return localStorage.getItem("user") ? "," : "";
}