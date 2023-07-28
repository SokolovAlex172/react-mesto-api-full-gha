import React, { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

export default function EditProfilePopup( {
  isOpen,
  onClose,
  onUpdateUser,
  isLoading,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name,
      about: description,
    });
  }


  return (
  <PopupWithForm
    title={"Редактировать профиль"}
    name={"edit-profile"}
    isOpen={isOpen}
    onClose={onClose}
    onSubmit={handleSubmit}
    textButton={isLoading? 'Сохранение...' : 'Сохранить'}>
    <div className="form__section">
      <input 
        type="text" 
        className="form__input form__input_type_name" 
        id="names" 
        name='name' 
        placeholder="Введите имя"
        minLength="2" 
        maxLength="40" 
        required
        value={name || ""}
        onChange={handleChangeName}
        
      />
      <span className="names-error form__input-error"></span>
    </div>
    <div className="form__section">
      <input 
        type="text" 
        className="form__input form__input_type_job" 
        id="about" 
        name='about' 
        placeholder="Введите профессию" 
        minLength="2" 
        maxLength="400" 
        required
        value={description || ""} 
        onChange={handleChangeDescription}
      />
      <span className="about-error form__input-error"></span>
    </div>
    </PopupWithForm>
  
  );
}

