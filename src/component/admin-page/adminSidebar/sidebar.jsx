import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { teal } from "../../../theme/color";

const menuItems = [
  { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { text: "Pelanggan", path: "/admin/pelanggan", icon: <PeopleIcon /> },
  { text: "Produk", path: "/admin/produk", icon: <InventoryIcon /> },
  { text: "Order", path: "/admin/orders", icon: <ReceiptIcon /> },
  { text: "Penjualan", path: "/admin/penjualan", icon: <TrendingUpIcon /> },
];

export default function AdminSidebarScreen() {
  return (
    <Box
      sx={{
        width: "240px",
        height: "100vh",
        backgroundColor: teal[100],
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <CssBaseline />
      <Typography variant="h6" sx={{ marginBottom: 2, textAlign: "center" }}>
        GoMart
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive ? teal[700] : teal[900],
                width: "100%",
              })}
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
