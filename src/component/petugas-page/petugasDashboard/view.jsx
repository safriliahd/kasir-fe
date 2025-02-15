import { Grid, Typography, Box } from "@mui/material";
import LeftSidePetugas from "./LeftSidePetugas";
import RightSidePetugas from "./RightSidePetugas";


export default function DashboardPagePetugas() {
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
        Petugas Dashboard
      </Typography>

      <Grid item xs={12}>
        <LeftSidePetugas />
      </Grid>

      <Grid item xs={12}>
        <RightSidePetugas />
      </Grid>
    </Box>
  );
}

