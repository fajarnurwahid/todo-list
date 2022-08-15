// start: Todo Check
const selectAll = document.getElementById('select-all')
const todoActions = document.querySelectorAll('.todo-table-action')

todoCheckFunc()

function todoCheckFunc() {
    const todoChecks = document.querySelectorAll('.todo-check')

    selectAll.onchange = function() {
        todoChecks.forEach(item=> {
            item.checked = selectAll.checked
        })

        todoActions[0].classList.toggle('active', !selectAll.checked)
        todoActions[1].classList.toggle('active', selectAll.checked)
    }

    todoChecks.forEach(item=> {
        item.onchange = function() {
            const listCheck = Array.from(todoChecks).map(i=> {
                return i.checked
            })

            todoActions[0].classList.toggle('active', !listCheck.includes(true))
            todoActions[1].classList.toggle('active', listCheck.includes(true))

            selectAll.checked = !listCheck.includes(false)
        }
    })
}

function resetCheck() {
    selectAll.checked = false

    todoActions[0].classList.toggle('active', !selectAll.checked)
    todoActions[1].classList.toggle('active', selectAll.checked)
}
// end: Todo Check



// start: Todo
!localStorage.getItem('todo') && localStorage.setItem('todo', JSON.stringify([]))



const todoForm = document.querySelector('.todo-form')
const todoBody = document.querySelector('.todo-table-body')

renderTodo()

todoForm.onsubmit = function(e) {
    e.preventDefault()

    if(e.target.todo.value) {
        const todo = JSON.parse(localStorage.getItem('todo'))
        const newTodo = {
            id: getMaxId() + 1,
            todo: e.target.todo.value,
            completed: false
        }

        localStorage.setItem('todo', JSON.stringify([newTodo, ...todo]))
        todoForm.reset()

        renderTodo()
    }
}



function getMaxId() {
    const todo = JSON.parse(localStorage.getItem('todo'))
    const listId = todo.map(i=> i.id)

    return todo.length > 0 ? Math.max(...listId) : 0
}

function renderTodo() {
    todoBody.innerHTML = ''
    const todo = JSON.parse(localStorage.getItem('todo'))

    if(todo.length > 0) {
        todo.forEach(item=> {
            const template = `
                <tr class="${item.completed ? "completed" : ''}">
                    <td><input type="checkbox" class="todo-check" id="${item.id}"></td>
                    <td><div class="todo-item">
                        <input class="todo-text" ondblclick="changeCompleted(this, ${item.id})" readonly value="${item.todo}">
                        <div class="todo-item-action">
                            <span onclick="editTodo(this, ${item.id})"><i class="ri-edit-line"></i></span>
                            <span onclick="deleteTodo(${item.id})"><i class="ri-delete-bin-line"></i></span>
                        </div>
                    </div></td>
                </tr>
            `
    
            todoBody.insertAdjacentHTML('beforeend', template)
        })
    } else {
        const template = `
            <tr>
                <td colspan="2">No todo</td>
            </tr>
        `

        todoBody.insertAdjacentHTML('beforeend', template)
    }

    selectAll.parentNode.classList.toggle('hide', todo.length < 1)

    todoCheckFunc()
}

function deleteTodo(id) {
    const todo = JSON.parse(localStorage.getItem('todo'))
    const newTodo = todo.filter(i=> i.id != id)

    localStorage.setItem('todo', JSON.stringify(newTodo))

    renderTodo()
}

function deleteTodoMany() {
    let todo = JSON.parse(localStorage.getItem('todo'))
    const todoChecks = document.querySelectorAll('.todo-check')

    todoChecks.forEach(i=> {
        if(i.checked) {
            todo = todo.filter(x=> x.id != i.id)
        }
    })

    localStorage.setItem('todo', JSON.stringify(todo))
    
    renderTodo()
    resetCheck()
}

function editTodo(el, id) {
    const todoText = el.closest('.todo-item').querySelector('.todo-text')

    todoText.removeAttribute('readonly')
    todoText.focus()

    todoText.onblur = function() {
        todoText.setAttribute('readonly', '')
        updateTodo(id, todoText.value)
    }

    todoText.onkeydown = function(e) {
        if(e.key == 'Enter') {
            e.preventDefault()
            todoText.blur()
        }
    }
}

function updateTodo(id, val) {
    if(val) {
        const todo = JSON.parse(localStorage.getItem('todo'))
        const todoIndex = todo.findIndex(i=> i.id == id)
    
        todo[todoIndex].todo = val

        localStorage.setItem('todo', JSON.stringify(todo))
    }

    renderTodo()
}

function changeCompleted(el, id) {
    if(el.getAttribute('readonly') == '') {
        const todo = JSON.parse(localStorage.getItem('todo'))
        const todoIndex = todo.findIndex(i=> i.id == id)
        
        todo[todoIndex].completed = !todo[todoIndex].completed
    
        localStorage.setItem('todo', JSON.stringify(todo))
    
        renderTodo()
    }
}

function changeCompletedMany(status) {
    const todo = JSON.parse(localStorage.getItem('todo'))
    const todoChecks = document.querySelectorAll('.todo-check')

    todoChecks.forEach(i=> {
        if(i.checked) {
            const todoIndex = todo.findIndex(x=> x.id == i.id)
            todo[todoIndex].completed = status
        }
    })

    localStorage.setItem('todo', JSON.stringify(todo))
    
    renderTodo()
    resetCheck()
}
// end: Todo