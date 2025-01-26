import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { login } from '../../store/endpoint/auth/authentication';

const LoginPageUI = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      if (response.redirect) {
        sessionStorage.setItem('role', response.role);
        sessionStorage.setItem('isAuthenticated', 'true');
        
        // Set login status to true and show success dialog
        setIsLoggedIn(true);
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
    setOpenSuccessDialog(false); // Close the dialog
    // Navigate only after dialog is closed
    navigateToRole(userRole);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>Login Kasir</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>Login</Button>

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
    </Box>
  );
};

export default LoginPageUI;
