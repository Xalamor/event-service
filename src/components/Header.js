import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { NavLink } from "react-router-dom";
import "../styles/components/Header.css";

function Header({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
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
    <header className="header">
      <nav className="nav">
        {/* Логотип */}
        <div className="logo">
          <NavLink
            to="/event-service"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
            onClick={closeMenu}
          >
            EventService
          </NavLink>
        </div>

        {/* Кнопка бургер-меню для мобильных */}
        <div
          className={`burger-menu ${isMenuOpen ? "burger-menu-open" : ""}`}
          onClick={toggleMenu}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </div>

        {/* Навигация для десктопа */}
        <div className="desktop-nav">
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                Привет, {user.displayName || user.email}!
              </NavLink>
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                Создать мероприятие
              </NavLink>
              <NavLink
                to="/myevents"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                Мои мероприятия
              </NavLink>
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                Войти
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `register-btn ${isActive ? "register-btn-active" : ""}`
                }
              >
                Регистрация
              </NavLink>
            </>
          )}
        </div>

        {/* Мобильное меню */}
        <div className={`mobile-menu ${isMenuOpen ? "mobile-menu-open" : ""}`}>
          {user ? (
            <>
              <div className="mobile-user-info">
                Привет, {user.displayName || user.email}!
              </div>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`
                }
                onClick={closeMenu}
              >
                Профиль
              </NavLink>
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`
                }
                onClick={closeMenu}
              >
                Создать мероприятие
              </NavLink>
              <NavLink
                to="/myevents"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`
                }
                onClick={closeMenu}
              >
                Мои мероприятия
              </NavLink>
              <button onClick={handleLogout} className="mobile-logout-btn">
                Выйти
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`
                }
                onClick={closeMenu}
              >
                Войти
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `mobile-register-btn ${
                    isActive ? "mobile-register-btn-active" : ""
                  }`
                }
                onClick={closeMenu}
              >
                Регистрация
              </NavLink>
            </>
          )}
        </div>

        {/* Затемнение фона при открытом меню */}
        {isMenuOpen && <div className="overlay" onClick={closeMenu} />}
      </nav>
    </header>
  );
}

export default Header;
