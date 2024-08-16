let tasks = [];
let contacts = [];
let currentDraggedElement;
let isMobile = false;


async function initBoard() {
  await updateBoard();
}


async function updateBoard() {
  await loadTasksFromFirebase();
  await loadContactsFromFirebase();
  renderBoard();
  checkAndApplyMobileSettings();
}


function checkAndApplyMobileSettings() {
  isMobile = isMobileOrTablet();

  if (isMobile) {
      let categoryIcons = document.querySelectorAll('.board-card-category-icon');
      categoryIcons.forEach(icon => {
          icon.style.display = 'block';
      });
  }
}


function isMobileOrTablet() {
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
let userAgent = navigator.userAgent.toLowerCase();
let isMobileAgent = /mobi|android|ipad|tablet|touch/i.test(userAgent);
return isTouchDevice || isMobileAgent;
}


async function loadTasksFromFirebase() {
  try {
    const fetchedTasks = await getData("tasks");

    tasks = Object.keys(fetchedTasks).map((key) => ({
      firebaseId: key,
      ...fetchedTasks[key],
      Subtasks: fetchedTasks[key].Subtasks ? Object.values(fetchedTasks[key].Subtasks) : [],
      Assigned_to: fetchedTasks[key].Assigned_to ? Object.values(fetchedTasks[key].Assigned_to) : []
    }));
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
      } else {
          contacts = [];
      }
  } catch (error) {
      console.error('Error loading contacts:', error);
  }
}


async function updateTaskStatusInFirebase(firebaseId, newStatus) {
  let newTimestamp = Date.now();
  try {
    await patchData(`tasks/${firebaseId}`, { Status: newStatus, timestamp: newTimestamp });
  } catch (error) {
    console.error(`Error updating task status and timestamp: ${error}`);
  }
}



function getFirebaseIdByTaskId(taskId) {
  let task = tasks.find((t) => t.id == taskId);
  return task ? task.firebaseId : null;
}


function clearContainers() {
  let containers = getContainersById();
  let { toDoContainer, inProgressContainer, awaitFeedbackContainer, doneContainer } = containers;

  [toDoContainer, inProgressContainer, awaitFeedbackContainer, doneContainer].forEach(container => {
    container.innerHTML = "";
  });
}


function renderBoard() {
  clearContainers();

  let containers = getContainersById();
  let sortedTasks = sortTasksByTimestamp(tasks);

  sortedTasks.forEach(task => {
    let container = getContainerForTaskStatus(task, containers);
    if (container) {
      container.innerHTML += generateSingleTaskHtml(task);
    }
  });
  checkIfContainerIsEmpty();
}


function getContainerForTaskStatus(task, containers) {
  let containerMap = {
    "to do": containers.toDoContainer,
    "in progress": containers.inProgressContainer,
    "await feedback": containers.awaitFeedbackContainer,
    "done": containers.doneContainer
  };
  return containerMap[task.Status];
}


// HTML CARDS
function generateSingleTaskHtml(task) {
  return /*html*/ `
  <div onclick="openCardDetailOverlay(${task.id})" id="${task.id}" class="board-cards" draggable="true"
  ondragstart="startDragging(${task.id})" ondragend="resetRotateTask(this)">
    ${checkSingleTaskCategory(task.Category)}
    <div class="board-card-text-container">
        <span class="board-card-text board-card-title">${task.Title}</span>
        ${checkSingleTaskDescription(task.Description)}
    </div>
    ${renderSingleTaskSubtask(task.Subtasks)}
    <div class="board-card-profiles-priority">
        <div class="board-card-profile-badges">
            ${generateAssignedToProfileBadges(task.Assigned_to)}
        </div>
        ${checkSingleTaskPriority(task.Prio)}
    </div>
    <div onclick="openMoveToMobileOverlay(event, ${task.id})" class="board-card-category-icon"></div>
  </div>
  `;
}


function renderSingleTaskSubtask(subtasks) {
  if (!subtasks || subtasks.length === 0) return "";

  let totalSubtasks = subtasks.length;
  let completedSubtasks = subtasks.filter(subtask => subtask.isChecked).length;
  let progressPercentage = (completedSubtasks / totalSubtasks) * 100;

  return generateSingleTaskSubtaskHtml(progressPercentage, completedSubtasks, totalSubtasks);
}


