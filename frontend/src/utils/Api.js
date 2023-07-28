export default class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }
    _checkStatus(res) {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    }

    getInitialCards() {
      return fetch(`${this._baseUrl}/cards`, {
        headers: this._headers,
      }).then((res) => this._checkStatus(res));
    }

    getUserInfo() {
      return fetch(`${this._baseUrl}/users/me`, {
        headers: this._headers,
      }).then((res) => this._checkStatus(res));
    }
    addNewCard({name, link}) {
      return fetch(`${this._baseUrl}/cards`, {
         method: "POST",
         headers: this._headers,
         body: JSON.stringify({name, link}),
      }).then((res) => this._checkStatus(res));
    }

    deleteCard(cardId) {
      return fetch(`${this._baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: this._headers,
      }).then((res) => this._checkStatus(res));
    }

    addLike(cardId) {
      return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
        method: "PUT",
        headers: this._headers,
      }).then((res) => this._checkStatus(res));
    }

    removeLike(cardId) {
      return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
        method: "DELETE",
        headers: this._headers,
      }).then((res) => this._checkStatus(res));
    }

    setUserInfo({name, about}) {
      return fetch(`${this._baseUrl}/users/me`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({ name, about }),
      }).then((res) => this._checkStatus(res));
    }

    setUserAvatar(avatar) {
      return fetch(`${this._baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify(avatar),
      }).then((res) => this._checkStatus(res));
    }

    changeLikeCardStatus(id, isLiked) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        method: isLiked ? "DELETE" : "PUT",
        headers: this._headers,
      }).then((res) => this._checkStatus(res));
    }
}

export const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-64",
  headers: {
    authorization: "79ee610d-0667-436e-9f24-0d4f28a2fc48",
    "Content-Type": "application/json",
  },
});