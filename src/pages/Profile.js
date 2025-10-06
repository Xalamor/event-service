import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../styles/pages/Profile.css";

function Profile({ user }) {
  const [userData, setUserData] = useState(null);
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
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
      setLoading(false);
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className={`profile-header ${isMobile ? "mobile" : ""}`}>
        <h2 className="profile-title">Мой профиль</h2>
        <Link
          to="/edit-profile"
          className={`edit-profile-btn ${isMobile ? "mobile" : ""}`}
          onMouseOver={
            isMobile
              ? undefined
              : (e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
                }
          }
          onMouseOut={
            isMobile
              ? undefined
              : (e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
          }
        >
          Редактировать профиль
        </Link>
      </div>

      <div className={`profile-content ${isMobile ? "mobile" : ""}`}>
        <div className={`profile-avatar-section ${isMobile ? "mobile" : ""}`}>
          <div className="profile-avatar">
            {userData?.displayName
              ? userData.displayName.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">
              {userData?.displayName || "Пользователь"}
            </h3>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className={`profile-detail-item ${isMobile ? "mobile" : ""}`}>
            <div className="detail-label">Имя:</div>
            <div className="detail-value">
              {userData?.displayName || "Не указано"}
            </div>
          </div>

          <div className={`profile-detail-item ${isMobile ? "mobile" : ""}`}>
            <div className="detail-label">О себе:</div>
            <div className="detail-value">{userData?.bio || "Не указано"}</div>
          </div>

          <div className={`profile-detail-item ${isMobile ? "mobile" : ""}`}>
            <div className="detail-label">Телефон:</div>
            <div className="detail-value">
              {userData?.phone || "Не указано"}
            </div>
          </div>

          <div className={`profile-detail-item ${isMobile ? "mobile" : ""}`}>
            <div className="detail-label">Email:</div>
            <div className="detail-value">{user.email}</div>
          </div>
        </div>

        {isMobile && (
          <div className="mobile-actions">
            <Link to="/myevents" className="mobile-action-btn primary">
              Мои мероприятия
            </Link>
            <Link to="/device-service" className="mobile-action-btn secondary">
              На главную
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
