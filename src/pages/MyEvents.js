import React, { useState, useEffect } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

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
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          color: "#2c3e50",
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Мои мероприятия
      </h2>

      {/* Секция "Я создал" */}
      <section style={{ marginBottom: "50px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              color: "#2c3e50",
              fontSize: "24px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Я создал
          </h3>
          <span
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {createdEvents.length}
          </span>
        </div>

        {createdEvents.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{ fontSize: "48px", marginBottom: "15px", opacity: 0.5 }}
            >
              🎯
            </div>
            <p
              style={{
                color: "#7f8c8d",
                marginBottom: "20px",
                fontSize: "16px",
              }}
            >
              Вы еще не создали ни одного мероприятия
            </p>
            <Link
              to="/create"
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              Создать мероприятие
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {createdEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid #e8f6ef",
                  transition: "transform 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                  }}
                >
                  <h4
                    style={{
                      color: "#2c3e50",
                      fontSize: "18px",
                      fontWeight: "600",
                      margin: 0,
                    }}
                  >
                    {event.title}
                  </h4>
                  <span
                    style={{
                      background: "#27ae60",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Организатор
                  </span>
                </div>

                <p
                  style={{
                    color: "#5d6d7e",
                    lineHeight: "1.5",
                    marginBottom: "15px",
                  }}
                >
                  {event.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "15px",
                    marginBottom: "20px",
                    padding: "15px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                      📅 Дата и время
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {event.date} {event.time}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                      📍 Место
                    </div>
                    <div style={{ fontWeight: "500" }}>{event.location}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                      👥 Участников
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {event.participants?.length || 0}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() =>
                      handleShowParticipants(event.id, event.participants || [])
                    }
                    style={{
                      padding: "10px 20px",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                    disabled={loadingParticipants}
                    onMouseOver={(e) => {
                      if (!loadingParticipants)
                        e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      if (!loadingParticipants)
                        e.target.style.transform = "translateY(0)";
                    }}
                  >
                    {loadingParticipants && showParticipants === event.id
                      ? "Загрузка..."
                      : "👥 Участники"}
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(event.id)}
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
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Секция "Я участвую" */}
      <section style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              color: "#2c3e50",
              fontSize: "24px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Я участвую
          </h3>
          <span
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {participatingEvents.length}
          </span>
        </div>

        {participatingEvents.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{ fontSize: "48px", marginBottom: "15px", opacity: 0.5 }}
            >
              🌟
            </div>
            <p
              style={{
                color: "#7f8c8d",
                fontSize: "16px",
              }}
            >
              Вы еще не участвуете ни в одном мероприятии
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {participatingEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid #e8f4fd",
                  transition: "transform 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <h4
                  style={{
                    color: "#2c3e50",
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  {event.title}
                </h4>

                <p
                  style={{
                    color: "#5d6d7e",
                    lineHeight: "1.5",
                    marginBottom: "15px",
                  }}
                >
                  {event.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "15px",
                    marginBottom: "15px",
                    padding: "15px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                      📅 Дата и время
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {event.date} {event.time}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                      📍 Место
                    </div>
                    <div style={{ fontWeight: "500" }}>{event.location}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                      👤 Организатор
                    </div>
                    <div style={{ fontWeight: "500" }}>
                      {event.creatorEmail}
                    </div>
                  </div>
                </div>

                {event.creatorId === user.uid && (
                  <button
                    onClick={() =>
                      handleShowParticipants(event.id, event.participants || [])
                    }
                    style={{
                      padding: "8px 16px",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                    disabled={loadingParticipants}
                  >
                    {loadingParticipants && showParticipants === event.id
                      ? "Загрузка..."
                      : "👥 Участники"}
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
                marginBottom: "20px",
                paddingBottom: "15px",
                borderBottom: "2px solid #f1f3f4",
              }}
            >
              <h3
                style={{
                  color: "#2c3e50",
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Участники мероприятия
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#7f8c8d",
                  padding: "5px",
                  borderRadius: "4px",
                  transition: "background 0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.background = "#f1f3f4")}
                onMouseOut={(e) => (e.target.style.background = "none")}
              >
                ✕
              </button>
            </div>

            {participantsList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "15px",
                    opacity: 0.5,
                  }}
                >
                  👥
                </div>
                <p style={{ color: "#7f8c8d" }}>
                  У этого мероприятия пока нет участников
                </p>
              </div>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {participantsList.map((participant) => (
                  <li
                    key={participant.id}
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #f1f3f4",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background 0.2s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#f8f9fa")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <div>
                      <strong style={{ display: "block", color: "#2c3e50" }}>
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
                        color: "#27ae60",
                        background: "#e8f6ef",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontWeight: "600",
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
