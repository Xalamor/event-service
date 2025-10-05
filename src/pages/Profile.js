import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function Profile({ user }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        padding: "40px",
        maxWidth: "600px",
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
          paddingBottom: "20px",
          borderBottom: "2px solid #f1f3f4",
        }}
      >
        <h2
          style={{
            color: "#2c3e50",
            fontSize: "28px",
            fontWeight: "600",
            margin: 0,
          }}
        >
          Мой профиль
        </h2>
        <Link
          to="/edit-profile"
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "500",
            fontSize: "14px",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Редактировать профиль
        </Link>
      </div>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e1e8ed",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "25px",
            paddingBottom: "20px",
            borderBottom: "1px solid #f1f3f4",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "600",
              marginRight: "20px",
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
                fontSize: "20px",
              }}
            >
              {userData?.displayName || "Пользователь"}
            </h3>
            <p
              style={{
                margin: 0,
                color: "#7f8c8d",
                fontSize: "14px",
              }}
            >
              {user.email}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                minWidth: "100px",
                fontWeight: "600",
                color: "#2c3e50",
              }}
            >
              Имя:
            </div>
            <div style={{ color: "#34495e" }}>
              {userData?.displayName || "Не указано"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                minWidth: "100px",
                fontWeight: "600",
                color: "#2c3e50",
              }}
            >
              О себе:
            </div>
            <div style={{ color: "#34495e", lineHeight: "1.5" }}>
              {userData?.bio || "Не указано"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                minWidth: "100px",
                fontWeight: "600",
                color: "#2c3e50",
              }}
            >
              Телефон:
            </div>
            <div style={{ color: "#34495e" }}>
              {userData?.phone || "Не указано"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                minWidth: "100px",
                fontWeight: "600",
                color: "#2c3e50",
              }}
            >
              Email:
            </div>
            <div style={{ color: "#34495e" }}>{user.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
