import * as React from "react";
import { NavLink, Outlet } from "react-router-dom"; // Gunakan NavLink
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { teal } from "../../../theme/color";

const sidebarWidth = 200; // Lebar sidebar

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

// Ganti Drawer dengan Box untuk sidebar
const Sidebar = styled(Box)(({ theme }) => ({
  width: sidebarWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: '#fff', // Warna latar belakang sidebar
  height: "100vh", // Pastikan sidebar memenuhi seluruh tinggi layar
  position: "fixed", // Fix sidebar ke sisi kiri
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column", // Menyusun menu secara vertikal
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function AdminSidebarPage() {
  const [activeIndex, setActiveIndex] = React.useState(null);

  const menuItems = [
    { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { text: "Pelanggan", path: "/admin/pelanggan", icon: <PeopleIcon /> },
    { text: "Produk", path: "/admin/produk", icon: <InventoryIcon /> },
    { text: "Order", path: "/admin/orders", icon: <ReceiptIcon /> },
    { text: "Penjualan", path: "/admin/penjualan", icon: <TrendingUpIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ backgroundColor: teal[500] }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{
              marginRight: 5,
              display: "none", // Hide menu icon
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{fontWeight: 'bold'}}>
            GoMart
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar menggunakan Box */}
      <Sidebar>
        <DrawerHeader>
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                display: "block",
                backgroundColor: activeIndex === index ? teal[500] : "transparent",
              }}
            >
              {/* Gunakan NavLink untuk navigasi */}
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "white" : teal[500],
                  width: "100%",
                })}
                onClick={() => {
                  console.log(`Navigating to: ${item.path}`);
                  setActiveIndex(index);
                }}
              >
                <ListItemButton
                  onClick={() => setActiveIndex(index)} // Set active index on click
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    justifyContent: "initial",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      color: activeIndex === index ? "white" : teal[500],
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: 1,
                      marginLeft: 2,
                      color: activeIndex === index ? "white" : teal[500],
                    }}
                  />
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Sidebar>

      {/* Konten utama */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${sidebarWidth}px` }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
