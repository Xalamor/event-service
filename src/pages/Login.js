import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
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
        padding: "40px",
        maxWidth: "400px",
        margin: "80px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px 30px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e1e8ed",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#2c3e50",
            fontSize: "28px",
            fontWeight: "600",
          }}
        >
          Вход в аккаунт
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="email"
              placeholder="Ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #dcdfe6",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                outline: "none",
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

          <div style={{ marginBottom: "25px" }}>
            <input
              type="password"
              placeholder="Ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #dcdfe6",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                outline: "none",
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

          {error && (
            <div
              style={{
                color: "#e74c3c",
                marginBottom: "20px",
                padding: "12px",
                background: "#fdf2f2",
                border: "1px solid #fbd5d5",
                borderRadius: "8px",
                fontSize: "14px",
                textAlign: "center",
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
              padding: "14px",
              background: loading
                ? "#bdc3c7"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {loading ? <span>Вход...</span> : <span>Войти</span>}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            paddingTop: "20px",
            borderTop: "1px solid #f1f3f4",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#7f8c8d",
              fontSize: "14px",
            }}
          >
            Нет аккаунта?{" "}
            <Link
              to="/register"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
                transition: "color 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#764ba2")}
              onMouseOut={(e) => (e.target.style.color = "#667eea")}
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
