import React, { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { teal } from "../../../theme/color";
import { useNavigate } from "react-router-dom";
import { fetchPelanggan } from "../../../store/endpoint/petugas/pelangganPetugas/pelangganEnd";
import { createOrder } from "../../../store/endpoint/petugas/order-penjualan-detail/orderPD";

export default function OrderDetails({ orderItems, setOrderItems }) {
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [pelanggan, setPelanggan] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false); 
  const [warningMessage, setWarningMessage] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const getPelanggan = async () => {
      try {
        const data = await fetchPelanggan();
        setPelanggan(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getPelanggan();
  }, []);

  const handleRemoveItem = (index) => {
    const updatedOrder = [...orderItems];
    updatedOrder.splice(index, 1);
    setOrderItems(updatedOrder);
  };

  const handleSubmitOrder = async () => {
    if (!selectedPelanggan && orderItems.length === 0) {
      setWarningMessage("Silakan tambahkan pelanggan dan produk terlebih dahulu.");
      setOpenWarningDialog(true);
      return;
    } else if (!selectedPelanggan) {
      setWarningMessage("Silakan pilih pelanggan terlebih dahulu.");
      setOpenWarningDialog(true); 
      return;
    } else if (orderItems.length === 0) {
      setWarningMessage("Silakan tambahkan produk ke order terlebih dahulu.");
      setOpenWarningDialog(true); 
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    const totalHarga = orderItems.reduce((total, item) => total + (item.Harga * (item.JumlahProduk || 1)), 0);

    const orderData = {
      PelangganID: selectedPelanggan.PelangganID,
      TanggalPenjualan: currentDate, 
      products: orderItems.map((item) => ({
        ProdukID: item.ProdukID,
        JumlahProduk: item.JumlahProduk || 1,
        Harga: item.Harga * (item.JumlahProduk || 1),
      })),
    };

    try {
      const response = await createOrder(orderData);
      console.log("Response from backend:", response);

      setOrderItems([]);
      alert("Pesanan berhasil dibuat!");

      const { penjualan } = response;
      console.log("PenjualanID from backend:", penjualan.PenjualanID);

    } catch (error) {
      console.error(error.message);
    }
  };

  const handleConfirmOrder = () => {
    if (!selectedPelanggan && orderItems.length === 0) {
      setWarningMessage("Silakan tambahkan pelanggan dan produk terlebih dahulu.");
      setOpenWarningDialog(true);
      return;
    } else if (!selectedPelanggan) {
      setWarningMessage("Silakan pilih pelanggan terlebih dahulu.");
      setOpenWarningDialog(true); 
      return;
    } else if (orderItems.length === 0) {
      setWarningMessage("Silakan tambahkan produk ke order terlebih dahulu.");
      setOpenWarningDialog(true); 
      return;
    }

    setOpenConfirmationDialog(true); 
  };


  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const handleProceedOrder = () => {
    handleSubmitOrder(); 
    setOpenConfirmationDialog(false); 
  };

  const handleCloseWarningDialog = () => {
    setOpenWarningDialog(false);
  };

  return (
    <Card sx={{ maxHeight: '100vh', overflowY: 'auto', paddingLeft: 0, }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', pb: 2 }}>Detail Order</Typography>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(true)}
            sx={{
              borderColor: teal[500],
              color: teal[500],
              "&:hover": {
                borderColor: teal[300],
              },
              marginRight: 2,
              borderWidth: 2,
            }}
          >
            Pilih Pelanggan
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: teal[500],
              color: "#fff",
              "&:hover": {
                backgroundColor: teal[300]
              }
            }}
            onClick={() => navigate("/petugas/add-pelanggan")}
          >
            Add Pelanggan
          </Button>
        </div>

        {selectedPelanggan && (
          <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            Pelanggan: {selectedPelanggan.NamaPelanggan} ({selectedPelanggan.Alamat})
          </Typography>
        )}

        <List>
          {orderItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem secondaryAction={<Button onClick={() => handleRemoveItem(index)}>Hapus</Button>}>
                <ListItemText
                  primary={item.NamaProduk}
                  secondary={`Rp ${item.Harga} x ${item.JumlahProduk || 1} = Rp ${item.Harga * (item.JumlahProduk || 1)}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Button
          variant="contained"
          fullWidth
          onClick={handleConfirmOrder}
          sx={{
            backgroundColor: teal[500],
            color: "#fff",
            "&:hover": {
              backgroundColor: teal[300]
            }
          }}
        >
          Konfirmasi Order
        </Button>
      </CardContent>

      {/* Warning Dialog */}
      <Dialog open={openWarningDialog} onClose={handleCloseWarningDialog} fullWidth maxWidth="sm">
        <DialogTitle>Peringatan</DialogTitle>
        <DialogContent>
          <Typography>{warningMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarningDialog}>Tutup</Button>
        </DialogActions>
      </Dialog>

      {/* Konfirmasi Order Dialog */}
      <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog} fullWidth maxWidth="sm">
        <DialogTitle>Konfirmasi Pesanan</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin melakukan pesanan ini? Pastikan data pelanggan dan produk sudah benar.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog}>Batal</Button>
          <Button onClick={handleProceedOrder} color="primary">Ya, Lanjutkan</Button>
        </DialogActions>
      </Dialog>

      {/* Pelanggan Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Pilih Pelanggan
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {pelanggan.map((p) => (
              <ListItem
                button
                key={p.PelangganID}
                onClick={() => { setSelectedPelanggan(p); setOpenDialog(false); }}
              >
                <ListItemText primary={p.NamaPelanggan} secondary={p.Alamat} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Batal</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
