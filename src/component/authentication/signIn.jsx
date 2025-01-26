import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { login } from '../../store/endpoint/auth/authentication';  // Import fungsi login

const LoginPageUI = () => {
  const [email, setEmail] = useState(''); // Menggunakan email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(email, password); // Mengirim email dan password ke backend
      if (response.redirect) {
        // Simpan role dan status login di sessionStorage
        sessionStorage.setItem('role', response.role); // Menyimpan role pengguna
        sessionStorage.setItem('isAuthenticated', true); // Menyimpan status login
        navigate(response.redirect); // Redirect sesuai role

        console.log('Login berhasil! Redirecting to:', response.redirect);
      }
    } catch (err) {
      setError(err.message); // Menampilkan error jika login gagal
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>Login Kasir</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        fullWidth
        label="Email"  // Menggunakan email
        value={email}
        onChange={(e) => setEmail(e.target.value)}  // Mengatur state email
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}  // Mengatur state password
        margin="normal"
      />
      <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>Login</Button>
    </Box>
  );
};

export default LoginPageUI;
