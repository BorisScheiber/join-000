/**
 * Initializes the page by displaying the desktop sidebar, header, mobile navigation,
 * removing certain classes if the user is not logged in, and displaying the user's initials in the header.
 */
async function init() {
  displayDesktopSidebar();
  displayHeader();
  displayMobileNav();
  removeClassesIfNotLoggedIn();
  displayInitialsHeaderUser();
}


/**
 * Gets the user's initials from localStorage.
 * If user initials are not found, it checks for guest initials.
 * If neither are found, it returns "G" as a default.
 * 
 * @returns {string} The initials of the user or guest.
 */
function getInitialsHeaderUser() {
  let user = localStorage.getItem("user");
  let guestInitials = localStorage.getItem("guestInitials");
  let initials = "G";
  let userData;

  if (user) {
    userData = JSON.parse(atob(user));
    initials = userData.initials || initials;
  } else if (guestInitials) {
    initials = guestInitials;
  }
  return initials;
}


/**
 * Displays the user's initials in the HTML element with the ID 'headerUserInitials'.
 * If the element is found, it sets its innerHTML to the user's initials.
 */
function displayInitialsHeaderUser() {
  let initials = getInitialsHeaderUser();
  let initialsElement = document.getElementById("headerUserInitials");

  if (initialsElement) {
    initialsElement.innerHTML = initials;
  }
}


/**
 * Displays the desktop sidebar with links and sets the active link.
 */
function displayDesktopSidebar() {
  document.getElementById("desktopSidebar").innerHTML =
    displayDesktopSidebarHTML();
  setActiveLinkSidebar();
}


/**
 * Sets the active link in the sidebar based on the current path.
 */
function setActiveLinkSidebar() {
  let path = window.location.pathname;
  let links = document.querySelectorAll(".sidebar-links");
  let legalLinks = document.querySelectorAll(".legal-links");

  addActiveClass(links, path, "link-desktop-active");
  addActiveClass(legalLinks, path, "legal-links-active");
}


/**
 * Adds an active class to the links that match the current path.
 *
 * @param {NodeList} links - The list of links to check.
 * @param {string} path - The current path to match.
 * @param {string} activeClass - The class to add to the active link.
 */
function addActiveClass(links, path, activeClass) {
  links.forEach((link) => {
    if (link.href.includes(path)) {
      link.classList.add(activeClass);
    }
  });
}


/**
 * Displays the header with the logo and navigation menu.
 */
function displayHeader() {
  document.getElementById("header").innerHTML = displayHeaderHTML();
}


/**
 * Displays the mobile navigation menu with links and sets the active link.
 */
function displayMobileNav() {
  document.getElementById("mobileNav").innerHTML = displayMobileNavHTML();
  setActiveLinkMobileNav();
}


/**
 * Sets the active link in the mobile navigation based on the current path.
 */
function setActiveLinkMobileNav() {
  let path = window.location.pathname;
  let links = document.querySelectorAll(".nav-mobile-links");

  addActiveClass(links, path, "nav-mobile-links-active");
}


/**
 * Navigates to the previous page in the browser history.
 */
function pageBack() {
  window.history.back();
}


/**
 * Removes certain classes if the user is not logged in.
 */
function removeClassesIfNotLoggedIn() {
  let path = window.location.pathname;

  if (path.includes("legalNoticeNo") || path.includes("privacyPolicyNo")) {
    hideElementsIfNotLoggedIn();
    updateLegalLinksNotLoggedIn();
  }
  setActiveLinkSidebar();
}


/**
 * Hides elements that should not be visible if the user is not logged in.
 */
function hideElementsIfNotLoggedIn() {
  document.querySelector(".header-nav").classList.add("d-none");
  document.querySelector(".sidebar-menu").classList.add("d-none");
  document.getElementById("mobileNav").classList.add("d-none-important");
}


/**
 * Updates the links to legal pages if the user is not logged in.
 */
function updateLegalLinksNotLoggedIn() {
  document.getElementById("privacyPolicyLink").href = "./privacyPolicyNo.html";
  document.getElementById("legalNoticeLink").href = "./legalNoticeNo.html";
}


/**
 * Displays the dropdown navigation menu.
 */
function displayDropDownNav() {
  document.getElementById("dropDownNav").innerHTML = displayDropDownNavHTML();
}


/**
 * Toggles the visibility of the dropdown navigation menu.
 */
function toggleDropDownNav() {
  let dropDownNav = document.getElementById("dropDownNav");

  if (dropDownNav.style.display === "flex") {
    slideOut(dropDownNav);
    document.removeEventListener("click", closeDropDownNavOnClickOutside); // Use a specific name
  } else {
    slideIn(dropDownNav);
    document.addEventListener("click", closeDropDownNavOnClickOutside); // Use a specific name
  }
}


/**
 * Slides the element in to make it visible.
 *
 * @param {HTMLElement} element - The element to slide in.
 */
function slideIn(element) {
  element.style.display = "flex";
  element.classList.remove("slide-out");
  element.classList.add("slide-in");
}


/**
 * Slides the element out to hide it.
 *
 * @param {HTMLElement} element - The element to slide out.
 */
function slideOut(element) {
  element.classList.remove("slide-in");
  element.classList.add("slide-out");
  setTimeout(() => {
    element.style.display = "none";
    element.classList.remove("slide-out");
  }, 200);
}


/**
 * Closes the dropdown navigation menu if the user clicks outside of it.
 *
 * @param {Event} event - The event triggered by clicking outside.
 */
function closeDropDownNavOnClickOutside(event) {
  let dropDownNav = document.getElementById("dropDownNav");
  let toggleButton = document.querySelector(".header-user-button");

  if (
    !dropDownNav.contains(event.target) &&
    !toggleButton.contains(event.target)
  ) {
    slideOut(dropDownNav);
    document.removeEventListener("click", closeDropDownNavOnClickOutside);
  }
}
