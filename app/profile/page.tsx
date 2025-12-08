import ProfilePage from "@/components/pages/ProfilePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
