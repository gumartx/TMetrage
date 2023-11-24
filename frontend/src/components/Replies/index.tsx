import React, { useState } from 'react';
import ProfileComment from 'components/ProfileComment';

const Replies = () => {
  const [repliesVisible, setRepliesVisible] = useState(false);

  return (
    <div className="comment">
      <div>
        <button
          className="btn view-replies-btn"
          onClick={() => setRepliesVisible(!repliesVisible)}
        >
          {repliesVisible ? 'Esconder Respostas' : 'Ver Respostas'}
        </button>
      </div>
      {repliesVisible && (
        <div className="replies">
          <ProfileComment />
          <ProfileComment />
        </div>
      )}
    </div>
  );
};


export default Replies;