// HTML FOR SUBTASKS
function generateSingleTaskSubtaskHtml(progressPercentage, completedSubtasks, totalSubtasks) {
  return /*html*/ `
    <div class="board-card-subtask-container">
      <div class="board-card-progress-bar">
          <div class="board-card-progress-fill" style="width: ${progressPercentage}%;" role="progressbar"></div>
      </div>
      <div class="board-card-progress-text">
          <span>${completedSubtasks}/${totalSubtasks} Subtasks</span>
      </div>
    </div>
  `;
}


function getContainersById() {
  return {
    toDoContainer: document.getElementById("toDo"),
    inProgressContainer: document.getElementById("inProgress"),
    awaitFeedbackContainer: document.getElementById("awaitFeedback"),
    doneContainer: document.getElementById("done")
  };
}


function checkIfContainerIsEmpty() {
  const { toDoContainer, inProgressContainer, awaitFeedbackContainer, doneContainer } = getContainersById();

  addPlaceholderIfEmpty(toDoContainer, "No tasks To do");
  addPlaceholderIfEmpty(inProgressContainer, "No tasks In progress");
  addPlaceholderIfEmpty(awaitFeedbackContainer, "No tasks Await feedback");
  addPlaceholderIfEmpty(doneContainer, "No tasks Done");
}


function addPlaceholderIfEmpty(container, placeholderText) {
  if (container.innerHTML.trim() === "") {
    container.innerHTML = /*html*/ `<div class="board-section-placeholder">${placeholderText}</div>`;
  }
}


function sortTasksByTimestamp(tasksArray) {
  return tasksArray.sort((a, b) => a.timestamp - b.timestamp);
}


function checkSingleTaskDescription(description) {
  if (!description || description.trim() === '') {
    return /*html*/ `<span class="board-card-text board-card-description d-none"></span>`;
  } else {
    return /*html*/ `<span class="board-card-text board-card-description">${description}</span>`;
  }
}


// Category HTML
function generateSingleTaskCategoryHtml(categoryClass, categoryLabel) {
  return /*html*/ `
    <div class="${categoryClass}">
      <span>${categoryLabel}</span>
    </div>`;
}


function checkSingleTaskCategory(category) {
  if (category === "Technical Task") {
    return generateSingleTaskCategoryHtml("board-card-technical", "Technical Task");
  } else if (category === "User Story") {
    return generateSingleTaskCategoryHtml("board-card-story", "User Story");
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
  let contact = contacts.find(contact => contact.name === name);
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
    let name = getNameForSingleContact(person.id);
    let initials = getInitials(name);
    let color = getColorForSingleContact(person.id);

    return /*html*/`<div class="board-card-single-profile" style="background-color: ${color};">${initials}</div>`;
  }).join('');
}


function generateAdditionalAssignedToCount(length) {
  return length > 4 ? /*html*/ `<span class="board-card-assigned-more">+${length - 4}</span>` : '';
}


function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('');
}


function getColorForSingleContact(id) {
  let contact = contacts.find(contact => contact.id === id);
  return contact ? contact.color : '';
}


function getNameForSingleContact(id) {
  let contact = contacts.find(contact => contact.id === id);
  return contact ? contact.name : '';
}


// DRAG AND DROP FUNCTIONS//////////////////////////////////////////////////////////

function rotateTask(taskId) {
  let element = document.getElementById(taskId);
  element.classList.add("board-card-rotate");
}


function startDragging(taskId) {
  currentDraggedElement = taskId;
  rotateTask(taskId);
}


function resetRotateTask(element) {
  element.classList.remove("board-card-rotate");
}


function getStatusFromDropContainerId(dropContainerId) {
  let statusMap = {
    "toDo": "to do",
    "inProgress": "in progress",
    "awaitFeedback": "await feedback",
    "done": "done"
  };
  return statusMap[dropContainerId] || null;
}


async function updateTaskStatus(firebaseId, newStatus) {
  if (firebaseId) {
    await updateTaskStatusInFirebase(firebaseId, newStatus);
  }
}


async function moveTo(dropContainerId) {
  if (!currentDraggedElement) return;

  let firebaseId = getFirebaseIdByTaskId(currentDraggedElement);
  let newStatus = getStatusFromDropContainerId(dropContainerId);

  if (newStatus) {
    await updateTaskStatus(firebaseId, newStatus);
  }

  await updateBoard();
  removeHighlightDragArea(dropContainerId);
  currentDraggedElement = null;
}


function allowDrop(ev) {
  ev.preventDefault();
}


function addHighlightDragArea(id) {
  let dragArea = document.getElementById(id);
  dragArea.classList.add("board-highlight-drag-area");
}


function removeHighlightDragArea(id) {
  let dragArea = document.getElementById(id);
  dragArea.classList.remove("board-highlight-drag-area");
}

