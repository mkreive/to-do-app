"use strict";

/////////// DUMMY DATA
const anonymous = [
    {
        id: "u0",
        name: "anonymous",
        password: "",
        do: ["Login/Signup to add some tasks"],
        done: ["Find ToDo app"],
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

// login/signup/logout
const loginOverlay = document.querySelector(".login");
const loginIcon = document.querySelector(".header__login");
const inputName = document.getElementById("name");
const inputPassword = document.getElementById("password");
const loginSignupBtns = document.querySelectorAll(".account__btns");
const logoutOverlay = document.querySelector(".logout");
const cancelBtn = document.querySelectorAll(".btn__cancel");
const logoutBtn = document.querySelector(".btn__logout");

// footer buttons
const footerBtns = document.querySelectorAll(".footer__text");

// other
const dragAndDrop = document.querySelector(".bottom");
const overlay = document.querySelector(".overlay");
const dragBtn = document.querySelector(".dragAndDrop");

/////////// VARIABLES
let currentAccount;
let openedModal;
let prevClickedBtn;

/////////// HELPER FUNCTIONS
// getting data from firebase
const fetchUserData = async function (address) {
    const response = await fetch(address);
    const responseData = await response.json();

    if (!response.ok) {
        throw new Error("Failed to fetch user info");
    }

    for (const key in responseData) {
        return {
            id: responseData[key].code,
            name: responseData[key].name,
            do: responseData[key].do.split(";"),
            done: responseData[key].done.split(";"),
        };
    }
    return {};
};

// getting data from LocalStorage
const getLocalStorage = function (key) {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
};
const setLocalStorage = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
};
const removeLocalStorage = function (key, value) {
    if (!key || !value) return;
    const data = getLocalStorage(key);
    if (data === value) window.localStorage.removeItem(key);
};

// creating new account
const createAccount = function (name, password) {
    const newAccount = {
        name: name,
        password: password,
        name_password: `${name}_${password}`,
        id: `u${Math.floor(Math.random() * 100)}`,
        do: {},
        done: {},
    };
    return newAccount;
};

const logoutCurrentAcc = function (account) {
    removeLocalStorage("userId", account.id);
    appLoad();
};

// welcome message
const logedInMessage = function (user) {
    if (user.name === "anonymous") {
        return;
    }
    if (user.name) {
        loginIcon.style.backgroundImage = "none";
        loginIcon.textContent = `Hello, ${user.name}`;
    } else return;
};

// open/close modals
const closeModal = function (modal) {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    openedModal = "";
};
const openModal = function (modal) {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    openedModal = modal;
};
// error popup
const errorPopup = function (message) {
    openModal(errorCard);
    errorMessageEl.textContent = message;
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
        todo.forEach((work) => {
            const html = generateItemHtml(work, "", "");
            listBlockEl.insertAdjacentHTML("beforeend", html);
        });
        updateCounter(todo);
    }
    if (done) {
        done.forEach((work) => {
            const html = generateItemHtml(work, "checked", "crossed");
            listBlockEl.insertAdjacentHTML("beforeend", html);
        });
    }

    taskElementListener();
};

const sendNewDoList = async function (account) {
    fetch(
        `https://to-do-list-app-10ca0-default-rtdb.europe-west1.firebasedatabase.app/users/${account.id}/.json`,
        {
            method: "PATCH",
            body: JSON.stringify({ do: account.do.join(";") }),
        }
    );
};

// manipulating list items
const addNewTask = async function (account, task) {
    account.do.push(task);
    inputField.value = "";
    updateUI(account);
    sendNewDoList(account);
};

const crossOutTask = function (account, task) {
    const newToDoList = account.do.filter((item) => item != task);
    account.do = newToDoList;
    account.done.push(task);
    updateCounter(newToDoList);
};
const deleteTask = function (account, task) {
    const newDoList = account.do.filter((item) => item != task);
    const newDoneList = account.done.filter((item) => item != task);
    account.do = newDoList;
    account.done = newDoneList;
    updateCounter(newDoList);
};

