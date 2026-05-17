// 1. DOM 요소 가져오기
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list');
const todoCount = document.querySelector('.todo-count');

// 2. 할 일 데이터를 저장할 배열 객체 선언
let todos = [];

// 3. 할 일을 화면에 다시 그려주는 함수
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="checkbox" data-index="${index}"></div>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn" data-index="${index}">×</button>
        `;
        
        todoList.appendChild(li);
    });

    const uncompletedCount = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = `${uncompletedCount}개 항목 남음`;
}

// 4. 할 일 추가 이벤트
todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    let text = todoInput.value.trim();
    if (text === '') return;

    todos.push({
        text: text,
        completed: false
    });

    todoInput.value = '';
    renderTodos();
});

// 5. 이벤트 위임
todoList.addEventListener('click', (event) => {
    const target = event.target;
    const index = target.dataset.index;

    if (index === undefined) return;

    if (target.classList.contains('checkbox')) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    }
    
    if (target.classList.contains('delete-btn')) {
        todos.splice(index, 1);
        renderTodos();
    }
});