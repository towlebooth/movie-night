import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//import AppNavbar from './components/AppNavbar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

import MovieList from './components/MovieList';
import MovieModal from './components/MovieModal';
import { Container } from 'reactstrap';

import { Provider } from 'react-redux';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      
      <Provider store={store}>
        <Router>
          <div className="App">
              <Navbar />
              <Route exact path="/" component={Landing} />
              <div className="container">
                <Route exact path="/register" component={ Register } />
                <Route exact path="/login" component={ Login } />
              </div>
              <Container>
                <MovieModal />
                <MovieList />
              </Container>
              <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