// clear button
const clearBtnClicked = function (account) {
    const completedTasks = account.done;
    if (completedTasks) {
        completedTasks.forEach((item) => {
            deleteTask(account, item);
            updateUI(account);
        });
    }
};
// show active tasks button
const showActiveTasks = function (account) {
    displayList(account.do, "");
};
const showCompletedTasks = function (account) {
    displayList("", account.done);
};
const showAllTasks = function (account) {
    displayList(account.do, account.done);
};

// update UI
const updateUI = function (user) {
    displayList(user.do, user.done);
};
const updateCounter = function (list) {
    listItemCounterEl.textContent = `${list.length} items left`;
};
const updatePage = function (user) {
    updateUI(user);
    logedInMessage(user);
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
        closeModal(openedModal);
    }
});

loginIcon.addEventListener("click", function () {
    if (currentAccount.name === "anonymous") {
        openModal(loginOverlay);
        inputName.focus();
    } else {
        openModal(logoutOverlay);
    }
});

// login/signup forms
loginSignupBtns.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
        e.preventDefault();

        const nameInputValue = inputName.value.trim();
        const pswrdInputValue = inputPassword.value;
        const uniqueUserCode = `${nameInputValue}_${pswrdInputValue}`;

        if (nameInputValue && pswrdInputValue) {
            try {
                const fetchAddress = `https://to-do-list-app-10ca0-default-rtdb.europe-west1.firebasedatabase.app/users.json?orderBy=%22name_password%22&equalTo=%22${uniqueUserCode}%22`;
                const userData = await fetchUserData(fetchAddress);
                currentAccount = userData;
            } catch (error) {
                console.error(error);
            }

            if (
                btn.classList.contains("btn__login") &&
                Object.keys(currentAccount).length === 0
            ) {
                errorPopup("There is no such account, please SignUp first");
                return;
            } else if (btn.classList.contains("btn__signup")) {
                if (Object.keys(currentAccount).length > 0) {
                    errorPopup(
                        "There is an account with this name. Try to log in, or use different name"
                    );
                    return;
                } else {
                    currentAccount = createAccount(
                        nameInputValue,
                        pswrdInputValue
                    );
                }
            }
            console.log(currentAccount);
            setLocalStorage("userId", currentAccount.id);
            inputName.value = inputPassword.value = "";
            closeModal(loginOverlay);
            updatePage(currentAccount);
        } else if (!nameInputValue || !pswrdInputValue) {
            errorPopup("Input fields should not be empty");
        }
    });
});
// cancel buttons
cancelBtn.forEach((btn) =>
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        closeModal(openedModal);
    })
);
// logout
logoutBtn.addEventListener("click", function (e) {
    // e.preventDefault();
    logoutCurrentAcc(currentAccount);
    closeModal(logoutOverlay);
});

// entering new task
inputField.addEventListener("keydown", function (e) {
    const newListItem = inputField.value.trim();

    if (e.key === "Enter" && newListItem && currentAccount) {
        addNewTask(currentAccount, newListItem);
    } else if (e.key === "Enter" && !inputField.value) {
        errorPopup("Input should not be empty..");
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
    window.addEventListener("load", async function () {
        const loggedUserId = getLocalStorage("userId");
        if (!loggedUserId) {
            [currentAccount] = anonymous;
        } else if (loggedUserId) {
            try {
                const fetchAddress = `https://to-do-list-app-10ca0-default-rtdb.europe-west1.firebasedatabase.app/users.json?orderBy=%22code%22&equalTo=%22${loggedUserId}%22`;
                const userData = await fetchUserData(fetchAddress);
                currentAccount = userData;
            } catch (error) {
                console.error(error);
            }
        }

        // loaderi yterpti!
        updatePage(currentAccount);
    });
};
appLoad();
