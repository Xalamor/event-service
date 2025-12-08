import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Функции для безопасного доступа к localStorage
const getInitialToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const getInitialRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
};

const initialState: AuthState = {
  token: null, // Инициализируем как null, потом обновим в useEffect
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const token = getInitialToken();
      const refreshToken = getInitialRefreshToken();

      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = !!token;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // В редьюсере loginSuccess:
    loginSuccess: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.access; // Это будет result.token
      state.refreshToken = action.payload.refresh; // Пустая строка
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.access);
        // refresh не сохраняем, так как его нет
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.error = action.payload;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  initializeAuth,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
