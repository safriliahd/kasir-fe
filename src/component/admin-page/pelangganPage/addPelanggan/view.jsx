import { TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { light, teal } from '../../../../theme/color';
import { createPelangganApi } from '../../../../store/endpoint/pelanggan/pelangganEnd';

export default function AddPelanggan() {
    const [formData, setFormData] = useState({
        NamaPelanggan: '',
        Alamat: '',
        NomorTelepon: '',
    });
    const [loading, setLoading] = useState(false); // To track the loading state
    const [error, setError] = useState(''); // To track any error messages
    const [openDialog, setOpenDialog] = useState(false); // To control the dialog visibility
    const navigate = useNavigate(); // Inisialisasi navigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true); // Start loading when submitting
        setError(''); // Reset error state
        try {
            const pelanggan = await createPelangganApi(formData.NamaPelanggan, formData.Alamat, formData.NomorTelepon);
            console.log('Pelanggan created:', pelanggan);
            setOpenDialog(true); // Open the dialog when the customer is successfully created
        } catch (error) {
            setError(error.message); // Set error message if creation fails
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleCancel = () => {
        // Navigasi kembali ke halaman sebelumnya
        navigate(-1); // Ini akan membawa pengguna ke halaman sebelumnya
    };

    const handleDialogClose = () => {
        navigate(-1); // Navigate back to the previous page when "Done" is clicked
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Add New Pelanggan</Typography>
            <TextField
                label="Nama Pelanggan"
                name="NamaPelanggan"
                value={formData.NamaPelanggan}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Alamat"
                name="Alamat"
                value={formData.Alamat}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Nomor Telepon"
                name="NomorTelepon"
                value={formData.NomorTelepon}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            {error && <Typography color="error" mt={2}>{error}</Typography>} {/* Display error message */}
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading} // Disable button while loading
                    sx={{
                        backgroundColor: teal[500],
                        color: light[200], // Teks warna putih
                        '&:hover': {
                            backgroundColor: teal[300], // Warna background saat hover
                            color: light[100], // Teks tetap putih saat hover
                        }
                    }}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel} // Menambahkan tombol cancel
                    sx={{
                        ml: 2,
                        borderColor: teal[500],
                        color: teal[500], // Teks warna putih
                        '&:hover': {
                            borderColor: teal[300], // Warna background saat hover
                            color: teal[300], // Teks tetap putih saat hover
                        }
                    }}
                >
                    Cancel
                </Button>
            </Box>

            {/* Dialog Modal */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" align="center">
                        Data pelanggan telah berhasil ditambahkan!
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDialogClose}
                        sx={{
                            backgroundColor: teal[500],
                            color: light[200],
                            '&:hover': {
                                backgroundColor: teal[300],
                                color: light[100],
                            }
                        }}
                    >
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
