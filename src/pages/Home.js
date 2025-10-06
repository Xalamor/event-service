import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { arrayUnion, updateDoc, doc, arrayRemove } from "firebase/firestore";
import { Link } from "react-router-dom";

function Home({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("date", "asc")
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
      window.location.reload();
    } catch (error) {
      console.error("Ошибка подписки:", error);
    }
  };

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

  return (
    <div
      style={{
        padding: "clamp(20px, 5vw, 40px)",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          marginBottom: "clamp(20px, 4vw, 30px)",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "15px" : "0",
        }}
      >
        <h1
          style={{
            color: "#2c3e50",
            fontSize: "clamp(24px, 6vw, 32px)",
            fontWeight: "700",
            margin: 0,
            textAlign: isMobile ? "center" : "left",
            width: isMobile ? "100%" : "auto",
          }}
        >
          Все мероприятия
        </h1>
        {user && (
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
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              display: "block",
              textAlign: "center",
              width: isMobile ? "100%" : "auto",
            }}
            onMouseOver={(e) => {
              if (!isMobile) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (!isMobile) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
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
            padding: "clamp(40px, 8vw, 60px) clamp(20px, 5vw, 40px)",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            margin: "0 10px",
          }}
        >
          <div
            style={{
              fontSize: "clamp(36px, 10vw, 48px)",
              marginBottom: "clamp(15px, 4vw, 20px)",
              opacity: 0.5,
            }}
          >
            📅
          </div>
          <h3
            style={{
              color: "#2c3e50",
              marginBottom: "clamp(8px, 2vw, 10px)",
              fontSize: "clamp(18px, 5vw, 24px)",
            }}
          >
            Мероприятий пока нет
          </h3>
          <p
            style={{
              color: "#7f8c8d",
              marginBottom: "clamp(20px, 5vw, 25px)",
              fontSize: "clamp(14px, 3vw, 16px)",
              lineHeight: 1.5,
            }}
          >
            Будьте первым, кто создаст мероприятие!
          </p>
          {user && (
            <Link
              to="/create"
              style={{
                padding: "clamp(10px, 3vw, 12px) clamp(20px, 6vw, 30px)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "clamp(14px, 3vw, 16px)",
                display: "inline-block",
              }}
            >
              Создать первое мероприятие
            </Link>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "clamp(15px, 4vw, 25px)",
            padding: isMobile ? "0 10px" : "0",
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "white",
                padding: "clamp(15px, 4vw, 25px)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e1e8ed",
                transition: isMobile
                  ? "none"
                  : "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseOver={
                isMobile
                  ? undefined
                  : (e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 15px rgba(0, 0, 0, 0.15)";
                    }
              }
              onMouseOut={
                isMobile
                  ? undefined
                  : (e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px rgba(0, 0, 0, 0.1)";
                    }
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
                <h3
                  style={{
                    color: "#2c3e50",
                    fontSize: "clamp(18px, 4vw, 20px)",
                    fontWeight: "600",
                    margin: 0,
                    flex: 1,
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </h3>
                {user && user.uid === event.creatorId && (
                  <span
                    style={{
                      color: "#27ae60",
                      fontWeight: "600",
                      fontSize: "clamp(11px, 2.5vw, 12px)",
                      background: "#e8f6ef",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 12px)",
                      borderRadius: "20px",
                      marginLeft: isMobile ? "0" : "15px",
                      alignSelf: isMobile ? "flex-start" : "center",
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
                  marginBottom: "clamp(15px, 3vw, 20px)",
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
                    : "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "clamp(10px, 2vw, 15px)",
                  marginBottom: "clamp(15px, 3vw, 20px)",
                  padding: "clamp(12px, 3vw, 15px)",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ fontSize: "clamp(16px, 3vw, 18px)" }}>📅</span>
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#7f8c8d",
                      }}
                    >
                      Дата и время
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
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ fontSize: "clamp(16px, 3vw, 18px)" }}>📍</span>
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#7f8c8d",
                      }}
                    >
                      Место
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
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ fontSize: "clamp(16px, 3vw, 18px)" }}>👥</span>
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 2.5vw, 12px)",
                        color: "#7f8c8d",
                      }}
                    >
                      Участников
                    </div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "clamp(13px, 3vw, 14px)",
                      }}
                    >
                      {event.participantsCount || 0}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #f1f3f4",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "15px" : "0",
                }}
              >
                <span
                  style={{
                    color: "#7f8c8d",
                    fontSize: "clamp(12px, 2.5vw, 14px)",
                    lineHeight: 1.4,
                  }}
                >
                  Организатор: {event.creatorEmail}
                </span>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    width: isMobile ? "100%" : "auto",
                    justifyContent: isMobile ? "center" : "flex-end",
                  }}
                >
                  {user && user.uid === event.creatorId ? (
                    <span
                      style={{
                        color: "#27ae60",
                        fontWeight: "500",
                        fontSize: "clamp(13px, 3vw, 14px)",
                        textAlign: isMobile ? "center" : "left",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      Вы организатор
                    </span>
                  ) : user && isUserParticipating(event) ? (
                    <button
                      onClick={() => handleLeaveEvent(event.id)}
                      style={{
                        padding: "clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)",
                        background: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "clamp(13px, 3vw, 14px)",
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                        width: isMobile ? "100%" : "auto",
                        minHeight: "44px",
                      }}
                      onMouseOver={
                        isMobile
                          ? undefined
                          : (e) =>
                              (e.target.style.transform = "translateY(-1px)")
                      }
                      onMouseOut={
                        isMobile
                          ? undefined
                          : (e) => (e.target.style.transform = "translateY(0)")
                      }
                    >
                      Отписаться
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={!user}
                      style={{
                        padding: "clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)",
                        background: !user
                          ? "#bdc3c7"
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "clamp(13px, 3vw, 14px)",
                        cursor: !user ? "not-allowed" : "pointer",
                        transition: "transform 0.2s ease",
                        opacity: !user ? 0.6 : 1,
                        width: isMobile ? "100%" : "auto",
                        minHeight: "44px",
                      }}
                      onMouseOver={
                        isMobile
                          ? undefined
                          : (e) => {
                              if (user)
                                e.target.style.transform = "translateY(-1px)";
                            }
                      }
                      onMouseOut={
                        isMobile
                          ? undefined
                          : (e) => {
                              if (user)
                                e.target.style.transform = "translateY(0)";
                            }
                      }
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

      <style jsx>{`
        @media (max-width: 768px) {
          /* Дополнительные мобильные стили */
        }

        @media (max-width: 480px) {
          div[style*="padding: clamp(20px, 5vw, 40px)"] {
            padding: 15px 10px !important;
          }

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

export default Home;
