import { ReactComponent as MainImg } from 'assets/images/main-image.svg';
import { Link } from 'react-router-dom';
import './styles.css';
import ButtonIcon from 'components/ButtonIcon';
import Navbar from './Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="base-card home-card">
          <div className="home-content-container">
            <div>
              <h1>Conheça o TMétrage</h1>
              <p>Encontre e organize filmes enquanto interage com amigos</p>
            </div>
            <div>
              <Link to="/auth">
                <ButtonIcon />
              </Link>
            </div>
          </div>
          <div className="home-image-container">
            <MainImg />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
