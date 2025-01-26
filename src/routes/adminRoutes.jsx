import { Routes, Route } from "react-router-dom";
import AdminSidebarPage from "../component/admin-page/adminSidebar/view";
import AdminDashboard from "../component/admin-page/adminDashboard/view";
import PelangganPage from "../component/admin-page/pelangganPage/view";
import OrderPage from "../component/admin-page/orderPage/view";
import PenjualanPage from "../component/admin-page/penjualanPage/view";
import ProdukPage from "../component/admin-page/produkPage/view";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminSidebarPage />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="pelanggan" element={<PelangganPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="penjualan" element={<PenjualanPage />} />
        <Route path="produk" element={<ProdukPage />} />
      </Route>
    </Routes>
  );
}

