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
const EDIT_BUTTON_CLASS = "edit_btn";
const DELETE_BUTTON_CLASS = "delete_btn";
const COMPLETED_TASK_CLASS = "completed";
const SELECTED_TASK_CLASS = "selected";
const LOCALSTORAGE_KEY = "tasks";
const STATUS_PROPERTY_NAME = "isCompleted";

class Task {
    constructor(taskId, taskName, isCompleted = false) {
        this.id = taskId;
        this.name = taskName;
        this.isCompleted = false;

        this.listElem = document.createElement("li");

        const isCompletedCheckbox = document.createElement("input");
        isCompletedCheckbox.setAttribute("type", "checkbox");
        this.listElem.appendChild(isCompletedCheckbox);

        const listItemSpan = document.createElement("span");
        listItemSpan.textContent = taskName;
        this.listElem.appendChild(listItemSpan);

        const listItemInput = document.createElement("input");
        listItemInput.setAttribute("type", "text");
        listItemInput.hidden = true;
        this.listElem.appendChild(listItemInput);

        const editButton = document.createElement("button");
        editButton.textContent = EDIT_BUTTON_LABEL;
        editButton.classList.add(EDIT_BUTTON_CLASS);
        this.listElem.appendChild(editButton);

        const deleteItemButton = document.createElement("button");
        deleteItemButton.textContent = DELETE_BUTTON_LABEL;
        deleteItemButton.classList.add(DELETE_BUTTON_CLASS);
        this.listElem.appendChild(deleteItemButton);
    }

    updateName(name) {
        this.name = name;
        this.span.textContent = name;
    }

    toggleStatus() {
        this.isCompleted = !this.isCompleted;
        this.span.style.textDecoration = this.isCompleted ? "line-through" : "none";
        this.checkbox.checked = this.isCompleted;
    }

    get span() {
        return this.listElem.querySelector("span");
    }

    get checkbox() {
        return this.listElem.querySelector("input[type='checkbox']");
    }

    get input() {
        return this.listElem.querySelector("input[type='text']");
    }

    get deleteBtn() {
        return this.listElem.querySelector(`button.${DELETE_BUTTON_CLASS}`);
    }

    get editBtn() {
        return this.listElem.querySelector(`button.${EDIT_BUTTON_CLASS}`);
    }
}

ADD_BUTTON.addEventListener("click", (event) => {
    event.preventDefault();

    if (TODO_INPUT.value === "") {
        alert(ERROR_MESSAGE);
        return;
    }

    const taskName = TODO_INPUT.value;
    const taskId = Date.now().toString();
    const task = new Task(taskId, taskName);
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
    TODO_LIST.appendChild(task.listElem);

    task.checkbox.addEventListener("click", function () {
        task.toggleStatus();

        saveToLocalStorage();
    })

    task.editBtn.addEventListener("click", function () {
        const isEditing = task.listElem.classList.contains(EDITING_TASK_CLASS);
        
        task.input.hidden = isEditing;
        task.span.hidden = !isEditing;
        task.listElem.classList.toggle(EDITING_TASK_CLASS, !isEditing);
        task.editBtn.textContent = isEditing ? EDIT_BUTTON_LABEL : SAVE_BUTTON_LABEL;

        if (isEditing) {
            task.updateName(task.input.value);
        } else {
            task.input.value = task.name;
        }

        saveToLocalStorage();
    });

    task.deleteBtn.addEventListener("click", () => {
        task.listElem.remove();
        tasks.splice(tasks.indexOf(task), 1);

        saveToLocalStorage();
    });
}

function saveToLocalStorage() {
    const tasksToSave = tasks.map(task => ({
        id: task.id,
        name: task.name,
        isCompleted: task.isCompleted
    }));

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tasksToSave));
}

document.addEventListener("DOMContentLoaded", function () {
    tasks = JSON.parse(localStorage[LOCALSTORAGE_KEY] ?? "[]");
    tasks.forEach(t => {
        const task = new Task(t.id, t.name, t.isCompleted);
        addTask(task);
    });
});