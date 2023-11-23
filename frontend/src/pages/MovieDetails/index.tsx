import MovieImg from 'assets/images/barbie.png';

import MovieStars from 'components/MovieStars';
import ProfileComment from 'components/ProfileComment';
import AvailableBox from 'components/AvailableBox';
import './styles.css';
import GoBack from 'components/GoBack';
import { Link } from 'react-router-dom';

const MovieDetails = () => {
  return (
    <div className="movie-details-container">
      <div className="base-card movie-details-card">
        <div className="btn-goback-container">
          <Link to="/menu">
            <div className="goback-container">
              <GoBack />
            </div>
          </Link>
        </div>
        <div className="row">
          <div className="col-xl-6">
            <div className="movie-container">
              <div className="movie-img-container">
                <img src={MovieImg} alt="Barbie" />
              </div>
              <div className="movie-available">
                <AvailableBox />
              </div>
              <div className="btn-list-container">
                <Link to="/lists">
                  <button className="btn btn-primary btn-list">
                    <h6>ADICIONAR EM LISTA</h6>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="movie-name-container">
              <h1>Barbie</h1>
            </div>
            <div className="movie-board-container">
              <div className="movie-stars">
                <MovieStars />
                <span>76</span>
              </div>
              <div className="movie-sinopse">
                <p>
                  Barbie e Ken tiram um tempo de suas vidas coloridas e
                  aparentemente perfeitas no mundo da Ilha da Barbie. Porém,
                  quando eles têm a chance de ir ao mundo real, logo descrobem
                  as alegrias e os perigos de viver entre os humanos
                </p>
              </div>
              <h4>Informações do Filme</h4>
              <div className="base-card movie-board">
                <div>
                  <h5>Dirigigo por:</h5>
                  <p>Greta Gerwing</p>
                </div>
                <div>
                  <h5>Ano de estreia:</h5>
                  <p>2023</p>
                </div>
                <div>
                  <h5>Elenco:</h5>
                  <p>
                    Margot Robbie, Ryan Gosling, America Ferrera, Kate McKinnon,
                    Ariana Greenblatt, Simu Liu, Will Ferrell, Michael Cera,
                    Heleh Mirren, Issac Rae, Alexandra Shipp, Emma Mackey,
                    Emerald Fennell, Rhea Perlman, Hari Nef, Kingsley Ben-Adir,
                    Ncuti Gatwa, Connor Swindells, Sharon, Ritu Arya, Ana Kayne,
                    Nicola Coughlan, Dua Lipa, John Cena, Scott Evans, Jamie
                    Demetriou, Andrew Leug, Will Merrick
                  </p>
                </div>
                <div>
                  <h5>Duração:</h5>
                  <p>1h 54m</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space"></div>
          <div className="movie-profile-comments">
            <ProfileComment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
