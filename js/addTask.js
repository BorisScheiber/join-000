const contacts = [
    { name: "Müller", vorname: "Hans", email: "hans.mueller@example.com" },
    { name: "Schmidt", vorname: "Anna", email: "anna.schmidt@example.com" },
    { name: "Schneider", vorname: "Peter", email: "peter.schneider@example.com" },
    { name: "Fischer", vorname: "Marie", email: "marie.fischer@example.com" },
    { name: "Becker", vorname: "Linda", email: "linda.becker@example.com" },
    { name: "Hoffmann", vorname: "Jan", email: "jan.hoffmann@example.com" },
    { name: "Weber", vorname: "Claudia", email: "claudia.weber@example.com" },
    { name: "Klein", vorname: "Michael", email: "michael.klein@example.com" },
    { name: "Zimmermann", vorname: "Sophie", email: "sophie.zimmermann@example.com" },
    { name: "Hartmann", vorname: "Max", email: "max.hartmann@example.com" }
];

const logoColors = [
    'rgba(255, 122, 0, 1)',
    'rgba(255, 94, 179, 1)',
    'rgba(110, 82, 255, 1)',
    'rgba(147, 39, 255, 1)',
    'rgba(0, 190, 232, 1)',
    'rgba(31, 215, 193, 1)',
    'rgba(255, 116, 94, 1)',
    'rgba(255, 163, 94, 1)',
    'rgba(252, 113, 255, 1)',
    'rgba(255, 199, 1, 1)',
    'rgba(0, 56, 255, 1)',
    'rgba(195, 255, 43, 1)',
    'rgba(255, 230, 43, 1)',
    'rgba(255, 70, 70, 1)',
    'rgba(255, 187, 43, 1)'
];

