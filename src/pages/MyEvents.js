import React, { useState, useEffect } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function MyEvents({ user }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showParticipants, setShowParticipants] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: isMobile ? "15px" : "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    zIndex: 1000,
    width: isMobile ? "90vw" : "clamp(400px, 50vw, 600px)",
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
          padding: "clamp(40px, 10vw, 60px) 20px",
          gap: "20px",
          minHeight: "50vh",
        }}
      >
        <div
          style={{
            width: "clamp(40px, 8vw, 50px)",
            height: "clamp(40px, 8vw, 50px)",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p
          style={{
            color: "#5d6d7e",
            fontSize: "clamp(14px, 4vw, 16px)",
            fontWeight: "500",
            margin: 0,
            textAlign: "center",
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
      await deleteDoc(doc(db, "events", eventId));
      setCreatedEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Ошибка удаления: ", error);
      alert("Не удалось удалить мероприятие");
    }
  };

  return (
    <div
      style={{
        padding: "clamp(20px, 5vw, 40px)",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      <h2
        style={{
          color: "#2c3e50",
          fontSize: "clamp(24px, 6vw, 32px)",
          fontWeight: "700",
          marginBottom: "clamp(20px, 4vw, 30px)",
          textAlign: "center",
        }}
      >
        Мои мероприятия
      </h2>

      {/* Секция "Я создал" */}
      <section style={{ marginBottom: "clamp(30px, 6vw, 50px)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "clamp(15px, 3vw, 25px)",
            flexDirection: isMobile ? "column" : "row",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <h3
            style={{
              color: "#2c3e50",
              fontSize: "clamp(20px, 5vw, 24px)",
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
              padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 12px)",
              borderRadius: "20px",
              fontSize: "clamp(12px, 2.5vw, 14px)",
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
              padding: "clamp(25px, 6vw, 40px)",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              margin: isMobile ? "0 10px" : "0",
            }}
          >
            <div
              style={{
                fontSize: "clamp(36px, 10vw, 48px)",
                marginBottom: "clamp(10px, 3vw, 15px)",
                opacity: 0.5,
              }}
            >
              🎯
            </div>
            <p
              style={{
                color: "#7f8c8d",
                marginBottom: "clamp(15px, 4vw, 20px)",
                fontSize: "clamp(14px, 3vw, 16px)",
                lineHeight: 1.5,
              }}
            >
              Вы еще не создали ни одного мероприятия
            </p>
            <Link
              to="/create"
              style={{
                padding: "clamp(10px, 3vw, 12px) clamp(15px, 4vw, 24px)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "clamp(13px, 3vw, 14px)",
                display: "inline-block",
              }}
            >
              Создать мероприятие
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "clamp(15px, 3vw, 20px)",
              padding: isMobile ? "0 10px" : "0",
            }}
          >
            {createdEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  background: "white",
                  padding: "clamp(15px, 4vw, 25px)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid #e8f6ef",
                  transition: isMobile ? "none" : "transform 0.2s ease",
                }}
                onMouseOver={
                  isMobile
                    ? undefined
                    : (e) =>
                        (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseOut={
                  isMobile
                    ? undefined
                    : (e) => (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "10px" : "0",
                  }}
                >
                  <h4
                    style={{
                      color: "#2c3e50",
                      fontSize: "clamp(16px, 4vw, 18px)",
                      fontWeight: "600",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {event.title}
                  </h4>
                  <span
                    style={{
                      background: "#27ae60",
                      color: "white",
                      padding: "clamp(3px, 1vw, 4px) clamp(6px, 2vw, 10px)",
                      borderRadius: "12px",
                      fontSize: "clamp(11px, 2.5vw, 12px)",
                      fontWeight: "600",
                      alignSelf: isMobile ? "flex-start" : "center",
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
                    fontSize: "clamp(14px, 3vw, 16px)",
                  }}
                >
                  {event.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "clamp(10px, 2vw, 15px)",
                    marginBottom: "clamp(15px, 3vw, 20px)",
                    padding: "clamp(12px, 3vw, 15px)",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#7f8c8d",
                        marginBottom: "4px",
                      }}
                    >
                      📅 Дата и время
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "clamp(13px, 3vw, 14px)",
                      }}
                    >
                      {event.date} {event.time}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#7f8c8d",
                        marginBottom: "4px",
                      }}
                    >
                      📍 Место
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "clamp(13px, 3vw, 14px)",
                      }}
                    >
                      {event.location}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#7f8c8d",
                        marginBottom: "4px",
                      }}
                    >
                      👥 Участников
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "clamp(13px, 3vw, 14px)",
                      }}
                    >
                      {event.participants?.length || 0}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <button
                    onClick={() =>
                      handleShowParticipants(event.id, event.participants || [])
                    }
                    style={{
                      padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "clamp(13px, 3vw, 14px)",
                      cursor: "pointer",
                      transition: isMobile ? "none" : "transform 0.2s ease",
                      minHeight: "44px",
                      flex: isMobile ? "1" : "0 1 auto",
                    }}
                    disabled={loadingParticipants}
                    onMouseOver={
                      isMobile
                        ? undefined
                        : (e) => {
                            if (!loadingParticipants)
                              e.target.style.transform = "translateY(-1px)";
                          }
                    }
                    onMouseOut={
                      isMobile
                        ? undefined
                        : (e) => {
                            if (!loadingParticipants)
                              e.target.style.transform = "translateY(0)";
                          }
                    }
                  >
                    {loadingParticipants && showParticipants === event.id
                      ? "Загрузка..."
                      : "👥 Участники"}
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    style={{
                      padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)",
                      background: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "clamp(13px, 3vw, 14px)",
                      cursor: "pointer",
                      transition: isMobile ? "none" : "transform 0.2s ease",
                      minHeight: "44px",
                      flex: isMobile ? "1" : "0 1 auto",
                    }}
                    onMouseOver={
                      isMobile
                        ? undefined
                        : (e) => (e.target.style.transform = "translateY(-1px)")
                    }
                    onMouseOut={
                      isMobile
                        ? undefined
                        : (e) => (e.target.style.transform = "translateY(0)")
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
      <section style={{ marginBottom: "clamp(20px, 4vw, 40px)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "clamp(15px, 3vw, 25px)",
            flexDirection: isMobile ? "column" : "row",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <h3
            style={{
              color: "#2c3e50",
              fontSize: "clamp(20px, 5vw, 24px)",
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
              padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 12px)",
              borderRadius: "20px",
              fontSize: "clamp(12px, 2.5vw, 14px)",
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
              padding: "clamp(25px, 6vw, 40px)",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              margin: isMobile ? "0 10px" : "0",
            }}
          >
            <div
              style={{
                fontSize: "clamp(36px, 10vw, 48px)",
                marginBottom: "clamp(10px, 3vw, 15px)",
                opacity: 0.5,
              }}
            >
              🌟
            </div>
            <p
              style={{
                color: "#7f8c8d",
                fontSize: "clamp(14px, 3vw, 16px)",
                lineHeight: 1.5,
              }}
            >
              Вы еще не участвуете ни в одном мероприятии
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "clamp(15px, 3vw, 20px)",
              padding: isMobile ? "0 10px" : "0",
            }}
          >
            {participatingEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  background: "white",
                  padding: "clamp(15px, 4vw, 25px)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid #e8f4fd",
                  transition: isMobile ? "none" : "transform 0.2s ease",
                }}
                onMouseOver={
                  isMobile
                    ? undefined
                    : (e) =>
                        (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseOut={
                  isMobile
                    ? undefined
                    : (e) => (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <h4
                  style={{
                    color: "#2c3e50",
                    fontSize: "clamp(16px, 4vw, 18px)",
                    fontWeight: "600",
                    marginBottom: "10px",
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </h4>

                <p
                  style={{
                    color: "#5d6d7e",
                    lineHeight: "1.5",
                    marginBottom: "15px",
                    fontSize: "clamp(14px, 3vw, 16px)",
                  }}
                >
                  {event.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "clamp(10px, 2vw, 15px)",
                    marginBottom: "15px",
                    padding: "clamp(12px, 3vw, 15px)",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#7f8c8d",
                        marginBottom: "4px",
                      }}
                    >
                      📅 Дата и время
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "clamp(13px, 3vw, 14px)",
                      }}
                    >
                      {event.date} {event.time}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#7f8c8d",
                        marginBottom: "4px",
                      }}
                    >
                      📍 Место
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "clamp(13px, 3vw, 14px)",
                      }}
                    >
                      {event.location}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#7f8c8d",
                        marginBottom: "4px",
                      }}
                    >
                      👤 Организатор
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "clamp(13px, 3vw, 14px)",
                      }}
                    >
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
                      padding: "clamp(6px, 2vw, 8px) clamp(10px, 2vw, 16px)",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "600",
                      fontSize: "clamp(12px, 2.5vw, 13px)",
                      cursor: "pointer",
                      minHeight: "36px",
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
                  fontSize: "clamp(18px, 4vw, 20px)",
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
                  minWidth: "30px",
                  minHeight: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                    fontSize: "clamp(36px, 8vw, 48px)",
                    marginBottom: "15px",
                    opacity: 0.5,
                  }}
                >
                  👥
                </div>
                <p
                  style={{
                    color: "#7f8c8d",
                    fontSize: "clamp(14px, 3vw, 16px)",
                  }}
                >
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
                      padding: "clamp(12px, 3vw, 15px)",
                      borderBottom: "1px solid #f1f3f4",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background 0.2s ease",
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile ? "8px" : "0",
                      textAlign: isMobile ? "center" : "left",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#f8f9fa")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <div style={{ flex: 1 }}>
                      <strong
                        style={{
                          display: "block",
                          color: "#2c3e50",
                          fontSize: "clamp(14px, 3vw, 16px)",
                          marginBottom: isMobile ? "4px" : "0",
                        }}
                      >
                        {participant.email}
                      </strong>
                      {participant.displayName && (
                        <span
                          style={{
                            color: "#666",
                            fontSize: "clamp(12px, 2.5vw, 14px)",
                            display: "block",
                          }}
                        >
                          {participant.displayName}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#27ae60",
                        background: "#e8f6ef",
                        padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
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

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="padding: clamp(20px, 5vw, 40px)"] {
            padding: 15px 10px !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="gridTemplateColumns: isMobile ?"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 360px) {
          div[style*="padding: clamp(15px, 4vw, 25px)"] {
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default MyEvents;
