import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar';
import MovieList from './components/MovieList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppNavbar />
        <MovieList />
      </div>
    );
  }
}

export default App;
