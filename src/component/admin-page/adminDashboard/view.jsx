import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  useEffect(() => {
    // Jika tidak ada autentikasi, arahkan ke /login
    if (!isAuthenticated) {
      // Navigasi hanya sekali
      window.location.href = "/login"; // Alternatif: gunakan `Navigate`
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <h1>hidaaa</h1>
      <div>Admin Dashboard Content</div>
    </>
  );
}
