import React, { useReducer, useEffect, useState } from 'react';
import '../App.css';
import Header from './Header';
import Movie from './Movie';
import Search from './Search';
import { useForm } from '../hooks/UseForm'
import { useFetch } from '../hooks/UseFetch';

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

  const { data, load } = useFetch(`http://numbersapi.com/${count}/trivia`);

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
    <div className="App">
      {/* send the text property to the Header component */}
      <Header text="MOVIES" />
      <div>
        <input name="email" value={values.email} onChange={handleChange} />
        <input type="password" name="password" value={values.password} onChange={handleChange} />
      </div>
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
  );

};

export default App;
