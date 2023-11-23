import MovieCard from 'components/MovieCard';
import { Link } from 'react-router-dom';
import './styles.css';
import Pagination from 'components/Pagination';
import { ReactComponent as SearchIcon } from 'assets/images/search.svg';

const Menu = () => {
  return (
    <div className="container my-4 menu-container">
      <div className="row menu-title-container">
        <h1>Procurando por um filme?</h1>
      </div>

      <div className="menu-search-container">
        <div className="row">
          <div className="col-md-6 search-container">
            <input
              type="text"
              placeholder="Pesquise um filme pelo nome"
              className="form-control base-input search-content"
            />
            <button className="btn btn-primary search-content-icon">
              <SearchIcon />
            </button>
          </div>
          <div className="col-md-6 filter-container">
            <button className="filter-btn">Filtrar por Gênero</button>
            <div className="dropdown-content">
              <a href="link">Ação e Aventura</a>
              <a href="link">Drama</a>
              <a href="link">Comédia</a>
              <a href="link">Romance</a>
              <a href="link">Documentário</a>
              <a href="link">Suspense</a>
              <a href="link">Ficção Científica</a>
              <a href="link">Terror</a>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <Link to="/menu/:movieId">
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
