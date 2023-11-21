import MovieCard from 'components/MovieCard';
import { Link } from 'react-router-dom';
import './styles.css'
import Pagination from 'components/Pagination';

const Menu = () => {
  return (
    <div className="container my-4 menu-container">
      <div className="row menu-title-container">
        <h1>Procurando por um filme?</h1>
      </div>
      <div className="row">
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <Link to="/menu/movieId">
            <MovieCard />
          </Link>
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <MovieCard />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <MovieCard />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <MovieCard />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <MovieCard />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <MovieCard />
        </div>
      </div>
      <div className="row">
        <Pagination />
      </div>
    </div>
  );
};

export default Menu;
