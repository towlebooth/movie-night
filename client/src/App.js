import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import CreateMovie from './components/create-movie/CreateMovie';
import CreateMovieNight from './components/create-movie-night/CreateMovieNight';
import Movie from './components/movie/Movie';
import MovieByTmdb from './components/movie/MovieByTmdb';
import MovieList from './components/movie/MovieList';
import MovieSearch from './components/movie/MovieSearch';
import MovieNight from './components/movie-night/MovieNight';
import MovieNightList from './components/movie-night/MovieNightList';
import HostingOrder from './components/hosting-order/HostingOrder';

import { Provider } from 'react-redux';
import store from './store';
import PrivateRoute from './components/common/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CastCrew from './components/movie-person/CastCrew';

// check for token
if (localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // decode token and get user info / experation
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 10000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    // clear current profile
    store.dispatch(clearCurrentProfile());
    // redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
    render() {
        return (          
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Navbar />
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/register" component={ Register } />
                        <Route exact path="/login" component={ Login } />

                        <div className="container">                            
                            <Switch>
                                <PrivateRoute exact path="/dashboard" component={ Dashboard } />
                            </Switch>
                            <Switch>
                                <PrivateRoute exact path="/allMovieNights" component={ MovieNightList } />
                            </Switch>
                            <Switch>
                                <PrivateRoute exact path="/create-profile" component={ CreateProfile } />
                            </Switch>
                            <Switch>
                                <PrivateRoute exact path="/create-movie" component={ CreateMovie } />
                            </Switch>
                            <Switch>
                                <PrivateRoute exact path="/create-movie-night" component={ CreateMovieNight } />
                            </Switch>
                            <Switch>
                                <PrivateRoute exact path="/movie-search" component={ MovieSearch } />
                            </Switch>
                            <Switch>
                                <PrivateRoute exact path="/allMovies" component={ MovieList } />
                            </Switch>
                            <Switch>
                                <PrivateRoute exact path="/hostingOrder" component={ HostingOrder } />
                            </Switch>
                            <Route path="/allMovies/:genre" component={MovieList} />
                            <Route path="/movie/:imdbId" component={Movie} />
                            <Route path="/movieByTmdb/:tmdbId" component={MovieByTmdb} />
                            <Route path="/movieNight/:date" component={MovieNight} />
                            <Route path="/allMovieNights/:host" component={MovieNightList} />
                            <Route path="/castCrew/:personTmdbId" component={CastCrew} />
                        </div>                        
                        <Footer />
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
