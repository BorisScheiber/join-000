/**
 * Returns the HTML string for the desktop sidebar, including the logo, menu links, and legal links.
 *
 * @returns {string} The HTML string for the desktop sidebar.
 */
function displayDesktopSidebarHTML() {
  return /*html*/ `
        <div class="sidebar-logo">
            <img src="./assets/img/Join-Logo-white.png" alt="Join Logo">
        </div>
        <div class="sidebar-menu">
            <a class="sidebar-links" href="./summary.html">
                <img class="sidebar-icons" src="./assets/icons/summaryDesktop.svg" alt="summary">
                Summary
            </a>
            <a class="sidebar-links" href="./addTask.html">
                <img class="sidebar-icons" src="./assets/icons/addTaskDesktop.svg" alt="add">
                Add Task
            </a>
            <a class="sidebar-links" href="./board.html">
                <img class="sidebar-icons" src="./assets/icons/boardDesktop.svg" alt="board">
                Board
            </a>
            <a class="sidebar-links" href="./contacts.html">
                <img class="sidebar-icons" src="./assets/icons/contactsDesktop.svg" alt="contacts">
                Contacts
            </a>
        </div>
        <div class="legal-menu">
            <a id="privacyPolicyLink" class="legal-links" href="./privacyPolicy.html">Privacy Policy</a>
            <a id="legalNoticeLink" class="legal-links" href="./legalNotice.html">Legal notice</a>
        </div>
    `;
}

/**
 * Returns the HTML string for the header, including the logo, title, help link, and user dropdown menu.
 *
 * @returns {string} The HTML string for the header.
 */
function displayHeaderHTML() {
  return /*html*/ `
            <img class="header-logo-mobile" src="./assets/icons/mobile/joinHeaderMobile.svg" alt="">
            <span class="header-title">Kanban Project Management Tool</span>
        <div class="header-nav">
            <a class="header-help" href="./help.html">
                <img src="./assets/icons/help.svg" alt="">
            </a>
            <button onclick="toggleDropDownNav()" class="header-user-button">
                <span id="headerUserInitials" class="header-user-initials"></span>
            </button>
            <nav id="dropDownNav" class="drop-down-nav" style="display: none;">
                <a class="drop-down-nav-links drop-down-nav-help" href="./help.html">Help</a>
                <a class="drop-down-nav-links" href="./legalNotice.html">Legal Notice</a>
                <a class="drop-down-nav-links" href="./privacyPolicy.html">Privacy Policy</a>
                <a class="drop-down-nav-links" href="./index.html">Log out</a>
            </nav>
        </div>
    `;
}

/**
 * Returns the HTML string for the mobile navigation menu, including the menu links and icons.
 *
 * @returns {string} The HTML string for the mobile navigation menu.
 */
function displayMobileNavHTML() {
  return /*html*/ `
        <a class="nav-mobile-links" href="./summary.html">
            <img class="nav-mobile-icons" src="./assets/icons/mobile/summaryMobile.svg" alt="">
            Summary
        </a>
        <a class="nav-mobile-links" href="./board.html" id="board-mobile">
            <img class="nav-mobile-icons" src="./assets/icons/mobile/boardMobile.svg" alt="">
            Board
        </a>
        <a class="nav-mobile-links" href="./addTask.html" id="add-task-mobile">
            <img class="nav-mobile-icons" src="./assets/icons/mobile/addTaskMobile.svg" alt="">
            Add Task
        </a>
        <a class="nav-mobile-links" href="./contacts.html">
            <img class="nav-mobile-icons" src="./assets/icons/mobile/contactsMobile.svg" alt="">
            Contacts
        </a>
    `;
}


/**
 * Generates the HTML content for the landscape warning message on mobile devices.
 * 
 * This function returns a string of HTML that represents a warning message to be displayed
 * when the device is in landscape orientation on mobile. The warning includes an image icon
 * and text prompting the user to rotate their device to portrait mode.
 * 
 * @returns {string} The HTML string for the landscape warning message.
 */
function displayLandscapeWarningMobileHTML() {
    return /*html*/ `
    <div class="landscape-warning-container">
        <div class="landscape-warning-imagebox">
            <img class="landscape-warning-icon" src="./assets/icons/mobile/rotateDevice.png" alt="">
        </div>
        <span class="landscape-warning-seperator"></span>
        <span class="landscape-warning-text">Please <br> rotate <br> your <br> device</span>
    </div>
    `;
}
