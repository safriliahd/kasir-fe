import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
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

const sidebarWidth = 200;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: sidebarWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function AdminSidebarPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // State for logout confirmation dialog
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false); // State for success dialog after logout
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { text: "Pelanggan", path: "/admin/pelanggan", icon: <PeopleIcon /> },
    { text: "Produk", path: "/admin/produk", icon: <InventoryIcon /> },
    { text: "Order", path: "/admin/orders", icon: <ReceiptIcon /> },
    { text: "Penjualan", path: "/admin/penjualan", icon: <TrendingUpIcon /> },
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setOpenDialog(true); // Show logout confirmation dialog
    setAnchorEl(null); // Close the dropdown
  };

  const handleLogout = () => {
    // Clear session data including the user's role
    sessionStorage.clear(); // This clears all session data, including the role
    setOpenDialog(false); // Close the confirmation dialog
    setOpenSuccessDialog(true); // Show success dialog

    console.log("isAuthenticated:", sessionStorage.getItem('isAuthenticated'));
    console.log("Role after logout:", sessionStorage.getItem('role'));
  };
  

  const handleCancelLogout = () => {
    setOpenDialog(false); // Close dialog if Cancel is clicked
  };

  const handleSuccessOk = () => {
    // Menunggu beberapa waktu sebelum navigasi untuk memastikan dialog ditutup
    setTimeout(() => {
      navigate("/login", { replace: true }); // Redirect ke halaman login
      setOpenSuccessDialog(false); // Menutup dialog sukses logout
    }, 100); // Delay beberapa milidetik sebelum navigasi
  };
  

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
              display: "none",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
            GoMart
          </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar>
        <Box>
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
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    color: isActive ? "white" : teal[500],
                    width: "100%",
                  })}
                  onClick={() => setActiveIndex(index)}
                >
                  <ListItemButton
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
        </Box>

        {/* Avatar in the bottom */}
        <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Avatar
            sx={{ bgcolor: teal[500], cursor: "pointer", mx: "auto" }}
            onClick={handleMenuClick}
          >
            A
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Box>
      </Sidebar>

      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${sidebarWidth}px` }}>
        <DrawerHeader />
        <Outlet />
      </Box>

      {/* Logout confirmation dialog */}
      <Dialog open={openDialog} onClose={handleCancelLogout}>
        <DialogTitle>{"Are you sure you want to logout?"}</DialogTitle>
        <DialogContent>
          <Typography>Once logged out, you will be redirected to the login page.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleCancelLogout} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success dialog after logout */}
      <Dialog open={openSuccessDialog} onClose={handleSuccessOk}>
        <DialogTitle>{"Logout Successful"}</DialogTitle>
        <DialogContent>
          <Typography>You have successfully logged out. Redirecting to login page...</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleSuccessOk} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
