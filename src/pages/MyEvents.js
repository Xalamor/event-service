import React, { useState, useEffect } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../styles/pages/MyEvent.css";

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Загрузка мероприятий...</p>
      </div>
    );
  }

  return (
    <div className="my-events-container">
      <h2 className="page-title">Мои мероприятия</h2>

      {/* Секция "Я создал" */}
      <section className="events-section">
        <div className="section-header">
          <h3 className="section-title">Я создал</h3>
          <span className="events-count">{createdEvents.length}</span>
        </div>

        {createdEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <p className="empty-text">
              Вы еще не создали ни одного мероприятия
            </p>
            <Link to="/create" className="create-link">
              Создать мероприятие
            </Link>
          </div>
        ) : (
          <div className="events-grid">
            {createdEvents.map((event) => (
              <div
                key={event.id}
                className={`event-card ${!isMobile ? "hoverable" : ""}`}
              >
                <div className="event-header">
                  <h4 className="event-title">{event.title}</h4>
                  <span className="organizer-badge">Организатор</span>
                </div>

                <p className="event-description">{event.description}</p>

                <div className="event-details">
                  <div className="detail-item">
                    <div className="detail-label">📅 Дата и время</div>
                    <div className="detail-value">
                      {event.date} {event.time}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">📍 Место</div>
                    <div className="detail-value">{event.location}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">👥 Участников</div>
                    <div className="detail-value">
                      {event.participants?.length || 0}
                    </div>
                  </div>
                </div>

                <div className="event-actions">
                  <button
                    onClick={() =>
                      handleShowParticipants(event.id, event.participants || [])
                    }
                    className="btn btn-primary"
                    disabled={loadingParticipants}
                  >
                    {loadingParticipants && showParticipants === event.id
                      ? "Загрузка..."
                      : "👥 Участники"}
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="btn btn-danger"
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
      <section className="events-section">
        <div className="section-header">
          <h3 className="section-title">Я участвую</h3>
          <span className="events-count">{participatingEvents.length}</span>
        </div>

        {participatingEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌟</div>
            <p className="empty-text">
              Вы еще не участвуете ни в одном мероприятии
            </p>
          </div>
        ) : (
          <div className="events-grid">
            {participatingEvents.map((event) => (
              <div
                key={event.id}
                className={`event-card ${!isMobile ? "hoverable" : ""}`}
              >
                <h4 className="event-title">{event.title}</h4>

                <p className="event-description">{event.description}</p>

                <div className="event-details">
                  <div className="detail-item">
                    <div className="detail-label">📅 Дата и время</div>
                    <div className="detail-value">
                      {event.date} {event.time}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">📍 Место</div>
                    <div className="detail-value">{event.location}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">👤 Организатор</div>
                    <div className="detail-value">{event.creatorEmail}</div>
                  </div>
                </div>

                {event.creatorId === user.uid && (
                  <button
                    onClick={() =>
                      handleShowParticipants(event.id, event.participants || [])
                    }
                    className="btn btn-primary btn-small"
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
          <div className="modal-overlay" onClick={handleCloseModal} />
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Участники мероприятия</h3>
              <button onClick={handleCloseModal} className="close-button">
                ✕
              </button>
            </div>

            {participantsList.length === 0 ? (
              <div className="empty-participants">
                <div className="empty-icon">👥</div>
                <p className="empty-text">
                  У этого мероприятия пока нет участников
                </p>
              </div>
            ) : (
              <ul className="participants-list">
                {participantsList.map((participant) => (
                  <li key={participant.id} className="participant-item">
                    <div className="participant-info">
                      <strong className="participant-email">
                        {participant.email}
                      </strong>
                      {participant.displayName && (
                        <span className="participant-name">
                          {participant.displayName}
                        </span>
                      )}
                    </div>
                    <span className="participant-badge">Участник</span>
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
