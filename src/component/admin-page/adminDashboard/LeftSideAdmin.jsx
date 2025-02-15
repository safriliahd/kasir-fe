import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, TextField, Box, FormControl, FormLabel } from "@mui/material";
import { teal } from "@mui/material/colors";
import { fetchAllPenjualanAPIAdmin } from "../../../store/endpoint/penjualan/penjualanEnd";

export default function LeftSideAdmin() {
    const [totalPenjualan, setTotalPenjualan] = useState(0);
    const [totalPemasukan, setTotalPemasukan] = useState(0);
    const [selectedDate, setSelectedDate] = useState("");
    const [noData, setNoData] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, [selectedDate]);

    const fetchDashboardData = async () => {
        try {
            const penjualan = await fetchAllPenjualanAPIAdmin();
            let filteredPenjualan = penjualan;

            if (selectedDate) {
                filteredPenjualan = penjualan.filter(item => {
                    const date = new Date(item.TanggalPenjualan).toISOString().split('T')[0];
                    return date === selectedDate;
                });
            }

            setTotalPenjualan(filteredPenjualan.length);
            const totalHarga = filteredPenjualan.reduce((acc, item) => acc + parseFloat(item.TotalHarga || 0), 0);
            setTotalPemasukan(totalHarga);
            setNoData(filteredPenjualan.length === 0);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
                {/* Filter Tanggal (Kiri) */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <FormLabel sx={{ color: teal[700], fontWeight: "bold", mb: 1 }}>Pilih Tanggal</FormLabel>
                        <TextField
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            sx={{
                                width: "100%",
                                "& .MuiInputBase-root": {
                                    backgroundColor: "#fff",
                                    borderRadius: "10px",
                                    border: `2px solid ${teal[500]}`,
                                    padding: "8px",
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: teal[500],
                                    },
                                    "&:hover fieldset": {
                                        borderColor: teal[700],
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: teal[900],
                                    }
                                },
                                "& .MuiInputBase-input": {
                                    padding: "10px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                }
                            }}
                        />
                    </FormControl>
                </Grid>

                {/* Total Penjualan & Pemasukan */}
                <Grid item xs={12} sm={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ width: "100%", boxShadow: 3, backgroundColor: teal[500] }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 'bold', color: 'white'}}>Total Penjualan</Typography>
                                    {noData ? (
                                        <Typography variant="h6" sx={{ color: "white", textAlign: "end", mt: 1 }}>
                                            Tidak Ada Data
                                        </Typography>
                                    ) : (
                                        <Typography variant="h5" sx={{textAlign: 'end', color: 'white', fontWeight: 'bold',}}>{totalPenjualan}</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ width: "100%", boxShadow: 3, backgroundColor: teal[500] }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 'bold', color: 'white' }}>Total Pemasukan</Typography>
                                    {noData ? (
                                        <Typography variant="h6" sx={{ color: "white", textAlign: "end", mt: 1 }}>
                                            Tidak Ada Data
                                        </Typography>
                                    ) : (
                                        <Typography variant="h5" sx={{textAlign: 'end', color: 'white', fontWeight: 'bold'}}>
                                            Rp {new Intl.NumberFormat('id-ID').format(totalPemasukan)}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
