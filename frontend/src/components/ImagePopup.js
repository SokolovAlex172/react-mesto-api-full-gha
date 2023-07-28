import close from '../image/close.svg';

import React from 'react';

export default function ImagePopup(props) {

  const className = `popup popup_black  popup_type_image image-popup ${props.card.name ? "popup_opened" : ""}`
  return (
    <div className={className}
    id="popup-image">
    <div className="popup__container-image">
      <button 
        className="popup__close" 
        id="popup__close-image" 
        type="button"
        onClick={props.onClose}>
        <img 
          className="popup__close-image" 
          src={close} 
          alt="Закарыть"/>
      </button>
      <img 
        className="popup__image" 
        src={props.card ? props.card.link : ""}
        alt={props.card ? props.card.name : ""}
      />
      <p 
        className="popup__text">
          {props.card ? props.card.name : ""}
        </p>
      </div>
  </div>
    )
}

