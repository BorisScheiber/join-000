function initSummary() {
  getGreeting();
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
  document.getElementById("summaryGreeting").innerHTML = greeting;
}
