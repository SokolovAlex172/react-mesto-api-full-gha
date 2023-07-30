import React,{ useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card({ 
  card: { _id, link, name, likes , owner},
  onCardClick,
  onCardLike,
  onCardDelete,
  }) {
    const currentUser = useContext(CurrentUserContext);

    const isOwn = owner === currentUser._id;

    const isLiked = likes.some( i => i === currentUser._id);

    const cardLikeButtonClassName = ( 
      `places__like ${isLiked && 'places__like_active'}` 
    );

  function handleClick() {
    onCardClick({ link, name });
  }

  function handleLikeClick() {
    onCardLike({ _id, likes });
  }

  function handleDeleteClick() {
    onCardDelete({ _id });
  }

  return(
    <article className="places__item" id={_id}>
      {isOwn && (
      <button
        className="places__delete" 
        type="button"
        onClick={handleDeleteClick}/>
        )}
      <img className="places__image" 
        src={link} 
        alt={name}
        onClick={handleClick}
      />
      <div className="places__info">
        <h2 className="places__info-title">{name}</h2>
        <div className="places__info-container">
          <button 
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}>
            </button>
          <p className="places__like-counter">{likes.length}</p>
        </div>
      </div>
    </article>
  );
}