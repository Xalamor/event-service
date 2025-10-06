import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/pages/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createAt: new Date(),
        displayName: "",
        bio: "",
        phone: "",
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Создать аккаунт</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="register-input"
            />
          </div>

          <div className="input-container">
            <input
              type="password"
              placeholder="Придумайте пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="register-input"
            />
            <div className="password-hint">
              ⓘ Пароль должен содержать минимум 6 символов
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`register-button ${loading ? "loading" : ""} ${
              isMobile ? "mobile" : ""
            }`}
          >
            {loading ? (
              <div className="button-loading">
                <div className="loading-spinner" />
                <span>Регистрация...</span>
              </div>
            ) : (
              <span>Зарегистрироваться</span>
            )}
          </button>
        </form>

        <div className="login-link-section">
          <p className="login-text">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="login-link">
              Войти
            </Link>
          </p>
        </div>

        {isMobile && (
          <div className="mobile-home-link">
            <Link to="/event-service" className="home-link">
              ← Вернуться на главную
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
