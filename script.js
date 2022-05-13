"use strict";

/////////// DUMMY DATA
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
        user: "Nobody",
        password: "",
        todo: {
            do: ["Login/Signup to add some tasks"],
            done: [],
        },
    },
];

/////////// SELECTORS
// theme
const themeSwitchBtn = document.querySelector(".header__theme");
const theme = document.querySelector(".theme-switch");

// error elements
const errorCard = document.querySelector(".error");
const errorMessageEl = document.querySelector(".error__message");

// list items
const inputField = document.querySelector(".text__input");
const listBlockEl = document.querySelector(".card__list-items");
const listItemCounterEl = document.querySelector(".items-left");

// login/signup
const loginOverlay = document.querySelector(".login");
const loginIcon = document.querySelector(".header__login");
const loginBtn = document.querySelector(".btn__login");
const signupBtn = document.querySelector(".btn__signup");
const cancelBtn = document.querySelector(".btn__cancel");
const inputName = document.getElementById("name");
const inputPassword = document.getElementById("password");

// footer buttons
const footerBtns = document.querySelectorAll(".footer__text");

// other
const dragAndDrop = document.querySelector(".bottom");
const overlay = document.querySelector(".overlay");
const dragBtn = document.querySelector(".dragAndDrop");

/////////// VARIABLES
let currentAccount;
let prevClickedBtn;

/////////// HELPER FUNCTIONS
// modal
const closeModal = function (modal) {
    modal.close();
    overlay.classList.add("hidden");
};
const openModal = function (modal) {
    modal.showModal();
    overlay.classList.remove("hidden");
    overlay.addEventListener("click", function () {
        console.log("clicked");
    });
};
// error popup
const errorPopup = function (message) {
    openModal(errorCard);
    errorMessageEl.textContent = message;
    const gotItBtn = document.querySelector(".btn__got-it");
    gotItBtn.addEventListener("click", function () {
        errorCard.close();
    });
};

// generate list item HTML
const generateItemHtml = function (value, checkmarkCl, textCl) {
    return `
    <div class="card__item">
        <span class="checkmark ${checkmarkCl}"></span>
        <div class="text ${textCl}">${value}</div>
        <div class="btn__exit"></div>
    </div>`;
};

// display list
const displayList = function (todoList, doneList) {
    listBlockEl.innerHTML = "";
    listItemCounterEl.textContent = "";

    const todo = todoList;
    const done = doneList;

    if (todo) {
        todo.forEach(function (work) {
            const html = generateItemHtml(work, "", "");
            listBlockEl.insertAdjacentHTML("beforeend", html);
        });
        updateCounter(todo);
    }
    if (done) {
        done.forEach(function (work) {
            const html = generateItemHtml(work, "checked", "crossed");
            listBlockEl.insertAdjacentHTML("beforeend", html);
        });
    }

    taskElementListener();
};

// manipulating list items
const addNewTask = function (account, task) {
    inputField.value = "";
    account.todo.do.push(task);
    updateUI(account);
};
const crossOutTask = function (account, task) {
    const newToDoList = account.todo.do.filter((item) => item != task);
    account.todo.do = newToDoList;
    account.todo.done.push(task);
    updateCounter(newToDoList);
};
const deleteTask = function (account, task) {
    const newDoList = account.todo.do.filter((item) => item != task);
    const newDoneList = account.todo.done.filter((item) => item != task);
    account.todo.do = newDoList;
    account.todo.done = newDoneList;
    updateCounter(newDoList);
};

// clear button
const clearBtnClicked = function (account) {
    const completedTasks = account.todo.done;
    if (completedTasks) {
        completedTasks.forEach((item) => {
            deleteTask(account, item);
            updateUI(account);
        });
    }
};
// show active tasks button
const showActiveTasks = function (account) {
    displayList(account.todo.do, "");
};
const showCompletedTasks = function (account) {
    displayList("", account.todo.done);
};
const showAllTasks = function (account) {
    displayList(account.todo.do, account.todo.done);
};

const updateCounter = function (list) {
    listItemCounterEl.textContent = `${list.length} items left`;
};

