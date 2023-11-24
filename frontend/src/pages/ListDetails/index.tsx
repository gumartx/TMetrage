import GoBack from 'components/GoBack';
import MovieCard from 'components/MovieCard';
import { Link } from 'react-router-dom';
import './styles.css';

const ListDetails = () => {
  return (
    <div className="list-details-container">
      <div className="base-card list-details-card">
        <div className="btn-goback-container">
          <Link to="/lists">
            <div className="goback-container">
              <GoBack />
            </div>
          </Link>
        </div>
        <div className="list-details-content">
          <div className="list-top-content">
            <div className="list-details-name">
              <h1>Filmes assistidos em 2023</h1>
              <p>21/11/2023</p>
            </div>
            <div className="row list-details-movies">
              <div className="col-sm-6 col-lg-4 col-xl-3">
                <Link to="/lists/:listId/:movieId">
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
          </div>
          <div className="list-bottom-content">
            <div className="list-details-description">
              <h2>Descrição</h2>
              <p>
                Criei pra deixar salvo e relembrar os filmes que assisti em 2023
              </p>
            </div>
            <div className="list-details-bottons">
              <Link to="/list/form">
              <button className="btn btn-primary btn-edit">
                <h6>Editar Lista</h6>
              </button>
              </Link>
              <button className="btn btn-primary btn-graphic">
                <h6>Gerar Gráfico</h6>
              </button>
              <button className="btn btn-primary btn-share">
                <h6>Compartilhar</h6>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListDetails;
