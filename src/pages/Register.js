import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

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
    <div
      style={{
        padding: "clamp(20px, 5vw, 40px)",
        maxWidth: "400px",
        margin: "clamp(40px, 10vw, 80px) auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "clamp(25px, 6vw, 40px) clamp(20px, 4vw, 30px)",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e1e8ed",
          width: "100%",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "clamp(20px, 4vw, 30px)",
            color: "#2c3e50",
            fontSize: "clamp(24px, 6vw, 28px)",
            fontWeight: "600",
            lineHeight: 1.3,
          }}
        >
          Создать аккаунт
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "clamp(15px, 3vw, 20px)" }}>
            <input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "clamp(12px, 3vw, 14px)",
                border: "1px solid #dcdfe6",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                outline: "none",
                boxSizing: "border-box",
                minHeight: "48px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3498db";
                e.target.style.boxShadow = "0 0 0 3px rgba(52, 152, 219, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#dcdfe6";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "clamp(20px, 4vw, 25px)" }}>
            <input
              type="password"
              placeholder="Придумайте пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "clamp(12px, 3vw, 14px)",
                border: "1px solid #dcdfe6",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                outline: "none",
                boxSizing: "border-box",
                minHeight: "48px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3498db";
                e.target.style.boxShadow = "0 0 0 3px rgba(52, 152, 219, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#dcdfe6";
                e.target.style.boxShadow = "none";
              }}
            />
            <div
              style={{
                marginTop: "8px",
                color: "#7f8c8d",
                fontSize: "clamp(11px, 2.5vw, 12px)",
                textAlign: "left",
                lineHeight: 1.4,
                padding: "0 4px",
              }}
            >
              ⓘ Пароль должен содержать минимум 6 символов
            </div>
          </div>

          {error && (
            <div
              style={{
                color: "#e74c3c",
                marginBottom: "clamp(15px, 3vw, 20px)",
                padding: "clamp(10px, 2vw, 12px)",
                background: "#fdf2f2",
                border: "1px solid #fbd5d5",
                borderRadius: "8px",
                fontSize: "clamp(13px, 3vw, 14px)",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "clamp(12px, 3vw, 14px)",
              background: loading
                ? "#bdc3c7"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: isMobile
                ? "none"
                : "transform 0.2s ease, box-shadow 0.2s ease",
              opacity: loading ? 0.7 : 1,
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseOver={
              isMobile
                ? undefined
                : (e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 12px rgba(0, 0, 0, 0.15)";
                    }
                  }
            }
            onMouseOut={
              isMobile
                ? undefined
                : (e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }
            }
          >
            {loading ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span>Регистрация...</span>
              </div>
            ) : (
              <span>Зарегистрироваться</span>
            )}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "clamp(20px, 4vw, 25px)",
            paddingTop: "clamp(15px, 3vw, 20px)",
            borderTop: "1px solid #f1f3f4",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#7f8c8d",
              fontSize: "clamp(13px, 3vw, 14px)",
              lineHeight: 1.5,
            }}
          >
            Уже есть аккаунт?{" "}
            <Link
              to="/login"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
                transition: "color 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#764ba2")}
              onMouseOut={(e) => (e.target.style.color = "#667eea")}
            >
              Войти
            </Link>
          </p>
        </div>

        {/* Дополнительные ссылки для мобильных */}
        {isMobile && (
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "1px solid #f1f3f4",
            }}
          >
            <Link
              to="/"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              ← Вернуться на главную
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Адаптивные стили через медиа-запросы */
        @media (max-width: 768px) {
          div[style*="padding: clamp(20px, 5vw, 40px)"] {
            padding: 20px 15px !important;
            margin: 20px auto !important;
          }

          div[style*="padding: clamp(25px, 6vw, 40px)"] {
            padding: 25px 20px !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="padding: clamp(20px, 5vw, 40px)"] {
            padding: 15px 10px !important;
            margin: 15px auto !important;
          }

          div[style*="padding: clamp(25px, 6vw, 40px)"] {
            padding: 20px 15px !important;
          }

          h2 {
            font-size: 22px !important;
            margin-bottom: 20px !important;
          }

          input {
            font-size: 16px !important;
            min-height: 44px !important;
          }

          button {
            min-height: 44px !important;
            font-size: 16px !important;
          }

          div[style*="marginTop: 8px"] {
            font-size: 11px !important;
          }
        }

        @media (max-width: 360px) {
          div[style*="padding: clamp(20px, 5vw, 40px)"] {
            padding: 10px !important;
          }

          div[style*="padding: clamp(25px, 6vw, 40px)"] {
            padding: 15px 12px !important;
          }

          h2 {
            font-size: 20px !important;
          }

          input {
            padding: 10px !important;
          }
        }

        /* Улучшение для очень маленьких экранов */
        @media (max-width: 320px) {
          div[style*="padding: clamp(25px, 6vw, 40px)"] {
            padding: 15px 10px !important;
          }

          button {
            font-size: 15px !important;
          }
        }

        /* Предотвращение масштабирования в iOS */
        @media (max-width: 768px) {
          input {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;
