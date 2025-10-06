// components/EditProfileView.js
import { useState, useEffect } from "react";
import "../styles/pages/EditProfile.css";

export default function EditProfileView({
  newUserData,
  saving,
  handleChange,
  handleSubmit,
  onCancel,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 480);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-title">Редактировать профиль</h2>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <FormField
          label="Имя:"
          name="displayName"
          value={newUserData.displayName}
          onChange={handleChange}
          placeholder="Введите ваше имя"
          type="text"
        />

        <FormField
          label="О себе:"
          name="bio"
          value={newUserData.bio}
          onChange={handleChange}
          placeholder="Расскажите о себе"
          type="textarea"
          rows={4}
        />

        <FormField
          label="Телефон:"
          name="phone"
          value={newUserData.phone}
          onChange={handleChange}
          placeholder="+7 (999) 123-45-67"
          type="text"
        />

        <div className={`form-buttons ${isMobile ? "mobile" : ""}`}>
          <button type="button" onClick={onCancel} className="cancel-button">
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

// Компонент поля формы
function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const inputProps = {
    name,
    value,
    onChange,
    placeholder,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    className: `form-input ${isFocused ? "focused" : ""}`,
  };

  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {type === "textarea" ? (
        <textarea {...inputProps} rows={rows} />
      ) : (
        <input type={type} {...inputProps} />
      )}
    </div>
  );
}
