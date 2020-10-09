import React, { Component } from "react";
import "./App.css";
import * as FilterConfig from "./components/FilterConfig";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import TodoControl from "./components/TodoControl";

class App extends Component {
  state = {
    todos: window.todoStorage.fetch() || [],
    visibility: FilterConfig.VISIBILITY_ALL || "all",
  };

  componentDidUpdate() {
    window.todoStorage.save(this.state.todos);
  }

  addTodo = (todoObj) => {
    console.log("append new todo", todoObj);
    this.setState({
      todos: [todoObj, ...this.state.todos],
    });
  };

  replaceTodo = (oldTodo, newTodo) => {
    const todos = [...this.state.todos];

    todos[todos.indexOf(oldTodo)] = newTodo;

    this.setState({
      todos: todos,
    });
  };

  removeCompletedTodos = () => {
    const onlyActiveTodos = this.sortStarredTodosFirst(this.getActiveTodos());
    this.setState({
      todos: onlyActiveTodos,
    });
  };

  updateVisibility = (newVisibility) => {
    this.setState({
      visibility: newVisibility,
    });
  };

  getFilteredTodos() {
    switch (this.state.visibility) {
      case FilterConfig.VISIBILITY_ACTIVE:
        return this.getActiveTodos();
      case FilterConfig.VISIBILITY_COMPLETED:
        return this.getCompletedTodos();
      default:
        return this.getAllTodos();
    }
  }

  getAllTodos() {
    const active = this.getActiveTodos();
    const completed = this.getCompletedTodos();

    return active.concat(completed);
  }

  getCompletedTodos() {
    const filtered = this.state.todos.filter((todo) => todo.completed === true);
    return filtered.sort((a, b) => a.id - b.id);
  }

  getActiveTodos = () => {
    const activeTodos = this.state.todos.filter(
      (todo) => todo.completed === false
    );

    return activeTodos.sort((a, b) => b.starred - a.starred);
  };

  getActiveStarred() {
    const activeTodos = this.getActiveTodos();

    return activeTodos.filter((todo) => todo.starred === 1);
  }

  counterActiveStarred = () => {
    return this.getActiveStarred().length;
  };

  sortStarredTodosFirst(todos) {
    return todos.sort((a, b) => b.starred - a.starred);
  }

  render() {
    return (
      <div>
        {/* <a href=""
           target="_blank"
           rel="noopener noreferrer"
        >
          <img className="avatar"
               src=""
               alt="avatar"
          />
        </a> */}
        <section className='todoapp'>
          <header className='header'>
            <h1>{"M I T Todo"}</h1>
            {this.state.visibility !== FilterConfig.VISIBILITY_COMPLETED && (
              <TodoForm addTodoHandler={this.addTodo} />
            )}
          </header>

          <section className='main'>
            <ul className='todo-list'>
              {this.getFilteredTodos().map((todo, index) => {
                return (
                  <TodoItem
                    key={todo.id}
                    index={index}
                    todo={todo}
                    counterActiveStarred={this.counterActiveStarred}
                    replaceTodo={this.replaceTodo}
                  />
                );
              })}
            </ul>
          </section>
          <footer className='footer'>
            <TodoControl
              visibility={this.state.visibility}
              counterCompleted={this.getCompletedTodos().length}
              removeCompletedTodos={this.removeCompletedTodos}
              updateVisibility={this.updateVisibility}
              getActiveTodos={this.getActiveTodos}
            />
          </footer>
        </section>
        <span>{"CSS template powered by todomvc.com®"}</span>
      </div>
    );
  }
}

export default App;
