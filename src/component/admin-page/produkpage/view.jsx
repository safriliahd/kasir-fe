import { Link } from 'react-router-dom';
import AllProduk from "./allProduk/view";
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import { light, teal } from '../../../theme/color'; 

export default function ProdukPage() {
    console.log("Rendering ProdukPage");

    return (
        <>
            <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            px={2}
            sx={{
                maxHeight: '70vh',
                overflow: 'hidden', 
            }}
            >
                <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>Daftar Produk</Typography>
                <Link to="/admin/add-produk" style={{ textDecoration: 'none' }}>
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
                        Add Produk
                    </Button>
                </Link>
            </Box>
            <AllProduk />
        </>
    );
}
