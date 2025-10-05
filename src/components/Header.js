import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { NavLink } from "react-router-dom";

function Header({ user }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <header
      style={{
        padding: "20px 40px",
        borderBottom: "1px solid #e1e8ed",
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div>
          <NavLink
            to="/event-service"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontSize: "24px",
              fontWeight: "700",
              color: isActive ? "#3498db" : "#2c3e50",
              transition: "color 0.2s ease",
            })}
          >
            EventService
          </NavLink>
        </div>

        <div>
          {user ? (
            <div
              style={{
                display: "flex",
                gap: "25px",
                alignItems: "center",
                fontSize: "15px",
              }}
            >
              <NavLink
                to="/profile"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#3498db" : "#5d6d7e",
                  fontWeight: "500",
                  transition: "color 0.2s ease",
                  borderBottom: isActive ? "2px solid #3498db" : "none",
                  paddingBottom: "4px",
                })}
              >
                Привет, {user.displayName || user.email}!
              </NavLink>
              <NavLink
                to="/create"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#3498db" : "#5d6d7e",
                  fontWeight: "500",
                  transition: "color 0.2s ease",
                  borderBottom: isActive ? "2px solid #3498db" : "none",
                  paddingBottom: "4px",
                })}
              >
                Создать мероприятие
              </NavLink>
              <NavLink
                to="/myevents"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#3498db" : "#5d6d7e",
                  fontWeight: "500",
                  transition: "color 0.2s ease",
                  borderBottom: isActive ? "2px solid #3498db" : "none",
                  paddingBottom: "4px",
                })}
              >
                Мои мероприятия
              </NavLink>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.background = "#c0392b")}
                onMouseOut={(e) => (e.target.style.background = "#e74c3c")}
              >
                Выйти
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                fontSize: "15px",
              }}
            >
              <NavLink
                to="/login"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#3498db" : "#5d6d7e",
                  fontWeight: "500",
                  transition: "color 0.2s ease",
                  borderBottom: isActive ? "2px solid #3498db" : "none",
                  paddingBottom: "4px",
                })}
              >
                Войти
              </NavLink>
              <NavLink
                to="/register"
                style={({ isActive }) => ({
                  padding: "8px 20px",
                  background: isActive ? "#2980b9" : "#3498db",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  transition: "background 0.2s ease",
                })}
              >
                Регистрация
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