function toggleContactList() {
    const contactList = document.getElementById("contact-list");
    const contactSearch = document.getElementById("contact-search");
    const selectedContacts = document.getElementById("selected-contacts");
    const toggleButton = document.getElementById("toggle-list");

    // Überprüfen, ob die Liste momentan angezeigt wird oder nicht
    const isListOpen = !contactList.classList.contains("hidden");

    if (isListOpen) {
        contactList.classList.add("hidden");
        contactSearch.style.borderRadius = "10px";
        toggleButton.textContent = "▼";
        selectedContacts.style.display = "flex";
        document.removeEventListener('click', closeDropdownOnClickOutside);
    } else {
        contactList.classList.remove("hidden");
        contactSearch.style.borderRadius = "10px 10px 0 0";
        toggleButton.textContent = "▲";
        selectedContacts.style.display = "none";
        document.addEventListener('click', closeDropdownOnClickOutside);
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

function closeDropdownOnClickOutside(event) {
    const contactList = document.getElementById("contact-list");
    const contactSearch = document.getElementById("contact-search");

    if (!contactList.contains(event.target) && !contactSearch.contains(event.target) && !event.target.matches("#toggle-list")) {
        toggleContactList();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const contactList = document.getElementById("contact-list");
    const contactSearch = document.getElementById("contact-search");

    contacts.forEach(contact => {
        const contactItem = document.createElement("div");
        contactItem.classList.add("contact-item");

        // Zufällige Hintergrundfarbe aus der vorgegebenen Liste
        const bgColor = logoColors[Math.floor(Math.random() * logoColors.length)];

        contactItem.innerHTML = `
            <div class="contact-logo" style="background-color: ${bgColor};" data-background="${bgColor}">
                ${contact.vorname.charAt(0)}${contact.name.charAt(0)}
            </div>
            <span>${contact.vorname} ${contact.name}</span>
            <div class="contact-checkbox" data-email="${contact.email}"></div>
        `;

        contactList.appendChild(contactItem);
    });
    contactSearch.addEventListener("input", filterContacts);
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
    selectedContacts.innerHTML = "";
    const selectedCheckboxes = document.querySelectorAll("#contact-list .contact-checkbox.checked");
    selectedCheckboxes.forEach(checkbox => {
        const contactItem = checkbox.parentElement;
        const logo = contactItem.querySelector(".contact-logo");
        const selectedContact = document.createElement("div");
        selectedContact.classList.add("selected-contact");
        selectedContact.style.backgroundColor = logo.dataset.background;
        selectedContact.innerText = logo.innerText;
        selectedContacts.appendChild(selectedContact);
    });
}

function clearFields() {
    // Leere die Werte der Eingabefelder
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("contact-search").value = "";

    // Setze alle Kontrollkästchen der Kontaktliste zurück
    document.querySelectorAll("#contact-list .contact-checkbox").forEach(checkbox => {
        checkbox.classList.remove("checked");
        checkbox.parentElement.classList.remove("checked");
    });

    // Leere die ausgewählten Kontakte
    document.getElementById("selected-contacts").innerHTML = "";

    // Schließe die Kontaktliste
    const contactList = document.getElementById("contact-list");
    contactList.classList.add("hidden");
    document.getElementById("contact-search").style.borderRadius = "10px";
    document.getElementById("toggle-list").textContent = "▼";
}

function validateFields() {
    const titleField = document.getElementById('title');
    const descriptionField = document.getElementById('description');
    let isValid = true;

    // Überprüfen Sie das Titelfeld
    if (titleField.value.trim() === "") {
        titleField.style.border = '1px solid rgba(255, 129, 144, 1)';
        showErrorMessage(titleField, 'This field is required');
        isValid = false;
    } else {
        titleField.style.border = '1px solid rgba(209, 209, 209, 1)';
        removeErrorMessage(titleField);
    }

    // Überprüfen Sie das Beschreibungsfeld
    if (descriptionField.value.trim() === "") {
        descriptionField.style.border = '1px solid rgba(255, 129, 144, 1)';
        showErrorMessage(descriptionField, 'This field is required');
        isValid = false;
    } else {
        descriptionField.style.border = '1px solid rgba(209, 209, 209, 1)';
        removeErrorMessage(descriptionField);
    }
    return isValid;
}

function showErrorMessage(field, message) {
    let error = field.nextElementSibling;
    if (!error || !error.classList.contains('error-message')) {
        error = document.createElement('p');
        error.classList.add('error-message');
        field.parentNode.appendChild(error);
    }
    error.textContent = message;
}

function removeErrorMessage(field) {
    let error = field.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
        error.remove();
    }
}

function createTask() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!validateFields()) {
        return;
    }

    const assignedContacts = [];
    document.querySelectorAll(".contact-list .contact-checkbox.checked").forEach(checkbox => {
        const contactItem = checkbox.parentElement;
        const name = contactItem.querySelector("span:nth-child(2)").textContent;
        assignedContacts.push(name);
    });

    console.log("Task created with title:", title);
    console.log("Description:", description);
    console.log("Assigned to:", assignedContacts.join(", "));

    // Form zurücksetzen
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.querySelectorAll(".contact-list .contact-checkbox").forEach(checkbox => {
        checkbox.classList.remove('checked');
        checkbox.parentElement.classList.remove('checked');
    });
    updateSelectedContacts();
}

function handleInput(event) {
    const field = event.target;
    if (field.value.trim() !== "") {
        field.style.border = '1px solid rgba(41, 171, 226, 1)';
        removeErrorMessage(field);
    } else {
        field.style.border = '1px solid rgba(255, 129, 144, 1)';
        showErrorMessage(field, 'This field is required');
    }
}

document.getElementById('recipeForm').onsubmit = function (event) {
    event.preventDefault();
    createTask();
};

// Event-Listener für Eingabefelder hinzufügen
document.getElementById('title').addEventListener('input', handleInput);
document.getElementById('description').addEventListener('input', handleInput);















// function toggleContactList(open = null) {
//     const contactList = document.getElementById("contact-list");
//     const contactSearch = document.getElementById("contact-search");
//     const selectedContacts = document.getElementById("selected-contacts");
//     const toggleButton = document.getElementById("toggle-list");

//     // Überprüfen Sie, ob ein spezifischer Status (öffnen/schließen) übergeben wurde
//     const shouldOpen = open !== null ? open : contactList.classList.contains("hidden");

