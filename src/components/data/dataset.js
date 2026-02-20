const dataset = [
  {
    pattern: /(hi|hello|hey)/i,
    response: "Hello! I'm here to help you with your mental health concerns. How are you feeling today?"
  },
  {
    pattern: /(how are you|how're you)/i,
    response: "I'm functioning well, thank you! More importantly, how are you doing?"
  },
  {
    pattern: /(sad|depressed|unhappy)/i,
    response: "I'm sorry to hear that you're feeling this way. Would you like to talk about what's bothering you? I can also help you book an appointment with a professional if you'd like."
  },
  {
    pattern: /(anxious|worried|stressed)/i,
    response: "It's normal to feel anxious sometimes. Would you like to talk to a professional about this? I can help you book an appointment."
  },
  {
    pattern: /(book|schedule|appointment|meet|doctor)/i,
    response: "APPOINTMENT_BOOKING"
  },
  {
    pattern: /(thank you|thanks)/i,
    response: "You're welcome! Remember, I'm here to support you whenever you need to talk."
  },
  {
    pattern: /(bye|goodbye|see you)/i,
    response: "Take care! Remember, you can always come back if you need someone to talk to."
  }
];

export default dataset; 