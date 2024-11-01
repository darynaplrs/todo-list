"use strict";

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

const DELETE_BUTTON_LABEL = "Delete";
const EDIT_BUTTON_LABEL = "Edit";
const SAVE_BUTTON_LABEL = "Save";
const EMPTY_TASK_NAME_ERROR = "Please, enter a task name!";
const TASK_EDITING_CLASS = "editing";
const TASK_COMPLETED_CLASS = "completed";
const LOCAL_STORAGE_KEY = "tasks";


todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let newTaskName = todoInput.value;

    if (newTaskName === "") {
        alert(EMPTY_TASK_NAME_ERROR);
        return;
    }

    addTask(newTaskName);
    todoInput.value = "";
});

function addTask(taskName, isCompleted = false) {
    const listItem = document.createElement("li");
    listItem.classList.toggle(TASK_COMPLETED_CLASS, isCompleted);

    const taskNameSpan = document.createElement("span");
    taskNameSpan.textContent = taskName;
    taskNameSpan.style.textDecoration = isCompleted ? "line-through" : "none";
    listItem.appendChild(taskNameSpan);

    const isTaskDoneCheckbox = document.createElement("input");
    isTaskDoneCheckbox.setAttribute("type", "checkbox");
    isTaskDoneCheckbox.checked = isCompleted;
    listItem.appendChild(isTaskDoneCheckbox);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = DELETE_BUTTON_LABEL;
    listItem.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.textContent = EDIT_BUTTON_LABEL;
    listItem.appendChild(editButton);

    todoList.appendChild(listItem);

    isTaskDoneCheckbox.addEventListener("change", function () {
        taskNameSpan.style.textDecoration = this.checked ? "line-through" : "none";

        listItem.classList.toggle(TASK_COMPLETED_CLASS, this.checked);

        saveTasksToLocalStorage();
    });

    deleteButton.addEventListener("click", function () {
        todoList.removeChild(listItem);

        saveTasksToLocalStorage();
    });
 
    const taskNameEditInput = document.createElement("input");
    taskNameEditInput.type = "text";
    editButton.addEventListener("click", function () {
        const isEditing = listItem.classList.contains(TASK_EDITING_CLASS);

        if (isEditing) {
            taskNameSpan.textContent = taskNameEditInput.value;
            listItem.replaceChild(taskNameSpan, taskNameEditInput);
            listItem.classList.remove(TASK_EDITING_CLASS);
            editButton.textContent = EDIT_BUTTON_LABEL;
        } else {
            taskNameEditInput.value = taskNameSpan.textContent;
            listItem.replaceChild(taskNameEditInput, taskNameSpan);
            listItem.classList.add(TASK_EDITING_CLASS);
            editButton.textContent = SAVE_BUTTON_LABEL;
        }
        
        saveTasksToLocalStorage();
    });

    saveTasksToLocalStorage();

}

function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll("#todo-list li").forEach(task => {
        const taskName = task.querySelector("span").textContent;
        const isCompleted = task.classList.contains(TASK_COMPLETED_CLASS);
        tasks.push({ name: taskName, completed: isCompleted });
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", function () {
    const savedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? [];
    savedTasks.forEach(task => {
        addTask(task.name, task.completed);
    });
});