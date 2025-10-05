import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

function Header({ user }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <header style={{ padding: "20px", borderBottom: "1px solid #ccc" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            EventService
          </Link>
        </div>

        <div>
          {user ? (
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <span>Привет, {user.email}!</span>
              <Link to="/create">Создать мероприятие</Link>
              <Link to="/myevents">Мои мероприятия</Link>
              <button onClick={handleLogout}>Выйти</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "15px" }}>
              <Link to="/login">Войти</Link>
              <Link to="/register">Регистрация</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
