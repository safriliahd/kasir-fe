import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { fetchProduk } from "../../../store/endpoint/petugas/produkPetugas/produkEnd";
import { teal } from "@mui/material/colors";

const ProductList = ({ onAddToOrder }) => {
  const [products, setProducts] = useState([]);
  const [orderCreated, setOrderCreated] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const getProducts = async () => {
    try {
      const data = await fetchProduk();
      setProducts(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, [orderCreated]);

  const handleAddToOrder = () => {
    onAddToOrder({ ...selectedProduct, JumlahProduk: quantity });
    setOpenDialog(false);
    setOrderCreated(true);
  };

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  return (
    <div style={{ maxHeight: '100vh', overflowY: 'auto', paddingLeft: 0 }}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.ProdukID}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.FotoProduk || "/default-image.jpg"}
                alt={product.NamaProduk}
              />
              <CardContent>
                <Typography variant="body1">{product.NamaProduk}</Typography>
                <Typography variant="body2">Rp {product.Harga}</Typography>
                <Typography variant="body2">Stok : {product.Stok}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog(product)}
                  fullWidth
                  sx={{ mt: 1, backgroundColor: teal[500], "&:hover": { backgroundColor: teal[300] }}}
                >
                  Tambah
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quantity Input Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tambah {selectedProduct?.NamaProduk}</DialogTitle>
        <DialogContent>
          <TextField
            label="Jumlah"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Batal</Button>
          <Button onClick={handleAddToOrder} color="primary">Tambah ke Order</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductList;
