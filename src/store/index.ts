import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import { persistReducer, persistStore } from "redux-persist";
import favoritesReducer from "./favorites/favorite-slice";

const crossPlatformStorage =
  Platform.OS === "web"
    ? {
        getItem: async (key: string) => localStorage.getItem(key),
        setItem: async (key: string, value: string) =>
          localStorage.setItem(key, value),
        removeItem: async (key: string) => localStorage.removeItem(key),
      }
    : AsyncStorage;

const persistConfig = {
  key: "root",
  storage: crossPlatformStorage,
  whitelist: ["favorites"],
};

const rootReducer = combineReducers({
  favorites: favoritesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
