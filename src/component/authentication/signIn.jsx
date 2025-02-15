import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { login } from '../../store/endpoint/auth/authentication';
import backgroundImage from '../../../public/imageTeal.jpg';

const LoginPageUI = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      if (response.redirect) {
        sessionStorage.setItem('role', response.role);
        sessionStorage.setItem('isAuthenticated', 'true');
        setOpenSuccessDialog(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const navigateToRole = (role) => {
    if (role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else if (role === 'PETUGAS') {
      navigate('/petugas', { replace: true });
    }
  };

  const handleSuccessDialogClose = () => {
    const userRole = sessionStorage.getItem('role');
    setOpenSuccessDialog(false);
    navigateToRole(userRole);
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left side with background image */}
      <Grid 
        item 
        xs={false} sm={8} md={8} 
        sx={{ 
          backgroundImage: `url(${backgroundImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      />
      
      {/* Right side with login form */}
      <Grid 
        item 
        xs={12} sm={4} md={4} 
        component={Paper} 
        elevation={6} 
        square 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing(4),
          backgroundColor: 'teal',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>Login Kasir</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
          <Typography sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>Email</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            InputProps={{
              sx: {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
              }
            }}
          />
          
          <Typography sx={{ color: 'white', fontWeight: 'bold', mt: 2, mb: 1 }}>Password</Typography>
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              sx: {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
              }
            }}
          />

          <Box display="flex" justifyContent="center" alignItems="center" mt={3} mb={2}>
            <Button variant="contained" onClick={handleLogin} sx={{ backgroundColor: 'white', color: 'teal', fontWeight: 'bold' }}>Login</Button>
          </Box>
        </Box>
      </Grid>
      
      {/* Success Dialog after login */}
      <Dialog open={openSuccessDialog} onClose={handleSuccessDialogClose}>
        <DialogTitle>Login Berhasil</DialogTitle>
        <DialogContent>
          <Typography>Anda berhasil masuk. Sistem akan membawa Anda ke halaman sesuai peran Anda.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default LoginPageUI;
