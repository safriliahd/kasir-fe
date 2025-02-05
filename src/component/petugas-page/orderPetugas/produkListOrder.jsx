import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { fetchProduk } from "../../../store/endpoint/petugas/produkPetugas/produkEnd";
import { teal } from "@mui/material/colors";

const ProductList = ({ onAddToOrder, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [orderCreated, setOrderCreated] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

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

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.NamaProduk.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto", paddingLeft: 0 }}>
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          margin: 0, 
          width: "100%", 
          padding: 0,
          display: "flex", 
          justifyContent: "flex-start" 
        }} 
        alignItems="stretch"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid 
              item xs={12} sm={6} md={4} lg={3} 
              key={product.ProdukID} 
              sx={{ 
                display: "flex", 
                justifyContent: "center", 
                padding: 0,
                margin: 0,
              }}
            >
              <Card 
                sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  height: "100%", 
                  width: "100%", 
                  margin: 0,
                  padding: 0,
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.FotoProduk || "/default-image.jpg"}
                  alt={product.NamaProduk}
                />
                <CardContent 
                  sx={{ 
                    flexGrow: 1, 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "space-between",
                    padding: "16px",
                  }}
                >
                  <Typography variant="body1">{product.NamaProduk}</Typography>
                  <Typography variant="body2">Rp {product.Harga}</Typography>
                  <Typography variant="body2">Stok : {product.Stok}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                    fullWidth
                    sx={{ 
                      mt: "auto", 
                      backgroundColor: teal[500], 
                      "&:hover": { backgroundColor: teal[300] }
                    }}
                  >
                    Tambah
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ width: "100%", textAlign: "center", padding: 2 }}>
            Produk tidak ditemukan
          </Typography>
        )}
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
