"use strict";

// DATA
const dummyLists = [
    {
        user: "Monika",
        password: "monkey",
        todo: {
            do: [
                "Walk dogs to the forest",
                "Do yoga",
                "Play a board game with family",
                "Read a book",
            ],
            done: ["Complete React online course", "Do dishes"],
        },
    },
    {
        user: "Jonas",
        password: "jonas",
        todo: {
            do: ["Finish project at work", "Buy apartment", "Read a book"],
            done: ["Feed the fish"],
        },
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
const listBlockEl = document.querySelector(".card__list-items");

const inputName = document.getElementById("name");
const inputPassword = document.getElementById("password");

// VARIABLES
let loggedIn = false;
let currentAccount;

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
const displayList = function (user, sort = false) {
    listBlockEl.innerHTML = "";

    const works = sort
        ? user.todo.do.slice().sort((a, b) => a - b)
        : user.todo.do;

    works.forEach(function (work, i) {
        const html = `
        <div class="card__item">
            <span class="checkmark"></span>
            <div class="text crossed">${work}</div>
            <div class="exit"></div>
      </div>
      `;

        listBlockEl.insertAdjacentHTML("afterbegin", html);
    });
};

const updateUI = function (user) {
    displayList(user);
};

// login/signup
loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    currentAccount = dummyLists.find((acc) => acc.user === inputName.value);
    console.log(currentAccount);

    if (currentAccount?.password === inputPassword.value) {
        inputName.value = inputPassword.value = "";
        closeModal();

        updateUI(currentAccount);
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
