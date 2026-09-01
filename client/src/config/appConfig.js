export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  saweriaUrl: import.meta.env.VITE_SAWERIA_URL || "https://saweria.co/fermanferdaus",
  feedbackEmail: import.meta.env.VITE_FEEDBACK_EMAIL || "support@resumix.id",
};
