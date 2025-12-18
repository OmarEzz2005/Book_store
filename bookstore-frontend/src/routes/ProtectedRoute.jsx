import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ currentUser, role, children }) {
  // Not logged in
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role
  if (role && currentUser.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
