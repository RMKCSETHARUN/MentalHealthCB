import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, 
  TextField, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  Button,
  Dialog,
  Alert,
  Snackbar
} from "@mui/material";
import { Mic, MicOff, Send } from "@mui/icons-material";
import dataset from "./data/dataset";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useApp } from "../context/AppContext";
import Appointment from "./Appointment";
import { containsAbusiveContent, sendWhatsAppAlert } from "../utils/contentFilter";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { showAppointmentModal, setShowAppointmentModal, appointmentHistory, userInfo } = useApp();

  const handleSpeechInput = useCallback((speechText) => {
    if (speechText.trim()) {
      setInput("");
      processUserMessage(speechText);
      resetTranscript();
    }
  }, [resetTranscript]);

  useEffect(() => {
    if (!listening && transcript) {
      handleSpeechInput(transcript);
    }
  }, [listening, transcript, handleSpeechInput]);

  useEffect(() => {
    // Add welcome message
    setMessages([
      { 
        text: "Hello! I'm your mental health assistant. How can I help you today?", 
        sender: "bot" 
      }
    ]);
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  const handleSend = () => {
    if (input.trim() === "") return;
    processUserMessage(input);
    setInput("");
  };

  const processUserMessage = async (userMessage) => {
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);

    // Check for abusive content
    if (containsAbusiveContent(userMessage)) {
      setShowAlert(true);
      if (userInfo.alternateNumber) {
        try {
          await sendWhatsAppAlert(
            userInfo.alternateNumber,
            userInfo.name,
            userMessage
          );
        } catch (error) {
          console.error('Failed to send WhatsApp alert:', error);
        }
      }
    }

    const botResponse = getBotResponse(userMessage);

    if (botResponse === "APPOINTMENT_BOOKING") {
      setShowAppointmentModal(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { 
            text: "I'll help you book an appointment with a mental health professional. Please use the appointment form that just opened.", 
            sender: "bot" 
          }
        ]);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      }, 500);
    }
  };

  const getBotResponse = (userInput) => {
    const normalizedInput = userInput.trim().toLowerCase();

    for (const pattern of dataset) {
      if (pattern.pattern.test(normalizedInput)) {
        return pattern.response;
      }
    }

    return "I'm sorry, I didn't quite understand that. Could you rephrase it? You can also say 'book appointment' if you'd like to schedule a consultation.";
  };

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: false });
  };

  return (
    <>
      <Box sx={{ maxWidth: 500, margin: "auto", mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2, height: "60vh", overflowY: "auto" }}>
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}
              >
                <ListItemText
                  primary={msg.text}
                  sx={{
                    bgcolor: msg.sender === "user" ? "#e3f2fd" : "#f5f5f5",
                    p: 1,
                    borderRadius: 2,
                    maxWidth: "70%",
                  }}
                />
              </ListItem>
            ))}
            {appointmentHistory.length > 0 && (
              <ListItem>
                <ListItemText
                  primary="Your Latest Appointment"
                  secondary={`${appointmentHistory[appointmentHistory.length - 1].psychologist} on ${appointmentHistory[appointmentHistory.length - 1].date} at ${appointmentHistory[appointmentHistory.length - 1].time}`}
                  sx={{
                    bgcolor: "#e8f5e9",
                    p: 1,
                    borderRadius: 2,
                    maxWidth: "70%",
                  }}
                />
              </ListItem>
            )}
          </List>
        </Paper>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            fullWidth
            placeholder="Type a message or use speech..."
            value={listening ? transcript : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
            <Send />
          </IconButton>
          <IconButton color={listening ? "secondary" : "default"} onClick={handleStartListening} sx={{ ml: 1 }}>
            {listening ? <MicOff /> : <Mic />}
          </IconButton>
        </Box>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setShowAppointmentModal(true)}
        >
          Book an Appointment
        </Button>
      </Box>

      <Dialog
        open={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        maxWidth="md"
        fullWidth
      >
        <Appointment />
      </Dialog>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity="warning"
          sx={{ width: '100%' }}
        >
          Please be mindful of your language. An alert has been sent to your emergency contact.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Chatbot;
