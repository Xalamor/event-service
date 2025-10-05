import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Загрузка...</div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header user={user} />
        <Routes>
          <Route path="/event-service" element={<Home user={user} />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/event-service" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/event-service" />}
          />
          <Route
            path="/create"
            element={
              user ? <CreateEvent user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/myevents"
            element={user ? <MyEvents user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/edit-profile" element={<EditProfile user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
