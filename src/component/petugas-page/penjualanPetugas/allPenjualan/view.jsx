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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TablePagination,
    TextField,
    Grid,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { deleteOrderByPenjualanID, fetchAllPenjualanAPI, fetchDetailPenjualanById } from '../../../../store/endpoint/petugas/order-penjualan-detail/orderPD';

export default function AllPenjualanPagePetugas() {
    const [penjualan, setPenjualan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPenjualanId, setSelectedPenjualanId] = useState(null);
    const [filterDate, setFilterDate] = useState('');
    const [detailPenjualan, setDetailPenjualan] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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

    const openDeleteDialog = (penjualanId) => {
        setSelectedPenjualanId(penjualanId);
        setDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDialogOpen(false);
        setSelectedPenjualanId(null);
    };

    const handleDelete = async () => {
        try {
            await deleteOrderByPenjualanID(selectedPenjualanId);
            setPenjualan((prevPenjualan) => prevPenjualan.filter((p) => p.PenjualanID !== selectedPenjualanId));
            setSnackbar({ open: true, message: 'Penjualan berhasil dihapus', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Gagal menghapus penjualan: ' + error.message, severity: 'error' });
        } finally {
            closeDeleteDialog();
        }
    };

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

    const openDetailDialog = async (penjualanId) => {
        try {
            const data = await fetchDetailPenjualanById(penjualanId);
            // console.log(data);
            setDetailPenjualan(data);
            setDialogOpen(true);
        } catch (error) {
            setSnackbar({ open: true, message: 'Error fetching detail penjualan: ' + error.message, severity: 'error' });
        }
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

    const headerCellStyle = {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1.1rem',
    };

    const filteredPenjualan = filterDate
        ? penjualan.filter((p) => new Date(p.TanggalPenjualan).toISOString().split('T')[0] === filterDate)
        : penjualan;

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
                            <TableCell sx={headerCellStyle}>ID</TableCell>
                            <TableCell sx={headerCellStyle}>Tanggal</TableCell>
                            <TableCell sx={headerCellStyle}>Nama Pelanggan</TableCell>
                            <TableCell sx={headerCellStyle}>Total Harga</TableCell>
                            <TableCell sx={headerCellStyle}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPenjualan.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Data tidak ditemukan
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPenjualan.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
                                <TableRow key={p.PenjualanID} onClick={() => openDetailDialog(p.PenjualanID)}>
                                    <TableCell align='center'>{p.PenjualanID}</TableCell>
                                    <TableCell align='center'>{new Date(p.TanggalPenjualan).toLocaleDateString()}</TableCell>
                                    <TableCell align='center'>{p.Pelanggan?.NamaPelanggan || "Tidak Ada"}</TableCell>
                                    <TableCell align='center'>Rp {p.TotalHarga.toLocaleString()}</TableCell>
                                    <TableCell >
                                        <IconButton onClick={() => openDeleteDialog(p.PenjualanID)} color="secondary">
                                            <Delete sx={{ color: 'red' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
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

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                {/* <DialogTitle>Detail Penjualan</DialogTitle> */}
                <DialogContent>
                    {detailPenjualan && (
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="h6">Informasi Penjualan</Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary="Tanggal" secondary={new Date(detailPenjualan.TanggalPenjualan).toLocaleDateString()} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Nama Pelanggan" secondary={detailPenjualan.Pelanggan?.NamaPelanggan || "Tidak Ada"} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Total Harga" secondary={`Rp ${detailPenjualan.TotalHarga.toLocaleString()}`} />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6">Produk</Typography>
                                <List>
                                    {detailPenjualan?.detailPenjualan?.length > 0 ? (
                                        detailPenjualan.detailPenjualan.map((item) => (
                                            <ListItem key={item.DetailID} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box
                                                    component="img"
                                                    src={item.produk.FotoProduk}
                                                    alt={item.produk.NamaProduk}
                                                    sx={{ width: 50, height: 50, objectFit: 'cover', marginRight: 2 }}
                                                />
                                                <ListItemText
                                                    primary={item.produk.NamaProduk}
                                                    secondary={`Jumlah: ${item.JumlahProduk}, Subtotal: Rp ${item.Subtotal.toLocaleString()}`}
                                                />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography variant="subtitle1" color="textSecondary">
                                            Tidak ada produk untuk penjualan ini
                                        </Typography>
                                    )}
                                </List>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">Tutup</Button>
                </DialogActions>
            </Dialog>


            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
