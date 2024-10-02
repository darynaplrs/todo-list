"use strict";

const todoForm = document.getElementById('todo-form'); // поміщаємо елементи дом в змінні
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

todoForm.addEventListener('submit', function (event) {
    event.preventDefault(); /* if the event does not get explicitly handled,
                            its default action should not be taken as it normally would be --- from MDN */
    
    let newTask = todoInput.value; // поміщаємо в змінну значення отримане в інпут після сабміту

    if (newTask === '') { // перевіряємо, чи отримане значення не пусте
        alert('Please enter a task!'); // якщо так, то сваримось
        return;
    }

    addTask(newTask); // викликаємо ф-ію addTask, що описана нижче з аргументом - отриманим значенням вижче

    todoInput.value = ''; //очищаємо поле введення
});

function addTask(task) {
    let listItem = document.createElement('li'); // створюємо айтем в списку
    
    listItem.textContent = task; // додаємо вміст айтему

    todoList.appendChild(listItem); // додаємо в струкутру документу цей айтем
}
