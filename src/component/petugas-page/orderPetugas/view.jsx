import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import ProductList from "./produkListOrder";
import OrderDetails from "./orderDetails";

export default function OrderPagePetugas() {
  const [orderItems, setOrderItems] = useState([]);

  const handleAddToOrder = (product) => {
    setOrderItems([...orderItems, product]);
  };

  return (
    <div sx={{ maxHeight: '100vh', overflowY: 'auto', px: 0 }}> 
      <Grid container spacing={3} sx={{ pt: 0, px: 0 }}>
        <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ProductList onAddToOrder={handleAddToOrder} />
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={4} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-beetwen', 
            margin: 0, 
            height: '100%' 
          }}
        >
          <OrderDetails orderItems={orderItems} setOrderItems={setOrderItems} />
        </Grid>
      </Grid>
    </div>
  );
}
