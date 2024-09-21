import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SearchComponent = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  // Fetch data from the API
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
      setTodos(response.data);
      setFilteredTodos(response.data); // Set all data initially
    } catch (error) {
      setError("Failed to fetch data from API.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  React.useEffect(() => {
    fetchTodos();
  }, []);

  // Formik validation schema
  const validationSchema = Yup.object({
    query: Yup.string().required("Search query is required"),
  });

  // Filter the data based on the search query
  const handleSearch = (values) => {
    const filtered = todos.filter((todo) =>
      todo.title.toLowerCase().includes(values.query.toLowerCase())
    );

    setFilteredTodos(filtered);
    setNoResults(filtered.length === 0);
  };

  return (
    <div>
      <h1>Search Todos</h1>
      <Formik
        initialValues={{ query: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSearch}
      >
        <Form>
          <div>
            <Field name="query" type="text" placeholder="Search todos..." />
            <ErrorMessage name="query" component="div" style={{ color: "red" }} />
          </div>
          <button type="submit">Search</button>
        </Form>
      </Formik>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : noResults ? (
        <p>No results found</p>
      ) : (
        <ul>
          {filteredTodos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;
