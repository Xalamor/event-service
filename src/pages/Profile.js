import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          flexDirection: "column",
          gap: "20px",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
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
            textAlign: "center",
          }}
        >
          Загрузка профиля...
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
        maxWidth: "600px",
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
          paddingBottom: "clamp(15px, 3vw, 20px)",
          borderBottom: "2px solid #f1f3f4",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "15px" : "0",
        }}
      >
        <h2
          style={{
            color: "#2c3e50",
            fontSize: "clamp(24px, 6vw, 28px)",
            fontWeight: "600",
            margin: 0,
            textAlign: isMobile ? "center" : "left",
            width: isMobile ? "100%" : "auto",
          }}
        >
          Мой профиль
        </h2>
        <Link
          to="/edit-profile"
          style={{
            padding: "clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "500",
            fontSize: "clamp(13px, 3vw, 14px)",
            transition: isMobile
              ? "none"
              : "transform 0.2s ease, box-shadow 0.2s ease",
            display: "block",
            textAlign: "center",
            width: isMobile ? "100%" : "auto",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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

      <div
        style={{
          background: "white",
          padding: "clamp(20px, 4vw, 30px)",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e1e8ed",
          margin: isMobile ? "0 10px" : "0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "clamp(20px, 4vw, 25px)",
            paddingBottom: "clamp(15px, 3vw, 20px)",
            borderBottom: "1px solid #f1f3f4",
            flexDirection: isMobile ? "column" : "row",
            textAlign: isMobile ? "center" : "left",
            gap: isMobile ? "15px" : "0",
          }}
        >
          <div
            style={{
              width: "clamp(50px, 10vw, 60px)",
              height: "clamp(50px, 10vw, 60px)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "clamp(18px, 4vw, 20px)",
              fontWeight: "600",
              marginRight: isMobile ? "0" : "20px",
              flexShrink: 0,
            }}
          >
            {userData?.displayName
              ? userData.displayName.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 5px 0",
                color: "#2c3e50",
                fontSize: "clamp(18px, 4vw, 20px)",
                lineHeight: 1.3,
              }}
            >
              {userData?.displayName || "Пользователь"}
            </h3>
            <p
              style={{
                margin: 0,
                color: "#7f8c8d",
                fontSize: "clamp(13px, 3vw, 14px)",
                wordBreak: "break-word",
              }}
            >
              {user.email}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gap: "clamp(15px, 3vw, 20px)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "clamp(12px, 3vw, 15px)",
              background: "#f8f9fa",
              borderRadius: "8px",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "8px" : "0",
            }}
          >
            <div
              style={{
                minWidth: isMobile ? "auto" : "100px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "clamp(14px, 3vw, 16px)",
              }}
            >
              Имя:
            </div>
            <div
              style={{
                color: "#34495e",
                fontSize: "clamp(14px, 3vw, 16px)",
                wordBreak: "break-word",
              }}
            >
              {userData?.displayName || "Не указано"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "clamp(12px, 3vw, 15px)",
              background: "#f8f9fa",
              borderRadius: "8px",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "8px" : "0",
            }}
          >
            <div
              style={{
                minWidth: isMobile ? "auto" : "100px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "clamp(14px, 3vw, 16px)",
              }}
            >
              О себе:
            </div>
            <div
              style={{
                color: "#34495e",
                lineHeight: "1.5",
                fontSize: "clamp(14px, 3vw, 16px)",
                wordBreak: "break-word",
              }}
            >
              {userData?.bio || "Не указано"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "clamp(12px, 3vw, 15px)",
              background: "#f8f9fa",
              borderRadius: "8px",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "8px" : "0",
              alignItems: isMobile ? "flex-start" : "center",
            }}
          >
            <div
              style={{
                minWidth: isMobile ? "auto" : "100px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "clamp(14px, 3vw, 16px)",
              }}
            >
              Телефон:
            </div>
            <div
              style={{
                color: "#34495e",
                fontSize: "clamp(14px, 3vw, 16px)",
                wordBreak: "break-word",
              }}
            >
              {userData?.phone || "Не указано"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "clamp(12px, 3vw, 15px)",
              background: "#f8f9fa",
              borderRadius: "8px",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "8px" : "0",
              alignItems: isMobile ? "flex-start" : "center",
            }}
          >
            <div
              style={{
                minWidth: isMobile ? "auto" : "100px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "clamp(14px, 3vw, 16px)",
              }}
            >
              Email:
            </div>
            <div
              style={{
                color: "#34495e",
                fontSize: "clamp(14px, 3vw, 16px)",
                wordBreak: "break-word",
              }}
            >
              {user.email}
            </div>
          </div>
        </div>

        {/* Дополнительные действия для мобильных */}
        {isMobile && (
          <div
            style={{
              marginTop: "25px",
              paddingTop: "20px",
              borderTop: "1px solid #f1f3f4",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Link
              to="/myevents"
              style={{
                padding: "12px 20px",
                background: "transparent",
                color: "#667eea",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "14px",
                border: "2px solid #667eea",
                textAlign: "center",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#667eea";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#667eea";
              }}
            >
              Мои мероприятия
            </Link>

            <Link
              to="/"
              style={{
                padding: "12px 20px",
                background: "transparent",
                color: "#7f8c8d",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "14px",
                border: "2px solid #f1f3f4",
                textAlign: "center",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#f1f3f4";
                e.target.style.color = "#2c3e50";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#7f8c8d";
              }}
            >
              На главную
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="padding: clamp(20px, 5vw, 40px)"] {
            padding: 15px 10px !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="padding: clamp(20px, 4vw, 30px)"] {
            padding: 15px !important;
          }

          div[style*="display: flex"] {
            padding: 10px !important;
          }
        }

        @media (max-width: 360px) {
          div[style*="padding: clamp(20px, 5vw, 40px)"] {
            padding: 10px !important;
          }

          div[style*="padding: clamp(20px, 4vw, 30px)"] {
            padding: 12px !important;
          }
        }

        /* Улучшение для очень маленьких экранов */
        @media (max-width: 320px) {
          h2 {
            font-size: 22px !important;
          }

          div[style*="width: clamp(50px, 10vw, 60px)"] {
            width: 45px !important;
            height: 45px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
