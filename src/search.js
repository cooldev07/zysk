import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./search.css"; // Import the CSS file

const SearchComponent = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    return response.data;
  };

  useEffect(() => {
    const loadData = async () => {
      const fetchedTodos = await fetchTodos();
      setTodos(fetchedTodos);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const validationSchema = Yup.object({
    query: Yup.string().required("Search query is required"),
  });

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading message while fetching todos
  }

  return (
    <div className="search-container">
      <h1 className="title">Search Todos</h1>
      <Formik
        initialValues={{
          query: "",
          filteredTodos: todos, // Set initial filteredTodos to the fetched todos
          error: "",
          noResults: false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setFieldValue }) => {
          const filtered = todos.filter((todo) =>
            todo.title.toLowerCase().includes(values.query.toLowerCase())
          );
          setFieldValue("filteredTodos", filtered);
          setFieldValue("noResults", filtered.length === 0);
          setFieldValue("error", "");
        }}
      >
        {({ handleSubmit, resetForm, values, setFieldValue }) => {
          const handleReset = () => {
            resetForm({
              values: {
                query: "",
                filteredTodos: todos, // Reset filteredTodos to the original todos
                error: "",
                noResults: false,
              },
            });
          };

          return (
            <Form onSubmit={handleSubmit} className="form">
              <div className="input-group">
                <Field
                  name="query"
                  type="text"
                  placeholder="Search todos..."
                  className="input"
                />
                <ErrorMessage name="query" component="div" className="error" />
              </div>
              <div className="button-group">
                <button type="submit" className="button">
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="button reset-button"
                >
                  Reset
                </button>
              </div>
              {/* Display results or error messages */}
              {values.error ? (
                <p className="error-message">{values.error}</p>
              ) : values.noResults ? (
                <p className="no-results">No results found</p>
              ) : (
                <ul className="todo-list">
                  {values.filteredTodos.map((todo) => (
                    <li key={todo.id} className="todo-item">
                      {todo.title}
                    </li>
                  ))}
                </ul>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SearchComponent;
