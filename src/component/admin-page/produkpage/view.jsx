import { Link } from 'react-router-dom';
import AllProduk from "./allProduk/view";
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Icon for Add button
import { light, teal } from '../../../theme/color'; // Your custom colors

export default function ProdukPage() {
    console.log("Rendering ProdukPage");

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>Daftar Produk</Typography>
                <Link to="/admin/add-produk" style={{ textDecoration: 'none' }}>
                    <Button 
                        variant="contained" 
                        color="teal" 
                        startIcon={<AddIcon />} 
                        sx={{
                            backgroundColor: teal[500],
                            color: light[200], // White text
                            '&:hover': {
                                backgroundColor: teal[300], // Background color on hover
                                color: light[100], // White text on hover
                            }
                        }}
                    >
                        Add Produk
                    </Button>
                </Link>
            </Box>
            <AllProduk />
        </>
    );
}
