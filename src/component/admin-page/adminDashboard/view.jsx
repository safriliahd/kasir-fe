import { Grid, Typography, Box } from "@mui/material";
import LeftSideAdmin from "./LeftSideAdmin";
import RightSideAdmin from "./RightSideAdmin";

export default function AdminDashboard() {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return (
    <Box
      sx={{
        overflow: "hidden", 
        display: "flex",
        flexDirection: "column",
        padding: 2, 
        bgcolor: "background.default",
        gap: 2, 
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "left" }}
      >
        Admin Dashboard
      </Typography>

      <Grid item xs={12}>
        <LeftSideAdmin />
      </Grid>

      <Grid item xs={12}>
        <RightSideAdmin />
      </Grid>
    </Box>
  );
}
