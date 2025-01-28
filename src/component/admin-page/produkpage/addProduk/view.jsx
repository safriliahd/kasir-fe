import React, { useState } from 'react';
import { TextField, Button, Typography, Card, CardContent, Grid, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone'; // For drag-and-drop functionality
import { createProdukApi } from '../../../../store/endpoint/produk/produkEnd';
import { light, teal } from '../../../../theme/color';

export default function AddProdukPage() {
    const [formData, setFormData] = useState({
        NamaProduk: '',
        Harga: '',
        Stok: '',
        FotoProduk: null, // File object initially
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value, // Set file for FotoProduk
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const form = new FormData();
            form.append('NamaProduk', formData.NamaProduk);
            form.append('Harga', formData.Harga);
            form.append('Stok', formData.Stok);
            form.append('FotoProduk', formData.FotoProduk); // Ensure the file is appended

            console.log('Form data before submit:', formData); // Debug form data

            await createProdukApi(form); // Replace with your actual API call
            alert('Produk berhasil ditambahkan!');
            setFormData({ NamaProduk: '', Harga: '', Stok: '', FotoProduk: null }); // Reset form
        } catch (error) {
            console.error('Error adding produk:', error);
            alert('Gagal menambahkan produk.');
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFormData((prev) => ({
                ...prev,
                FotoProduk: acceptedFiles[0], // Store the file object
            }));
        },
        accept: 'image/*', // Ensure only images are accepted
    });

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
                                <Box
                                    {...getRootProps()}
                                    sx={{
                                        border: '2px dashed',
                                        borderColor: teal[500],
                                        height: 500,
                                        p: 4,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            borderColor: teal[300],
                                        },
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {!formData.FotoProduk ? (
                                        <Typography variant="body1" color="textSecondary">
                                            Drag and drop an image here, or click to select one
                                        </Typography>
                                    ) : (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" sx={{ color: teal[700] }}>
                                                {formData.FotoProduk.name}
                                            </Typography>
                                            <img
                                                src={URL.createObjectURL(formData.FotoProduk)}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '400px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    marginTop: '8px',
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
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
                                    '&:hover': {
                                        borderColor: teal[300],
                                        color: teal[300],
                                    },
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
                                    '&:hover': {
                                        backgroundColor: teal[300],
                                        color: light[100],
                                    },
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Menambahkan...' : 'Tambah Produk'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
