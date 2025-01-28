import { Routes, Route } from "react-router-dom";
import PetugasSidebarPage from "../component/petugas-page/petugasSidebar/view";
import DashboardPagePetugas from "../component/petugas-page/petugasDashboard/view";
import PelangganPagePetugas from "../component/petugas-page/pelangganPetugas/view";
import OrderPagePetugas from "../component/petugas-page/orderPetugas/view";
import PenjualanPagePetugas from "../component/petugas-page/penjualanPetugas/view";
import ProdukPagePetugas from "../component/petugas-page/produkPetugas/view";

function PetugasRoutes() {
  return (
     <Routes>
          <Route path="/" element={<PetugasSidebarPage />}>
            <Route path="dashboard" element={<DashboardPagePetugas />} />
            <Route path="pelanggan" element={<PelangganPagePetugas />} />
            <Route path="orders" element={<OrderPagePetugas />} />
            <Route path="penjualan" element={<PenjualanPagePetugas />} />
            <Route path="produk" element={<ProdukPagePetugas />} />
            {/* <Route path="add-pelanggan" element={<AddPelanggan />} />
            <Route path="add-produk" element={<AddProdukPage />} /> */}
          </Route>
        </Routes>
  );
}

export default PetugasRoutes;
