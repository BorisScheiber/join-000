
// For Category
function toggleCategoryDropdown() {
    const dropdown = document.getElementById('category-dropdown');
    const dropdownIcon = document.querySelector('.dropdown-icon-category');

    if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
        dropdownIcon.src = '/assets/icons/arrow_drop_down.svg';
    } else {
        dropdown.style.display = 'flex';
        dropdownIcon.src = '/assets/icons/arrow_drop_up.svg';
    }
}

function selectCategory(category) {
    const categoryInput = document.getElementById('category');
    categoryInput.value = category;
    toggleCategoryDropdown();
    handleInput({ target: categoryInput }); // Manuell das Input-Event auslösen, um die Validierung zu aktualisieren
}

// Optionale Initialisierung um sicherzustellen, dass das Icon beim Laden korrekt gesetzt wird
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('category-dropdown');
    const dropdownIcon = document.querySelector('.dropdown-icon-category');
    if (dropdown.style.display === 'flex') {
        dropdownIcon.src = '/assets/icons/arrow_drop_up.svg';
    } else {
        dropdownIcon.src = '/assets/icons/arrow_drop_down.svg';
    }
});


// Hide dropdown on clicking outside
document.addEventListener('click', function (event) {
    const categoryField = document.querySelector('.category-field');
    const dropdown = document.getElementById('category-dropdown');
    if (!categoryField.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// // For subtasks
function addSubtask() {
    const subtaskInput = document.getElementById('subtask-input');
    const subtaskList = document.getElementById('subtask-list');
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText === '') return;

    const li = document.createElement('li');
    li.className = 'subtask-item';
    li.innerHTML = `
        <div ondblclick="editSubtask(this)" class="subtask-text"><li>${subtaskText}</li>
</div>
        <div class="edit-delete-icons" style="display: none;">
            <img src="/assets/icons/edit.svg" alt="Edit" onclick="editSubtask(this)">
            <div class="vertical-line"></div>
            <img src="/assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(this)">
        </div>
    `;
    subtaskList.appendChild(li);
    subtaskInput.value = '';
    toggleEditDeleteVisibility();
}

function deleteSubtask(element) {
    element.closest('li').remove();
}

function editSubtask(element) {
    const subtask = document.getElementById("subtask-list");
    const li = element.closest('li');
    const subtaskText = element.tagName.toLowerCase() === 'div' ? element.innerText : element.closest('li').querySelector('.subtask-text').innerText;

    // Setze Padding auf 0 beim Bearbeiten
    subtask.style.paddingLeft = '0px';
    li.style.paddingLeft = '0';

    li.innerHTML = `
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
    const subtaskInput = li.querySelector('input');
    subtaskInput.focus();
}

function saveSubtask(element) {
    const subtask = document.getElementById("subtask-list");
    const li = element.closest('li');
    const subtaskInput = li.querySelector('input');
    const newText = subtaskInput.value.trim();
    if (newText === '') return;

    // Setze Padding auf 20px nach dem Speichern
    subtask.style.paddingLeft = '20px';
    li.style.paddingLeft = '20px';

    li.innerHTML = `
        <div ondblclick="editSubtask(this)" class="subtask-text"><li>${newText}</li></div>
        <div class="edit-delete-icons" style="display: none;">
            <img src="/assets/icons/edit.svg" alt="Edit" onclick="editSubtask(this)">
            <div class="vertical-line"></div>
            <img src="/assets/icons/delete.svg" alt="Delete" onclick="deleteSubtask(this)">
        </div>
    `;
}

// Optional: Add CSS to make the edit-delete div visible when its parent li is in edit mode
document.addEventListener('click', (event) => {
    const isSubtaskItem = event.target.closest('.subtask-item');
    document.querySelectorAll('.subtask-item').forEach(item => {
        if (item === isSubtaskItem) {
            const editDelete = item.querySelector('.edit-delete-icons');
            if (editDelete) editDelete.style.display = 'flex';
        } else {
            const editDelete = item.querySelector('.edit-delete-icons');
            if (editDelete) editDelete.style.display = 'none';
        }
    });
});


//Diese Funktion leert das Eingabefeld und ruft toggleEditDeleteVisibility auf, um die Änderungen widerzuspiegeln.
function resetSubtaskInput() {
    const subtaskInput = document.getElementById('subtask-input');
    subtaskInput.value = '';
    toggleEditDeleteVisibility();
}


//Diese Funktion prüft, ob das Eingabefeld leer ist. Wenn nicht, zeigt sie die edit-delete-Div an, andernfalls blendet sie diese aus.
function toggleEditDeleteVisibility() {
    const subtaskInput = document.getElementById('subtask-input');
    const editDelete = subtaskInput.nextElementSibling;
    if (subtaskInput.value.trim() !== '') {
        editDelete.style.display = 'flex';
    } else {
        editDelete.style.display = 'none';
    }
}

//Dieser hört auf Änderungen im Eingabefeld und ruft toggleEditDeleteVisibility auf, 
//um die edit-delete-Div je nach Inhalt des Eingabefelds anzuzeigen oder auszublenden.
document.getElementById('subtask-input').addEventListener('input', toggleEditDeleteVisibility);

// Funktion zum Hinzufügen eines neuen Subtasks bei Enter-Taste im Eingabefeld
function handleEnterKey(event, callback) {
    if (event.key === 'Enter') {
        event.preventDefault();
        callback();
    }
}
document.getElementById('subtask-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSubtask();
    }
});
