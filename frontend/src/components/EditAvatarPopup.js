import React,{ useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({
  isOpen,
  onClose,
  onUpdateAvatar,
  isLoading,
}) {
  const avatarRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  return (
  <PopupWithForm
    title={"Обновить аватар"}
    name={"change-avatar"}
    isOpen={isOpen}
    onClose={onClose}
    onSubmit={handleSubmit}
    textButton={isLoading? 'Сохранение...' : 'Сохранить'}>
      <div className="form__section">
        <input 
          type="url" 
          className="form__input form__input_type_avatar" 
          name='avatar' 
          id="avatar" 
          placeholder="Ссылка на новый аватар" 
          required
          ref={avatarRef} 
        />
        <span className="avatar-error form__input-error"></span>
      </div>
  </PopupWithForm>
  );
}