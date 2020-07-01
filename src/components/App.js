import React, { useState, useEffect } from 'react';
import logo from '../logo.svg';
import '../App.css';
import Header from './Header';
import Movie from './Movie';
import Search from './Search';

const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=4a3b711b" // api movies Duh!

const App = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]); // array of movies
  const [errorMessage, setErrorMessage] = useState(null);

  // calling api
  useEffect(() => {
    fetch(MOVIE_API_URL)
    .then(response => response.json())
    .then(jsonResponse => {
      setMovies(jsonResponse.Search);
      setLoading(false);
    });
  }, []); // first argument, the function that i want to use. second argument array that we pass in a value 
  // calling the useEffect once because the second argunment is a empty array

  const search = searchValue => {
    setLoading(true);
    setErrorMessage(null);

    fetch(`https://www.ombapi.com/?s=${searchValue}&apikey=4a3b711b`)
    .then(response => response.json())
    .then(jsonResponse => {
      if(jsonResponse.Response === "True"){
        setMovies(jsonResponse.Search);
        setLoading(false);
      } else {
        setErrorMessage(jsonResponse.Error);
        setLoading(false);
      }
    });
  };

  return (
    <div className="App">
      {/* send the text property to the Header component */}
      <Header text="MOVIES" /> 
      <Search search="{search}" />
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
    </div>
  );

};

export default App;
