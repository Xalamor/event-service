import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function EditProfile({ user }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newUserData, setNewUserData] = useState({
    displayName: "",
    bio: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setNewUserData({
          displayName: data.displayName || "",
          bio: data.bio || "",
          phone: data.phone || "",
        });
      }
      setLoading(false);
    };
    fetchUserData();
  }, [user]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), newUserData);
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка в обновлении данных:", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          flexDirection: "column",
          gap: "20px",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p
          style={{
            color: "#5d6d7e",
            fontSize: "16px",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          Загрузка профиля...
        </p>
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
        </style>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "clamp(20px, 5vw, 40px)",
        maxWidth: "500px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "calc(100vh - 80px)",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "clamp(20px, 4vw, 30px)",
          color: "#2c3e50",
          fontSize: "clamp(24px, 6vw, 28px)",
          fontWeight: "600",
          padding: "0 10px",
        }}
      >
        Редактировать профиль
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "clamp(20px, 4vw, 30px)",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e1e8ed",
          margin: "0 10px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#2c3e50",
              fontSize: "14px",
            }}
          >
            Имя:
          </label>
          <input
            name="displayName"
            value={newUserData.displayName}
            onChange={handleChange}
            placeholder="Введите ваше имя"
            style={{
              width: "100%",
              padding: "clamp(12px, 3vw, 14px)",
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              transition: "border-color 0.3s ease",
              outline: "none",
              boxSizing: "border-box",
              minHeight: "44px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3498db")}
            onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#2c3e50",
              fontSize: "14px",
            }}
          >
            О себе:
          </label>
          <textarea
            name="bio"
            value={newUserData.bio}
            onChange={handleChange}
            placeholder="Расскажите о себе"
            rows="4"
            style={{
              width: "100%",
              padding: "clamp(12px, 3vw, 14px)",
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              resize: "vertical",
              transition: "border-color 0.3s ease",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
              minHeight: "120px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3498db")}
            onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#2c3e50",
              fontSize: "14px",
            }}
          >
            Телефон:
          </label>
          <input
            name="phone"
            value={newUserData.phone}
            onChange={handleChange}
            placeholder="+7 (999) 123-45-67"
            style={{
              width: "100%",
              padding: "clamp(12px, 3vw, 14px)",
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              transition: "border-color 0.3s ease",
              outline: "none",
              boxSizing: "border-box",
              minHeight: "44px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3498db")}
            onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexDirection: window.innerWidth <= 480 ? "column" : "row",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/profile")}
            style={{
              flex: window.innerWidth <= 480 ? "1" : "0 0 auto",
              padding: "clamp(12px, 3vw, 14px)",
              background: "transparent",
              color: "#5d6d7e",
              border: "2px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "center",
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = "#3498db";
              e.target.style.color = "#3498db";
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = "#dcdfe6";
              e.target.style.color = "#5d6d7e";
            }}
          >
            Отмена
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              flex: "1",
              padding: "clamp(12px, 3vw, 14px)",
              background: saving
                ? "#95a5a6"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: saving ? "not-allowed" : "pointer",
              transition:
                "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
              opacity: saving ? 0.7 : 1,
              minHeight: "44px",
            }}
            onMouseOver={(e) => {
              if (!saving) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (!saving) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>

      <style jsx>{`
        /* Адаптивные стили через медиа-запросы */
        @media (max-width: 768px) {
          div[style*="padding: clamp(20px, 5vw, 40px)"] {
            padding: 20px 15px !important;
          }

          form {
            margin: 0 !important;
            padding: 20px !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="display: flex"] {
            flex-direction: column !important;
            gap: 10px !important;
          }

          h2 {
            font-size: 22px !important;
            margin-bottom: 20px !important;
          }

          button {
            font-size: 15px !important;
          }

          input,
          textarea {
            font-size: 16px !important; /* Предотвращает масштабирование в iOS */
          }
        }

        @media (max-width: 360px) {
          div[style*="padding: clamp(20px, 5vw, 40px)"] {
            padding: 15px 10px !important;
          }

          form {
            padding: 15px !important;
          }

          textarea {
            min-height: 100px !important;
            rows: 3 !important;
          }
        }

        /* Улучшение для мобильного ввода */
        @media (max-width: 768px) {
          input,
          textarea {
            font-size: 16px !important;
          }
        }

        /* Улучшение для очень маленьких экранов */
        @media (max-width: 320px) {
          h2 {
            font-size: 20px !important;
          }

          form {
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
