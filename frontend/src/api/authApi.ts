import axios from "axios";
import { getApiUrl } from "../utils/env.util";
import { SignUpData, SignInData, AuthResponse } from "../types/auth.types";

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

export const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signin", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  checkAuth: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>("/auth/check");
    return response.data;
  },
};
