import React, { useState } from "react";
import { Grid, InputBase, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductList from "./produkListOrder";
import OrderDetails from "./orderDetails";
import { light, teal } from "../../../theme/color";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: teal[500],
  "&:hover": {
    backgroundColor: teal[300],
  },
  marginLeft: "16px",
  width: "100%",
  maxWidth: "400px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  paddingLeft: theme.spacing(2), // Tambahkan padding agar ikon tidak terlalu mepet
  [theme.breakpoints.down("sm")]: {
    maxWidth: "300px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: light[200],
  marginRight: theme.spacing(1), // Beri jarak antara ikon dan input
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.common.white,
  width: "100%",
  height: "100%",
}));

export default function OrderPagePetugas() {
  const [orderItems, setOrderItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddToOrder = (product) => {
    setOrderItems([...orderItems, product]);
  };

  return (
    <div style={{ maxHeight: "100vh", overflowY: "auto", padding: 0 }}>
      {/* Search Bar di kiri */}
      <div style={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Search>
      </div>

      {/* Grid Layout */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} style={{ display: "flex", justifyContent: "center" }}>
          <ProductList onAddToOrder={handleAddToOrder} searchTerm={searchTerm} />
        </Grid>
        <Grid item xs={12} md={4} style={{ display: "flex", height: "100%" }}>
          <OrderDetails orderItems={orderItems} setOrderItems={setOrderItems} />
        </Grid>
      </Grid>
    </div>
  );
}
