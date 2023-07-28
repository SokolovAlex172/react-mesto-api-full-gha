
import { useState } from "react";

function Login({ handleAuthorization }) {

  const [formValue, setFormValue] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    }); 
  }

  const handleSubmit = e => {
    e.preventDefault();
    handleAuthorization(formValue);
  };
  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Вход</h2>
      <form
        className="auth-form__form"
        id="login"
        name="login"
        onSubmit={handleSubmit}
      >
        <input
          className="auth-form__text-input"
          type="email"
          name="email"
          id="email-input"
          placeholder="Email"
          required
          autoComplete="email"
          value={formValue.email || ""}
          onChange={handleChange}
        />
        <input
          className="auth-form__text-input"
          type="password"
          name="password"
          id="password-input"
          placeholder="Пароль"
          minLength="8"
          required
          value={formValue.password || ""}
          onChange={handleChange}
        />
        <button className="auth-form__button button" type="submit">
          Войти
        </button>
      </form>
    </section>
  );
}

export default Login;