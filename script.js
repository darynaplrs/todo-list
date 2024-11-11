"use strict";

const TODO_FORM = document.getElementById("todo_form");
const TODO_INPUT = document.getElementById("todo_input");
const TODO_LIST = document.getElementById("todo_list");

const DELETE_BUTTON = "Delete";
const EDIT_BUTTON = "Edit";
const SAVE_BUTTON = "Save";

const ERROR_MESSAGE = "Please, enter the task name!"

const EDITING_TASK_CLASS = "editing";
const COMPLETED_TASK_CLASS = "completed"
const LOCALSTORAGE_KEY = "tasks";

TODO_FORM.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskName = TODO_INPUT.value;

    if (TODO_INPUT.value === "") {
        alert(ERROR_MESSAGE);
        return; // без return в нас буде викликатись ф-ія addTask з пустим інпутом
    }

    addTask(taskName);
    TODO_INPUT.value = "";
})

function addTask(taskName, isCompleted = false) {
    const listItem = document.createElement("li");
    listItem.classList.toggle(COMPLETED_TASK_CLASS, isCompleted);

    const taskNameSpan = document.createElement("span");
    taskNameSpan.textContent = taskName;
    taskNameSpan.style.textDecoration = (isCompleted) ? "line-through" : "none";
    listItem.appendChild(taskNameSpan);

    const isTaskDoneCheckbox = document.createElement("input");
    isTaskDoneCheckbox.setAttribute("type", "checkbox");
    isTaskDoneCheckbox.checked = isCompleted;
    listItem.appendChild(isTaskDoneCheckbox);

    const deleteItemButton = document.createElement("button");
    deleteItemButton.textContent = DELETE_BUTTON;
    listItem.appendChild(deleteItemButton);

    const editItemButton = document.createElement("button");
    editItemButton.textContent = EDIT_BUTTON;
    listItem.appendChild(editItemButton);

    TODO_LIST.appendChild(listItem);

    isTaskDoneCheckbox.addEventListener("click", function() {
        taskNameSpan.style.textDecoration = this.checked ? "line-through" : "none"; // тут звернути увагу на те, що індикатором чекнутого чекбоксу є сам чекбокс, а не розміщений стан у змінну isCompleted

        listItem.classList.toggle(COMPLETED_TASK_CLASS, this.checked);

        saveToLocalStorage();
    })

    deleteItemButton.addEventListener("click", function () {
        TODO_LIST.removeChild(listItem);

        saveToLocalStorage();
    })

    const taskEditingInput = document.createElement("input");
    taskEditingInput.setAttribute("type", "text");

    editItemButton.addEventListener("click", function () {
        const isEditing = listItem.classList.contains(EDITING_TASK_CLASS); // якщо оголосити цю змінну поза функцією, вона буде недосяжною
        
        if (isEditing) {
            taskNameSpan.textContent = taskEditingInput.value;
            listItem.replaceChild(taskNameSpan, taskEditingInput);
            listItem.classList.remove(EDITING_TASK_CLASS);
            editItemButton.textContent = EDIT_BUTTON;
        } else {
            taskEditingInput.value = taskNameSpan.textContent;
            listItem.replaceChild(taskEditingInput, taskNameSpan);
            listItem.classList.add(EDITING_TASK_CLASS);
            editItemButton.textContent = SAVE_BUTTON;
        }

        saveToLocalStorage();
    })

    saveToLocalStorage();
}

function saveToLocalStorage() {
    const tasks = [];
    document.querySelectorAll("li").forEach((task) => {
        const taskName = task.firstChild.textContent;
        const isCompleted = task.classList.contains(COMPLETED_TASK_CLASS);
        tasks.push({ task: taskName, completed: isCompleted });
    })
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", function () {
    const savedTasks = JSON.parse(localStorage[LOCALSTORAGE_KEY]); // памʼятати про квадратні дужки замість крапки!!!
    savedTasks.forEach(task => {
        addTask(task.task, task.completed);
    })
})

