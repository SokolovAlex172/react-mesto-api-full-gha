export default class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }
    _checkStatus(res) {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    }

    getInitialCards() {
      return fetch(`${this.baseUrl}/cards`, {
        headers: this.headers
      }).then((res) => this._checkStatus(res));
    }

    getUserInfo() {
      this.headers.authorization = `Bearer ${localStorage.getItem('jwt')}`
      return fetch(`${this.baseUrl}/users/me`, {
        headers: this.headers
      }).then((res) => this._checkStatus(res));
      }

    addNewCard(data) {
      return fetch(`${this.baseUrl}/cards`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          name: `${data.name}`,
          link: `${data.link}`
        })
      }).then((res) => this._checkStatus(res));
    }

    deleteCard(cardId) {
      return fetch(`${this.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: this.headers,
      }).then((res) => this._checkStatus(res));
    }

    // addLike(cardId) {
    //   return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
    //     method: "PUT",
    //     headers: this.headers,
    //   }).then((res) => this._checkStatus(res));
    // }

    // removeLike(cardId) {
    //   return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
    //     method: "DELETE",
    //     headers: this.headers,
    //   }).then((res) => this._checkStatus(res));
    // }

    setUserInfo(data) {
      return fetch(`${this.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          name: `${data.name}`,
          about: `${data.about}`
        })
      }).then((res) => this._checkStatus(res));
    }

    setUserAvatar(data) {
      return fetch(`${this.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          avatar: `${data.avatar}`
        })
      }).then((res) => this._checkStatus(res));
    }


    changeLikeCardStatus(cardId, isLiked) {
      if (!isLiked) {
        return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
          method: 'DELETE',
          headers: this.headers,
        })
        .then((res) => this._checkStatus(res));
      } else {
        return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
          method: 'PUT',
          headers: this.headers,
        })
        .then((res) => this._checkStatus(res));
      }
    }

    // changeLikeCardStatus(cardId, isLiked) {
    //   const token = localStorage.getItem('jwt');
    //   return fetch(`${this._baseUrl}/cards/like/${cardId}`, {
    //     method: isLiked ? "DELETE" : "PUT",
    //     headers: {
    //       authorization: `Bearer ${token}`,
    //       'Content-Type': 'application/json',
    //   },
    //   }).then((res) => this._checkStatus(res));
    // }
}


const token = localStorage.getItem('jwt');

export const api = new Api({
  baseUrl: "http://localhost:3001",
  headers: {
    authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});