/**
 * Generates the HTML markup for a single task card.
 * This includes the task title, description, subtasks, priority, and category.
 * It also sets up event handlers for interacting with the task.
 *
 * @param {Object} task - The task object containing details such as id, category, title, description, subtasks, assigned users, and priority.
 * @returns {string} The HTML string representing the task card.
 */
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


/**
 * Generates the HTML markup for the subtasks of a single task.
 * This includes a progress bar and text showing the number of completed subtasks out of the total.
 *
 * @param {number} progressPercentage - The percentage of subtasks that have been completed.
 * @param {number} completedSubtasks - The number of subtasks that have been completed.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @returns {string} The HTML string representing the subtask section of a task card.
 */
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


/**
 * Generates the HTML markup for a task's category.
 * This includes a styled container that displays the category name.
 *
 * @param {string} categoryClass - The CSS class to style the category container.
 * @param {string} categoryLabel - The text label representing the category.
 * @returns {string} The HTML string representing the category section of a task card.
 */
function generateSingleTaskCategoryHtml(categoryClass, categoryLabel) {
    return /*html*/ `
      <div class="${categoryClass}">
        <span>${categoryLabel}</span>
      </div>`;
}


/**
 * Generates the HTML markup for the "Move Task to" overlay in mobile view.
 * This includes buttons to move the task to different status categories and a close button.
 *
 * @param {number} taskId - The ID of the task that the overlay is associated with.
 * @returns {string} The HTML string representing the mobile overlay for moving a task.
 */
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