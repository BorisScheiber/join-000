async function initLogin() {
    checkPreviousPage();
    displayLoginPage();
}

function checkPreviousPage() {
  if (!document.referrer.includes("signUp.html")) {
    document.getElementById("loginAnimationBg").style.display = "block";
    document.getElementById("loginJoinLogo").style.display = "block";
    document.getElementById("loginJoinLogoNoAnimation").style.display = "none";
  }
}

function displayLoginPage() {
  document.getElementById("loginContent").style.display = "flex";
}

function goToSignUp() {
  window.location.href = "signUp.html";
}

function guestLogin() {
  window.location.href = "summary.html";
}
