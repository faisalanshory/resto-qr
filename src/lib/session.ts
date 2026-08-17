export function getCustomerSessionId(): string {
  if (typeof window === "undefined") return ""; // Server side fallback
  
  let sessionId = localStorage.getItem("qr-resto-session");
  if (!sessionId) {
    // Generate a new random session ID
    sessionId = `session_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    localStorage.setItem("qr-resto-session", sessionId);
  }
  return sessionId;
}

export function clearCustomerSessionId() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("qr-resto-session");
  }
}
