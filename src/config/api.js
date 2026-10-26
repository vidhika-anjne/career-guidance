// Centralized API configuration
// Automatically detect if running on localhost or network IP
const hostname = window.location.hostname;
export const API_BASE = process.env.REACT_APP_API_BASE || `http://${hostname}:5000`;

export default { API_BASE };
