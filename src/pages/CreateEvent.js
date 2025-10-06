import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/pages/CteateEvent.css";

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
      navigate("/event-service");
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
    <div className="create-event-container">
      <h2 className="create-event-title">Создать мероприятие</h2>

      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-group">
          <label className="form-label">Название мероприятия:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введите название мероприятия"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Описание мероприятия:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите ваше мероприятие..."
            required
            rows="4"
            className="form-textarea"
          />
        </div>

        <div className="form-row">
          <div className="form-group form-group-half">
            <label className="form-label">Дата:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group form-group-half">
            <label className="form-label">Время:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Локация:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Где будет проходить мероприятие?"
            required
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`submit-btn ${isSubmitting ? "submit-btn-disabled" : ""}`}
        >
          {isSubmitting ? "Создание..." : "Создать мероприятие"}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
