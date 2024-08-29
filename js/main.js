let usersData = [];


/**
 * Initializes the page by displaying the desktop sidebar, header, mobile navigation,
 * removing certain classes if the user is not logged in, and displaying the user's initials in the header.
 */
async function init() {
  displayDesktopSidebar();
  displayHeader();
  displayMobileNav();
  removeClassesIfNotLoggedIn();
  await getUsersData();
  displayInitialsHeaderUser();
}


/**
 * Initializes the landscape warning for mobile devices.
 * Displays a warning if the device is in landscape orientation and is a mobile device.
 */
function initLandscapeWarning() {
  displayLandscapeWarningMobile();

  if (isMobileDevice() && isTouchDevice()) {
    handleOrientationChangeMobile();
  }
}


/**
 * Displays the HTML content for the landscape warning on mobile devices.
 * This function injects the warning HTML into the element with the ID 'landscapeWarningMobile'.
 */
function displayLandscapeWarningMobile() {
  let warningOverlay = document.getElementById('landscapeWarningMobile');
  warningOverlay.innerHTML = "";
  warningOverlay.innerHTML = displayLandscapeWarningMobileHTML();
}


/**
 * Handles the orientation change for mobile devices.
 * It listens for changes in orientation and window size, then toggles the landscape warning accordingly.
 */
function handleOrientationChangeMobile() {
  let mediaQuery = window.matchMedia("(orientation: landscape)");

  toggleLandscapeWarning(mediaQuery.matches);

  mediaQuery.addEventListener("change", (e) => {
    toggleLandscapeWarning(e.matches);
  });

  window.addEventListener('resize', () => {
    toggleLandscapeWarning(mediaQuery.matches);
  });
}


/**
 * Toggles the display of the landscape warning based on the device's orientation and height.
 * If the device is in landscape mode and the height is less than or equal to 850px,
 * the warning overlay is shown and the body overflow is hidden. Otherwise, the warning is hidden.
 *
 * @param {boolean} show - A boolean indicating whether to show or hide the landscape warning.
 */
function toggleLandscapeWarning(show) {
  let warningOverlay = document.getElementById('landscapeWarningMobile');
  let body = document.querySelector('body');
  if (warningOverlay) {
    if (show && window.innerHeight <= 850) { 
      warningOverlay.style.display = 'flex';
      body.style.overflow = 'hidden';
    } else {
      warningOverlay.style.display = 'none';
      body.style.overflow = 'auto';
    }
  }
}


/**
 * Checks if the current device is a mobile device based on the user agent string.
 *
 * @returns {boolean} True if the device is a mobile or tablet, false otherwise.
 */
function isMobileDevice() {
  let userAgent = navigator.userAgent.toLowerCase();
  return /mobi|android|iphone|ipod|ipad|tablet/i.test(userAgent);
}


/**
 * Checks if the current device supports touch input.
 *
 * @returns {boolean} True if the device supports touch input, false otherwise.
 */
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}


/**
 * Fetches user data from the database and stores it in the usersData array.
 *
 * This asynchronous function retrieves user data from the database using the getData function.
 * If successful, it stores the fetched data in the usersData variable.
 * If an error occurs during the fetch, it logs the error to the console.
 */
async function getUsersData() {
  try {
    usersData = await getData("users");
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


/**
 * Retrieves the initials to display in the header.
 *
 * This function checks if a user is stored in local storage and, if so,
 * retrieves their initials. If no user is found, it checks for guest initials.
 * If neither are found, it defaults to "G".
 *
 * @returns {string} The initials to display in the header.
 */
function getInitialsHeaderUser() {
  let user = localStorage.getItem("user");
  let guestInitials = localStorage.getItem("guestInitials");

  if (user) {
    return getUserInitials(user);
  } else if (guestInitials) {
    return guestInitials;
  }

  return "G";
}


/**
 * Extracts the initials of a user from the provided user data.
 *
 * This function decodes the user data, searches for the user by ID, 
 * and returns their initials. If the user or initials are not found, it defaults to "G".
 *
 * @param {string} user - The encoded user data from local storage.
 * @returns {string} The initials of the user or "G" if not found.
 */
function getUserInitials(user) {
  let userData = JSON.parse(atob(user));
  let userId = userData.id;

  if (userId) {
    let foundUser = searchUserById(userId);
    if (foundUser && foundUser.initials) {
      return foundUser.initials;
    }
  }

  return "G";
}


/**
 * Searches for a user by their ID in the usersData array.
 *
 * This function looks through the usersData array to find a user with the matching ID.
 *
 * @param {string} userId - The ID of the user to search for.
 * @returns {Object|null} The user object if found, or null if not found.
 */
function searchUserById(userId) {
  return usersData.find((u) => u.id === userId) || null;
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


