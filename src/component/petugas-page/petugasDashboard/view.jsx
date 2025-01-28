import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login"; 
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <h1>Welcome</h1>
      <div>Petugas Dashboard Content</div>
    </>
  );
}
