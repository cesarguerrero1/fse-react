import React from "react";

const TuitStats = ({tuit, handleLikeEvent}) => {

  return (
    <div className="row mt-2">
      <div className="col">
        <i className="far fa-message me-1"></i>
        {tuit.stats.replies}
      </div>
      <div className="col">
        <i className="far fa-retweet me-1"></i>
        {tuit.stats.retuits}
      </div>
      <div className="col">
        <span onClick={() => handleLikeEvent(tuit, 'like')}>
          <i className={`far fa-thumbs-up me-1 ${tuit.liked ? "text-danger" : ""}`}/>{tuit.stats.likes}
        </span>
      </div>
      <div className="col">
        <span onClick={() => handleLikeEvent(tuit, 'dislike')}>
          <i className={`far fa-thumbs-down me-1 ${tuit.disliked ? "text-danger" : ""}`}/>{tuit.stats.dislikes}
        </span>
      </div>
      <div className="col">
        <i className="far fa-inbox-out"></i>
      </div>
    </div>
  );
}

export default TuitStats;