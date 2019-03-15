import React, {Component} from 'react';
import './App.css';
import lodashSortBy from 'lodash/sortBy';
import lodashFilter from 'lodash/filter';
import FilterConfig from './components/FilterConfig';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import TodoControl from './components/TodoControl';
import TodoCounter from './components/TodoCounter';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: window.todoStorage.fetch() || [],
      visibility: FilterConfig.VISIBILITY_ALL || "all",
    };
  }

  componentDidUpdate() {
    window.todoStorage.save(this.state.todos);
  }

  addTodo(todoObj) {
    this.setState({
      todos: [todoObj, ...this.state.todos],
    });
  }

  replaceTodoByIndex(index, todoObj) {
    const todos = this.state.todos;
    todos[index] = todoObj;

    this.setState({
      todos: todos,
    });
  }

  removeCompletedTodos() {
    const onlyActiveTodos = this.sortStarredTodosFirst(this.getActiveTodos());
    this.setState({
      todos: onlyActiveTodos,
    });
  }

  updateVisibility(newVisibility) {
    this.setState({
      visibility: newVisibility,
    });
  }

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
    return lodashSortBy(this.state.todos, ['completed', 'starred'], ['asc', 'desc']);
  }

  getCompletedTodos() {
    return lodashFilter(this.state.todos, ['completed', true]);
  }

  getActiveTodos() {
    const activeTodos = lodashFilter(this.state.todos, ['completed', false]);

    return lodashSortBy(activeTodos, ['starred'], ['desc']);
  }

  sortStarredTodosFirst(todos) {
    return lodashSortBy(todos, ['starred'], ['desc']);
  }

  render() {
    return <div id="todo-demo">
      <a href="https://github.com/vikbert/react-MIT-todo" target="_blank" rel="noopener noreferrer">
        <img className="avatar"
             src="https://github.githubassets.com/images/modules/site/logos/desktop-logo.png"
             alt="avatar"/>
      </a>
      <section className="todoapp">
        <header className="header">
          <h1>M I T Todo</h1>
          {this.state.visibility !== FilterConfig.VISIBILITY_COMPLETED && <TodoForm addTodoHandler={this.addTodo.bind(this)}></TodoForm> }
        </header>

        <section className="main">
          <ul className="todo-list">
            {this.getFilteredTodos().map((todo, index) => {
              return (<TodoItem key={todo.id} index={index} todo={todo}
                                replaceTodoByIndex={this.replaceTodoByIndex.bind(this)}/>);
            })}
          </ul>
        </section>
        <footer className="footer">
          <TodoCounter counterActive={this.getActiveTodos().length}></TodoCounter>
          <TodoControl visibility={this.state.visibility}
                       counterCompleted={this.getCompletedTodos().length}
                       removeCompletedTodos={this.removeCompletedTodos.bind(this)}
                       updateVisibility={this.updateVisibility.bind(this)}>
          </TodoControl>
        </footer>
      </section>
    </div>;
  }
}

export default App;
