import "./App.css";
import Header from "./MyComponents/Header";
import { Todos } from "./MyComponents/Todos";
import { Footer } from "./MyComponents/Footer";
import { AddTodo } from "./MyComponents/AddTodo";
import { About } from "./MyComponents/About";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios for API requests
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [todos, setTodos] = useState([]);

  // Fetch todos from backend on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/todos");
        setTodos(res.data);
      } catch (error) {
        console.log("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  // Delete a todo
  const onDelete = async (todo) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${todo._id}`);
      setTodos(todos.filter((e) => e._id !== todo._id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  // Add a new todo
  const addTodo = async (title, desc) => {
    let sno = todos.length === 0 ? 0 : todos[todos.length - 1].sno + 1;
    const newTodo = { sno, title, desc };

    try {
      const res = await axios.post("http://localhost:5000/api/todos", newTodo);
      setTodos([...todos, res.data]);
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  return (
    <>
      <Router>
        <Header title="My Todos List" searchBar={false} />
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <>
                  <AddTodo addTodo={addTodo} />
                  <Todos todos={todos} onDelete={onDelete} />
                </>
              );
            }}
          ></Route>
          <Route exact path="/about">
            <About />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
