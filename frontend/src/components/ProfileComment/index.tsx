import ProfileImg from 'assets/images/profileImg.png';
import CommentImg from 'assets/images/comment.svg';
import HeartImg from 'assets/images/heart.svg';
import Replies from 'components/Replies';

import './styles.css';
import { Link } from 'react-router-dom';

const Comments = () => {
  return (
    <div className="movie-comments-container">
      <Link to="/profileView">
      <div className="profile-comment-details">
          <div className="profile-comment-img">
            <img src={ProfileImg} alt="Foto de perfil" />
          </div>
          <div className="profile-comment-name">
            <h4>pedrinhopaulo123</h4>
            <p>&bull;10h</p>
          </div>
      </div>
      </Link>
      <div className="profile-comment-comment">
        <p>Filme muito bom!</p>
        <div className="profile-comment-comments">
          <div className="comments-comment-comment">
            <img src={CommentImg} alt="Ícone de comentário" />
            <span>2</span>
          </div>
          <div className="comments-comment-likes">
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
