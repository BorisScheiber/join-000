
//for contacts
function toggleContactList() {
    const contactList = document.getElementById("contact-list");
    const contactSearch = document.getElementById("contact-search");
    const selectedContacts = document.getElementById("selected-contacts");
    const toggleButton = document.getElementById("toggle-list");
    const dropdownIcon = toggleButton.querySelector(".dropdown-icon");

    // Use classList.toggle to consistently manage the hidden class
    contactList.classList.toggle("hidden");

    if (contactList.classList.contains("hidden")) {
        contactSearch.style.borderRadius = "10px";
        dropdownIcon.src = "/assets/icons/arrow_drop_down.svg";
        selectedContacts.style.display = "flex";
        document.removeEventListener('click', closeContactListOnClickOutside);
    } else {
        contactSearch.style.borderRadius = "10px 10px 0 0";
        dropdownIcon.src = "/assets/icons/arrow_drop_up.svg";
        selectedContacts.style.display = "none";
        document.addEventListener('click', closeContactListOnClickOutside);
    }
}


function filterContacts() {
    const searchTerm = document.getElementById("contact-search").value.toLowerCase();
    const contactItems = document.querySelectorAll("#contact-list .contact-item");
    contactItems.forEach(item => {
        const name = item.textContent.toLowerCase();
        item.style.display = name.includes(searchTerm) ? "" : "none";
    });

    // Öffne die Liste, wenn sie versteckt ist
    const contactList = document.getElementById("contact-list");
    const isListOpen = !contactList.classList.contains("hidden");
    if (!isListOpen) {
        toggleContactList(); // Liste öffnen
    }
}

function closeContactListOnClickOutside(event) {
    const contactList = document.getElementById("contact-list");
    const contactSearch = document.getElementById("contact-search");
    const toggleButton = document.getElementById("toggle-list");
    const selectedContacts = document.getElementById("selected-contacts");

    if (!contactList.contains(event.target) && !contactSearch.contains(event.target) && !toggleButton.contains(event.target)) {
        toggleContactList(); // Liste schließen
        selectedContacts.style.display = "flex"; // Selected Contacts anzeigen
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    const contactList = document.getElementById("contact-list");
    const contactSearch = document.getElementById("contact-search");
    try {
        const contactsData = await getData("contacts"); // Fetch contacts from Firebase

        if (contactsData) {
            // Convert Firebase object to an array of contacts
            const firebaseContacts = Object.values(contactsData);

            firebaseContacts.forEach(contact => {
                const contactItem = document.createElement("div");
                contactItem.classList.add("contact-item");

                // Split the name into parts
                const nameParts = contact.name.split(" ");

                // Get the first letter of the first part and the first letter of the second part
                const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);

                contactItem.innerHTML = `
              <div class="contact-logo" style="background-color: ${contact.color};" data-background="${contact.color}">
                  ${initials} 
              </div>
              <span>${contact.name}</span>
              <div class="contact-checkbox" data-email="${contact.email}"></div>
            `;
                contactList.appendChild(contactItem);
            });
        } else {
            console.log("No contacts found in Firebase.");
        }
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
    contactSearch.addEventListener("input", filterContacts);
    setPriority('medium'); // Set Medium as default
});

document.getElementById("contact-list").addEventListener("click", (event) => {
    const contactItem = event.target.closest(".contact-item");
    if (contactItem) {
        const checkbox = contactItem.querySelector(".contact-checkbox");
        checkbox.classList.toggle("checked");
        contactItem.classList.toggle("checked");
        updateSelectedContacts();
    }
});

function updateSelectedContacts() {
    const selectedContacts = document.getElementById("selected-contacts");
    selectedContacts.innerHTML = ''; // Clear the existing content

    const selectedCheckboxes = document.querySelectorAll("#contact-list .contact-checkbox.checked");
    selectedCheckboxes.forEach(checkbox => {
        const contactItem = checkbox.parentElement;
        const logo = contactItem.querySelector(".contact-logo");

        // Create the selected contact element directly using innerHTML
        selectedContacts.innerHTML += `
            <div class="selected-contact" style="background-color: ${logo.dataset.background}">
                ${logo.innerText}
            </div>
        `;
    });
}


// Open dropdown when typing in search field
document.getElementById('contact-search').addEventListener('input', function () {
    document.getElementById('contact-list').style.display = 'block';
    filterContacts(); // Assuming this function filters contacts based on input
});