// update UI
const updateUI = function (user) {
    displayList(user.todo.do, user.todo.done);
};

// welcome message
const logedInMessage = function (account) {
    loginIcon.style.backgroundImage = "none";
    loginIcon.textContent = `Hello, ${account.user}`;
};

/////////// EVENT LISTENERS
// theme switching
themeSwitchBtn.addEventListener("click", function () {
    theme.classList.toggle("theme-1");
    theme.classList.toggle("theme-2");
});

// open/close login modal
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
        closeModal(loginOverlay);
        closeModal(errorCard);
    }
});
loginIcon.addEventListener("click", function () {
    openModal(loginOverlay);
});

// entering new task
inputField.addEventListener("keydown", function (e) {
    const newItem = inputField.value;
    if (e.key === "Enter" && inputField.value && currentAccount) {
        addNewTask(currentAccount, newItem);
    } else if (e.key === "Enter" && inputField.value && !currentAccount) {
        [currentAccount] = dummyLists.filter((user) => user.user === "Dummy");
        addNewTask(currentAccount, newItem);
    } else if (e.key === "Enter" && !inputField.value) {
        errorPopup("Input shouldn't be empty..");
    }
});

// manipulating with list items
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
                    crossOutTask(currentAccount, checkedItem.textContent);
                }
            } else if (taskClicked.classList.contains("btn__exit")) {
                taskClicked.parentElement.remove();
                const removedItem =
                    taskClicked.previousElementSibling.textContent;
                deleteTask(currentAccount, removedItem);
            }
        })
    );
};

// login/signup forms
loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    currentAccount = dummyLists.find((acc) => acc.user === inputName.value);

    if (currentAccount?.password === inputPassword.value) {
        inputName.value = inputPassword.value = "";
        closeModal(loginOverlay);
        updateUI(currentAccount);
        logedInMessage(currentAccount);
    } else {
        errorPopup("🤷🏽 There is no such user, try signing up first.. ");
        inputName.value = inputPassword.value = "";
    }
});

signupBtn.addEventListener("click", function (e) {
    e.preventDefault();
    currentAccount = dummyLists.find((acc) => acc.user === inputName.value);

    if (
        !currentAccount &&
        inputName.value.trim().length > 4 &&
        inputPassword.value.trim().length > 4
    ) {
        currentAccount = {
            user: inputName.value.trim(),
            password: inputPassword.value.trim(),
            todo: { do: [], done: [] },
        };
        dummyLists.push(currentAccount);

        inputName.value = inputPassword.value = "";
        closeModal(loginOverlay);
        updateUI(currentAccount);
        logedInMessage(currentAccount);
    } else {
        errorPopup(
            "Username/Password should be at least 5 characters long.. Try again! "
        );
        inputName.value = inputPassword.value = "";
    }
});
cancelBtn.addEventListener("click", function () {
    inputName.value = inputPassword.value = "";
    closeModal(loginOverlay);
});

// footer buttons
footerBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        if (prevClickedBtn) {
            prevClickedBtn.classList.remove("active");
        }

        const account = currentAccount;
        const clickedBtn = e.target;
        clickedBtn.classList.add("active");

        if (clickedBtn.classList.contains("btn-all")) {
            showAllTasks(account);
            prevClickedBtn = clickedBtn;
        } else if (clickedBtn.classList.contains("btn-active")) {
            showActiveTasks(account);
            prevClickedBtn = clickedBtn;
        } else if (clickedBtn.classList.contains("btn-completed")) {
            showCompletedTasks(account);
            prevClickedBtn = clickedBtn;
        } else if (clickedBtn.classList.contains("btn-clear")) {
            clearBtnClicked(account);
            prevClickedBtn = clickedBtn;
        }
    });
});

// drag and drop
dragAndDrop.addEventListener(
    "drag",
    function (e) {
        console.log("dragged");
    },
    false
);

/////////// LOADING APP
const appLoad = function () {
    window.addEventListener("load", function () {
        currentAccount = dummyLists[2];
        updateUI(currentAccount);
        logedInMessage(currentAccount);
    });
};
appLoad();
