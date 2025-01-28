import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  TablePagination,
  Input,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  fetchProduk,
  deleteProduk,
  editProduk,
} from "../../../../store/endpoint/produk/produkEnd";

export default function AllProduk() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [formData, setFormData] = useState({
    NamaProduk: "",
    Harga: "",
    Stok: "",
    FotoProduk: null,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const getProduk = async () => {
      try {
        const data = await fetchProduk();
        setProdukList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getProduk();
  }, []);

  const handleRowClick = (produk) => {
    setSelectedProduk(produk);
    setDialogOpen(true);
  };

  const handleEdit = (produkId) => {
    const produkToEdit = produkList.find((p) => p.ProdukID === produkId);

    console.log("Editing produk with ID:", produkId);

    if (produkToEdit) {
      setFormData({
        NamaProduk: produkToEdit.NamaProduk,
        Harga: produkToEdit.Harga,
        Stok: produkToEdit.Stok,
        FotoProduk: produkToEdit.FotoProduk,
      });
      setSelectedProduk(produkToEdit);
      setEditDialogOpen(true); 
    }
  };

  const handleEditSubmit = async () => {
    try {
      const updatedProduk = await editProduk(selectedProduk.ProdukID, formData);
      setProdukList((prevProduk) =>
        prevProduk.map((p) =>
          p.ProdukID === selectedProduk.ProdukID ? updatedProduk : p
        )
      );
      setSnackbar({
        open: true,
        message: "Produk berhasil diperbarui",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Gagal memperbarui produk: " + error.message,
        severity: "error",
      });
    } finally {
      setEditDialogOpen(false); 
    }
  };

  const handleDelete = async () => {
    if (!selectedProduk) {
      setSnackbar({
        open: true,
        message: "No product selected for deletion",
        severity: "error",
      });
      return;
    }

    try {
      await deleteProduk(selectedProduk.ProdukID);
      setProdukList((prevProduk) =>
        prevProduk.filter((p) => p.ProdukID !== selectedProduk.ProdukID)
      );
      setSnackbar({
        open: true,
        message: "Produk deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete produk: " + error.message,
        severity: "error",
      });
    } finally {
      setDialogOpen(false);
      setSelectedProduk(null);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file instanceof File) {
      setFormData({ ...formData, FotoProduk: file });
    } else {
      console.error("Invalid file type");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  }

  const headerCellStyle = {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "1.1rem",
  };

  return (
    <Box p={2}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellStyle}>ID</TableCell>
              <TableCell sx={headerCellStyle}>Nama Produk</TableCell>
              <TableCell sx={headerCellStyle}>Harga</TableCell>
              <TableCell sx={headerCellStyle}>Stok</TableCell>
              <TableCell sx={headerCellStyle}>Foto Produk</TableCell>
              <TableCell sx={headerCellStyle}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produkList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((produk) => (
                <TableRow key={produk.ProdukID}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {produk.ProdukID}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {produk.NamaProduk}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Rp {produk.Harga.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {produk.Stok}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <img
                      src={produk.FotoProduk}
                      alt={produk.NamaProduk}
                      width="100"
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                      onClick={() => handleEdit(produk.ProdukID)}
                      color="primary"
                    >
                      <Edit sx={{ color: "teal" }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedProduk(produk);
                        setDialogOpen(true);
                      }}
                      color="secondary"
                    >
                      <Delete sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Table Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={produkList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialog for editing produk */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Produk</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
              {/* Left side:*/}
            <Box width="45%" display="flex" flexDirection="column" alignItems="center">
              {formData.FotoProduk ? (
                formData.FotoProduk instanceof File ? (
                  <Box>
                    <Typography variant="body2">Preview foto baru:</Typography>
                    <img
                      src={URL.createObjectURL(formData.FotoProduk)}
                      alt="Foto Produk"
                      width="150"
                      style={{ borderRadius: "8px" }}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body2">Foto Produk:</Typography>
                    <img
                      src={formData.FotoProduk}
                      alt="Foto Produk"
                      width="150"
                      style={{ borderRadius: "8px" }}
                    />
                  </Box>
                )
              ) : (
                <Box>
                  <Typography variant="body2">No photo selected</Typography>
                </Box>
              )}
              <Input type="file" margin="normal" onChange={handleFileChange} />
            </Box>

            {/* Right side:*/}
            <Box width="45%">
              <TextField
                fullWidth
                margin="normal"
                label="Nama Produk"
                value={formData.NamaProduk}
                onChange={(e) =>
                  setFormData({ ...formData, NamaProduk: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Harga"
                value={formData.Harga}
                onChange={(e) =>
                  setFormData({ ...formData, Harga: e.target.value })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Stok"
                value={formData.Stok}
                onChange={(e) =>
                  setFormData({ ...formData, Stok: e.target.value })
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>



      {/* Confirmation dialog for delete */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Apakah Anda yakin ingin menghapus {selectedProduk?.NamaProduk}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Batal
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