// Clear Fields button
function clearFields() {
    // Leere die Werte der Eingabefelder
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("contact-search").value = "";
    document.getElementById("due-date").value = "";
    document.getElementById("category").value = "";
    document.getElementById("subtask-input").value = "";

    // Setze die Rahmen der Eingabefelder zurück
    document.getElementById("title").style.border = '1px solid rgba(209, 209, 209, 1)';
    document.getElementById("description").style.border = '1px solid rgba(209, 209, 209, 1)';
    document.getElementById("due-date").style.border = '1px solid rgba(209, 209, 209, 1)';
    document.getElementById("category-field").style.border = '1px solid rgba(209, 209, 209, 1)';
    document.getElementById("contact-search").style.border = '1px solid rgba(209, 209, 209, 1)';
    document.getElementById("subtask-input").style.border = '1px solid rgba(209, 209, 209, 1)';

    // Entferne alle Fehlermeldungen
    removeErrorMessage(document.getElementById("title"));
    removeErrorMessage(document.getElementById("category-field"));
    removeErrorMessage(document.getElementById("due-date"));

    // Setze alle Kontrollkästchen der Kontaktliste zurück
    document.querySelectorAll(".contact-checkbox").forEach(checkbox => {
        checkbox.classList.remove("checked");
        checkbox.parentElement.classList.remove("checked");
    });
    // Clear error messages instead of removing them
    document.querySelectorAll('.error-message').forEach(errorElement => {
        errorElement.textContent = ''; // Clear the content of the error message
    });
    
    // Leere die ausgewählten Kontakte
    document.getElementById("selected-contacts").innerHTML = "";

    // Leere die Subtask-Liste
    document.getElementById("subtask-list").innerHTML = "";

    // Setze die Prio-Buttons zurück
    setPriority('medium'); // Set Medium as default
    currentPriority = "medium";
    // Clear error messages instead of removing them
    document.querySelectorAll('.error-message').forEach(errorElement => {
        errorElement.textContent = ''; // Clear the content of the error message
    });
}

function removeErrorMessage(field) {
    let errorElement = field.nextElementSibling;
    if (field.id === 'category') {
        errorElement = document.getElementById('category-error');
    }
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}


function validateDueDate(dueDate) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regular expression for YYYY-MM-DD format

    if (!datePattern.test(dueDate)) {
        return 'Please enter a valid date in YYYY-MM-DD format.';
    }

    const today = new Date();
    const selectedDate = new Date(dueDate);

    if (selectedDate <= today) {
        return 'Please enter a future date.';
    }

    return ''; // No error
}


function validateFields() {
    const fields = [
      document.getElementById('title'),
      document.getElementById('category'), // Keep this to get the value
      document.getElementById('due-date')
    ];
  
    let isValid = true;
    fields.forEach(field => {
      if (field.value.trim() === "") {
        if (field.id === 'category') {
          document.getElementById('category-field').style.border = '1px solid rgba(255, 129, 144, 1)'; // Change border of category-field
          showErrorMessage(field, 'This field is required');
        } else {
          field.style.border = '1px solid rgba(255, 129, 144, 1)';
          showErrorMessage(field, 'This field is required');
        }
        isValid = false;
      } else if (field.id === 'due-date') { 
        const dueDateError = validateDueDate(field.value);
    if (dueDateError) {
      field.style.border = '1px solid rgba(255, 129, 144, 1)';
      showErrorMessage(field, dueDateError);
      isValid = false;
    } else {
      field.style.border = '1px solid rgba(41, 171, 226, 1)';
      removeErrorMessage(field);
    }
      } else {
        if (field.id === 'category') {
          document.getElementById('category-field').style.border = '1px solid rgba(41, 171, 226, 1)'; // Change border of category-field
        } else {
          field.style.border = '1px solid rgba(41, 171, 226, 1)';
        }
        removeErrorMessage(field);
      }
    });
    return isValid;
  }
document.getElementById('recipeForm').onsubmit = function (event) {
    event.preventDefault();
    createTask();
};

function showErrorMessage(field, message) {
    let errorElement = field.nextElementSibling;
    if (field.id === 'category') {
        errorElement = document.getElementById('category-error');
    }
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
         if (field.id === 'category') {
             document.querySelector('.category-section .input-group').appendChild(errorElement);
         } else {
             field.parentNode.insertBefore(errorElement, field.nextSibling);
         }
    }
    errorElement.textContent = message;
}

function removeErrorMessage(field) {
    let errorElement = field.nextElementSibling;
    if (field.id === 'category') {
        errorElement = document.getElementById('category-error');
    }
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseAsJson = await response.json();
}

async function createTask() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value.trim();
    const dueDate = document.getElementById('due-date').value;
    const prio = currentPriority; // Get the current priority from the global variable

    if (!validateFields()) {
        return;
    }

    const assignedContacts = [];
    document.querySelectorAll(".contact-list .contact-checkbox.checked").forEach(checkbox => {
        const contactItem = checkbox.parentElement;
        const name = contactItem.querySelector("span:nth-child(2)").textContent;
        assignedContacts.push(name);
    });

    const subtasks = [];
    const subtaskItems = document.querySelectorAll("#subtask-list .subtask-item");
    subtaskItems.forEach(item => {
        const subtaskText = item.querySelector('.subtask-text').innerText;
        subtasks.push(subtaskText);
    });

    // Create the task object
    const newTask = {
        id: Date.now(), // Generate a unique ID using timestamp
        Title: title,
        Description: description,
        Assigned_to: assignedContacts,
        Due_date: dueDate,
        Prio: prio,
        Category: category,
        Subtasks: subtasks
    };

    // Save the task to Firebase
    try {
        await postData("tasks", newTask);
        console.log("Task created successfully:", newTask);
        // Reset the form and clear selected contacts
        clearFields();
    } catch (error) {
        console.error("Error creating task:", error);
    }

    // Show the popup
    showTaskCreatedPopup();

    // Redirect to board.html after 2 seconds
    setTimeout(() => {
        window.location.href = 'board.html';
    }, 2000);
}



