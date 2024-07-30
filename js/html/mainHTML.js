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

function displayHeaderHTML() {
  return /*html*/ `
            <img class="header-logo-mobile" src="./assets/icons/mobile/joinHeaderMobile.svg" alt="">
            <span class="header-title">Kanban Project Management Tool</span>
        <div class="header-nav">
            <a class="header-help" href="./help.html">
                <img src="./assets/icons/help.svg" alt="">
            </a>
            <button onclick="toggleDropDownNav()" class="header-user-button">
                <span id="headerUserInitials" class="header-user-initials">G</span>
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

function displayMobileNavHTML() {
  return /*html*/ `
        <a class="nav-mobile-links" href="./summary.html">
            <img class="nav-mobile-icons" src="./assets/icons/mobile/summaryMobile.svg" alt="">
            Summary
        </a>
        <a class="nav-mobile-links" href="./board.html">
            <img class="nav-mobile-icons" src="./assets/icons/mobile/boardMobile.svg" alt="">
            Board
        </a>
        <a class="nav-mobile-links" href="./addTask.html">
            <img class="nav-mobile-icons" src="./assets/icons/mobile/addTaskMobile.svg" alt="">
            Add Task
        </a>
        <a class="nav-mobile-links" href="./contacts.html">
            <img class="nav-mobile-icons" src="./assets/icons/mobile/contactsMobile.svg" alt="">
            Contacts
        </a>
    `;
}
