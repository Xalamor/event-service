import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { arrayUnion, updateDoc, doc, arrayRemove } from "firebase/firestore";

function Home({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Получаем все мероприятия, отсортированные по дате
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("date", "asc") // Сортировка по дате
        );
        const querySnapshot = await getDocs(eventsQuery);

        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(eventsData);
      } catch (error) {
        console.error("Ошибка загрузки мероприятий:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Функция подписки на мероприятие
  const handleJoinEvent = async (eventId) => {
    if (!user) {
      alert("Войдите в систему чтобы подписаться!");
      return;
    }

    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        participants: arrayUnion(user.uid),
        participantsCount:
          events.find((e) => e.id === eventId).participantsCount + 1 || 1,
      });

      alert("Вы успешно подписались на мероприятие!");
      // Обновляем список мероприятий
      window.location.reload(); // Простой способ обновить данные
    } catch (error) {
      console.error("Ошибка подписки:", error);
    }
  };

  // Функция отписки от мероприятия
  const handleLeaveEvent = async (eventId) => {
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        participants: arrayRemove(user.uid),
        participantsCount:
          events.find((e) => e.id === eventId).participantsCount - 1,
      });

      alert("Вы отписались от мероприятия");
      window.location.reload();
    } catch (error) {
      console.error("Ошибка отписки:", error);
    }
  };

  // Проверяем, подписан ли пользователь на мероприятие
  const isUserParticipating = (event) => {
    return event.participants && event.participants.includes(user?.uid);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Загрузка мероприятий...
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Все мероприятия</h1>

      {events.length === 0 ? (
        <p style={{ marginTop: "15px" }}>
          Пока нет мероприятий. <a href="/create">Создайте первое!</a>
        </p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>

              <div style={{ display: "flex", gap: "20px", margin: "10px 0" }}>
                <div>
                  <strong>📅 Дата:</strong> {event.date} {event.time}
                </div>
                <div>
                  <strong>📍 Место:</strong> {event.location}
                </div>
                <div>
                  <strong>👥 Участников:</strong> {event.participantsCount || 0}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                {user && user.uid === event.creatorId ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Вы организатор
                  </span>
                ) : user && isUserParticipating(event) ? (
                  <button
                    onClick={() => handleLeaveEvent(event.id)}
                    style={{
                      padding: "8px 16px",
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Отписаться
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinEvent(event.id)}
                    disabled={!user}
                    style={{
                      padding: "8px 16px",
                      background: user ? "#007bff" : "#ccc",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    {user ? "Участвовать" : "Войдите чтобы участвовать"}
                  </button>
                )}

                <span style={{ color: "#666" }}>
                  Организатор: {event.creatorEmail}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
