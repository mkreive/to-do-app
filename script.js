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
const loginBtn = document.querySelector(".header__login");
const themeSwitchBtn = document.querySelector(".header__theme");
const dragAndDrop = document.querySelector(".bottom");
const cancelBtn = document.querySelector(".btn__cancel");

// overlays
const loginOverlay = document.querySelector(".login");
const overlay = document.querySelector(".overlay");
const theme = document.querySelector(".theme-switch");

// other
const inputField = document.querySelector(".text__input");
const listItems = document.querySelectorAll(".card__item");
const listItemCounterEl = document.querySelector(".items-left");

// VARIABLES

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
loginBtn.addEventListener("click", function () {
    openModal();
});
cancelBtn.addEventListener("click", function () {
    closeModal();
});

themeSwitchBtn.addEventListener("click", function () {
    theme.classList.toggle("theme-1");
    theme.classList.toggle("theme-2");
});
