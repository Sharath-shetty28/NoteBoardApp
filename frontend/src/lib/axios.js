// import axios from "axios";

// // in production, there's no localhost so we have to make this dynamic
// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// console.log("API Base URL:", BASE_URL);

// export default api;

import axios from "axios";

// In development, Vite will proxy "/api" to backend (5001)
// In production, frontend + backend will share the same domain
const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

console.log("🔗 AXIOS BASE URL:", api.defaults.baseURL);

export default api;
