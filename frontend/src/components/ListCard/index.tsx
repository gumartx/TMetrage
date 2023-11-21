import MovieCard from 'components/MovieCard';
import './styles.css';

const ListCard = () => {
  return (
    <div className="list-card-container">
      <div className="list-card-content">
        <div className="base-card list-card-top-content">
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
        </div>
        <div className="list-card-bottom-content">
          <h2>Filmes assistos em 2023</h2>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
