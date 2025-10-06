import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function CreateEvent({ user }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...formData,
        creatorId: user.uid,
        creatorEmail: user.email,
        createdAt: serverTimestamp(),
        participants: [],
        participantsCount: 0,
      });

      console.log("Мероприятие создано с ID:", docRef.id);
      navigate("/event-device");
    } catch (error) {
      console.error("Ошибка при создании мероприятия:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#2c3e50",
          fontSize: "clamp(24px, 6vw, 28px)",
          fontWeight: "600",
          padding: "0 10px",
        }}
      >
        Создать мероприятие
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "clamp(20px, 5vw, 30px)",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e1e8ed",
          flex: 1,
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
            Название мероприятия:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введите название мероприятия"
            required
            style={{
              width: "100%",
              padding: "clamp(10px, 3vw, 12px)",
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              transition: "border-color 0.3s ease",
              outline: "none",
              boxSizing: "border-box",
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
            Описание мероприятия:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите ваше мероприятие..."
            required
            rows="4"
            style={{
              width: "100%",
              padding: "clamp(10px, 3vw, 12px)",
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              resize: "vertical",
              transition: "border-color 0.3s ease",
              outline: "none",
              fontFamily: "inherit",
              minHeight: "100px",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3498db")}
            onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flexDirection: window.innerWidth <= 480 ? "column" : "row",
          }}
        >
          <div style={{ flex: "1" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
                fontSize: "14px",
              }}
            >
              Дата:
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "clamp(10px, 3vw, 12px)",
                border: "1px solid #dcdfe6",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3498db")}
              onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
            />
          </div>

          <div style={{ flex: "1" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#2c3e50",
                fontSize: "14px",
              }}
            >
              Время:
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "clamp(10px, 3vw, 12px)",
                border: "1px solid #dcdfe6",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3498db")}
              onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
            />
          </div>
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
            Локация:
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Где будет проходить мероприятие?"
            required
            style={{
              width: "100%",
              padding: "clamp(10px, 3vw, 12px)",
              border: "1px solid #dcdfe6",
              borderRadius: "8px",
              fontSize: "16px",
              transition: "border-color 0.3s ease",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3498db")}
            onBlur={(e) => (e.target.style.borderColor = "#dcdfe6")}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "clamp(12px, 4vw, 14px)",
            background: isSubmitting
              ? "#95a5a6"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition:
              "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
            opacity: isSubmitting ? 0.7 : 1,
          }}
          onMouseOver={(e) => {
            if (!isSubmitting) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
            }
          }}
          onMouseOut={(e) => {
            if (!isSubmitting) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }
          }}
        >
          {isSubmitting ? "Создание..." : "Создать мероприятие"}
        </button>
      </form>

      <style jsx>{`
        /* Адаптивные стили через медиа-запросы */
        @media (max-width: 768px) {
          div[style*="padding: 20px"] {
            padding: 15px !important;
          }

          form {
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
        }

        @media (max-width: 360px) {
          div[style*="padding: 20px"] {
            padding: 10px !important;
          }

          form {
            padding: 15px !important;
          }

          textarea {
            min-height: 80px !important;
          }
        }

        /* Улучшение для мобильного ввода */
        @media (max-width: 768px) {
          input,
          textarea {
            font-size: 16px !important; /* Предотвращает масштабирование в iOS */
          }

          input[type="date"],
          input[type="time"] {
            min-height: 44px; /* Минимальная высота для touch */
          }
        }
      `}</style>
    </div>
  );
}

export default CreateEvent;
