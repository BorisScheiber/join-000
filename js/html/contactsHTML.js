/* gerenarte HTML-content for the separate card to create a new contact */

function openNewContact() {
    const addNewContactContainer = document.getElementById('newContact');
    addNewContactContainer.innerHTML = `
        <form class="add-new-contact-form" onsubmit="createNewContact(); return false;">
            <div class="add-new-contact">
                <div class="add-new-contact-menu">
                    <div class="add-new-contact-menu-img">
                        <img src="./assets/icons/logo-add-new-contact.svg" alt="logo" class="add-new-contact-menu-img">
                    </div>
                    <div>
                        <div class="add-new-contact-menu-text">
                            <span class="add-new-contact-menu-text-headline">Add contact</span>
                            <span class="add-new-contact-menu-text-subtext">Tasks are better with a team!</span>
                        </div>
                        <div class="add-new-contact-menu-separator"></div>
                    </div>
                </div>
                <div class="add-new-contact-content">
                    <div class="add-new-contact-close-button">
                        <img src="./assets/icons/close-contact.svg" alt="close" class="close-contact" onclick="closeNewContact()">
                    </div>
                    <div class="add-new-contact-input-fields">
                        <div class="icon-profile-add-new-contact">
                            <img src="./assets/icons/personContact.svg" alt="profile" class="img-profile-add-new-contact">
                        </div>
                        <div class="add-new-contact-input-field-section">
                            <div class="contact-input-fields">
                                <input type="text" placeholder="Name" class="input-fields-add-new-contact" id="newContactName" required>
                                <div class="contact-input-icon">
                                    <img src="./assets/icons/contactPersonInput.svg" alt="profile">
                                </div>
                                <div id="nameError" class="form-error-message"></div>
                            </div>
                            <div class="input-field-separator"></div>
                            <div class="contact-input-fields">
                                <input type="email" placeholder="Email" class="input-fields-add-new-contact" id="newContactEmail">
                                <div class="contact-input-icon">
                                    <img src="./assets/icons/contactMailInput.svg" alt="mail">
                                </div>
                                <div id="emailError" class="form-error-message"></div>
                            </div>
                            <div class="input-field-separator"></div>
                            <div class="contact-input-fields">
                                <input type="tel" placeholder="Phone" class="input-fields-add-new-contact" id="newContactPhone" required>
                                <div class="contact-input-icon">
                                    <img src="./assets/icons/contactCallInput.svg" alt="phone">
                                </div>
                                <div id="phoneError" class="form-error-message"></div>
                            </div>
                        </div>
                    </div>
                    <div class="add-new-contact-button-section">
                        <div class="add-new-contact-buttons">
                            <button type="button" class="button-cancel-new-contact" onclick="closeNewContact()">
                                <span>Cancel</span>
                                <img src="./assets/icons/cancelNewContact.svg" alt="cancel">
                            </button>
                            <button type="submit" class="button-create-new-contact">
                                <span>Create contact</span>
                                <img src="./assets/icons/createNewContact.svg" alt="tick">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `;
    addNewContactContainer.style.display = 'flex';
}

/* generates HTML-contend for the short single contact detailes in the contact menu */

function generateContactHTML(user) {
    const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
    return `
        <div class="single-contact" data-name="${user.name}" onclick="showContactDetail('${user.name}')">
            <div class="single-contact-profile-img" style="background-color: ${user.color};">
                ${initials}
            </div>
            <div class="single-contact-profile">
                ${user.name}
                <a href="#">${user.email}</a>
            </div>
        </div>
    `;
}

/* generates HTML-contend for the detailed view of a contact */

