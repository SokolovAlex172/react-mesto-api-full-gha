import { useState, useEffect  } from 'react';
import { Routes, Route, useNavigate} from 'react-router-dom';
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { AppContext } from "../contexts/AppContext";
import Header from './Header';
import Main from './Main';
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import ImagePopup from './ImagePopup.js';
import Footer from './Footer';

///Auth
import * as Auth from '../utils/Auth';
// import { authorize, checkToken, register } from "../utils/Auth";
import Register from "./Register";
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';  
import InfoTooltip from './InfoTooltip';


function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [deletedCard, setDeletedCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState({});
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistrSuccess, setIsRegistrSuccess] = useState(true);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link

  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();

  // useEffect(() => {
  //   handleToken();

  //   Promise.all([
  //     api.getUserInfo(),
  //     api.getInitialCards(),
  //   ])
  //     .then(([userData, cards]) => {
  //       setCurrentUser(userData);

  //       setCards(cards);
  //     })
  //     .catch(() => {
  //       console.error();
  //     })
  // }, []);
  
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipPopupOpen(false);
  }
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      Auth.checkToken(jwt)
        .then((authData) => {
          setUserEmail(authData.email);
          setLoggedIn(true);
          navigate('/', { replace: true });
        })
        .catch(err => console.log(err));
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, cardList]) => {
          setCurrentUser(userData);
          setCards(cardList.reverse());
        })
        .catch(err => console.log(err))
    }
  }, [loggedIn]);


  useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen]) 

  
  function handleSubmit(request) {
    // изменяем текст кнопки до вызова запроса
    setIsLoading(true);
    request()
      // закрывать попап нужно только в `then`
      .then(closeAllPopups)
      // в каждом запросе нужно ловить ошибку
      // console.error обычно используется для логирования ошибок, если никакой другой обработки ошибки нет
      .catch(console.error)
      // в каждом запросе в `finally` нужно возвращать обратно начальный текст кнопки
      .finally(() => setIsLoading(false));
  }

  ///Avatar
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }
  function handleUpdateAvatar(avatar) {
    const makeRequest = () =>
      api
        .setUserAvatar(avatar)
        .then(newAvatar => setCurrentUser(newAvatar))
    handleSubmit(makeRequest);
  }

  ///Card
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(() => {
        console.error();
      })
  } 
  function handleConfirmDelete(card) {
    setIsConfirmDeletePopupOpen(true);
    setDeletedCard(card);
  }
  function handleCardDelete(card) {
    const makeRequest = () =>
      api
        .deleteCard(card._id)
        .then(() => {
          setCards((state) => state.filter((c) => c._id !== card._id));
        })
      handleSubmit(makeRequest);
  }
////User
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleUpdateUser(info) {
    const makeRequest = () =>
      api
        .setUserInfo(info)
        .then((newInfo) => {setCurrentUser(newInfo)
        })  
      handleSubmit(makeRequest);
  }
///Place
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleAddPlaceSubmit(card) {
    const makeRequest = () =>
      api
        .addNewCard(card)
        .then((newCard )=> {setCards([newCard, ...cards])
        })
     handleSubmit(makeRequest);
  }
/// Registration
  function handleRegistration({ email, password }) {

    Auth.register(email, password)
    .then(() => {
      setIsRegistrSuccess(true);
      setIsInfoTooltipPopupOpen(true);
      navigate("/signin", { replace: true });
    })
    .catch(() => {
      setIsInfoTooltipPopupOpen(true);
      setIsRegistrSuccess(false);
    })
  }

/// Login
function handleLogin({ email }) {
  setLoggedIn(true);
  setUserEmail({ email });
  
} 
  function handleAuthorization({ email, password }) {
    const makeRequest = () =>
    Auth.authorize(email, password)
        .then(data => {
          if (data.token) {
            localStorage.setItem("jwt", data.token);
            handleLogin({ email });
            navigate("/", { replace: true });
          }
        })
    handleSubmit(makeRequest);
  }
  
  function onSignOut() {
    setUserEmail('');
    setLoggedIn(false);
    localStorage.removeItem("jwt");

  }
  
  return (
    <div className="page">
      <AppContext.Provider value={{ isLoading, closeAllPopups }}>
        <CurrentUserContext.Provider value={currentUser}>
          <Header 
            onSignOut={onSignOut} 
            userEmail={userEmail} />
          <div className="container">
            <Routes>
              <Route
                path="/signup"
                element={<Register handleRegistration={handleRegistration} />}
              />
              <Route
                path="/signin"
                element={<Login handleAuthorization={handleAuthorization} />}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    element={Main}
                    loggedIn={loggedIn}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleConfirmDelete}
                    onUpdateUser={handleUpdateUser}
                    cards={cards}
                  />
                }
              />
            </Routes>
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
              isLoading={isLoading}
            />
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              isLoading={isLoading}
            />
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
              isLoading={isLoading}
            />
            
            <ConfirmDeletePopup
              isOpen={isConfirmDeletePopupOpen}
              onClose={closeAllPopups}
              onConfirmDelete={handleCardDelete}
              card={deletedCard}
              isLoading={isLoading}
            />
            <ImagePopup 
              card={selectedCard} 
              onClose={closeAllPopups} />
            <InfoTooltip 
              isOpen={isInfoTooltipPopupOpen}
              isSuccess={isRegistrSuccess} 
              onClose={closeAllPopups}/>
              <Footer />
          </div> 
        </CurrentUserContext.Provider>
      </AppContext.Provider>
    </div>
  );
}

export default App;