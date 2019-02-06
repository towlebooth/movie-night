import React from 'react';
import { Link } from 'react-router-dom';

const MovieActions = () => {
  return (
    <div className="btn-group mb-4" role="group">
      <Link to="/edit-movie" className="btn btn-light">
        <i className="fas fa-user-circle text-info mr-1" /> Edit Movie
      </Link>
      <Link to="/add-review" className="btn btn-light">
        <i className="fab fa-black-tie text-info mr-1" />
        Review this Movie
      </Link>
    </div>
  );
};

export default MovieActions;