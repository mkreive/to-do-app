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
    {
        user: "Dummy",
        password: "",
        todo: {
            do: [],
            done: [],
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
// const listItems = document.querySelectorAll(".card__item");
const listItemCounterEl = document.querySelector(".items-left");
const listBlockEl = document.querySelector(".card__list-items");

const inputName = document.getElementById("name");
const inputPassword = document.getElementById("password");

// VARIABLES
let loggedIn = false;
let currentAccount;

// HELPER FUNCTIONS
// close open modal
const closeModal = function () {
    loginOverlay.close();
    overlay.classList.add("hidden");
};
const openModal = function () {
    loginOverlay.showModal();
    overlay.classList.remove("hidden");
};

// generate html task line
const generateItemHtml = function (value, checkmarkCl, textCl) {
    return `
    <div class="card__item">
        <span class="checkmark ${checkmarkCl}"></span>
        <div class="text ${textCl}">${value}</div>
        <div class="btn__exit"></div>
    </div>`;
};

// adding new task line
const addNewTask = function (account, task) {
    inputField.value = "";
    account.todo.do.push(task);
    updateUI(account);
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

// checkmark task as done
const taskElementListener = function () {
    const listItems = document.querySelectorAll(".card__item");

    listItems.forEach((item) =>
        item.addEventListener("click", function (e) {
            const taskClicked = e.target;

            if (taskClicked.classList.contains("checkmark")) {
                taskClicked.classList.add("checked");
                const checkedItem = taskClicked.nextElementSibling;
                checkedItem.classList.add("crossed");

                if (currentAccount) {
                    const newToDoList = currentAccount.todo.do.filter(
                        (task) => task != checkedItem.innerHTML
                    );
                    currentAccount.todo.do = newToDoList;
                    currentAccount.todo.done.push(checkedItem.innerHTML);
                }
            } else if (taskClicked.classList.contains("btn__exit")) {
                // delte from vaizdas ir is duombazes
            }
        })
    );
};

// display list of tasks
const displayList = function (user) {
    listBlockEl.innerHTML = "";
    listItemCounterEl.textContent = "";

    const todo = user.todo.do;
    const done = user.todo.done;

    todo.forEach(function (work) {
        const html = generateItemHtml(work, "", "");
        listBlockEl.insertAdjacentHTML("beforeend", html);
    });
    done.forEach(function (work) {
        const html = generateItemHtml(work, "checked", "crossed");
        listBlockEl.insertAdjacentHTML("beforeend", html);
    });

    listItemCounterEl.textContent = `${todo.length} items left`;
    taskElementListener();
};

// update UI
const updateUI = function (user) {
    displayList(user);
};

// login/signup forms
loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    currentAccount = dummyLists.find((acc) => acc.user === inputName.value);

    if (currentAccount?.password === inputPassword.value) {
        inputName.value = inputPassword.value = "";
        closeModal();
        updateUI(currentAccount);
        loginIcon.style.backgroundImage = "none";
        loginIcon.textContent = `Hello, ${currentAccount.user}`;
    }
});
signupBtn.addEventListener("click", function (e) {
    e.preventDefault();
    currentAccount = dummyLists.find((acc) => acc.user === inputName.value);

    if (!currentAccount && inputName.value) {
        currentAccount = {
            user: inputName.value,
            password: inputPassword.value,
            todo: { do: [], done: [] },
        };
        dummyLists.push(currentAccount);
        inputName.value = inputPassword.value = "";
        closeModal();
        updateUI(currentAccount);
    }
});

// user enters new task
inputField.addEventListener("keydown", function (e) {
    const newItem = inputField.value;
    if (e.key === "Enter" && inputField.value && currentAccount) {
        addNewTask(currentAccount, newItem);
    } else if (e.key === "Enter" && inputField.value && !currentAccount) {
        [currentAccount] = dummyLists.filter((user) => user.user === "Dummy");
        addNewTask(currentAccount, newItem);
    }
});

// filter tasks

// clear list

// drag and drop

// page load

const appLoad = function () {
    window.addEventListener("load", function () {});
};
