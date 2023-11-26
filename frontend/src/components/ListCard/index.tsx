import MovieCard from 'components/MovieCard';
import './styles.css';
import { Link } from 'react-router-dom';

const ListCard = () => {
  return (
    <Link to="/lists/:listId" className="list-card-container">
    <div className="list-card-container">
      <div className="list-card-content">
        <div className="base-card list-card-top-content">
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
        </div>
        <div className="list-card-bottom-content">
          <h2>Filmes assistidos em 2023</h2>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ListCard;
