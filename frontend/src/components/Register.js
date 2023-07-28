import {useState } from "react";
import { Link } from "react-router-dom";

function Register({ handleRegistration }) {

  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
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
      handleRegistration(formValue);
  };

  return (
    <section className="auth-form">
      <h2 className="auth-form__title">Регистрация</h2>
      <form
        className="auth-form__form"
        id="register"
        name="register"
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
          Зарегистрироваться
        </button>
      </form>
      <p className="auth-form__text">
        Уже зарегистрированы?{" "}
        <Link to="/signin" className="link">
          Войти
        </Link>
      </p>
    </section>
  );
}

export default Register;
