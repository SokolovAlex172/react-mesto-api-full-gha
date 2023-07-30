const BASE_URL = "http://localhost:3001";


export function checkResponse(response) {
  return response.ok ? response.json() : Promise.reject(`Ошибка ${response.status}`)
}

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: `${password}`,
      email: `${email}`
    })
  })
  .then(checkResponse);
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: `${password}`,
      email: `${email}`
    })
  })
  .then(checkResponse)
  .then((data) => {
    localStorage.setItem('jwt', data.token)
    return data;
  })
};


export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => res.json())
  .then(data => data)
};











