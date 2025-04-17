export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning ☀️! Ready for a healthy breakfast?";
  if (hour < 18) return "Good afternoon 🌞! Let's see what's for lunch.";
  return "Good evening 🌙! Scanning your delicious dinner?";
};
