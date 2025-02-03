import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Grid } from "@mui/material";
import { fetchProduk } from "../../../store/endpoint/petugas/produkPetugas/produkEnd";
import { teal } from "@mui/material/colors";

const ProductList = ({ onAddToOrder }) => {
  const [products, setProducts] = useState([]);
  const [orderCreated, setOrderCreated] = useState(false);

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

  const handleAddToOrder = (product) => {
    onAddToOrder(product);
    setOrderCreated(true);
  };

  return (
    <div style={{ maxHeight: '100vh', overflowY: 'auto', paddingLeft: 0, }}>
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
                <Typography variant="h6">{product.NamaProduk}</Typography>
                <Typography variant="body2">Rp {product.Harga}</Typography>
                <Typography variant="body2">Stok : {product.Stok}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToOrder(product)}
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
    </div>
  );
};

export default ProductList;
