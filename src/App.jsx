import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routes/adminRoutes";
import PetugasRoutes from "./routes/petugasRoutes";
// import LoginPage from './component/authentication/signIn';  // Halaman Login
import LoginPageUI from './component/authentication/signIn';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Cek apakah user sudah login dari sessionStorage
    const loggedIn = sessionStorage.getItem('isAuthenticated');
    const userRole = sessionStorage.getItem('role');
    if (loggedIn) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rute untuk halaman login */}
        {!isAuthenticated && <Route path="/login" element={<LoginPageUI />} />}
        
        {/* Rute untuk Admin */}
        {isAuthenticated && role === "ADMIN" && <Route path="/admin/*" element={<AdminRoutes />} />}
        
        {/* Rute untuk Petugas */}
        {isAuthenticated && role === "PETUGAS" && <Route path="/petugas/*" element={<PetugasRoutes />} />}

        {/* Redirect ke halaman login jika belum login */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to={role === "ADMIN" ? "/admin/dashboard" : "/petugas"} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
