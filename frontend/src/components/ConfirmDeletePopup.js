import PopupWithForm from "./PopupWithForm";

export default function ConfirmDeletePopup({
  isOpen,
  onClose,
  onConfirmDelete,
  card,
  isLoading
}) {
  function handleSubmit(e) {
    e.preventDefault();

    onConfirmDelete(card);
  }

  return (

    <PopupWithForm 
      title={"Вы уверены?"} 
      name={"confirm-delete"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      textButton={isLoading? 'Сохранение...' : "Да, удалить карточку"}
      
      >
    </PopupWithForm>
  );
}