//     if (shouldOpen) {
//         contactList.classList.remove("hidden");
//         contactSearch.style.borderRadius = "10px 10px 0 0";
//         toggleButton.textContent = "▲";
//         selectedContacts.style.display = "none";
//     } else {
//         contactList.classList.add("hidden");
//         contactSearch.style.borderRadius = "10px";
//         toggleButton.textContent = "▼";
//         selectedContacts.style.display = "flex";
//     }
// }

// function filterContacts() {
//     const searchTerm = document.getElementById("contact-search").value.toLowerCase();
//     const contactItems = document.querySelectorAll("#contact-list .contact-item");

//     contactItems.forEach(item => {
//         const name = item.textContent.toLowerCase();
//         item.style.display = name.includes(searchTerm) ? "" : "none";
//     });

//     // Öffnen Sie die Kontaktliste, wenn sie gefiltert wird
//     toggleContactList(true);
// }

// document.addEventListener("DOMContentLoaded", () => {
//     const contactList = document.getElementById("contact-list");
//     const contactSearch = document.getElementById("contact-search");

//     contacts.forEach(contact => {
//         const contactItem = document.createElement("div");
//         contactItem.classList.add("contact-item");

//         // Zufällige Hintergrundfarbe für das Logo
//         const bgColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;

//         contactItem.innerHTML = `
//             <div class="contact-logo" style="background-color: ${bgColor};" data-background="${bgColor}">
//                 ${contact.vorname.charAt(0)}${contact.name.charAt(0)}
//             </div>
//             <span>${contact.vorname} ${contact.name}</span>
//             <div class="contact-checkbox" data-email="${contact.email}"></div>
//         `;

//         contactList.appendChild(contactItem);
//     });

//     contactSearch.addEventListener("input", filterContacts);
// });

// document.getElementById("contact-list").addEventListener("click", (event) => {
//     if (event.target.classList.contains("contact-checkbox")) {
//         const checkbox = event.target;
//         const contactItem = checkbox.parentElement;
//         checkbox.classList.toggle("checked");
//         contactItem.classList.toggle("checked");
//         updateSelectedContacts();
//     }
// });

// altes COde funktioniert gut
// function toggleContactList() {
//     const contactList = document.getElementById("contact-list");
//     const toggleButton = document.getElementById("toggle-list");
//     const selectedContacts = document.getElementById("selected-contacts");
//     contactList.classList.toggle("hidden");
//     toggleButton.textContent = contactList.classList.contains("hidden") ? "▼" : "▲";
//       // Zeige ausgewählte Kontakte nur an, wenn die Kontaktliste ausgeblendet ist
//       if (contactList.classList.contains("hidden")) {
//         selectedContacts.style.display = "flex";
//     } else {
//         selectedContacts.style.display = "none";
//     }
// }

// function filterContacts() {
//     const searchTerm = document.getElementById("contact-search").value.toLowerCase();
//     const contactItems = document.querySelectorAll("#contact-list .contact-item");
//     contactItems.forEach(item => {
//         const name = item.textContent.toLowerCase();
//         item.style.display = name.includes(searchTerm) ? "" : "none";
//     });
// }

// document.getElementById("contact-list").addEventListener("click", (event) => {
//     if (event.target.classList.contains("contact-checkbox")) {
//         const checkbox = event.target;
//         const contactItem = checkbox.parentElement;
//         checkbox.classList.toggle("checked");
//         contactItem.classList.toggle("checked");
//         updateSelectedContacts();
//     }
// });

// function updateSelectedContacts() {
//     const selectedContacts = document.getElementById("selected-contacts");
//     selectedContacts.innerHTML = "";
//     const selectedCheckboxes = document.querySelectorAll("#contact-list .contact-checkbox.checked");
//     selectedCheckboxes.forEach(checkbox => {
//         const contactItem = checkbox.parentElement;
//         const logo = contactItem.querySelector(".contact-logo");
//         const selectedContact = document.createElement("div");
//         selectedContact.classList.add("selected-contact");
//         selectedContact.style.backgroundColor = logo.dataset.background;
//         selectedContact.innerText = logo.innerText;
//         selectedContacts.appendChild(selectedContact);
//     });
// }