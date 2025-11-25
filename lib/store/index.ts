import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { eventsApi } from "./api/eventsApi";
import authSlice from "./slices/authSlice";
import eventsSlice from "./slices/eventsSlice";
import userSlice from "./slices/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      user: userSlice,
      events: eventsSlice,
      [authApi.reducerPath]: authApi.reducer,
      [eventsApi.reducerPath]: eventsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(eventsApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
