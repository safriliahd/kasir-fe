import { Link } from 'react-router-dom';
import GetAllPelanggan from './allPelanggan/view';
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Icon untuk tombol Add
import { light, teal } from '../../../theme/color';

export default function PelangganPage() {
    console.log("Rendering PelangganPage");
    
    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
            <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>Daftar Pelanggan</Typography>
                <Link to="/admin/add-pelanggan" style={{ textDecoration: 'none' }}>
                    <Button 
                        variant="contained" 
                        color="teal" 
                        startIcon={<AddIcon />} 
                        sx={{
                            backgroundColor: teal[500],
                            color: light[200], // Teks warna putih
                            '&:hover': {
                                backgroundColor: teal[300], // Warna background saat hover
                                color: light[100], // Teks tetap putih saat hover
                            }
                        }}
                    >
                        Add Pelanggan
                    </Button>
                </Link>
            </Box>
            <GetAllPelanggan />
        </>
    );
}
