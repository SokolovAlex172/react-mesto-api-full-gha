import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Card from "./Card";

import edit from "../image/edit.svg";
import add from "../image/add.svg";

export default function Main({
  onEditAvatar,
  onEditProfile,
  onCardClick,
  onAddPlace,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const currentUser = useContext(CurrentUserContext);

  const cardsList = cards.map(card => (
    <Card 
    key={card._id} 
    card={card} 
    onCardClick={onCardClick} 
    onCardLike={onCardLike}
    onCardDelete={onCardDelete}
    />
  ));

  return (
    <main>
      <section className="profile">
        <div className="profile__side">
          <div className="profile__avatar"
          onClick={onEditAvatar}>
            <img 
              className='profile__avatar-img'
              src={currentUser.avatar} alt='Аватар'
               />
          </div>
          <div className="profile__info">
            <div className="profile__text">
              <h1 className="profile__text-name">{currentUser.name}</h1>
              <p className="profile__text-job">{currentUser.about}</p>
            </div>
            <button 
              className="profile__edit" 
              type="button"
              onClick={onEditProfile}>
                 <img className="profile__edit-image" 
                 src={edit} 
                 alt="Редактировать" />
            </button>
          </div>
        </div>
        <button className="profile__add" type="button"
         onClick={onAddPlace}>
          <img 
            className="profile__add-image" 
            src={add} alt="Добавить"
            
          />
        </button>
      </section>
      <section className="places" id="places-card">
        {cardsList}
      </section>
    </main>
  );
}
