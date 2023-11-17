import { ReactComponent as MainImage } from 'assets/images/main-image.svg';
import Navbar from 'components/Navbar';

import './styles.css';
import ButtonIcon from 'components/ButtonIcon';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-card">
          <div className="home-content-container">
            <div>
              <h1>Conheça o TMétrage</h1>
              <p>Encontre e organize filmes enquanto interage com amigos</p>
            </div>
            <ButtonIcon />
          </div>
          <div className="home-image-container">
            <MainImage />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
