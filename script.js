"use strict";

const todoForm = document.getElementById("todo-form"),
    todoInput = document.getElementById("todo-input"),
    todoList = document.getElementById("todo-list");

todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let newTask = todoInput.value;

    if (newTask === "") {
        alert("Please, enter a task!");
        return;
    }

    addTask(newTask);
    todoInput.value = "";
});

function addTask(task) {
    const listItem = document.createElement('li');

    const taskText = document.createElement('span');
    taskText.textContent = task;
    listItem.appendChild(taskText);

    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    listItem.appendChild(checkBox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    listItem.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    listItem.appendChild(editButton);

    todoList.appendChild(listItem);

    checkBox.addEventListener('change', function () {
        if (this.checked) {
            taskText.style.textDecoration = 'line-through';
        } else {
            taskText.style.textDecoration = 'none';
        }
    });

    deleteButton.addEventListener('click', function () {
        todoList.removeChild(listItem);
    });
 
    const input = document.createElement('input');
    editButton.addEventListener('click', function () {
        const isEditing = listItem.classList.contains('editing');

        if (isEditing) {
            taskText.textContent = this.previousSibling.value; // Assuming the input field is right before the edit button
            listItem.insertBefore(taskText, input);
            taskText.textContent = input.value;
            listItem.removeChild(input);
            listItem.classList.remove('editing');
            editButton.textContent = 'Edit';
        } else {
            input.type = 'text';
            input.value = taskText.textContent;
            listItem.insertBefore(input, taskText);
            listItem.removeChild(taskText);
            listItem.classList.add('editing');
            editButton.textContent = 'Save';
        }
    });

    saveTasksToLocalStorage();

}

function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#todo-list li').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const isCompleted = task.classList.contains('completed');
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.addEventListener('DOMContentLoaded', function () {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTask(task.text);
    });
});