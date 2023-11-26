import ProfilePhoto from 'assets/images/profileImg.png';
import './styles.css';
import MovieCard from 'pages/ProfileDetails/MovieCard';
import ProfileComment from 'components/ProfileComment';
import { useState } from 'react';

const ProfileDetails = () => {
  const [repliesVisible, setRepliesVisible] = useState(false);

  return (
    <div className="profile-container">
      <div className="profile-image-container">
        <div className="profile-view-image-background"></div>
        <div className="profile-image-photo">
          <img src={ProfilePhoto} alt="Imagem de perfil" />
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-top-content">
          <div className="profile-view-details">
            <h1>pedrinhopaulo123</h1>
          </div>
          <div className="profile-view-follow">
            <div className="profile-dropdown" id="followingDropdown">
              <span>34&bull;</span>
              <span>SEGUINDO</span>
            </div>
            <div className="profile-dropdown" id="followersDropdown">
              <span>41&bull;</span>
              <span>SEGUIDORES</span>
            </div>
          </div>
          <div className="btn-follow">
              <div>
                <button
                  className="btn btn-follower"
                  onClick={() => setRepliesVisible(!repliesVisible)}
                >
                  {repliesVisible ? 'Seguindo' : 'Seguir'}
                </button>
              </div>
            </div>
        </div>
        <div className="row profile-view-bottom-content">
          <div className="col-lg-6">
            <h3>Comentários</h3>
            <div className="profile-view-comment">
              <ProfileComment />
              <ProfileComment />
              <ProfileComment />
              <ProfileComment />
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
