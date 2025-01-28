import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routes/adminRoutes";
import PetugasRoutes from "./routes/petugasRoutes";
import LoginPageUI from './component/authentication/signIn';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isAuthenticated') === 'true';
    const userRole = sessionStorage.getItem('role');

    if (loggedIn) {
      setIsAuthenticated(true);
      setRole(userRole || null);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // This will run once when the component is mounted

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Loading state while checking authentication
  }

  return (
    <Router>
      <Routes>
        {/* If not authenticated, show login page */}
        {!isAuthenticated && <Route path="/login" element={<LoginPageUI />} />}
        
        {/* If authenticated and role is ADMIN, show AdminRoutes */}
        {isAuthenticated && role === "ADMIN" && <Route path="/admin/*" element={<AdminRoutes />} />}
        
        {/* If authenticated and role is PETUGAS, show PetugasRoutes */}
        {isAuthenticated && role === "PETUGAS" && <Route path="/petugas/*" element={<PetugasRoutes />} />}
        
        {/* Default route, navigate based on role if authenticated */}
        <Route
          path="*"
          element={isAuthenticated ? (
            <Navigate to={role === "ADMIN" ? "/admin/dashboard" : "/petugas/dashboard"} replace />
          ) : (
            <Navigate to="/login" replace />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
