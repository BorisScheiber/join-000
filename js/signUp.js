function updateIconOnInput(inputField) {
    let passwordValue = inputField.value;
    let inputIconDiv = inputField.nextElementSibling;
    let inputFieldImg = inputIconDiv.querySelector("img");

    if (passwordValue === "") {
        inputFieldImg.src = "./assets/icons/lock.svg";
        inputFieldImg.classList.remove("cursor-pointer");
        inputField.type = "password";
    } else if (inputFieldImg.src.includes("lock.svg")) {
        inputFieldImg.src = "./assets/icons/visibility_off.svg";
        inputFieldImg.classList.add("cursor-pointer");
    }
}

function showHidePassword(inputFieldImg) {
    let inputField = inputFieldImg.parentNode.previousElementSibling;

    switch (true) {
        case inputFieldImg.src.includes("lock.svg"):
            break;
        case inputFieldImg.src.includes("visibility_off.svg"):
            inputFieldImg.src = "./assets/icons/visibility.svg";
            inputField.type = "text";
            break;
        case inputFieldImg.src.includes("visibility.svg"):
            inputFieldImg.src = "./assets/icons/visibility_off.svg";
            inputField.type = "password";
            break;
    }
}
