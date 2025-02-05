import React, { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField
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
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleConfirmOrder = () => {
    if (!selectedPelanggan || orderItems.length === 0) {
      setWarningMessage(
        !selectedPelanggan
          ? "Silakan pilih pelanggan terlebih dahulu."
          : "Silakan tambahkan produk ke order terlebih dahulu."
      );
      setOpenWarningDialog(true);
      return;
    }
    setOpenConfirmationDialog(true);
  };

  const handleSubmitOrder = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const orderData = {
      PelangganID: selectedPelanggan.PelangganID,
      TanggalPenjualan: currentDate,
      products: orderItems.map((item) => ({
        ProdukID: item.ProdukID,
        JumlahProduk: parseInt(item.JumlahProduk) || 1,
        Harga: item.Harga * (item.JumlahProduk || 1),
      })),
    };

    try {
      await createOrder(orderData);
      setOrderItems([]);
      alert("Pesanan berhasil dibuat!");
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredPelanggan = pelanggan.filter((p) =>
    p.NamaPelanggan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card sx={{ maxHeight: '100vh', overflowY: 'auto', paddingLeft: 0 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', pb: 2 }}>Detail Order</Typography>
        <Button
          variant="outlined"
          onClick={() => setOpenDialog(true)}
          sx={{ borderColor: teal[500], color: teal[500], marginRight: 2 }}
        >
          Pilih Pelanggan
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: teal[500], color: "#fff" }}
          onClick={() => navigate("/petugas/add-pelanggan")}
        >
          Add Pelanggan
        </Button>

        {selectedPelanggan && (
          <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
            Pelanggan: {selectedPelanggan.NamaPelanggan} ({selectedPelanggan.Alamat})
          </Typography>
        )}

        <List>
          {orderItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem secondaryAction={<Button onClick={() => handleRemoveItem(index)}>Hapus</Button>}>
                <ListItemText primary={item.NamaProduk} secondary={`Rp ${item.Harga} x ${item.JumlahProduk || 1} = Rp ${item.Harga * (item.JumlahProduk || 1)}`} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        {/* Total Harga */}
        <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'left', marginY: 2 }}>
          Total Harga: Rp {orderItems.reduce((total, item) => total + item.Harga * (item.JumlahProduk || 1), 0)}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={handleConfirmOrder}
          sx={{ backgroundColor: teal[500], color: "#fff" }}
        >
          Konfirmasi Order
        </Button>
      </CardContent>

      {/* Dialog Pilih Pelanggan */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Pilih Pelanggan
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Cari Pelanggan"
            variant="outlined"
            fullWidth
            margin="dense"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredPelanggan.length > 0 ? (
            <List>
              {filteredPelanggan.map((p) => (
                <ListItem button key={p.PelangganID} onClick={() => { setSelectedPelanggan(p); setOpenDialog(false); }}>
                  <ListItemText primary={p.NamaPelanggan} secondary={p.Alamat} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", marginTop: 2 }}>Tidak ada pelanggan yang ditemukan.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Batal</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
