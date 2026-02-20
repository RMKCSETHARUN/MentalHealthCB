import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    phoneNumber: '',
    alternateNumber: ''
  });

  const addAppointment = (appointment) => {
    setAppointmentHistory(prev => [...prev, appointment]);
  };

  const updateUserInfo = (info) => {
    setUserInfo(info);
  };

  return (
    <AppContext.Provider 
      value={{
        showAppointmentModal,
        setShowAppointmentModal,
        selectedPsychologist,
        setSelectedPsychologist,
        appointmentHistory,
        addAppointment,
        userInfo,
        updateUserInfo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 