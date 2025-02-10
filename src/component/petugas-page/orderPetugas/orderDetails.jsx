import React, { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Snackbar, Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { teal } from "../../../theme/color";
import { useNavigate } from "react-router-dom";
import { createPelangganApi, fetchPelanggan } from "../../../store/endpoint/petugas/pelangganPetugas/pelangganEnd";
import { createOrder } from "../../../store/endpoint/petugas/order-penjualan-detail/orderPD";

export default function OrderDetails({ orderItems, setOrderItems }) {
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [pelanggan, setPelanggan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [newPelanggan, setNewPelanggan] = useState({ NamaPelanggan: "", Alamat: "", NomorTelepon: "" });
  const [openNewPelanggan, setOpenNewPelanggan] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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

  const calculateTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.Harga * (item.JumlahProduk || 1), 0);
  };

  const handleSubmitOrder = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const TotalHarga = calculateTotalPrice();
    
    console.log("Order Items:", orderItems);
    console.log("Total harga di frontend sebelum dikirim:", orderItems.reduce((total, item) => total + item.Harga * (item.JumlahProduk || 1), 0));
   
    

    const orderData = {
      PelangganID: selectedPelanggan.PelangganID,
      TanggalPenjualan: currentDate,
      TotalHarga: TotalHarga,
      products: orderItems.map((item) => ({
        ProdukID: item.ProdukID,
        JumlahProduk: parseInt(item.JumlahProduk) || 1,
        Harga: item.Harga ,
      })),
    };

    console.log("Data dikirim ke backend:", orderData);

    try {
      await createOrder(orderData);
      setOrderItems([]);
      setOpenConfirmationDialog(false); 
      alert("Pesanan berhasil dibuat!");
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredPelanggan = pelanggan.filter((p) =>
    p.NamaPelanggan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewPelanggan = async () => {
    if (!newPelanggan.NamaPelanggan || !newPelanggan.Alamat) return;

    console.log("Menambahkan pelanggan baru:", newPelanggan);

    try {
      const newEntry = await createPelangganApi(
        newPelanggan.NamaPelanggan,
        newPelanggan.Alamat,
        newPelanggan.NomorTelepon
      );

      setPelanggan([...pelanggan, newEntry]);
      setNewPelanggan({ NamaPelanggan: "", Alamat: "", NomorTelepon: "" });
      setOpenNewPelanggan(false);

      setSnackbarMessage("Pelanggan berhasil ditambahkan!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saat menambahkan pelanggan:", error.response?.data || error.message);
    }
  };



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
          onClick={() => setOpenNewPelanggan(true)}
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
          Total Harga: Rp {calculateTotalPrice()}
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


      {/* Dialog Tambah Pelanggan Baru */}
      <Dialog open={openNewPelanggan} onClose={() => setOpenNewPelanggan(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Pelanggan"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newPelanggan.NamaPelanggan}
            onChange={(e) => setNewPelanggan({ ...newPelanggan, NamaPelanggan: e.target.value })}
          />
          <TextField
            label="Alamat"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newPelanggan.Alamat}
            onChange={(e) => setNewPelanggan({ ...newPelanggan, Alamat: e.target.value })}
          />
          <TextField
            label="Nomor Telepon"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newPelanggan.NomorTelepon}
            onChange={(e) => setNewPelanggan({ ...newPelanggan, NomorTelepon: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddNewPelanggan} variant="contained" sx={{ backgroundColor: teal[500], color: "#fff" }}>Simpan</Button>
          <Button onClick={() => setOpenNewPelanggan(false)}>Batal</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Konfirmasi Order */}
      <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Konfirmasi Order</DialogTitle>
        <DialogContent>
          <Typography>Apakah Anda yakin ingin mengonfirmasi order ini?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitOrder} variant="contained" sx={{ backgroundColor: teal[500], color: "#fff" }}>Ya</Button>
          <Button onClick={() => setOpenConfirmationDialog(false)}>Batal</Button>
        </DialogActions>
      </Dialog>


      {/* Snackbar untuk pesan berhasil create new pelanggan */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
