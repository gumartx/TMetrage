import MovieImg from 'assets/images/barbie.png';
import ProfileImg from 'assets/images/profileImg.png';
import CommentImg from 'assets/images/comment.svg';
import HeartImg from 'assets/images/heart.svg';
import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';
import MovieStars from 'components/MovieStars';
import './styles.css';

const MovieDetails = () => {
  return (
    <div className="movie-details-container">
      <div className="base-card movie-details-card">
        <div className="goback-container">
          <ArrowIcon />
          <h3>VOLTAR</h3>
        </div>
        <div className="row">
          <div className="col-xl-6">
            <div className="movie-container">
              <div className="movie-img-container">
                <img src={MovieImg} alt="Barbie" />
              </div>
              <div className="movie-available-container">
                <h4>Disponível</h4>
                <ul>
                  <li>Amazon Prime Video</li>
                  <li>YouTube</li>
                  <li>Google Play</li>
                  <li>iTunes</li>
                  <li>Claro TV</li>
                </ul>
              </div>
              <div className="btn-rate-container">
                <button className="btn btn-primary btn-rate">
                  <h6>ADICIONAR EM LISTA</h6>
                </button>
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
          <div className="movie-comments-container">
            <div className="profile-details">
              <div className="profile-img">
                <img src={ProfileImg} alt="Foto de perfil" />
              </div>
              <div className="profile-name">
                <h4>pedrinhopaulo123</h4>
                <p>&bull;10h</p>
              </div>
            </div>
            <div className="profile-comment">
              <p>Filme muito bom!</p>
              <div className="comments">
                <div className="comments-comment">
                  <img src={CommentImg} alt="Ícone de comentário" />
                  <span>0</span>
                </div>
                <div className="comments-likes">
                  <img src={HeartImg} alt="Ícone de coração" />
                  <span>34</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