///////////////// SEARCH FUNCTION //////////////////////////////////////////////////

function searchTasks() {
  let searchField = document.getElementById("boardSearchInput").value.toLowerCase();
  let taskCards = document.querySelectorAll(".board-cards");

  if (searchField === "") {
    showAllTasks(taskCards);
    hideNoResultsError();
  } else {
    filterTasks(searchField, taskCards);
  }
}


function showAllTasks(taskCards) {
  taskCards.forEach(taskCard => {
    taskCard.style.display = "flex";
  });
}


function updateTaskVisibility(taskCard, shouldShow) {
  taskCard.style.display = shouldShow ? "flex" : "none";
}


function filterTasks(searchField, taskCards) {
  let matchFound = false;

  taskCards.forEach(taskCard => {
    let title = taskCard.querySelector(".board-card-title").innerText.toLowerCase();
    let description = taskCard.querySelector(".board-card-description").innerText.toLowerCase();
    let isMatch = title.includes(searchField) || description.includes(searchField);

    updateTaskVisibility(taskCard, isMatch);
    if (isMatch) matchFound = true;
  });

  matchFound ? hideNoResultsError() : showNoResultsError();
}


function showNoResultsError() {
  document.querySelector(".board-no-results").style.display = "flex";
  document.querySelector(".board-search-input").classList.add("board-no-results-error");
}


function hideNoResultsError() {
  document.querySelector(".board-no-results").style.display = "none";
  document.querySelector(".board-search-input").classList.remove("board-no-results-error");
}


// MOVE TO OVERLAY FUNCTIONS ////////////////////////////////////////////////////////


function renderMoveToMobileOverlay(taskId) {
  let overlayContainer = document.getElementById("moveToMobileOverlay");
  overlayContainer.innerHTML = "";

  overlayContainer.innerHTML = generateMoveToMobileOverlayHtml(taskId);
}



// HTML FOR MOVE TO MOBILE OVERLAY
function generateMoveToMobileOverlayHtml(taskId) {
  return /*html*/ `
  <div class="board-move-to-mobile-card">
    <h2 class="board-move-to-title">Move Task to</h2>
    <button class="board-move-to-buttons" onclick="moveTaskToMobile('to do', ${taskId})">To do</button>
    <button class="board-move-to-buttons" onclick="moveTaskToMobile('in progress', ${taskId})">In progress</button>
    <button class="board-move-to-buttons" onclick="moveTaskToMobile('await feedback', ${taskId})">Await feedback</button>
    <button class="board-move-to-buttons" onclick="moveTaskToMobile('done', ${taskId})">Done</button>
    <img class="board-move-to-xmark" src="./assets/icons/close-contact.svg" alt="" onclick="closeMoveToMobileOverlay()">
  </div>
  `;
}


function closeMoveToMobileIfClickOutside(event) {
  let card = document.querySelector('.board-move-to-mobile-card');
    if (!card.contains(event.target)) {
        closeMoveToMobileOverlay();
    }
}



function openMoveToMobileOverlay(event, taskId) {
  event.stopPropagation(); 
  renderMoveToMobileOverlay(taskId); 
  let overlay = document.getElementById("moveToMobileOverlay");
  let card = overlay.querySelector('.board-move-to-mobile-card');

  showMoveToOverlay(overlay, card);
}



function closeMoveToMobileOverlay() {
  let overlay = document.getElementById("moveToMobileOverlay");
  let card = overlay.querySelector('.board-move-to-mobile-card');

  hideMoveToOverlay(overlay, card);
}



function showMoveToOverlay(overlay, card) {
  overlay.style.display = "flex"; 
  overlay.classList.add('fadeInMoveToMobile'); 
  card.classList.add('slideInMoveToMobile'); 
}



function hideMoveToOverlay(overlay, card) {
  card.classList.remove('slideInMoveToMobile'); 
  card.classList.add('slideOutMoveToMobile'); 
  overlay.classList.remove('fadeInMoveToMobile'); 
  overlay.classList.add('fadeOutMoveToMobile'); 

  setTimeout(() => {
      overlay.style.display = "none"; 
      overlay.classList.remove('fadeOutMoveToMobile'); 
      card.classList.remove('slideOutMoveToMobile'); 
  }, 300); 
}



async function moveTaskToMobile(status, taskId) {
  let firebaseId = getFirebaseIdByTaskId(taskId);

  if (firebaseId) {
      await updateTaskStatusInFirebase(firebaseId, status);
      await updateBoard();
  }
  closeMoveToMobileOverlay();
}