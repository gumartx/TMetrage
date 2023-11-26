import MovieImg from 'assets/images/barbie.png';
import MovieStars from 'components/MovieStars';
import './styles.css';
import { Link } from 'react-router-dom';

const MovieCard = () => {
  return (
    <Link to="/lists/:listId/:movieId" className="">
      <div className="base-card movie-form-card">
        <div className="movie-form-top-container">
          <img src={MovieImg} alt="Barbie" />
        </div>
        <div className="movie-form-bottom-container">
          <h6>Barbie</h6>
          <div className="movie-form-bottom-available">
            <MovieStars />
            <span>76</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
