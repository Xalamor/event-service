import React, { useState, useEffect } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function MyEvents({ user }) {
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    zIndex: 1000,
    minWidth: "400px",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999,
  };

  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showParticipants, setShowParticipants] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) return;
      try {
        const createdQuery = query(
          collection(db, "events"),
          where("creatorId", "==", user.uid)
        );

        const participatingQuery = query(
          collection(db, "events"),
          where("participants", "array-contains", user.uid)
        );

        const [createdSnapshot, participatingSnapshot] = await Promise.all([
          getDocs(createdQuery),
          getDocs(participatingQuery),
        ]);

        const createdEventsData = createdSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const participatingEventsData = participatingSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        setCreatedEvents(createdEventsData);
        setParticipatingEvents(participatingEventsData);
      } catch (error) {
        console.error("Ошибка загрузки мероприятий: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user]);

  const handleShowParticipants = async (eventId, participantIds = []) => {
    setLoadingParticipants(true);

    try {
      // Загружаем информацию о каждом участнике
      const participantsData = [];

      for (const userId of participantIds) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          participantsData.push({
            id: userDoc.id,
            ...userDoc.data(),
          });
        }
      }

      setParticipantsList(participantsData);
      setShowParticipants(eventId);
    } catch (error) {
      console.error("Ошибка загрузки участников:", error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleCloseModal = () => {
    setShowParticipants(null);
    setParticipantsList([]);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Загрузка мероприятий...
      </div>
    );
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      if (!window.confirm("Вы уверены, что хотите удалить мероприятие?")) {
        return;
      }
      await deleteDoc(doc(db, "events", eventId)); // ← ИСПРАВИЛ: db вместо user
      setCreatedEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Ошибка удаления: ", error);
      alert("Не удалось удалить мероприятие");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Мои мероприятия</h2>

      {/* Секция "Я создал" */}
      <section style={{ marginBottom: "40px" }}>
        <h3>Я создал ({createdEvents.length})</h3>
        {createdEvents.length === 0 ? (
          <p>Вы еще не создали ни одного мероприятия</p>
        ) : (
          <div>
            {createdEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  background: "#f9f9f9",
                }}
              >
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <p>
                  <strong>Дата:</strong> {event.date} {event.time}
                </p>
                <p>
                  <strong>Место:</strong> {event.location}
                </p>
                <p>
                  <strong>Участников:</strong> {event.participants?.length || 0}
                </p>

                <button
                  onClick={() =>
                    handleShowParticipants(event.id, event.participants || [])
                  }
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  disabled={loadingParticipants}
                >
                  {loadingParticipants && showParticipants === event.id
                    ? "Загрузка..."
                    : "Показать участников"}
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  style={{
                    marginTop: "10px",
                    marginLeft: "15px",
                    padding: "8px 16px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Удалить мероприятие
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Секция "Я участвую" - ВОТ ЭТУ СЕКЦИЮ Я ВЕРНУЛ! */}
      <section style={{ marginBottom: "40px" }}>
        <h3>Я участвую ({participatingEvents.length})</h3>
        {participatingEvents.length === 0 ? (
          <p>Вы еще не участвуете ни в одном мероприятии</p>
        ) : (
          <div>
            {participatingEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  background: "#f0f8ff", // Другой цвет для отличия
                }}
              >
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <p>
                  <strong>Дата:</strong> {event.date} {event.time}
                </p>
                <p>
                  <strong>Место:</strong> {event.location}
                </p>
                <p>
                  <strong>Организатор:</strong> {event.creatorEmail}
                </p>
                <p>
                  <strong>Участников:</strong> {event.participants?.length || 0}
                </p>

                {/* Кнопка "Показать участников" и для мероприятий где участвуешь */}
                {event.creatorId === user.uid && (
                  <button
                    onClick={() =>
                      handleShowParticipants(event.id, event.participants || [])
                    }
                    style={{
                      marginTop: "10px",
                      padding: "8px 16px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    disabled={loadingParticipants}
                  >
                    {loadingParticipants && showParticipants === event.id
                      ? "Загрузка..."
                      : "Показать участников"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Модальное окно для участников */}
      {showParticipants && (
        <>
          <div style={overlayStyle} onClick={handleCloseModal} />
          <div style={modalStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3>Участники мероприятия</h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {participantsList.length === 0 ? (
              <p>У этого мероприятия пока нет участников</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {participantsList.map((participant) => (
                  <li
                    key={participant.id}
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ display: "block" }}>
                        {participant.email}
                      </strong>
                      {participant.displayName && (
                        <span style={{ color: "#666", fontSize: "14px" }}>
                          {participant.displayName}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        background: "#f0f0f0",
                        padding: "4px 8px",
                        borderRadius: "3px",
                      }}
                    >
                      Участник
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MyEvents;
