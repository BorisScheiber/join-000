async function init() {
  displayDesktopSidebar();
  displayHeader();
  displayMobileNav();
  removeClassesIfNotLoggedIn();
}


function displayDesktopSidebar() {
  document.getElementById("desktopSidebar").innerHTML =
    displayDesktopSidebarHTML();
  setActiveLinkSidebar();
}


function setActiveLinkSidebar() {
  let path = window.location.pathname;
  let links = document.querySelectorAll(".sidebar-links");
  let legalLinks = document.querySelectorAll(".legal-links");

  addActiveClass(links, path, "link-desktop-active");
  addActiveClass(legalLinks, path, "legal-links-active");
}


function addActiveClass(links, path, activeClass) {
  links.forEach((link) => {
    if (link.href.includes(path)) {
      link.classList.add(activeClass);
    }
  });
}


function displayHeader() {
  document.getElementById("header").innerHTML = displayHeaderHTML();
}


function displayMobileNav() {
  document.getElementById("mobileNav").innerHTML = displayMobileNavHTML();
  setActiveLinkMobileNav();
}


function setActiveLinkMobileNav() {
  let path = window.location.pathname;
  let links = document.querySelectorAll(".nav-mobile-links");

  addActiveClass(links, path, "nav-mobile-links-active");
}


function pageBack() {
  window.history.back();
}


function removeClassesIfNotLoggedIn() {
  let path = window.location.pathname;

  if (path.includes("legalNoticeNo") || path.includes("privacyPolicyNo")) {
    hideElementsIfNotLoggedIn();
    updateLegalLinksNotLoggedIn();
  }
  setActiveLinkSidebar();
}


function hideElementsIfNotLoggedIn() {
  document.querySelector(".header-nav").classList.add("d-none");
  document.querySelector(".sidebar-menu").classList.add("d-none");
  document.getElementById("mobileNav").classList.add("d-none-important");
}


function updateLegalLinksNotLoggedIn() {
  document.getElementById("privacyPolicyLink").href = "./privacyPolicyNo.html";
  document.getElementById("legalNoticeLink").href = "./legalNoticeNo.html";
}


function displayDropDownNav() {
  document.getElementById("dropDownNav").innerHTML = displayDropDownNavHTML();
}


function toggleDropDownNav() {
  let dropDownNav = document.getElementById("dropDownNav");

  if (dropDownNav.style.display === "flex") {
      slideOut(dropDownNav);
      document.removeEventListener('click', closeDropdownOnClickOutside);
  } else {
      slideIn(dropDownNav);
      document.addEventListener('click', closeDropdownOnClickOutside);
  }
}


function slideIn(element) {
  element.style.display = "flex";
  element.classList.remove('slide-out');
  element.classList.add('slide-in');
}


function slideOut(element) {
  element.classList.remove('slide-in');
  element.classList.add('slide-out');
  setTimeout(() => {
      element.style.display = "none";
      element.classList.remove('slide-out');
  }, 200);
}


function closeDropdownOnClickOutside(event) {
  let dropDownNav = document.getElementById("dropDownNav");
  let toggleButton = document.querySelector(".header-user-button");

  if (!dropDownNav.contains(event.target) && !toggleButton.contains(event.target)) {
      slideOut(dropDownNav);
      document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}
