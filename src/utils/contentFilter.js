// List of abusive words to detect
const abusiveWords = [
  'abuse', 'hate', 'stupid', 'idiot', 'fool',
  // Add more words as needed
];

export const containsAbusiveContent = (text) => {
  const normalizedText = text.toLowerCase();
  return abusiveWords.some(word => normalizedText.includes(word));
};

export const sendWhatsAppAlert = async (phoneNumber, userName, message) => {
  try {
    // Using WhatsApp Business API
    const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: {
          body: `Alert: ${userName} used inappropriate language in the chat.\nMessage: "${message}"`
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp alert:', error);
    return false;
  }
}; 