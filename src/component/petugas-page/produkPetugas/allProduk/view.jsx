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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TablePagination,
} from "@mui/material";
import { fetchProduk } from "../../../../store/endpoint/petugas/produkPetugas/produkEnd";


export default function AllProdukPetugas() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedProduk(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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
            </TableRow>
          </TableHead>
          <TableBody>
            {produkList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produk) => (
              <TableRow key={produk.ProdukID} onClick={() => handleRowClick(produk)} style={{ cursor: "pointer" }}>
                <TableCell sx={{ textAlign: "center" }}>{produk.ProdukID}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{produk.NamaProduk}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Rp {produk.Harga.toLocaleString("id-ID")}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{produk.Stok}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={produkList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog Modal Detail Produk */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Detail Produk</DialogTitle>
        <DialogContent>
          {selectedProduk && (
            <Box display="flex" alignItems="center" justifyContent="space-between">
              {/* Kiri: Foto Produk */}
              <Box width="45%" display="flex" flexDirection="column" alignItems="center">
                <img
                  src={selectedProduk.FotoProduk}
                  alt={selectedProduk.NamaProduk}
                  width="150"
                  style={{ borderRadius: "8px" }}
                />
              </Box>

              {/* Kanan: Detail Produk */}
              <Box width="50%">
                <Typography variant="body1" gutterBottom>
                  <strong>Nama Produk:</strong> {selectedProduk.NamaProduk}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Harga:</strong> Rp {selectedProduk.Harga.toLocaleString("id-ID")}
                </Typography>
                <Typography variant="body1">
                  <strong>Stok:</strong> {selectedProduk.Stok}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
