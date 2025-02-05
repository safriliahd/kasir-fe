import { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    IconButton,
    Snackbar,
    Alert,
    Button,
    TablePagination,
    TextField,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid
} from '@mui/material';
import { ExpandMore, ExpandLess, Delete } from '@mui/icons-material';
import { deleteOrderByPenjualanID, fetchAllPenjualanAPI, fetchDetailPenjualanById } from '../../../../store/endpoint/petugas/order-penjualan-detail/orderPD';
import { teal } from '@mui/material/colors';

export default function AllPenjualanPagePetugas() {
    const [penjualan, setPenjualan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [expandedPenjualanId, setExpandedPenjualanId] = useState(null);
    const [filterDate, setFilterDate] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPenjualanId, setSelectedPenjualanId] = useState(null);
    const [detailPenjualan, setDetailPenjualan] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllPenjualanAPI();
                setPenjualan(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleFilterChange = (event) => {
        setFilterDate(event.target.value);
    };

    const toggleDetail = async (penjualanId) => {
        if (expandedPenjualanId === penjualanId) {
            setExpandedPenjualanId(null);
            setDetailPenjualan(null); // Reset detail ketika ditutup
        } else {
            try {
                const detail = await fetchDetailPenjualanById(penjualanId); // Ambil detail penjualan
                console.log(detail); // Cek apakah detail berisi ProdukID dan Jumlah
                setDetailPenjualan(detail); // Simpan detail
                setExpandedPenjualanId(penjualanId); // Set ID yang sedang diperluas
            } catch (error) {
                setSnackbar({ open: true, message: 'Error fetching detail penjualan: ' + error.message, severity: 'error' });
            }
        }
    };

    const handleOpenDialog = (penjualanId) => {
        setSelectedPenjualanId(penjualanId);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPenjualanId(null);
    };

    const handleDelete = async () => {
        if (selectedPenjualanId) {
            try {
                await deleteOrderByPenjualanID(selectedPenjualanId);
                setPenjualan(penjualan.filter((p) => p.PenjualanID !== selectedPenjualanId));
                setSnackbar({ open: true, message: 'Penjualan berhasil dihapus', severity: 'success' });
            } catch (error) {
                setSnackbar({ open: true, message: 'Error deleting penjualan: ' + error.message, severity: 'error' });
            }
        }
        handleCloseDialog();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography variant="h6" color="error">Error: {error}</Typography>;
    }

    const filteredPenjualan = filterDate
        ? penjualan.filter((p) => new Date(p.TanggalPenjualan).toISOString().split('T')[0] === filterDate)
        : penjualan;

    // Kelompokkan produk berdasarkan ProdukID dan jumlahkan
    const groupedProducts = detailPenjualan?.detailPenjualan.reduce((acc, item) => {
        const existingProduct = acc.find(p => p.produk.ProdukID === item.produk.ProdukID);
        if (existingProduct) {
            existingProduct.JumlahProduk += item.JumlahProduk; // Menambahkan jumlah jika produk sudah ada
        } else {
            acc.push({ ...item }); // Menambah produk baru jika belum ada
        }
        return acc;
    }, []);

    const headerCellStyle = {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1.1rem',
    };

    return (
        <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Rekap Penjualan</Typography>
                <TextField
                    label="Filter Tanggal"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filterDate}
                    onChange={handleFilterChange}
                    sx={{ mb: 2 }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={headerCellStyle}>ID</TableCell>
                            <TableCell sx={headerCellStyle}>Tanggal</TableCell>
                            <TableCell sx={headerCellStyle}>Nama Pelanggan</TableCell>
                            <TableCell sx={headerCellStyle}>Total Harga</TableCell>
                            <TableCell sx={headerCellStyle}>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPenjualan.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
                            <>
                                <TableRow key={p.PenjualanID}>
                                    <TableCell align='center'>
                                        <IconButton onClick={() => toggleDetail(p.PenjualanID)}>
                                            {expandedPenjualanId === p.PenjualanID ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align='center'>{p.PenjualanID}</TableCell>
                                    <TableCell align='center'>{new Date(p.TanggalPenjualan).toLocaleDateString()}</TableCell>
                                    <TableCell align='center'>{p.Pelanggan?.NamaPelanggan || "Tidak Ada"}</TableCell>
                                    <TableCell align='center'>Rp {p.TotalHarga.toLocaleString()}</TableCell>
                                    <TableCell align='center'>
                                        <IconButton color="error" onClick={() => handleOpenDialog(p.PenjualanID)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Collapse in={expandedPenjualanId === p.PenjualanID} timeout="auto" unmountOnExit>
                                            <Box sx={{ padding: 2 }}>
                                                {detailPenjualan ? (
                                                    <div>
                                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                                            <Grid item xs={6}>
                                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Detail Penjualan</Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography variant="h6"  sx={{fontWeight: 'bold'}}>Daftar Produk</Typography>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container spacing={2}>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                sm={6}
                                                                sx={{
                                                                    p: 2,
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: 2,
                                                                }}
                                                            >
                                                                <TextField
                                                                    label="ID Produk"
                                                                    value={detailPenjualan?.PenjualanID || "Tidak Tersedia"}
                                                                    InputProps={{ readOnly: true }}
                                                                    variant="outlined"
                                                                    fullWidth
                                                                />

                                                                <TextField
                                                                    label="Tanggal Penjualan"
                                                                    value={detailPenjualan?.TanggalPenjualan
                                                                        ? new Date(detailPenjualan.TanggalPenjualan).toLocaleDateString('id-ID', {
                                                                            weekday: 'long',
                                                                            day: '2-digit',
                                                                            month: 'long',
                                                                            year: 'numeric',
                                                                        })
                                                                        : "Tidak Tersedia"}
                                                                    InputProps={{ readOnly: true }}
                                                                    variant="outlined"
                                                                    fullWidth
                                                                />

                                                                <TextField
                                                                    label="Nama Pelanggan"
                                                                    value={detailPenjualan?.Pelanggan?.NamaPelanggan || "Tidak Tersedia"}
                                                                    InputProps={{ readOnly: true }}
                                                                    variant="outlined"
                                                                    fullWidth
                                                                />

                                                                <TextField
                                                                    label="Total Harga"
                                                                    value={`Rp ${detailPenjualan?.TotalHarga?.toLocaleString() || "0"}`}
                                                                    InputProps={{ readOnly: true }}
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    sx={{
                                                                        fontWeight: "bold",
                                                                        "& .MuiInputBase-input": { color: teal[500] }
                                                                    }}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={6}>
                                                                {groupedProducts?.map((item) => (
                                                                    <Box
                                                                        key={item.DetailID}
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            mb: 2,
                                                                            p: 1,
                                                                            borderRadius: 1,
                                                                            border: '1px solid #ccc',  
                                                                            bgcolor: 'background.paper',
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={item.produk?.FotoProduk}
                                                                            alt={item.produk?.NamaProduk}
                                                                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, marginRight: 10 }}
                                                                        />
                                                                        <Box sx={{ flex: 1 }}>
                                                                            <Typography fontWeight="bold">{item.produk?.NamaProduk}</Typography>
                                                                            <Typography variant="body2">Jumlah: {item.JumlahProduk}</Typography>
                                                                            <Typography variant="body2">Subtotal: Rp {item.Subtotal.toLocaleString()}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                ))}
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                ) : (
                                                    <CircularProgress size={24} />
                                                )}
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>

                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={filteredPenjualan.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menghapus penjualan ini?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Batal</Button>
                    <Button onClick={handleDelete} color="error">Hapus</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