function generateContactDetailHTML(user, bgColor) {
    const initials = user.name.split(' ').map(n => n.charAt(0)).join('');
    return `
        <div class="contact-detail-card-headline">
            <div class="contact-detail-profile-img" style="background-color: ${bgColor};">${initials}</div>
            <div class="contact-detail-card-user">
                <span class="contact-detail-card-name">${user.name}</span>
                <div class="contact-detail-change-section">
                    <button class="contact-detail-edit" onmouseover="changeIcon(this, 'editContactsActive.svg')" 
                    onmouseout="changeIcon(this, 'edit-contact.svg')" onclick="openEditingContact('${user.name}')">
                        <img src="./assets/icons/edit-contact.svg" alt="edit" class="contact-detail-change-icons-edit">
                        <span class="contact-detail-edit-text">Edit</span>
                    </button>
                    <button class="contact-detail-delete" onmouseover="changeIcon(this, 'deleteContactActive.svg')" 
                    onmouseout="changeIcon(this, 'delete-contact.svg')" onclick="deleteContact('${user.name}')">
                        <img src="./assets/icons/delete-contact.svg" alt="delete" class="contact-detail-change-icons-delete">
                        <span class="contact-detail-delete-text">Delete</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="contact-detail-card-subheadline">
            <span>Contact Information</span>
        </div>
        <div class="contact-detail-information-block">
            <div class="contact-detail-information-block-mail">
                <span class="contact-detail-information-block-subheadline">Email</span>
                <a href="mailto:${user.email}" class="contact-detail-information-block-text">${user.email}</a>
            </div>
            <div class="contact-detail-information-block-phone">
                <span class="contact-detail-information-block-subheadline">Phone</span>
                <span class="contact-detail-information-block-text">${user.phone}</span>
            </div>
        </div>
    `;
}

function changeIcon(button, newIcon) {
    const img = button.querySelector('img');
    img.src = `./assets/icons/${newIcon}`;
}






/* generates HTML-content for a separate editing window to change the contact details */

function generateEditContactHTML(user, initials, bgColor) {
    return `
        <div class="edit-contact">
            <div class="edit-contact-menu">
                <div class="edit-contact-menu-img">
                    <img src="./assets/icons/logo-add-new-contact.svg" alt="logo" class="edit-contact-menu-img">
                </div>
                <div>
                    <div class="edit-contact-menu-text">
                        <span class="edit-contact-menu-text-headline">Edit contact</span>
                    </div>
                    <div class="edit-contact-menu-separator"></div>
                </div>
            </div>
            <div class="edit-contact-content">
                <div class="edit-contact-close-button">
                    <img src="./assets/icons/close-contact.svg" alt="close" class="close-contact" onclick="closeEditContact()">
                </div>
                <form onsubmit="saveEditingContact(); return false;">
                    <div class="edit-contact-input-fields">
                        <div class="icon-profile-edit-contact" style="background-color: ${bgColor};">
                            <span>${initials}</span>
                        </div>
                        <div class="edit-contact-input-field-section">
                            <div class="contact-input-fields">
                                <input type="text" placeholder="Name" class="input-fields-edit-contact" value="${user.name}" id="contactName">
                                <div class="contact-input-icon">
                                    <img src="./assets/icons/contactPersonInput.svg" alt="profile">
                                </div>
                                <div id="nameError" class="form-error-message"></div>
                            </div>
                            <div class="input-field-separator"></div>
                            <div class="contact-input-fields">
                                <input type="email" placeholder="Email" class="input-fields-edit-contact" value="${user.email}" id="contactMailAdress">
                                <div class="contact-input-icon">
                                    <img src="./assets/icons/contactMailInput.svg" alt="mail">
                                </div>
                                <div id="emailError" class="form-error-message"></div>
                            </div>
                            <div class="input-field-separator"></div>
                            <div class="contact-input-fields">
                                <input type="tel" placeholder="Phone" class="input-fields-edit-contact" value="${user.phone}" id="contactPhone">
                                <div class="contact-input-icon">
                                    <img src="./assets/icons/contactCallInput.svg" alt="phone">
                                </div>
                                <div id="phoneError" class="form-error-message"></div>
                            </div>
                        </div>
                    </div>
                    <div class="edit-contact-button-section">
                        <div class="edit-contact-buttons">
                            <div class="button-delete-contact" onclick="clearContactInfo()">
                                <span>Delete</span>
                            </div>
                            <div class="button-save-contact" onclick="saveEditingContact()">
                                <span>Save</span>
                                <img src="./assets/icons/createNewContact.svg" alt="tick">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}