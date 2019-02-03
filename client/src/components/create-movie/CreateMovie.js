import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { createMovie } from '../../actions/movieActions';

class CreateMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      releaseDate: '',
      writers: '',
      directors: '',
      actors: '',
      genres: '',
      runTime: '',
      rottenTomatoesUrlKey: '',
      rottenTomatoesTomatoMeter: '',
      rottenTomatoesAudienceScore: '',
      imdbId: '',
      imdbRating: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
        this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const movieData = {
        title: this.state.title,
        releaseDate: this.state.releaseDate,
        writers: this.state.writers,
        directors: this.state.directors,
        actors: this.state.actors,
        genres: this.state.genres,
        runTime: this.state.runTime,
        rottenTomatoesUrlKey: this.state.rottenTomatoesUrlKey,
        rottenTomatoesTomatoMeter: this.state.rottenTomatoesTomatoMeter,
        rottenTomatoesAudienceScore: this.state.rottenTomatoesAudienceScore,
        imdbId: this.state.imdbId,
        imdbRating: this.state.imdbRating
    };

    this.props.createMovie(movieData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    // Select options for status
    const options = [
      { label: '* Select Professional Status', value: 0 },
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Student or Learning', value: 'Student or Learning' },
      { label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
      { label: 'Intern', value: 'Intern' },
      { label: 'Other', value: 'Other' }
    ];

    return (
      <div className="create-movie">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Movie</h1>
              <p className="lead text-center">
                Let's get some information to make your movie stand out
              </p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Movie Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                  //info="A unique handle for your profile URL. Your full name, company name, nickname"
                />
                <TextFieldGroup
                  name="releaseDate"
                  placeholder="Date movie was released"
                  type="date"
                  value={this.state.releaseDate}
                  onChange={this.onChange}
                  error={errors.releaseDate}
                  info="Release date of movie"
                />
                <TextFieldGroup
                  placeholder="Writers"
                  name="writers"
                  value={this.state.writers}
                  onChange={this.onChange}
                  error={errors.writers}
                  info="List of writer names seperated by commas (eg. Phil Lord, Christopher Miller)"
                />
                <TextFieldGroup
                  placeholder="Directors"
                  name="directors"
                  value={this.state.directors}
                  onChange={this.onChange}
                  error={errors.directors}
                  info="List of director names seperated by commas (eg. Joel Coen, Ethan Coen)"
                />
                <TextFieldGroup
                  placeholder="Actors"
                  name="actors"
                  value={this.state.actors}
                  onChange={this.onChange}
                  error={errors.actors}
                  info="List of actor names seperated by commas (eg. Bill Murray, Dan Aykroyd, Sigourney Weaver)"
                />
                <TextFieldGroup
                  placeholder="Genres"
                  name="genres"
                  value={this.state.genres}
                  onChange={this.onChange}
                  error={errors.genres}
                  info="List of genre names seperated by commas (eg. Action, Suspense, Drama)"
                />
                <TextFieldGroup
                  placeholder="Runtime"
                  name="runTime"
                  value={this.state.runTime}
                  onChange={this.onChange}
                  error={errors.runTime}
                  info="Runtime of movie in minutes"
                />
                <TextFieldGroup
                  placeholder="Rotten Tomatoes Url Key"
                  name="rottenTomatoesUrlKey"
                  value={this.state.rottenTomatoesUrlKey}
                  onChange={this.onChange}
                  error={errors.rottenTomatoesUrlKey}
                  info="The last piece of the url to a movie on Rotten Tomatoes (eg. the_big_lebowski from url https://www.rottentomatoes.com/m/the_big_lebowski"
                />
                <TextFieldGroup
                  placeholder="TomatoMeter"
                  name="rottenTomatoesTomatoMeter"
                  value={this.state.TomatoMeter}
                  onChange={this.onChange}
                  error={errors.TomatoMeter}
                  info="TomatoMeter from Rotten Tomatoes (1-100)"
                />
                <TextFieldGroup
                  placeholder="Rotten Tomatoes Audience Score"
                  name="rottenTomatoesAudienceScore"
                  value={this.state.rottenTomatoesAudienceScore}
                  onChange={this.onChange}
                  error={errors.rottenTomatoesAudienceScore}
                  info="Audience Score from Rotten Tomatoes (1-100)"
                />
                <TextFieldGroup
                  placeholder="IMDB ID"
                  name="imdbId"
                  value={this.state.imdbId}
                  onChange={this.onChange}
                  error={errors.imdbId}
                  info="The last piece of the url to a movie on IMDB (eg. tt0087332 from url https://www.imdb.com/title/tt0087332/"
                />
                <TextFieldGroup
                  placeholder="IMDB Rating"
                  name="imdbRating"
                  value={this.state.imdbRating}
                  onChange={this.onChange}
                  error={errors.imdbRating}
                  info="Rating out of 10 on IMDB (eg. 7.8)"
                />
                
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateMovie.propTypes = {
  movie: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  movie: state.movie,
  errors: state.errors
});

export default connect(mapStateToProps, { createMovie })(
  withRouter(CreateMovie)
);
