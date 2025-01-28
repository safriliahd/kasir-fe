import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Button } from '@mui/material';
import { fetchProduk } from '../../../../store/endpoint/produk/produkEnd';


export default function AllProduk() {
  const [produkList, setProdukList] = useState([]);

  useEffect(() => {
    const getProduk = async () => {
      try {
        const data = await fetchProduk();
        setProdukList(data);
      } catch (error) {
        console.error('Error fetching produk:', error);
      }
    };

    getProduk();
  }, []);

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-700">
        Produk
      </Typography>
      <Grid container spacing={4}>
        {produkList.map((produk) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={produk.ProdukID}>
            <Card className="shadow-lg rounded-2xl">
              <CardMedia
                component="img"
                height="150"
                image={produk.FotoProduk}
                alt={produk.NamaProduk}
                className="rounded-t-2xl"
              />
              <CardContent>
                <Typography variant="h6" className="font-bold">
                  {produk.NamaProduk}
                </Typography>
                <Typography className="text-gray-500 mb-2">
                  Harga: Rp {produk.Harga.toLocaleString('id-ID')}
                </Typography>
                <Typography className="text-gray-500 mb-4">
                  Stok: {produk.Stok}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
