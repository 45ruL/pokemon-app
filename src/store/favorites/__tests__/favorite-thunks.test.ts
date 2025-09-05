// src/store/__tests__/favorite-thunks.test.ts
import NetInfo from "@react-native-community/netinfo";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer, {
  incrementRetry,
  markSynced,
  PendingItem,
} from "../favorite-slice";

// Mock NetInfo
jest.mock("@react-native-community/netinfo");

const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;

// Mock the sync API function
const mockSyncFavoritesAPI = jest.fn();

// Create a test version of the thunks with mocked API
const createSyncFavorites = (syncAPI = mockSyncFavoritesAPI) => {
  return () => async (dispatch: any, getState: any) => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    const { pendingQueue } = getState().favorites;
    if (pendingQueue.length === 0) return;

    try {
      console.log("Syncing favorites queue:", pendingQueue);
      const synced = await syncAPI(pendingQueue);

      dispatch(markSynced(synced.map((p: PendingItem) => p.data)));

      pendingQueue.forEach((p: PendingItem) => {
        if (!synced.some((s: PendingItem) => s.data.name === p.data.name)) {
          dispatch(incrementRetry(p.data.name));
        }
      });
    } catch (err) {
      console.error("Sync failed, will retry later", err);
    }
  };
};

let mockSyncInterval: ReturnType<typeof setInterval> | null = null;

const createStartAutoSync = (syncFn: any) => {
  return () => (dispatch: any) => {
    if (mockSyncInterval) return;
    mockSyncInterval = setInterval(() => {
      dispatch(syncFn());
    }, 30000);
  };
};

const createStopAutoSync = () => {
  return () => {
    if (mockSyncInterval) {
      clearInterval(mockSyncInterval);
      mockSyncInterval = null;
    }
  };
};

describe("Favorites Thunks", () => {
  let store: ReturnType<typeof configureStore>;

  const mockPendingItems: PendingItem[] = [
    { data: { name: "pikachu", url: "url1" }, retries: 0 },
    { data: { name: "charizard", url: "url2" }, retries: 1 },
    { data: { name: "bulbasaur", url: "url3" }, retries: 0 },
  ];

  beforeEach(() => {
    // Create a test store
    store = configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
      preloadedState: {
        favorites: {
          items: mockPendingItems.map((p) => p.data),
          pendingQueue: mockPendingItems,
        },
      },
    });

    jest.clearAllMocks();
    jest.useFakeTimers();
    mockSyncInterval = null;
  });

  afterEach(() => {
    jest.useRealTimers();
    if (mockSyncInterval) {
      clearInterval(mockSyncInterval);
      mockSyncInterval = null;
    }
  });

  describe("syncFavorites", () => {
    it("should not sync when network is not connected", async () => {
      mockNetInfo.fetch.mockResolvedValue({ isConnected: false } as any);

      const syncFavorites = createSyncFavorites();
      const initialState = store.getState();

      await store.dispatch(syncFavorites() as any);

      const finalState = store.getState();
      expect(finalState).toEqual(initialState);
      expect(mockSyncFavoritesAPI).not.toHaveBeenCalled();
    });

    it("should not sync when pending queue is empty", async () => {
      mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);

      // Create store with empty pending queue
      const emptyStore = configureStore({
        reducer: { favorites: favoritesReducer },
        preloadedState: {
          favorites: { items: [], pendingQueue: [] },
        },
      });

      const syncFavorites = createSyncFavorites();
      await emptyStore.dispatch(syncFavorites() as any);

      expect(mockSyncFavoritesAPI).not.toHaveBeenCalled();
    });

    it("should successfully sync all items", async () => {
      mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);
      mockSyncFavoritesAPI.mockResolvedValue(mockPendingItems);

      const syncFavorites = createSyncFavorites();
      await store.dispatch(syncFavorites() as any);

      expect(mockSyncFavoritesAPI).toHaveBeenCalledWith(mockPendingItems);

      const finalState = store.getState() as {
        favorites: {
          items: PendingItem["data"][];
          pendingQueue: PendingItem[];
        };
      };
      expect(finalState.favorites.pendingQueue).toHaveLength(0);
    });

    it("should handle partial sync success", async () => {
      mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);

      const successfulItems = mockPendingItems.slice(0, 2);
      mockSyncFavoritesAPI.mockResolvedValue(successfulItems);

      const syncFavorites = createSyncFavorites();
      await store.dispatch(syncFavorites() as any);

      const finalState = store.getState() as {
        favorites: {
          items: PendingItem["data"][];
          pendingQueue: PendingItem[];
        };
      };

      // Should have removed synced items from pending queue
      expect(finalState.favorites.pendingQueue).toHaveLength(1);
      expect(finalState.favorites.pendingQueue[0].data.name).toBe("bulbasaur");

      // Should have incremented retry for failed item
      expect(finalState.favorites.pendingQueue[0].retries).toBe(1);
    });

    it("should handle API failure gracefully", async () => {
      mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);
      mockSyncFavoritesAPI.mockRejectedValue(new Error("API Error"));

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const syncFavorites = createSyncFavorites();
      const initialState = store.getState() as {
        favorites: {
          items: PendingItem["data"][];
          pendingQueue: PendingItem[];
        };
      };

      await store.dispatch(syncFavorites() as any);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Sync failed, will retry later",
        expect.any(Error)
      );

      const finalState = store.getState() as {
        favorites: {
          items: PendingItem["data"][];
          pendingQueue: PendingItem[];
        };
      };
      expect(finalState.favorites.pendingQueue).toEqual(
        initialState.favorites.pendingQueue
      );

      consoleSpy.mockRestore();
    });

    it("should handle NetInfo fetch failure", async () => {
      mockNetInfo.fetch.mockRejectedValue(new Error("NetInfo Error"));

      const syncFavorites = createSyncFavorites();

      await expect(store.dispatch(syncFavorites() as any)).rejects.toThrow(
        "NetInfo Error"
      );
    });
  });

  describe("Auto Sync Functions", () => {
    it("should start auto sync interval", () => {
      const syncFn = createSyncFavorites();
      const startAutoSync = createStartAutoSync(syncFn);

      store.dispatch(startAutoSync() as any);

      expect(mockSyncInterval).not.toBeNull();
    });

    it("should stop auto sync interval", () => {
      const syncFn = createSyncFavorites();
      const startAutoSync = createStartAutoSync(syncFn);
      const stopAutoSync = createStopAutoSync();

      store.dispatch(startAutoSync() as any);
      expect(mockSyncInterval).not.toBeNull();

      stopAutoSync();
      expect(mockSyncInterval).toBeNull();
    });

    it("should not start multiple intervals", () => {
      const syncFn = createSyncFavorites();
      const startAutoSync = createStartAutoSync(syncFn);

      store.dispatch(startAutoSync() as any);
      const firstInterval = mockSyncInterval;

      store.dispatch(startAutoSync() as any);
      expect(mockSyncInterval).toBe(firstInterval);
    });
  });
});
