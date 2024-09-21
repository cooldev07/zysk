import React, { useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./SearchComponent.css"; // Import the CSS file

const SearchComponent = () => {
  const fetchTodos = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    return response.data;
  };

  const validationSchema = Yup.object({
    query: Yup.string().required("Search query is required"),
  });

  return (
    <div className="search-container">
      <h1 className="title">Search Todos</h1>
      <Formik
        initialValues={{
          query: "",
          todos: [],
          filteredTodos: [],
          error: "",
          noResults: false,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldValue }) => {
          const todos = await fetchTodos();
          setFieldValue("todos", todos);
          const filtered = todos.filter((todo) =>
            todo.title.toLowerCase().includes(values.query.toLowerCase())
          );
          setFieldValue("filteredTodos", filtered);
          setFieldValue("noResults", filtered.length === 0);
          setFieldValue("error", "");
        }}
      >
        {({ handleSubmit, resetForm, values }) => {
          useEffect(() => {
            const loadData = async () => {
              const todos = await fetchTodos();
              resetForm({
                values: {
                  query: "",
                  todos,
                  filteredTodos: todos,
                  error: "",
                  noResults: false,
                },
              });
            };
            loadData();
          }, [resetForm]);

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
                  onClick={() => {
                    resetForm();
                    values.filteredTodos = values.todos;
                    values.noResults = false;
                    values.error = "";
                  }}
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
