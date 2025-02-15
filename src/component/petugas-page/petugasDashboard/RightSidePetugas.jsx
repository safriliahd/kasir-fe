import { useState, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { teal } from "@mui/material/colors";
import { fetchAllPenjualanAPI } from "../../../store/endpoint/petugas/order-penjualan-detail/orderPD";

export default function RightSideAdmin() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      const penjualan = await fetchAllPenjualanAPI();
  
      const filteredData = penjualan.filter((item) => {
        const date = new Date(item.TanggalPenjualan);
        return (
          date.getMonth() + 1 === Number(selectedMonth) &&
          date.getFullYear() === Number(selectedYear)
        );
      });
  
      const groupedData = filteredData.reduce((acc, item) => {
        const date = new Date(item.TanggalPenjualan).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + parseFloat(item.TotalHarga || 0);
        return acc;
      }, {});
  
      const formattedData = Object.entries(groupedData).map(([date, total]) => ({
        date,
        Total: total, 
      }));
  
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching penjualan data:", error);
    }
  };


  const namaBulan = new Date(2000, selectedMonth - 1).toLocaleString("id-ID", { month: "long" });

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: teal[700] }}>
          Grafik Penjualan {chartData.length > 0 ? `(${namaBulan})` : ""}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField select label="Bulan" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} sx={{ minWidth: 120 }}>
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString("id-ID", { month: "long" })}
              </MenuItem>
            ))}
          </TextField>

          <TextField select label="Tahun" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} sx={{ minWidth: 120 }}>
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <MenuItem key={year} value={year}>{year}</MenuItem>;
            })}
          </TextField>
        </Box>
      </Box>

      {chartData.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "gray", mt: 4 }}>
          Tidak ada data penjualan untuk bulan ini.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke={teal[700]} />
            <YAxis stroke={teal[700]} />
            <Tooltip />
            <Bar dataKey="Total" fill={teal[500]} barSize={40} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
