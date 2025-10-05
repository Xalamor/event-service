import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function EditProfile({ user }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    try {
      await updateDoc(doc(db, "users", user.uid), newUserData);
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка в обновлении данных:", error.message);
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
        padding: "40px",
        maxWidth: "500px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
        Редактировать профиль
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e1e8ed",
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
              padding: "12px",
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              transition: "border-color 0.3s ease",
              outline: "none",
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
              padding: "12px",
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              resize: "vertical",
              transition: "border-color 0.3s ease",
              outline: "none",
              fontFamily: "inherit",
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
              padding: "12px",
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              transition: "border-color 0.3s ease",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3498db")}
            onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
