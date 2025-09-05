import { api } from "@/src/lib/axios";
import { fetchPokemonDetail, fetchPokemonList } from "../pokemon";

jest.mock("@/src/lib/axios");

describe("Pokemon Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call api.get with correct URL for fetchPokemonList", async () => {
    const mockData = { results: [] };
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const data = await fetchPokemonList(20);

    expect(api.get).toHaveBeenCalledWith("/pokemon?limit=20&offset=20");
    expect(data).toEqual(mockData);
  });

  it("should throw error when API fails for fetchPokemonList", async () => {
    const error = new Error("Network error");
    (api.get as jest.Mock).mockRejectedValueOnce(error);

    await expect(fetchPokemonList(0)).rejects.toThrow("Network error");
  });

  // --- Tambahan untuk fetchPokemonDetail ---
  it("should call api.get with correct URL for fetchPokemonDetail", async () => {
    const mockData = { name: "Pikachu" };
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const data = await fetchPokemonDetail("Pikachu");

    expect(api.get).toHaveBeenCalledWith("/pokemon/Pikachu");
    expect(data).toEqual(mockData);
  });

  it("should throw error when API fails for fetchPokemonDetail", async () => {
    const error = new Error("Network error");
    (api.get as jest.Mock).mockRejectedValueOnce(error);

    await expect(fetchPokemonDetail("Pikachu")).rejects.toThrow(
      "Network error"
    );
  });
});
