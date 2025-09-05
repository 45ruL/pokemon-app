import NetInfo from "@react-native-community/netinfo";
import { AppDispatch, RootState } from "..";
import { incrementRetry, markSynced, PendingItem } from "./favorite-slice";

// PSEUDO-API
const syncFavoritesAPI = async (favorites: PendingItem[]) => {
  // Ganti dengan API call nyata
  // Bisa return hanya item yang berhasil
  return new Promise<PendingItem[]>((resolve, reject) => {
    setTimeout(() => {
      // Simulasi: random gagal 20%
      const success = favorites.filter(() => Math.random() > 0.2);
      resolve(success);
    }, 1000);
  });
};

// Thunk untuk sync dengan queue + retry
export const syncFavorites =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    const { pendingQueue } = getState().favorites;
    if (pendingQueue.length === 0) return;

    try {
      console.log("Syncing favorites queue:", pendingQueue);
      const synced = await syncFavoritesAPI(pendingQueue);

      // Tandai sukses
      dispatch(markSynced(synced.map((p) => p.data)));

      // Increment retries untuk yang gagal
      pendingQueue.forEach((p) => {
        if (!synced.some((s) => s.data.name === p.data.name)) {
          dispatch(incrementRetry(p.data.name));
        }
      });
    } catch (err) {
      console.error("Sync failed, will retry later", err);
      // Semua item akan dicoba lagi saat online berikutnya
    }
  };

// Auto retry interval (misal tiap 30 detik)
let syncInterval: ReturnType<typeof setInterval> | null = null;
export const startAutoSync = () => (dispatch: AppDispatch) => {
  if (syncInterval) return; // sudah berjalan
  syncInterval = setInterval(() => {
    dispatch(syncFavorites());
  }, 30_000);
};

export const stopAutoSync = () => {
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = null;
};
