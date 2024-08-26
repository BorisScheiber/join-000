let tasks = [];


/**
 * Initializes the summary page by setting up necessary data and UI elements.
 *
 * This asynchronous function first waits for the `init()` function to complete,
 * which initializes global data and UI components. Then, it sets the greeting message,
 * displays the user's name, updates the mobile greeting, loads tasks from the database,
 * and updates the summary metrics on the page.
 */
async function initSummary() {
  await init();
  getGreeting();
  displayUserName();
  getGreetingAndUserNameMobile();
  await loadTasksFromFirebase();
  displaySummaryMetrics();
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
 * Displays the logged-in user's name in the summary greeting.
 *
 * This function retrieves the user data from local storage, decodes it, 
 * and searches for the user's name by their ID. If the user's name is found, 
 * it updates the HTML element with the ID "summaryGreetingName" to display the name.
 */
function displayUserName() {
  let user = localStorage.getItem("user");
  if (user) {
    let userData = JSON.parse(atob(user));
    let userId = userData.id;

    let foundUser = searchUserById(userId);
    if (foundUser && foundUser.name) {
      document.getElementById("summaryGreetingName").innerHTML = foundUser.name;
    }
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


/**
 * Displays the summary metrics including task counts, urgent tasks, and upcoming deadline.
 * Updates the summary metrics on the page.
 */
function displaySummaryMetrics(){
  updateTaskCounts();
  updateUrgentTaskCount();
  updateUpcomingDeadline();
}


/**
 * Asynchronously loads tasks from Firebase and populates the tasks array.
 * If there's an error during the fetching process, an alert is shown to the user.
 * 
 * @async
 */
async function loadTasksFromFirebase() {
  try {
    const fetchedTasks = await getData("tasks");

    tasks = Object.keys(fetchedTasks).map((key) => ({
      firebaseId: key,
      ...fetchedTasks[key],
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    alert("Failed to load tasks. Please try again later.");
  }
}


/**
 * Counts the number of tasks that have a specific status.
 * 
 * @param {string} status - The status to count tasks for (e.g., "to do", "done").
 * @returns {number} - The number of tasks with the specified status.
 */
function countTasksByStatus(status) {
  return tasks.filter(task => task.Status?.toLowerCase() === status).length;
}


/**
 * Updates the task counts for different statuses and displays them on the page.
 * It also updates the text labels for the task counts.
 */
function updateTaskCounts() {
  let toDoTasks = countTasksByStatus("to do");
  let doneTasks = countTasksByStatus("done");
  let inProgressTasks = countTasksByStatus("in progress");
  let awaitFeedbackTasks = countTasksByStatus("await feedback");
  let totalTasks = tasks.length;

  document.getElementById("toDo").innerHTML = toDoTasks;
  document.getElementById("done").innerHTML = doneTasks;
  document.getElementById("inProgress").innerHTML = inProgressTasks;
  document.getElementById("awaitFeedback").innerHTML = awaitFeedbackTasks;
  document.getElementById("totalTasks").innerHTML = totalTasks;
  updateTaskCountsText(totalTasks, inProgressTasks);
}


/**
 * Updates the text labels for the task counts in the Board and Progress sections.
 * 
 * @param {number} totalTasks - The total number of tasks in the board.
 * @param {number} inProgressTasks - The number of tasks currently in progress.
 */
function updateTaskCountsText(totalTasks, inProgressTasks) {
  document.getElementById("taskBoardText").innerHTML = `${totalTasks === 1 ? "Task" : "Tasks"} in <br> Board`;
  document.getElementById("taskProgressText").innerHTML = `${inProgressTasks === 1 ? "Task" : "Tasks"} in <br> Progress`;
}


/**
 * Counts the number of tasks that are marked with a priority of "urgent".
 * 
 * @returns {number} - The number of tasks that have the priority set to "urgent".
 */
function countUrgentTasks(){
  return tasks.filter(task => task.Prio?.toLowerCase() === "urgent").length;
}


/**
 * Updates the display of the urgent task count on the page.
 * Retrieves the number of urgent tasks and sets this value in the HTML element with the ID "urgent".
 */
function updateUrgentTaskCount() {
  let urgentTasks = countUrgentTasks();
  document.getElementById("urgent").innerHTML = urgentTasks;
}


/**
 * Finds the task with the nearest upcoming due date.
 * 
 * Filters the tasks to include only those with a due date in the future, 
 * sorts them by the nearest date, and returns the task with the earliest due date.
 * 
 * @returns {Object|null} - The task with the nearest upcoming due date, 
 *                          or null if no such tasks exist.
 */
function getUpcomingDeadline() {
  let now = new Date();
  let tasksWithFutureDueDate = tasks.filter(task => task.Due_date && new Date(task.Due_date) > now);

  tasksWithFutureDueDate.sort((a, b) => new Date(a.Due_date) - new Date(b.Due_date));
  return tasksWithFutureDueDate.length > 0 ? tasksWithFutureDueDate[0] : null;
}


/**
 * Updates the display of the upcoming deadline on the summary page.
 * 
 * Retrieves the task with the nearest upcoming due date using `getUpcomingDeadline()`.
 * If an upcoming task is found, its due date is formatted and displayed.
 * If no upcoming tasks are found, the display is updated to show "No upcoming deadline".
 */
function updateUpcomingDeadline() {
  let upcomingDeadlineDate = document.getElementById("upcomingDeadlineDate");
  let upcomingDeadlineText = document.getElementById("upcomingDeadlineText");
  let upcomingTask = getUpcomingDeadline();

  if (upcomingTask) {
    upcomingDeadlineDate.innerHTML = new Date(upcomingTask.Due_date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } else {
    setNoUpcomingDeadline(upcomingDeadlineDate, upcomingDeadlineText);
  }
}


/**
 * Sets the display to indicate that there are no upcoming deadlines.
 * 
 * Clears the content of the specified deadline element, hides it, 
 * and updates the label to show "No upcoming deadline".
 * 
 * @param {HTMLElement} upcomingDeadlineElement - The element that displays the deadline date.
 * @param {HTMLElement} upcomingDeadlineLabel - The label element that displays the deadline status.
 */
function setNoUpcomingDeadline(upcomingDeadlineElement, upcomingDeadlineLabel) {
  upcomingDeadlineElement.innerHTML = "";
  upcomingDeadlineElement.style.display = "none";
  upcomingDeadlineLabel.innerHTML = "No upcoming deadline";
}

