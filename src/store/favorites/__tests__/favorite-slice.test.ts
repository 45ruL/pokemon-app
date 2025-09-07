import favoritesReducer, {
  addFavorite,
  FavoritePokemon,
  FavoritesState,
  incrementRetry,
  markSynced,
  removeFavorite,
} from "../favorite-slice";

describe("favoritesSlice", () => {
  const initialState: FavoritesState = {
    items: [],
    pendingQueue: [],
  };

  const mockPokemon1: FavoritePokemon = {
    name: "pikachu",
    url: "https://pokeapi.co/api/v2/pokemon/25/",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    rating: 5,
    types: ["electric"],
  };

  const mockPokemon2: FavoritePokemon = {
    name: "charizard",
    url: "https://pokeapi.co/api/v2/pokemon/6/",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    rating: 4,
    types: ["fire", "flying"],
  };

  const mockPokemon3: FavoritePokemon = {
    name: "bulbasaur",
    url: "https://pokeapi.co/api/v2/pokemon/1/",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    rating: 3,
    types: ["grass", "poison"],
  };

  describe("addFavorite", () => {
    it("should add a new favorite pokemon to empty state", () => {
      const action = addFavorite(mockPokemon1);
      const state = favoritesReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPokemon1);
      expect(state.pendingQueue).toHaveLength(1);
      expect(state.pendingQueue[0]).toEqual({
        data: mockPokemon1,
        retries: 0,
      });
    });

    it("should add multiple different pokemon", () => {
      let state = favoritesReducer(initialState, addFavorite(mockPokemon1));
      state = favoritesReducer(state, addFavorite(mockPokemon2));

      expect(state.items).toHaveLength(2);
      expect(state.items).toContainEqual(mockPokemon1);
      expect(state.items).toContainEqual(mockPokemon2);
      expect(state.pendingQueue).toHaveLength(2);
    });

    it("should not add duplicate pokemon", () => {
      let state = favoritesReducer(initialState, addFavorite(mockPokemon1));
      state = favoritesReducer(state, addFavorite(mockPokemon1));

      expect(state.items).toHaveLength(1);
      expect(state.pendingQueue).toHaveLength(1);
    });

    it("should not add pokemon with same name but different url", () => {
      const duplicatePokemon = { ...mockPokemon1, url: "different-url" };
      let state = favoritesReducer(initialState, addFavorite(mockPokemon1));
      state = favoritesReducer(state, addFavorite(duplicatePokemon));

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPokemon1);
      expect(state.pendingQueue).toHaveLength(1);
    });
  });

  describe("removeFavorite", () => {
    const stateWithItems: FavoritesState = {
      items: [mockPokemon1, mockPokemon2, mockPokemon3],
      pendingQueue: [
        { data: mockPokemon1, retries: 0 },
        { data: mockPokemon2, retries: 1 },
        { data: mockPokemon3, retries: 2 },
      ],
    };

    it("should remove existing pokemon from both items and pendingQueue", () => {
      const state = favoritesReducer(stateWithItems, removeFavorite("pikachu"));

      expect(state.items).toHaveLength(2);
      expect(state.items).not.toContainEqual(mockPokemon1);
      expect(state.items).toContainEqual(mockPokemon2);
      expect(state.items).toContainEqual(mockPokemon3);

      expect(state.pendingQueue).toHaveLength(2);
      expect(state.pendingQueue.map((p) => p.data.name)).not.toContain(
        "pikachu"
      );
    });

    it("should handle removing non-existent pokemon", () => {
      const state = favoritesReducer(
        stateWithItems,
        removeFavorite("nonexistent")
      );

      expect(state.items).toHaveLength(3);
      expect(state.pendingQueue).toHaveLength(3);
      expect(state).toEqual(stateWithItems);
    });

    it("should remove all items when called multiple times", () => {
      let state = stateWithItems;
      state = favoritesReducer(state, removeFavorite("pikachu"));
      state = favoritesReducer(state, removeFavorite("charizard"));
      state = favoritesReducer(state, removeFavorite("bulbasaur"));

      expect(state.items).toHaveLength(0);
      expect(state.pendingQueue).toHaveLength(0);
    });
  });

  describe("markSynced", () => {
    const stateWithPending: FavoritesState = {
      items: [mockPokemon1, mockPokemon2, mockPokemon3],
      pendingQueue: [
        { data: mockPokemon1, retries: 0 },
        { data: mockPokemon2, retries: 1 },
        { data: mockPokemon3, retries: 2 },
      ],
    };

    it("should remove synced items from pending queue", () => {
      const syncedItems = [mockPokemon1, mockPokemon3];
      const state = favoritesReducer(stateWithPending, markSynced(syncedItems));

      expect(state.items).toHaveLength(3); // Items should remain unchanged
      expect(state.pendingQueue).toHaveLength(1);
      expect(state.pendingQueue[0].data).toEqual(mockPokemon2);
    });

    it("should handle empty synced array", () => {
      const state = favoritesReducer(stateWithPending, markSynced([]));

      expect(state.items).toHaveLength(3);
      expect(state.pendingQueue).toHaveLength(3);
      expect(state).toEqual(stateWithPending);
    });

    it("should handle syncing all items", () => {
      const syncedItems = [mockPokemon1, mockPokemon2, mockPokemon3];
      const state = favoritesReducer(stateWithPending, markSynced(syncedItems));

      expect(state.items).toHaveLength(3);
      expect(state.pendingQueue).toHaveLength(0);
    });

    it("should handle syncing non-existent items", () => {
      const nonExistentPokemon: FavoritePokemon = {
        name: "nonexistent",
        url: "",
        image: "",
        rating: null,
        types: [],
      };
      const state = favoritesReducer(
        stateWithPending,
        markSynced([nonExistentPokemon])
      );

      expect(state.items).toHaveLength(3);
      expect(state.pendingQueue).toHaveLength(3);
      expect(state).toEqual(stateWithPending);
    });
  });

  describe("incrementRetry", () => {
    const stateWithPending: FavoritesState = {
      items: [mockPokemon1, mockPokemon2],
      pendingQueue: [
        { data: mockPokemon1, retries: 0 },
        { data: mockPokemon2, retries: 2 },
      ],
    };

    it("should increment retry count for existing item", () => {
      const state = favoritesReducer(
        stateWithPending,
        incrementRetry("pikachu")
      );

      expect(state.pendingQueue[0].retries).toBe(1);
      expect(state.pendingQueue[1].retries).toBe(2); // Should remain unchanged
    });

    it("should increment retry count multiple times", () => {
      let state = stateWithPending;
      state = favoritesReducer(state, incrementRetry("pikachu"));
      state = favoritesReducer(state, incrementRetry("pikachu"));
      state = favoritesReducer(state, incrementRetry("pikachu"));

      expect(state.pendingQueue[0].retries).toBe(3);
    });

    it("should handle incrementing retry for non-existent item", () => {
      const state = favoritesReducer(
        stateWithPending,
        incrementRetry("nonexistent")
      );

      expect(state.pendingQueue[0].retries).toBe(0);
      expect(state.pendingQueue[1].retries).toBe(2);
      expect(state).toEqual(stateWithPending);
    });

    it("should handle incrementing retry in empty queue", () => {
      const state = favoritesReducer(initialState, incrementRetry("pikachu"));

      expect(state.pendingQueue).toHaveLength(0);
      expect(state).toEqual(initialState);
    });
  });

  describe("reducer edge cases", () => {
    it("should return initial state when called with undefined state", () => {
      const state = favoritesReducer(undefined, { type: "unknown" });
      expect(state).toEqual(initialState);
    });

    it("should handle unknown action types", () => {
      const state = favoritesReducer(initialState, { type: "unknown" } as any);
      expect(state).toEqual(initialState);
    });

    it("should maintain state immutability", () => {
      const state = favoritesReducer(initialState, addFavorite(mockPokemon1));

      expect(state).not.toBe(initialState);
      expect(state.items).not.toBe(initialState.items);
      expect(state.pendingQueue).not.toBe(initialState.pendingQueue);
    });
  });
});
