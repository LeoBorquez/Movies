import React, { useReducer, useEffect, useState, useRef, useMemo } from 'react';
import '../App.css';
import Header from './Header';
import Movie from './Movie';
import Search from './Search';
import { useForm } from '../hooks/UseForm'
import { useFetch } from '../hooks/UseFetch';
//pages
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Index } from '../index'
import { About } from '../pages/about'
import { UserContext } from '../context/UserContext';

const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=4a3b711b" // api movies Duh!

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIE_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};


const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const [values, handleChange] = useForm({ email: "", password: "" });

  // get and save items in localstorage with useState
  const [count, setCount] = useState(() =>
    JSON.parse(localStorage.getItem("count"))
  );
  useEffect(() => {
    localStorage.setItem("count", JSON.stringify(count));
  }, [count]);

  // call and api from a hook
  const { data, load } = useFetch(`http://numbersapi.com/${count}/trivia`);

  const inputRef = useRef();

  // context
  const [user, setUser] = useState(null);
  // save the value of the context, change when the context change
  const value = useMemo(() => ({user, setUser}), [user, setUser])

  // calling api
  useEffect(() => {
    fetch(MOVIE_API_URL)
      .then(response => response.json())
      .then(jsonResponse => {
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.Search
        });
      });
  }, []); // first argument, the function that i want to use. second argument array that we pass in a value 
  // calling the useEffect once because the second argunment is a empty array

  const search = searchValue => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === "True") {
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
          });
        } else {
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error
          });
        }
      });
  };

  const { movies, errorMessage, loading } = state;

  return (
    <Router>
      <div className="App">
        {/* send the text property to the Header component */}
        <Header text="MOVIES" />

        {/* navigation */}
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about/">About</Link>
              </li>
            </ul>
          </nav>
          {/* wrap the context to the routes */}
          <UserContext.Provider value={value}>
            <Route path="/" exact component={Index} />
            <Route path="/about/" component={About} />
          </UserContext.Provider>

        </div>

        <div>
          <input ref={inputRef} name="email" value={values.email} onChange={handleChange} />
          <input type="password" name="password" value={values.password} onChange={handleChange} />
        </div>
        <button onClick={() => { console.log(inputRef.current.focus()); }}>focus</button>
        <Search search={search} />
        <p className="App-intro"> Here a few of our favorite movies </p>
        <div className="movies">
          {loading && !errorMessage ? (
            <span>loading....</span>
          ) : errorMessage ? (
            <div className="errorMessage">{errorMessage}</div>
          ) : (
                movies.map((movie, index) => (
                  <Movie key={`${index}-${movie.Title}`} movie={movie} />
                ))
              )}
        </div>

        <div>{!data ? "loading..." : data}</div>
        <div>count: {count}</div>
        <button onClick={() => setCount(c => c + 1)}> change trivia</button>

      </div>
    </Router>
  );

};

export default App;
