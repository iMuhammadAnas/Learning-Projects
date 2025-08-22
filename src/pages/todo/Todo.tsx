import { useState, type ChangeEvent, type FormEvent } from "react";
import "./todo.css";

type TodoType = {
  id: number;
  text: string;
  completed: boolean;
};

const Todo = () => {
  const [todos, setTodos] = useState<TodoType[]>([
    { id: 1, text: "Go to gym", completed: false },
    { id: 2, text: "Finish Assignments", completed: false },
    { id: 3, text: "Purchase groceries", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleNewTask = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTask.trim()) {
      alert("Input cannot be empty");
      return;
    }

    if (isEditing && editId !== null) {
      // Update existing todo
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { ...todo, text: newTask } : todo
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      // Add new todo
      const newTodo: TodoType = {
        id: Date.now(), // unique id
        text: newTask,
        completed: false,
      };
      setTodos([newTodo, ...todos]);
    }

    setNewTask("");
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id: number, text: string) => {
    setIsEditing(true);
    setEditId(id);
    setNewTask(text);
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="todo-main">
      <div className="todo-container">
        <h2>What you want to do?</h2>
        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTask}
            onChange={handleNewTask}
            id="todo"
            placeholder="Type your todo"
          />
          <button type="submit">
            {isEditing ? "Update Todo" : "Add Todo"}
          </button>
        </form>

        {todos.length > 0 ? (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id}>
                <div className="todo-left">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <span className={todo.completed ? "completed" : ""}>
                    {todo.text}
                  </span>
                </div>
                <div className="todo-actions">
                  <button onClick={() => handleEditTodo(todo.id, todo.text)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-todo">You don't have any todos</p>
        )}
      </div>
    </div>
  );
};

export default Todo;
