import React, { useState } from 'react';
import { TextField, Button, Typography, Card, CardContent, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom'; 
import { createProdukApi } from '../../../../store/endpoint/produk/produkEnd';
import { light, teal } from '../../../../theme/color';

const DragDropInput = ({ onDrop, photoPreview, photoName }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    return (
        <Box
            {...getRootProps()}
            sx={{
                border: '2px dashed',
                borderColor: teal[500],
                height: 300,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                '&:hover': { borderColor: teal[300] },
                bgcolor: isDragActive ? 'rgba(0, 128, 128, 0.1)' : 'transparent',
            }}
        >
            <input {...getInputProps()} />
            {!photoPreview ? (
                <Typography variant="body1" color="textSecondary">
                    {isDragActive ? 'Drop the file here...' : 'Drag and drop a file, or click to select one'}
                </Typography>
            ) : (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: teal[700] }}>
                        {photoName}
                    </Typography>
                    <img
                        src={photoPreview}
                        alt="Preview"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginTop: '8px',
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default function AddProdukPage() {
    const [formData, setFormData] = useState({
        NamaProduk: '',
        Harga: '',
        Stok: '',
        FotoProduk: null,
    });

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFormData((prev) => ({
                ...prev,
                FotoProduk: acceptedFiles[0],
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.NamaProduk || !formData.Harga || !formData.Stok || !formData.FotoProduk) {
            alert('Semua field harus diisi!');
            return;
        }
        setLoading(true);
        try {
            const form = new FormData();
            form.append('NamaProduk', formData.NamaProduk);
            form.append('Harga', formData.Harga);
            form.append('Stok', formData.Stok);
            form.append('FotoProduk', formData.FotoProduk);

            console.log('Form data before submit:', formData);
            console.log('File FotoProduk:', formData.FotoProduk);

            await createProdukApi(form);

            setOpenDialog(true);

            setFormData({ NamaProduk: '', Harga: '', Stok: '', FotoProduk: null });
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal menambahkan produk.');
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        navigate('/admin/produk'); 
    };

    return (
        <div className="p-4">
            <Typography variant="h4" className="mb-4 font-semibold text-teal-700">
                Tambah Produk
            </Typography>
            <Card className="shadow-lg rounded-2xl">
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <DragDropInput
                                    onDrop={handleDrop}
                                    photoPreview={formData.FotoProduk ? URL.createObjectURL(formData.FotoProduk) : null}
                                    photoName={formData.FotoProduk?.name || ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nama Produk"
                                    name="NamaProduk"
                                    variant="outlined"
                                    value={formData.NamaProduk}
                                    onChange={handleChange}
                                    required
                                    sx={{ mb: 3 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Harga"
                                    name="Harga"
                                    type="number"
                                    variant="outlined"
                                    value={formData.Harga}
                                    onChange={handleChange}
                                    required
                                    sx={{ mb: 3 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Stok"
                                    name="Stok"
                                    type="number"
                                    variant="outlined"
                                    value={formData.Stok}
                                    onChange={handleChange}
                                    required
                                    sx={{ mb: 3 }}
                                />
                            </Grid>
                        </Grid>
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: teal[500],
                                    color: teal[500],
                                    '&:hover': { borderColor: teal[300], color: teal[300] },
                                }}
                                onClick={() => setFormData({ NamaProduk: '', Harga: '', Stok: '', FotoProduk: null })}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: teal[500],
                                    color: light[200],
                                    '&:hover': { backgroundColor: teal[300], color: light[100] },
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Menambahkan...' : 'Tambah Produk'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>

            {/* Dialog success */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Produk Berhasil Ditambahkan</DialogTitle>
                <DialogContent>
                    <Typography>
                        Produk Anda telah berhasil ditambahkan. Klik "Done" untuk kembali ke halaman produk.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleDialogClose}
                        sx={{
                            backgroundColor: teal[500],
                            textAlign: 'center',
                            color: light[200],
                            '&:hover': { backgroundColor: teal[300], color: light[100] },
                        }}
                    >
                        Done
                    </Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}
