import imageSuccess from "../image/tooltip-success.svg";
import imageError from "../image/tooltip-error.svg";
import close from '../image/close.svg';
import React from "react";

const InfoTooltip = ({
   isOpen, 
   onClose, 
   isSuccess  }) => {
  const signUpResult = {
    success: "Вы успешно зарегистрировались!",
    fail: "Что-то пошло не так! Попробуйте ещё раз.",
  };

  return (
    <div className={`popup ${isOpen && "popup_opened"}`}>
      <div className="popup__container popup__container_type_info-tooltip">
        <button
          className="popup__close"
          type="button"
          onClick={onClose}>
            <img 
              className="popup__close-image" 
              src={close} 
              alt="Закарыть"/>
          </button>
        <div
          className="popup__tooltip-image"
          style={{
            backgroundImage: `url(${isSuccess ? imageSuccess : imageError})`,
          }}
        ></div>
        <p className="popup__tooltip-text">
          {isSuccess ? signUpResult.success : signUpResult.fail}
        </p>
      </div>
    </div>
  );
};

export default InfoTooltip;