let tasks = [];
let contacts = [];


async function initBoard() {
  await loadTasksFromFirebase();
  await loadContactsFromFirebase();
  renderToDo();
}


async function loadTasksFromFirebase() {
  try {
    const fetchedTasks = await getData("tasks");
    console.log(fetchedTasks);

    tasks = Object.keys(fetchedTasks).map((key) => ({
      firebaseId: key,
      ...fetchedTasks[key],
    }));
    console.log(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}


async function loadContactsFromFirebase(){
  try {
      const data = await getData('contacts');
      if (data) {
          contacts = Object.values(data);
          contacts.sort((a, b) => a.name.localeCompare(b.name));
          console.log(contacts);
          
      } else {
          contacts = [];
      }
  } catch (error) {
      console.error('Error loading contacts:', error);
  }
}


// console.log(getFirebaseIdByTaskId("1723056298922"));
function getFirebaseIdByTaskId(taskId) {
  const task = tasks.find((t) => t.id == taskId);
  return task ? task.firebaseId : null;
}


function renderToDo() {
  const toDoContainer = document.getElementById("toDo");

  toDoContainer.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    toDoContainer.innerHTML += /*html*/ `
                        <div onclick="openOverlay(${task.id})" id="${task.id}" class="board-cards" draggable="true">
                        ${checkSingleTaskCategory(task.Category)}
                        <div class="board-card-text-container">
                            <span class="board-card-text board-card-title">${task.Title}</span>
                            ${checkSingleTaskDescription(task.Description)}
                        </div>
                        <div class="board-card-subtask-container">
                            <div class="board-card-progress-bar">
                                <div class="board-card-progress-fill" style="width: 0%;" role="progressbar"></div>
                            </div>
                            <div class="board-card-progress-text">
                                <span>1/2 Subtasks</span>
                            </div>
                        </div>
                        <div class="board-card-profiles-priority">
                            <div class="board-card-profile-badges">
                            ${generateAssignedToProfileBadges(task.Assigned_to)}
                            </div>
                            ${checkSingleTaskPriority(task.Prio)}
                        </div>
                    </div>
     `;
  }
}


function checkSingleTaskDescription(description) {
  if (!description || description.trim() === '') {
    return /*html*/ `<span class="board-card-text board-card-description d-none"></span>`;
  } else {
    return /*html*/ `<span class="board-card-text board-card-description">${description}</span>`;
  }
}


function checkSingleTaskCategory(category) {
  if (category === "Technical Task") {
    return /*html*/ `
      <div class="board-card-technical">
        <span>Technical Task</span>
      </div>`;
  } else if (category === "User Story") {
    return /*html*/ `
      <div class="board-card-story">
        <span>User Story</span>
      </div>`;
  } else {
    return "";
  }
}


function checkSingleTaskPriority(priority) {
  if (!priority) return '';

  switch (priority.toLowerCase()) {
    case 'urgent':
      return /*html*/`<img src="./assets/icons/priorityUrgent.svg" alt="Urgent Priority">`;
    case 'medium':
      return /*html*/`<img src="./assets/icons/priorityMedium.svg" alt="Medium Priority">`;
    case 'low':
      return /*html*/`<img src="./assets/icons/priorityLow.svg" alt="Low Priority">`;
    default:
      return '';
  }
}

function getColorForSingleContact(name) {
  const contact = contacts.find(contact => contact.name === name);
  return contact ? contact.color : '';
}


function generateAssignedToProfileBadges(assignedTo) {
  if (assignedTo && assignedTo.length > 0) {
    let assignedHtml = generateProfileBadgeHtml(assignedTo);
    let additionalAssigned = generateAdditionalAssignedToCount(assignedTo.length);

    return `${assignedHtml}${additionalAssigned}`;
  } else {
    return '';
  }
}


function generateProfileBadgeHtml(assignedTo) {
  return assignedTo.slice(0, 4).map(person => {
    let initials = getInitials(person);
    let color = getColorForSingleContact(person);
    return /*html*/`<div class="board-card-single-profile" style="background-color: ${color};">${initials}</div>`;
  }).join('');
}


function generateAdditionalAssignedToCount(length) {
  return length > 4 ? `<span class="board-card-assigned-more">+${length - 4}</span>` : '';
}


function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('');
}
