"use strict";

const TODO_FORM = document.getElementById("todo_form");
const TODO_INPUT = document.getElementById("todo_input");
const TODO_LIST = document.getElementById("todo_list");


const DELETE_BUTTON_LABEL = "Delete";
const EDIT_BUTTON_LABEL = "Edit";
const SAVE_BUTTON_LABEL = "Save";
const ERROR_MESSAGE = "Please, enter the task name!"

const TASK_COMPLETED_CLASS = "completed";
const TASK_EDITING_CLASS = "editing";

const LOCAL_STORAGE_KEY = "tasks";

TODO_FORM.addEventListener("submit", event => {
    event.preventDefault();
    const taskName = TODO_INPUT.value;
    if (taskName === "") {
        alert(ERROR_MESSAGE);
    } else {
        addTask(taskName);
    }
})



function addTask(taskName, isCompleted = false) {
    const listItem = document.createElement("li");
    listItem.classList.toggle(TASK_COMPLETED_CLASS, isCompleted);

    const taskNameSpan = document.createElement("span");
    taskNameSpan.textContent = taskName;
    listItem.appendChild(taskNameSpan);
    taskNameSpan.style.textDecoration = isCompleted ? "line-through" : "none";

    const taskCheckbox = document.createElement("input");
    taskCheckbox.setAttribute("type", "checkbox");
    taskCheckbox.checked = isCompleted;
    listItem.appendChild(taskCheckbox);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = DELETE_BUTTON_LABEL;
    listItem.appendChild(deleteButton);

    const editButtton = document.createElement("button");

    editButtton.textContent = EDIT_BUTTON_LABEL;
    listItem.appendChild(editButtton);

    TODO_LIST.appendChild(listItem);
    TODO_INPUT.value = "";

    taskCheckbox.addEventListener("change", event => {
        const target = event.target;
        taskNameSpan.style.textDecoration = target.checked ? "line-through" : "none";
        listItem.classList.toggle(TASK_COMPLETED_CLASS, target.checked);
        saveToLocalStorage();
    })

    deleteButton.addEventListener("click", function () {
        TODO_LIST.removeChild(listItem);

        saveToLocalStorage();
    })

    const taskEditingInput = document.createElement("input");

    editButtton.addEventListener("click", function() {
        const isEditing = listItem.classList.contains(TASK_EDITING_CLASS);

        if (isEditing) {
            taskNameSpan.textContent = taskEditingInput.value;
            listItem.replaceChild(taskNameSpan, taskEditingInput);
            taskNameSpan.textContent = taskEditingInput.value;
            listItem.classList.remove(TASK_EDITING_CLASS);
            editButtton.textContent = EDIT_BUTTON_LABEL;
        } else {
            taskEditingInput.type = "text";
            taskEditingInput.value = taskNameSpan.textContent;
            listItem.replaceChild(taskEditingInput, taskNameSpan);
            listItem.classList.add(TASK_EDITING_CLASS);
            editButtton.textContent = SAVE_BUTTON_LABEL;
        }

        saveToLocalStorage();
    })

    saveToLocalStorage();
}

function saveToLocalStorage() {
    const tasks = [];
    document.querySelectorAll("li").forEach((task) => {
        const taskName = task.firstChild.textContent;
        const isCompleted = task.classList.contains(TASK_COMPLETED_CLASS);
        tasks.push({ task: taskName, status: isCompleted });
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", function() {
    const savedTasks = JSON.parse(localStorage[LOCAL_STORAGE_KEY]) ?? [];

    savedTasks.forEach(task => {
        addTask(task.task, task.status);
    })
})