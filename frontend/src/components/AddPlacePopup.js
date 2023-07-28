import React, { useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({
  isOpen,
  onClose,
  onAddPlace,
  isLoading,
}) {
  const cardTitleRef = useRef();
  const cardLinkRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({
      name: cardTitleRef.current.value,
      link: cardLinkRef.current.value,
    });
  }

  useEffect(() => {
    cardTitleRef.current.value = "";
    cardLinkRef.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm
        title={"Новое место"}
        name={"place"}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        textButton={isLoading? 'Сохранение...' : 'Создать'}>
          <div className="form__section">
              <input 
                type="text" 
                className="form__input form__input_type_place" 
                id="add" 
                name='add'  
                placeholder="Название"
                minLength="2" 
                maxLength="30" 
                required
                ref={cardTitleRef}/>
              <span className="place-error form__input-error"></span>
              </div>
              <div className="form__section">
              <input 
                type="url"
                className="form__input form__input_type_link" 
                name='link' 
                id="link" 
                placeholder="Ссылка на картинку" 
                required
                ref={cardLinkRef}/>
              <span className="link-error form__input-error"></span>
            </div>
        </PopupWithForm>
  );
}