
// TEST Function to render tasks from Firebase to the board
async function renderTasks() {
    try {
      const tasksData = await getData("tasks"); // Fetch tasks from Firebase
      const taskList = document.getElementById("taskList"); // Get the task list element
      taskList.innerHTML = ""; // Clear existing tasks
  
      if (tasksData) {
        // Iterate through each task and create list items
        for (const taskId in tasksData) {
          const task = tasksData[taskId];
          const listItem = document.createElement("li");
          listItem.classList.add("task-item");
          listItem.innerHTML = `
            <div class="task-content">
              <h3 class="task-title">${task.Title}</h3>
              ${task.Description ? `<p class="task-description">${task.Description}</p>` : ''}
              <div class="task-details">
                ${task.Assigned_to ? `<span class="task-detail">Assigned to: ${task.Assigned_to.join(", ")}</span>` : ''}
                ${task.Due_date ? `<span class="task-detail">Due date: ${task.Due_date}</span>` : ''}
                ${task.Prio ? `<span class="task-detail">Priority: ${task.Prio}</span>` : ''}
                ${task.Category ? `<span class="task-detail">Category: ${task.Category}</span>` : ''}
              </div>
              <ul class="subtask-list">
                ${task.Subtasks ? task.Subtasks.map(subtask => `<li>${subtask}</li>`).join('') : ''}
              </ul>
            </div>
            <button class="delete-task" onclick="deleteTask('${taskId}')">Delete</button>
          `;
          taskList.appendChild(listItem);
        }
      }
    } catch (error) {
      console.error("Error rendering tasks:", error);
    }
  }
  
  // Function to delete a task from Firebase
  async function deleteTask(taskId) {
    try {
      await deleteData(`tasks/${taskId}`);
      console.log(`Task with ID ${taskId} deleted successfully`);
      renderTasks(); // Re-render the task list after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }


