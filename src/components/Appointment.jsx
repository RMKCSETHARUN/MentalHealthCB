import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import psychologists from "./data/psychologistsDataset";
import { useApp } from "../context/AppContext";

const Appointment = () => {
  const [selectedPsychologist, setSelectedPsychologist] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [serviceMode, setServiceMode] = useState("");
  const [error, setError] = useState("");

  const { setShowAppointmentModal, addAppointment } = useApp();
  const today = new Date().toISOString().split("T")[0];

  const handleBook = () => {
    if (!selectedPsychologist || !date || !time || !serviceMode) {
      setError("Please fill in all required fields");
      return;
    }

    const appointment = {
      psychologist: selectedPsychologist,
      date,
      time,
      serviceMode,
      bookedAt: new Date().toISOString()
    };

    addAppointment(appointment);
    setShowAppointmentModal(false);

    setSelectedPsychologist("");
    setDate("");
    setTime("");
    setServiceMode("");
    setError("");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Book an Appointment
        </Typography>
        <IconButton onClick={() => setShowAppointmentModal(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Psychologist</InputLabel>
        <Select
          value={selectedPsychologist}
          onChange={(e) => setSelectedPsychologist(e.target.value)}
          sx={{
            "& .MuiInputLabel-root": { color: "gray" },
            "& .MuiInputBase-input": { color: "black" },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          }}
        >
          {psychologists.map((psych) => (
            <MenuItem key={psych.id} value={psych.name}>
              {psych.name} - {psych.specialization} ({psych.experience})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {selectedPsychologist && (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Service Mode</InputLabel>
            <Select
              value={serviceMode}
              onChange={(e) => setServiceMode(e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: "gray" },
                "& .MuiInputBase-input": { color: "black" },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              <MenuItem value="Video Call">Video Call</MenuItem>
              <MenuItem value="In-Person Meeting">In-Person Meeting</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{ inputProps: { min: today } }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            onClick={handleBook}
            fullWidth
          >
            Book Appointment
          </Button>
        </>
      )}
    </Box>
  );
};

export default Appointment;