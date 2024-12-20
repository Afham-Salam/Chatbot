
import axios from "axios";
// import { API_URL } from "./urls";
// import jsCookie from 'js-cookie';


// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGV5NWtkZDkwMDAwenJmeXpnYmxuOG9wIiwiZW1haWwiOiJhZG1pbkBmdXJzYW5jYXJ0LmNvbSIsImlhdCI6MTY3ODI3Mjk3NiwiZXhwIjoxNjc4ODc3Nzc2fQ.hffQm7Jk3fDV5f9uPf9_wHPIXPTYYO_q7sRCMNfaQPo"
// const API_URL = "http://192.168.1.27:3010/api"
const API_URL = "https://digitalmarketing-chatbot-ai.appii.space"

const APIClientPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": true,
    // Authorization:`Bearer ${token}`
  },
  // withCredentials: true,
});

export const APIClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

export default APIClientPrivate;
