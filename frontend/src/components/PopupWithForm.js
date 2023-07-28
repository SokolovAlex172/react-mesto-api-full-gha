import close from '../image/close.svg';

export default function PopupWithForm({
  title,
  name,
  children,
  isOpen,
  onClose,
  onSubmit,
  textButton
  }) {

 
  return (
    <div className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""} `}
      id={`popup-${name}`}
    >
    <div className="popup__container">
      <button 
        className="popup__close" 
        type="button">
        <img 
          className="popup__close-image" 
          src={close} 
          alt="Закарыть"
          onClick={onClose}
        />
      </button>
      <h3 className="popup__title">{title}</h3>
      <form 
        className="form" 
        id={`${name}`}
        name={`${name}`}
        disabled
        onSubmit={onSubmit}
      >
       {children}
       <button
          className= "form__submit"
          type="submit"
        >
          {textButton}
        </button>
      </form>
    </div>
  </div>
  )
}