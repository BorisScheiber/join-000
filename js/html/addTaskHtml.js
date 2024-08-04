  /**
   * Creates a new subtask list item element.
   * @param {string} subtaskText - The text of the subtask.
   * @returns {HTMLElement} The created list item element.
   */
  function createSubtaskItem(subtaskText) {
    const li = document.createElement('li');
    li.className = 'subtask-item';
    li.innerHTML = `
      <div ondblclick="editSubtask(this)" class="subtask-text"><li>${subtaskText}</li></div>
      <div class="edit-delete-icons" style="display: none;">
        <img src="/assets/icons/edit.svg" alt="Edit" onclick="editSubtask(this)">
        <div class="vertical-line"></div>
        <img src="/assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(this)">
      </div>
    `;
    return li;
  }
  

   /**
   * Generates the HTML for the edit subtask input field and buttons.
   * @param {string} subtaskText - The text of the subtask being edited.
   * @returns {string} The HTML string for the edit subtask section.
   */
   function generateEditSubtaskHTML(subtaskText) {
    return `
      <div class="subtask-content">
        <div class="edit-div">
          <input type="text" class="input-field-editing" value="${subtaskText}">
          <div class="edit-delete">
            <img src="/assets/icons/done.svg" alt="Done" onclick="saveSubtask(this)">
            <div class="vertical-line"></div>
            <img src="/assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(this)">
          </div>
        </div>
      </div>
    `;
  }


   /**
   * Generates the HTML for a saved subtask item.
   * @param {string} newText - The updated text of the subtask.
   * @returns {string} The HTML string for the saved subtask item.
   */
   function generateSavedSubtaskHTML(newText) {
    return `
      <div ondblclick="editSubtask(this)" class="subtask-text"><li>${newText}</li></div>
      <div class="edit-delete-icons" style="display: none;">
        <img src="/assets/icons/edit.svg" alt="Edit" onclick="editSubtask(this)">
        <div class="vertical-line"></div>
        <img src="/assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(this)">
      </div>
    `;
  }
  