const BASE_URL = "https://auth.nomoreparties.co";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export function checkResponse(response) {
  return response.ok ? response.json() : Promise.reject(`Ошибка ${response.status}`)
}

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers,
    body: JSON.stringify({email, password})
  })
  .then(checkResponse);
}

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers,
    body: JSON.stringify({email, password})
  })
  .then(checkResponse);
}

export function  checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: { ...headers, Authorization: `Bearer ${token}` },
  })
  .then(checkResponse);
}











