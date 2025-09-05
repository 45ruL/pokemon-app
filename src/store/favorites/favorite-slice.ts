import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FavoritePokemon = {
  name: string;
  url?: string;
};

export type PendingItem = {
  data: FavoritePokemon;
  retries: number;
};

export type FavoritesState = {
  items: FavoritePokemon[];
  pendingQueue: PendingItem[];
};

const initialState: FavoritesState = {
  items: [],
  pendingQueue: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoritePokemon>) => {
      if (!state.items.some((p) => p.name === action.payload.name)) {
        state.items.push(action.payload);
        state.pendingQueue.push({ data: action.payload, retries: 0 });
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.name !== action.payload);
      state.pendingQueue = state.pendingQueue.filter(
        (p) => p.data.name !== action.payload
      );
    },
    markSynced: (state, action: PayloadAction<FavoritePokemon[]>) => {
      // Hapus item yang berhasil di-sync dari queue
      state.pendingQueue = state.pendingQueue.filter(
        (p) => !action.payload.some((s) => s.name === p.data.name)
      );
    },
    incrementRetry: (state, action: PayloadAction<string>) => {
      const item = state.pendingQueue.find(
        (p) => p.data.name === action.payload
      );
      if (item) {
        item.retries += 1;
      }
    },
  },
});

export const { addFavorite, removeFavorite, markSynced, incrementRetry } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
