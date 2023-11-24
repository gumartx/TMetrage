import ProfileImg from 'assets/images/profileImg.png';
import CommentImg from 'assets/images/comment.svg';
import HeartImg from 'assets/images/heart.svg';
import Replies from 'components/Replies'

import './styles.css';

const Comments = () => {
  return (
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
        <div className="profile-comments">
          <div className="comments-comment">
            <img src={CommentImg} alt="Ícone de comentário" />
            <span>2</span>
          </div>
          <div className="comments-likes">
            <img src={HeartImg} alt="Ícone de coração" />
            <span>34</span>
          </div>
        </div>
      </div>
      <Replies />
    </div>
  );
};

export default Comments;
