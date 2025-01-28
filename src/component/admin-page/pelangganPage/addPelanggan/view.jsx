import { TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { light, teal } from '../../../../theme/color';
import { createPelangganApi } from '../../../../store/endpoint/pelanggan/pelangganEnd';

export default function AddPelanggan() {
    const [formData, setFormData] = useState({
        NamaPelanggan: '',
        Alamat: '',
        NomorTelepon: '',
    });
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(''); 
    const [openDialog, setOpenDialog] = useState(false); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true); 
        setError(''); 
        try {
            const pelanggan = await createPelangganApi(formData.NamaPelanggan, formData.Alamat, formData.NomorTelepon);
            console.log('Pelanggan created:', pelanggan);
            setOpenDialog(true); 
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false); 
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleDialogClose = () => {
        navigate(-1);
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
            {error && <Typography color="error" mt={2}>{error}</Typography>} 
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading} 
                    sx={{
                        backgroundColor: teal[500],
                        color: light[200], 
                        '&:hover': {
                            backgroundColor: teal[300], 
                            color: light[100], 
                        }
                    }}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel} 
                    sx={{
                        ml: 2,
                        borderColor: teal[500],
                        color: teal[500], 
                        '&:hover': {
                            borderColor: teal[300], 
                            color: teal[300], 
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
