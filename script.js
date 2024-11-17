"use strict";

const TODO_FORM = document.getElementById("todo_form");
const ADD_BUTTON = document.getElementById("add_button")
const TODO_INPUT = document.getElementById("todo_input");
const TODO_LIST = document.getElementById("todo_list");
const DELETE_ALL_BUTTON = document.getElementById("delete_all_button");
let tasks = [];

const DELETE_BUTTON_LABEL = "Delete";
const EDIT_BUTTON_LABEL = "Edit";
const SAVE_BUTTON_LABEL = "Save";
const SELECT_BUTTON_LABEL = "Select";

const ERROR_MESSAGE = "Please, enter the task name!"

const EDITING_TASK_CLASS = "editing";
const COMPLETED_TASK_CLASS = "completed";
const SELECTED_TASK_CLASS = "selected";
const LOCALSTORAGE_KEY = "tasks";
const STATUS_PROPERTY_NAME = "isCompleted";



ADD_BUTTON.addEventListener("click", (event) => {
    event.preventDefault();
    const taskName = TODO_INPUT.value;

    if (TODO_INPUT.value === "") {
        alert(ERROR_MESSAGE);
        return;
    }

    const taskId = Date.now().toString();
    const task = { id: taskId, name: taskName, isCompleted: false }
    tasks.push(task);

    addTask(task);
    saveToLocalStorage();
    TODO_INPUT.value = "";
})

function deleteAll() {
    while (TODO_LIST.firstChild) {
        TODO_LIST.firstChild.remove();
    };

    tasks = [];

    saveToLocalStorage();
}

function deleteSelected() {
    const itemsToDelete = [];
    
    for (let listItem of TODO_LIST.children) {
        if (listItem.classList.contains(SELECTED_TASK_CLASS)) {
            itemsToDelete.push(listItem);
        }
    }

    itemsToDelete.forEach(listItem => {
        const itemToDelete = tasks.find(item => item.id === listItem.id);
        tasks.splice(tasks.indexOf(itemToDelete), 1);
        listItem.remove();
    })

    saveToLocalStorage();
}

function addTask(task) {
    const listItem = document.createElement("li");
    listItem.setAttribute("id", task.id);
    listItem.classList.toggle(COMPLETED_TASK_CLASS, task.isCompleted);

    const isTaskDoneCheckbox = document.createElement("input");
    isTaskDoneCheckbox.setAttribute("type", "checkbox");
    isTaskDoneCheckbox.checked = task.isCompleted;
    listItem.appendChild(isTaskDoneCheckbox);

    const taskNameSpan = document.createElement("span");
    taskNameSpan.textContent = task.name;
    taskNameSpan.style.textDecoration = (task.isCompleted) ? "line-through" : "none";
    listItem.appendChild(taskNameSpan);

    const deleteItemButton = document.createElement("button");
    deleteItemButton.textContent = DELETE_BUTTON_LABEL;
    listItem.appendChild(deleteItemButton);

    const editItemButton = document.createElement("button");
    editItemButton.textContent = EDIT_BUTTON_LABEL;
    listItem.appendChild(editItemButton);

    TODO_LIST.appendChild(listItem);

    isTaskDoneCheckbox.addEventListener("click", function () {
        taskNameSpan.style.textDecoration = this.checked ? "line-through" : "none"; // тут звернути увагу на те, що індикатором чекнутого чекбоксу є сам чекбокс, а не розміщений стан у змінну isCompleted

        listItem.classList.toggle(COMPLETED_TASK_CLASS, this.checked);

        task.isCompleted = this.checked;

        saveToLocalStorage();
    })

    deleteItemButton.addEventListener("click", function () {
        const index = tasks.indexOf(task);
        delete tasks[index];

        TODO_LIST.removeChild(listItem);

        saveToLocalStorage();
    });

    const taskEditingInput = document.createElement("input");
    taskEditingInput.setAttribute("type", "text");

    editItemButton.addEventListener("click", function () {
        const isEditing = listItem.classList.contains(EDITING_TASK_CLASS); // якщо оголосити цю змінну поза функцією, вона буде недосяжною
        
        if (isEditing) {
            taskNameSpan.textContent = taskEditingInput.value;
            task.name = taskEditingInput.value;
            listItem.replaceChild(taskNameSpan, taskEditingInput);
            listItem.classList.remove(EDITING_TASK_CLASS);
            editItemButton.textContent = EDIT_BUTTON_LABEL;
        } else {
            taskEditingInput.value = taskNameSpan.textContent;
            listItem.replaceChild(taskEditingInput, taskNameSpan);
            listItem.classList.add(EDITING_TASK_CLASS);
            editItemButton.textContent = SAVE_BUTTON_LABEL;
        }

        saveToLocalStorage();
    });

    const selectItemButton = document.createElement("button");
    selectItemButton.textContent = SELECT_BUTTON_LABEL;
    listItem.appendChild(selectItemButton);

    selectItemButton.addEventListener("click", () => {
        listItem.classList.toggle(SELECTED_TASK_CLASS);
        const isSelected = listItem.classList.contains(SELECTED_TASK_CLASS);
        taskNameSpan.style.color = isSelected ? "red" : "black";
        saveToLocalStorage();
    })
}

function saveToLocalStorage() {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", function () {
    tasks = JSON.parse(localStorage[LOCALSTORAGE_KEY]); // памʼятати про квадратні дужки замість крапки!!!
    tasks.forEach(task => {
        addTask(task);
    });
});