"use strict";

const todoForm = document.getElementById("todo_form");
const todoInput = document.getElementById("todo_input");
const todoList = document.getElementById("todo_list");


const DELETE_BUTTON = "Delete";
const EDIT_BUTTON = "Edit";
const SAVE_BUTTON = "Save";
const ERROR = "Please, enter the task name!"

const TASK_COMPLETED_CLASS = "completed";
const TASK_EDITING_CLASS = "editing";

const LOCAL_STORAGE_KEY = "tasks";

todoForm.addEventListener("submit", event => {
    event.preventDefault();
    const taskName = todoInput.value;
    if (taskName === "") {
        alert(ERROR);
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
    isCompleted = taskCheckbox.checked;
    listItem.appendChild(taskCheckbox);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = DELETE_BUTTON;
    listItem.appendChild(deleteButton);

    const editButtton = document.createElement("button");

    editButtton.textContent = EDIT_BUTTON;
    listItem.appendChild(editButtton);

    todoList.appendChild(listItem);
    todoInput.value = "";

    taskCheckbox.addEventListener("change", function () {
        taskNameSpan.style.textDecoration = this.checked ? "line-through" : "none";
        listItem.classList.toggle(TASK_COMPLETED_CLASS, this.checked);

        saveToLocalStorage();
    })

    deleteButton.addEventListener("click", function () {
        todoList.removeChild(listItem);

        saveToLocalStorage();
    })

    const taskEditingInput = document.createElement("input");

    editButtton.addEventListener("click", function() {
        const isEditing = listItem.classList.contains(TASK_EDITING_CLASS);

        if (isEditing) {
            taskNameSpan.textContent = this.previousSibling.value;
            listItem.insertBefore(taskNameSpan, taskEditingInput);
            taskNameSpan.textContent = taskEditingInput.value;
            listItem.removeChild(taskEditingInput);
            listItem.classList.remove(TASK_EDITING_CLASS);
            editButtton.textContent = EDIT_BUTTON;
        } else {
            taskEditingInput.type = "text";
            taskEditingInput.value = taskNameSpan.textContent;
            listItem.insertBefore(taskEditingInput, taskNameSpan);
            listItem.removeChild(taskNameSpan);
            listItem.classList.add(TASK_EDITING_CLASS);
            editButtton.textContent = SAVE_BUTTON;
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
    const savedTasks = JSON.parse(localStorage[LOCAL_STORAGE_KEY] ?? []);

    savedTasks.forEach(task => {
        addTask(task.task, task.status);
    })
})