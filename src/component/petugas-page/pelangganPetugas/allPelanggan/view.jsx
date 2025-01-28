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
    TextField,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { deletePelanggan, editPelanggan, fetchPelanggan } from '../../../../store/endpoint/petugas/pelangganPetugas/pelangganEnd';


export default function GetAllPelangganPetugas() {
    const [pelanggan, setPelanggan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPelangganId, setSelectedPelangganId] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ NamaPelanggan: '', Alamat: '', NomorTelepon: '' });

    useEffect(() => {
        const getPelanggan = async () => {
            try {
                const data = await fetchPelanggan();
                setPelanggan(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getPelanggan();
    }, []);

    const handleEdit = (pelangganId) => {
        const pelangganToEdit = pelanggan.find((p) => p.PelangganID === pelangganId);
        setFormData({
            NamaPelanggan: pelangganToEdit.NamaPelanggan,
            Alamat: pelangganToEdit.Alamat,
            NomorTelepon: pelangganToEdit.NomorTelepon,
        });
        setSelectedPelangganId(pelangganId);
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            const updatedPelanggan = await editPelanggan(selectedPelangganId, formData);
            setPelanggan((prevPelanggan) =>
                prevPelanggan.map((p) =>
                    p.PelangganID === selectedPelangganId ? updatedPelanggan : p
                )
            );
            setSnackbar({ open: true, message: 'Pelanggan updated successfully', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update pelanggan: ' + error.message, severity: 'error' });
        } finally {
            setEditDialogOpen(false);
            setSelectedPelangganId(null);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePelanggan(selectedPelangganId);
            setPelanggan((prevPelanggan) => prevPelanggan.filter((p) => p.PelangganID !== selectedPelangganId));
            setSnackbar({ open: true, message: 'Pelanggan deleted successfully', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to delete pelanggan: ' + error.message, severity: 'error' });
        } finally {
            setDialogOpen(false);
            setSelectedPelangganId(null);
        }
    };

    const openDeleteDialog = (pelangganId) => {
        setSelectedPelangganId(pelangganId);
        setDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDialogOpen(false);
        setSelectedPelangganId(null);
    };

    const headerCellStyle = {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1.1rem',
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

    return (
        <Box p={2}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerCellStyle}>ID</TableCell>
                            <TableCell sx={headerCellStyle}>Nama</TableCell>
                            <TableCell sx={headerCellStyle}>Alamat</TableCell>
                            <TableCell sx={headerCellStyle}>Nomor Telepon</TableCell>
                            <TableCell sx={headerCellStyle}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pelanggan.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Tidak ada pelanggan tersedia</TableCell>
                            </TableRow>
                        ) : (
                            pelanggan.map((p) => (
                                <TableRow key={p.PelangganID}>
                                    <TableCell sx={{ textAlign: 'center' }}>{p.PelangganID}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{p.NamaPelanggan}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{p.Alamat}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{p.NomorTelepon}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton onClick={() => handleEdit(p.PelangganID)} color="primary">
                                            <Edit sx={{ color: 'teal' }} />
                                        </IconButton>
                                        <IconButton onClick={() => openDeleteDialog(p.PelangganID)} color="secondary">
                                            <Delete sx={{ color: 'red' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for editing pelanggan */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Pelanggan</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nama Pelanggan"
                        value={formData.NamaPelanggan}
                        onChange={(e) => setFormData({ ...formData, NamaPelanggan: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Alamat"
                        value={formData.Alamat}
                        onChange={(e) => setFormData({ ...formData, Alamat: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nomor Telepon"
                        value={formData.NomorTelepon}
                        onChange={(e) => setFormData({ ...formData, NomorTelepon: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">Batal</Button>
                    <Button onClick={handleEditSubmit} color="primary">Simpan</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for delete confirmation */}
            <Dialog open={dialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Hapus Pelanggan</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">Batal</Button>
                    <Button onClick={handleDelete} color="secondary">Hapus</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
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
