import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { NavLink } from "react-router-dom";

function Header({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false); // Закрываем меню после выхода
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      style={{
        padding: "20px 40px",
        borderBottom: "1px solid #e1e8ed",
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        position: "relative",
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
        {/* Логотип */}
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
            onClick={closeMenu}
          >
            EventService
          </NavLink>
        </div>

        {/* Кнопка бургер-меню для мобильных */}
        <div
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "space-around",
            width: "30px",
            height: "25px",
            cursor: "pointer",
            zIndex: 1001,
          }}
          className="burger-menu"
          onClick={toggleMenu}
        >
          <span
            style={{
              display: "block",
              height: "3px",
              width: "100%",
              backgroundColor: "#2c3e50",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: isMenuOpen
                ? "rotate(45deg) translate(5px, 5px)"
                : "none",
            }}
          ></span>
          <span
            style={{
              display: "block",
              height: "3px",
              width: "100%",
              backgroundColor: "#2c3e50",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              opacity: isMenuOpen ? 0 : 1,
            }}
          ></span>
          <span
            style={{
              display: "block",
              height: "3px",
              width: "100%",
              backgroundColor: "#2c3e50",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: isMenuOpen
                ? "rotate(-45deg) translate(7px, -6px)"
                : "none",
            }}
          ></span>
        </div>

        {/* Навигация для десктопа */}
        <div
          style={{
            display: "flex",
            gap: "25px",
            alignItems: "center",
            fontSize: "15px",
          }}
          className="desktop-nav"
        >
          {user ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Мобильное меню */}
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "75%",
            height: "100vh",
            background: "white",
            boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
            transform: isMenuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s ease",
            padding: "80px 30px 30px",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            zIndex: 1000,
          }}
          className="mobile-menu"
        >
          {user ? (
            <>
              <div
                style={{
                  padding: "15px 0",
                  borderBottom: "1px solid #eee",
                  color: "#2c3e50",
                  fontWeight: "600",
                }}
              >
                Привет, {user.displayName || user.email}!
              </div>
              <NavLink
                to="/profile"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#3498db" : "#5d6d7e",
                  fontWeight: "500",
                  fontSize: "18px",
                  padding: "12px 0",
                  borderBottom: "1px solid #f5f5f5",
                })}
                onClick={closeMenu}
              >
                Профиль
              </NavLink>
              <NavLink
                to="/create"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#3498db" : "#5d6d7e",
                  fontWeight: "500",
                  fontSize: "18px",
                  padding: "12px 0",
                  borderBottom: "1px solid #f5f5f5",
                })}
                onClick={closeMenu}
              >
                Создать мероприятие
              </NavLink>
              <NavLink
                to="/myevents"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#3498db" : "#5d6d7e",
                  fontWeight: "500",
                  fontSize: "18px",
                  padding: "12px 0",
                  borderBottom: "1px solid #f5f5f5",
                })}
                onClick={closeMenu}
              >
                Мои мероприятия
              </NavLink>
              <button
                onClick={handleLogout}
                style={{
                  padding: "12px 20px",
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#3498db" : "#5d6d7e",
                  fontWeight: "500",
                  fontSize: "18px",
                  padding: "12px 0",
                  borderBottom: "1px solid #f5f5f5",
                })}
                onClick={closeMenu}
              >
                Войти
              </NavLink>
              <NavLink
                to="/register"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#3498db" : "white",
                  fontWeight: "500",
                  fontSize: "18px",
                  padding: "12px 20px",
                  background: isActive ? "#2980b9" : "#3498db",
                  borderRadius: "6px",
                  textAlign: "center",
                  marginTop: "10px",
                })}
                onClick={closeMenu}
              >
                Регистрация
              </NavLink>
            </>
          )}
        </div>

        {/* Затемнение фона при открытом меню */}
        {isMenuOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            onClick={closeMenu}
          />
        )}
      </nav>

      <style jsx>{`
        /* Адаптивные стили */
        @media (max-width: 768px) {
          header {
            padding: 15px 20px !important;
          }

          .desktop-nav {
            display: none !important;
          }

          .burger-menu {
            display: flex !important;
          }
        }

        @media (min-width: 769px) {
          .burger-menu {
            display: none !important;
          }

          .mobile-menu {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-menu {
            width: 85% !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