function showTaskCreatedPopup() {
    const popup = document.getElementById('taskCreatedPopup');
    popup.classList.add('show'); // Add the 'show' class to trigger the animation

    // Hide the popup after 2 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

//Diese Funktion wird aufgerufen, wenn der Benutzer in das Eingabefeld tippt (input-Event).
// Sie setzt den Rahmen auf 1px solid rgba(41, 171, 226, 1) während der Eingabe und entfernt die Fehlermeldung, falls vorhanden.
function handleInput(event) {
    const field = event.target;
    if (field.value.trim() !== "") {
        field.style.border = '1px solid rgba(41, 171, 226, 1)';
        removeErrorMessage(field);
    }
}

//Diese Funktion wird aufgerufen, wenn der Benutzer das Eingabefeld verlässt (blur-Event). Wenn das Eingabefeld nicht leer ist, wird der Rahmen auf 1px solid rgba(209, 209, 209, 1) gesetzt. Wenn das Feld leer ist, wird der Rahmen auf 1px solid rgba(255, 129, 144, 1) gesetzt und eine Fehlermeldung angezeigt.
function handleBlur(event) {
    const field = event.target;
    if (field.value.trim() !== "") {
        field.style.border = '1px solid rgba(209, 209, 209, 1)';
    } else {
        if (field.id !== 'description') {
            field.style.border = '1px solid rgba(255, 129, 144, 1)';
            showErrorMessage(field, 'This field is required');
        } else {
            field.style.border = '1px solid rgba(209, 209, 209, 1)';
            removeErrorMessage(field);
        }
    }
    // Reset category-field border when focusing out of any field
  if (field.id !== 'category') {
    document.getElementById('category-field').style.border = '1px solid rgba(209, 209, 209, 1)';
  }
}

// Event-Listener für Eingabefelder hinzufügen
document.getElementById('title').addEventListener('input', handleInput);
document.getElementById('description').addEventListener('input', handleInput);
document.getElementById('due-date').addEventListener('input', handleInput);
document.getElementById('category-field').addEventListener('input', handleInput);

document.getElementById('title').addEventListener('blur', handleBlur);
document.getElementById('description').addEventListener('blur', handleBlur);
document.getElementById('due-date').addEventListener('blur', handleBlur);
// // document.getElementById('category-field').addEventListener('blur', handleBlur);


document.getElementById('recipeForm').onsubmit = function (event) {
    event.preventDefault();
};

//for Prio buttons
let currentPriority = "medium";

function setPriority(level) {
    const buttons = document.querySelectorAll('.priority-button');

    // Reset all buttons first
    buttons.forEach(button => resetButtonStyles(button));



    // Set the styles for the clicked button
    const activeButton = document.getElementById(`${level}-button`);
    activeButton.style.backgroundColor = getPriorityColor(level);
    activeButton.style.color = 'rgba(255, 255, 255, 1)'; // Change text color
    activeButton.style.fontFamily = 'Inter'; // Change font family
    activeButton.style.fontSize = '21px'; // Change font size
    activeButton.style.fontWeight = '700'; // Change font weight
    activeButton.style.lineHeight = '25.2px'; // Change line height
    activeButton.style.textAlign = 'left'; // Change text align
    activeButton.querySelector('img').src = `/assets/icons/${level}White.svg`;

    // Remove hover effect from the selected button
    activeButton.classList.add('selected'); // Add a class to the selected button
    // Update the current priority
    currentPriority = level;
}

function resetButtonStyles(button) {
    button.classList.remove('selected'); // Remove the class when resetting

    button.style.backgroundColor = 'rgba(255, 255, 255, 1)'; // Reset background color
    button.style.color = 'rgba(0, 0, 0, 1)'; // Reset text color
    button.style.fontFamily = 'Inter'; // Reset font family
    button.style.fontSize = '20px'; // Reset font size
    button.style.fontWeight = '400'; // Reset font weight
    button.style.lineHeight = '24px'; // Reset line height
    button.style.textAlign = 'left'; // Reset text align
    const img = button.querySelector('img');
    switch (button.id) {
        case 'urgent-button':
            img.src = '/assets/icons/urgent.svg';
            break;
        case 'medium-button':
            img.src = '/assets/icons/medium.svg';
            break;
        case 'low-button':
            img.src = '/assets/icons/low.svg';
            break;
    }
}

function getPriorityColor(level) {
    switch (level) {
        case 'urgent':
            return 'rgba(255, 61, 0, 1)';
        case 'medium':
            return 'rgba(255, 168, 0, 1)';
        case 'low':
            return 'rgba(122, 226, 41, 1)';
        default:
            return 'rgba(255, 255, 255, 1)';
    }
}
