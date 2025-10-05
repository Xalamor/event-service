import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { arrayUnion, updateDoc, doc, arrayRemove } from "firebase/firestore";
import { Link } from "react-router-dom";

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 20px",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
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
            margin: 0,
          }}
        >
          Загрузка мероприятий...
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
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            color: "#2c3e50",
            fontSize: "32px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Все мероприятия
        </h1>
        {user && (
          <Link
            to="/create"
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
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
            + Создать мероприятие
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "20px",
              opacity: 0.5,
            }}
          >
            📅
          </div>
          <h3
            style={{
              color: "#2c3e50",
              marginBottom: "10px",
            }}
          >
            Мероприятий пока нет
          </h3>
          <p
            style={{
              color: "#7f8c8d",
              marginBottom: "25px",
            }}
          >
            Будьте первым, кто создаст мероприятие!
          </p>
          {user && (
            <Link
              to="/create"
              style={{
                padding: "12px 30px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Создать первое мероприятие
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gap: "25px" }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e1e8ed",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 15px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "15px",
                }}
              >
                <h3
                  style={{
                    color: "#2c3e50",
                    fontSize: "20px",
                    fontWeight: "600",
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {event.title}
                </h3>
                {user && user.uid === event.creatorId && (
                  <span
                    style={{
                      color: "#27ae60",
                      fontWeight: "600",
                      fontSize: "12px",
                      background: "#e8f6ef",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      marginLeft: "15px",
                    }}
                  >
                    🎯 Организатор
                  </span>
                )}
              </div>

              <p
                style={{
                  color: "#5d6d7e",
                  lineHeight: "1.5",
                  marginBottom: "20px",
                }}
              >
                {event.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px",
                  marginBottom: "20px",
                  padding: "15px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ fontSize: "18px" }}>📅</span>
                  <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                      Дата и время
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {event.date} {event.time}
                    </div>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ fontSize: "18px" }}>📍</span>
                  <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                      Место
                    </div>
                    <div style={{ fontWeight: "500" }}>{event.location}</div>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ fontSize: "18px" }}>👥</span>
                  <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                      Участников
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {event.participantsCount || 0}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #f1f3f4",
                }}
              >
                <span
                  style={{
                    color: "#7f8c8d",
                    fontSize: "14px",
                  }}
                >
                  Организатор: {event.creatorEmail}
                </span>

                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  {user && user.uid === event.creatorId ? (
                    <span
                      style={{
                        color: "#27ae60",
                        fontWeight: "500",
                      }}
                    >
                      Вы организатор
                    </span>
                  ) : user && isUserParticipating(event) ? (
                    <button
                      onClick={() => handleLeaveEvent(event.id)}
                      style={{
                        padding: "10px 20px",
                        background: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.transform = "translateY(-1px)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.transform = "translateY(0)")
                      }
                    >
                      Отписаться
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={!user}
                      style={{
                        padding: "10px 20px",
                        background: !user
                          ? "#bdc3c7"
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: !user ? "not-allowed" : "pointer",
                        transition: "transform 0.2s ease",
                        opacity: !user ? 0.6 : 1,
                      }}
                      onMouseOver={(e) => {
                        if (user) e.target.style.transform = "translateY(-1px)";
                      }}
                      onMouseOut={(e) => {
                        if (user) e.target.style.transform = "translateY(0)";
                      }}
                    >
                      {user ? "Участвовать" : "Войдите"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
