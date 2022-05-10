"use strict";

// DATA
const dummyLists = [
    {
        user: "Monika",
        password: "monkey",
        toDoList: [
            "Walk dogs to the forest",
            "Do yoga",
            "Play a board game with family",
            "Read a book",
        ],
        doneList: ["Complete React online course", "Do dishes"],
    },
    {
        user: "Jonas",
        password: "jonas",
        toDoList: ["Buy apartment", "Go outside", "Play a board game"],
        doneList: ["Finish project at work", "Feed the fish"],
    },
];

// SELECTORS
// buttons
const loginIcon = document.querySelector(".header__login");
const themeSwitchBtn = document.querySelector(".header__theme");
const dragAndDrop = document.querySelector(".bottom");
const cancelBtn = document.querySelector(".btn__cancel");
const loginBtn = document.querySelector(".btn__login");
const signupBtn = document.querySelector(".btn__signup");

// overlays
const loginOverlay = document.querySelector(".login");
const overlay = document.querySelector(".overlay");
const theme = document.querySelector(".theme-switch");

// other
const inputField = document.querySelector(".text__input");
const listItems = document.querySelectorAll(".card__item");
const listItemCounterEl = document.querySelector(".items-left");
const cardBlock = card.document.querySelector(".card");

const inputName = document.getElementById("name");
const inputPassword = document.getElementById("password");

// VARIABLES
let loggedIn = false;

// HELPER FUNCTIONS
const closeModal = function () {
    loginOverlay.close();
    overlay.classList.add("hidden");
};
const openModal = function () {
    loginOverlay.showModal();
    overlay.classList.remove("hidden");
};

// EVENT LISTENERS
// open/close login modal
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
        closeModal();
    }
});
loginIcon.addEventListener("click", function () {
    openModal();
});
cancelBtn.addEventListener("click", function () {
    closeModal();
});

// theme switching
themeSwitchBtn.addEventListener("click", function () {
    theme.classList.toggle("theme-1");
    theme.classList.toggle("theme-2");
});

// display list
const displayList = function (acc, sort = false) {
    containerMovements.innerHTML = "";

    const movs = sort
        ? acc.movements.slice().sort((a, b) => a - b)
        : acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? "deposit" : "withdrawal";

        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date, acc.locale);

        const formattedMov = formatCur(mov, acc.locale, acc.currency);

        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
            i + 1
        } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
      `;

        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};

// login/signup
loginBtn.addEventListener("click", function () {
    const userName = inputName.value.trim().toLowerCase();
    const userpassword = inputPassword.value;
    const userData = dummyLists.find(
        (element) => element.user == userName.toLowerCase()
    );

    console.log(userName);
    console.log(userpassword);

    if (userData && userData.password == userpassword) {
        loggedIn = true;
        loginIcon.style.backgroundImage =
            "url('https://res.cloudinary.com/kreiva/image/upload/v1652166389/FrontendMentor/ToDoListApp/logout2_uirmed.png')";
        // appLoad();
    }
});

const appLoad = function () {
    window.addEventListener("load", function () {
        if (loggedIn) {
            console.log("logged in");
        } else {
            console.log("not logged in");
        }
    });
};

appLoad();
