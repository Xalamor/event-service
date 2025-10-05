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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      navigate("/");
    } catch (error) {
      console.error("Ошибка при создании мероприятия:", error.message);
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Создать мероприятие</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Название мероприятия:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Описание мероприятия:</label>
          <textarea
            name="description" // ← исправил type="text"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", minHeight: "100px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Дата проведения:</label>
          <input
            type="date" // ← исправил на date
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Время проведения:</label>
          <input
            type="time" // ← исправил на time
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Локация мероприятия:</label>
          <input
            type="text"
            name="location" // ← исправил name!
            value={formData.location}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "white",
            border: "none",
            fontSize: "16px",
          }}
        >
          Создать мероприятие
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
