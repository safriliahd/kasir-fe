import axios from "axios";

const API_URL = axios.create({
  baseURL: "http://localhost:3000", // URL backend
  withCredentials: true, // Include credentials (cookies) in the request
});// URL backend


export default API_URL;
