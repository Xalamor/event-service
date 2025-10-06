import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { arrayUnion, updateDoc, doc, arrayRemove } from "firebase/firestore";
import { Link } from "react-router-dom";
import "../styles/pages/Home.css";

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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Загрузка мероприятий...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Все мероприятия</h1>
        {user && (
          <Link to="/create" className="create-event-link">
            + Создать мероприятие
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3 className="empty-title">Мероприятий пока нет</h3>
          <p className="empty-description">
            Будьте первым, кто создаст мероприятие!
          </p>
          {user && (
            <Link to="/create" className="create-first-event-link">
              Создать первое мероприятие
            </Link>
          )}
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                {user && user.uid === event.creatorId && (
                  <span className="organizer-badge">🎯 Организатор</span>
                )}
              </div>

              <p className="event-description">{event.description}</p>

              <div className="event-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div>
                    <div className="detail-label">Дата и время</div>
                    <div className="detail-value">
                      {event.date} {event.time}
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <div>
                    <div className="detail-label">Место</div>
                    <div className="detail-value">{event.location}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">👥</span>
                  <div>
                    <div className="detail-label">Участников</div>
                    <div className="detail-value">
                      {event.participantsCount || 0}
                    </div>
                  </div>
                </div>
              </div>

              <div className="event-footer">
                <span className="organizer-info">
                  Организатор: {event.creatorEmail}
                </span>

                <div className="action-buttons">
                  {user && user.uid === event.creatorId ? (
                    <span className="organizer-text">Вы организатор</span>
                  ) : user && isUserParticipating(event) ? (
                    <button
                      onClick={() => handleLeaveEvent(event.id)}
                      className="leave-button"
                    >
                      Отписаться
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={!user}
                      className={`join-button ${!user ? "disabled" : ""}`}
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
