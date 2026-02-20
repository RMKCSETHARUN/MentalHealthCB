import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    alternateNumber: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateUserInfo } = useApp();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (formData.name.trim().length >= 3 && formData.phoneNumber.length === 10) {
      updateUserInfo(formData);
      onLogin();
      navigate('/');
    } else {
      setError('Please enter a valid name (minimum 3 characters) and phone number (10 digits)');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Mental Health ChatBot Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              inputProps={{
                minLength: 3,
                maxLength: 50
              }}
              helperText="Enter your full name (minimum 3 characters)"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              id="phoneNumber"
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              inputProps={{
                pattern: "[0-9]{10}",
                title: "Please enter a valid 10-digit phone number"
              }}
              helperText="Enter your 10-digit phone number"
            />
            <TextField
              margin="normal"
              fullWidth
              name="alternateNumber"
              label="Emergency Contact Number"
              type="tel"
              id="alternateNumber"
              autoComplete="tel"
              value={formData.alternateNumber}
              onChange={handleChange}
              inputProps={{
                pattern: "[0-9]{10}",
                title: "Please enter a valid 10-digit phone number"
              }}
              helperText="Enter an emergency contact number for alerts"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 