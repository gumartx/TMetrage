import ProfilePhoto from 'assets/images/profileImg.png';
import './styles.css';
import MovieCard from 'pages/ProfileDetails/MovieCard';
import ListCard from 'components/ListCard';
import ProfileCard from 'components/ProfileCard';

const ProfileDetails = () => {
  return (
    <div className="profile-container">
      <div className="profile-image-container">
        <div className="profile-image-background"></div>
        <div className="profile-image-photo">
          <img src={ProfilePhoto} alt="Imagem de perfil" />
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-top-content">
          <div className="profile-details">
            <h1>pedrinhopaulo123</h1>
            <div className="profile-user">
              <h4>Pedro Paulo</h4>
              <p>&bull;pedro.paulo@gmail.com</p>
            </div>
          </div>
          <div className="profile-follow">
            <div className="profile-dropdown" id="followingDropdown">
              <span>3&bull;</span>
              <span>SEGUINDO</span>
              <div className="profile-arrow profile-down"></div>
              <div className="profile-dropdown-content">
                <ProfileCard />
                <ProfileCard />
                <ProfileCard />
              </div>
            </div>

            <div className="profile-dropdown" id="followersDropdown">
              <span>3&bull;</span>
              <span>SEGUIDORES</span>
              <div className="profile-arrow profile-down"></div>
              <div className="profile-dropdown-content">
                <ProfileCard />
                <ProfileCard />
                <ProfileCard />
              </div>
            </div>
          </div>
        </div>
        <div className="row profile-bottom-content">
          <div className="col-lg-6">
            <h3>Listas</h3>
            <div className="profile-lists">
              <ListCard />
              <ListCard />
              <ListCard />
              <ListCard />
            </div>
          </div>
          <div className="col-lg-6">
            <h3>Avaliações</h3>
            <div className="profile-scores">
              <MovieCard />
              <MovieCard />
              <MovieCard />
              <MovieCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
