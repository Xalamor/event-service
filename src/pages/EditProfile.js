// pages/EditProfile.js
import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/pages/EditProfile.css";

function EditProfile({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Загрузка данных пользователя...");
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Данные получены:", data);
          setFormData({
            displayName: data.displayName || "",
            bio: data.bio || "",
            phone: data.phone || "",
          });
        } else {
          console.log("Документ пользователя не найден");
          // Если документа нет, используем пустые значения
          setFormData({
            displayName: "",
            bio: "",
            phone: "",
          });
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        // При ошибке тоже устанавливаем пустые значения
        setFormData({
          displayName: "",
          bio: "",
          phone: "",
        });
      } finally {
        setLoading(false);
        console.log("Загрузка завершена");
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), formData);
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className={`edit-profile-header ${isMobile ? "mobile" : ""}`}>
        <h2 className="edit-profile-title">Редактировать профиль</h2>
      </div>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-field">
          <label className="form-label">Имя:</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Введите ваше имя"
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label className="form-label">О себе:</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Расскажите о себе"
            rows={4}
            className="form-input form-textarea"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Телефон:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7 (999) 123-45-67"
            className="form-input"
          />
        </div>

        <div className={`form-buttons ${isMobile ? "mobile" : ""}`}>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
            disabled={saving}
          >
            Отмена
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`save-button ${saving ? "saving" : ""}`}
          >
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
