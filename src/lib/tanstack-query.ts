import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { Platform } from "react-native";

const safeStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web")
      return typeof localStorage !== "undefined"
        ? localStorage.getItem(key)
        : null;
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web")
      return typeof localStorage !== "undefined"
        ? localStorage.setItem(key, value)
        : undefined;
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web")
      return typeof localStorage !== "undefined"
        ? localStorage.removeItem(key)
        : undefined;
    return AsyncStorage.removeItem(key);
  },
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: safeStorage,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24,
});
