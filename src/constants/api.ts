import { Platform } from "react-native";

const DEV_API_HOST = Platform.select({
  android: "192.168.100.28",
  ios: "192.168.100.28",
  default: "localhost",
});

export const API_BASE_URL = `http://${DEV_API_HOST}:5000/api/v1`;

export const ENDPOINTS = {
  LOGIN: "/user/login",
  REGISTER_STEP1: "/user/register/step1",
  VERIFY_EMAIL: "/user/register/verify-email",
  VERIFY_ID: "/user/register/verify-id",
  VERIFY_FACE: "/user/register/verify-face",
  FORGOT_PASSWORD: "/user/forgot-password",
  RESET_PASSWORD: "/user/reset-password",
  PROFILE: "/user/profile",
  LOGOUT: "/user/logout",
};
