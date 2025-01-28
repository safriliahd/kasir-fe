import { Link } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import { light, teal } from '../../../theme/color';
import GetAllPelangganPetugas from './allPelanggan/view';

export default function PelangganPagePetugas() {
    console.log("Rendering PelangganPage");
    
    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
            <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>Daftar Pelanggan</Typography>
                <Link to="/petugas/add-pelanggan" style={{ textDecoration: 'none' }}>
                    <Button 
                        variant="contained" 
                        color="teal" 
                        startIcon={<AddIcon />} 
                        sx={{
                            backgroundColor: teal[500],
                            color: light[200],
                            '&:hover': {
                                backgroundColor: teal[300], 
                                color: light[100], 
                            }
                        }}
                    >
                        Add Pelanggan
                    </Button>
                </Link>
            </Box>
            <GetAllPelangganPetugas />
        </>
    );
}
