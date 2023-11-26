import MovieImg from 'assets/images/barbie.png';
import MovieStars from 'components/MovieStars';
import './styles.css';
import { Link } from 'react-router-dom';

const MovieCard = () => {
  return (
    <Link to="/lists/:listId/:movieId" className="movie-card">
      <div className="base-card movie-card">
        <div className="card-top-container">
          <img src={MovieImg} alt="Barbie" />
        </div>
        <div className="card-bottom-container">
          <h6>Barbie</h6>
          <div>
            <MovieStars />
            <span>76</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
