import { Routes, Route } from "react-router-dom";

function PetugasRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Halaman Petugas</h1>} />
      <Route path="/tasks" element={<h1>Tugas Petugas</h1>} />
    </Routes>
  );
}

export default PetugasRoutes;
