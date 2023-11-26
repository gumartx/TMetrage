import ProfileImg from 'assets/images/profileImg.png';
import './styles.css'
import { Link } from 'react-router-dom';

const ProfileCard = () => {

    return(
        <Link to="/profileView">
        <div className="profile-card-container">
            <div className="profile-card-image">
                <img src={ProfileImg} alt="Imagem de perfil" />
            </div>
            <div className="profile-card-name">
                <h1>pedrinhopaulo123</h1>
            </div>
        </div>
        </Link>
    );

}

export default ProfileCard;