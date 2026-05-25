import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import POSPage from "../pages/POSPage";

// blocks access if no access token in memory
function ProtectedRoute({ children }) {
  const isAuthenticated = !!window.__accessToken;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* protected — only accessible when logged in */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <POSPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;