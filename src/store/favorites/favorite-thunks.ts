import NetInfo from "@react-native-community/netinfo";
import { AppDispatch, RootState } from "..";
import { incrementRetry, markSynced, PendingItem } from "./favorite-slice";

const syncFavoritesAPI = async (favorites: PendingItem[]) => {
  // buat api beneran nanti
  return new Promise<PendingItem[]>((resolve, reject) => {
    setTimeout(() => {
      const success = favorites.filter(() => Math.random() > 0.2);
      resolve(success);
    }, 1000);
  });
};

export const syncFavorites =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    const { pendingQueue } = getState().favorites;
    if (pendingQueue.length === 0) return;

    try {
      console.log("Syncing favorites queue:", pendingQueue);
      const synced = await syncFavoritesAPI(pendingQueue);

      dispatch(markSynced(synced.map((p) => p.data)));

      pendingQueue.forEach((p) => {
        if (!synced.some((s) => s.data.name === p.data.name)) {
          dispatch(incrementRetry(p.data.name));
        }
      });
    } catch (err) {
      console.error("Sync failed, will retry later", err);
    }
  };

let syncInterval: ReturnType<typeof setInterval> | null = null;
export const startAutoSync = () => (dispatch: AppDispatch) => {
  if (syncInterval) return;
  syncInterval = setInterval(() => {
    dispatch(syncFavorites());
  }, 30_000);
};

export const stopAutoSync = () => {
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = null;
};
