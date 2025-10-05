import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

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
    return <div>Загрузка профиля...</div>;
  }
  return (
    <div style={{ margin: "15px" }}>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <h2>Мой профиль</h2>
      </div>
      <div style={{ marginTop: "15px" }}>
        <p>Имя: {userData?.displayName || "Не указано"}</p>
        <p>О себе: {userData?.bio || "Не указано"}</p>
        <p>Телефон: {userData?.phone || "Не указано"}</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
}

export default Profile;
