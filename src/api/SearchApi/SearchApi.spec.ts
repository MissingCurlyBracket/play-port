import SearchApi from './SearchApi.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

globalThis.fetch = vi.fn();

describe('SearchApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searches by name', async () => {
    const name = 'Inception';
    const mockResponse = {
      data: {
        title_results: [
          {
            resultType: 'title',
            id: 1,
            name: 'Inception',
            type: 'movie',
            year: 2010,
            imdb_id: 'tt1375666',
            tmdb_id: 27205,
            tmdb_type: 'movie',
          },
        ],
        people_results: [],
      },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const searchApi = new SearchApi();
    const result = await searchApi.getByName(name);

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.watchmode.com/v1/search/?apiKey=test_api_key&search_field=name&search_value=${encodeURIComponent(name)}`,
    );
  });

  it('throws error when API response is not ok', async () => {
    const name = 'Inception';
    const errorStatus = 'Not Found';

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      statusText: errorStatus,
    } as Response);

    const searchApi = new SearchApi();

    await expect(searchApi.getByName(name)).rejects.toThrow(
      `Error fetching search results: ${errorStatus}`,
    );

    expect(fetch).toHaveBeenCalledWith(
      `https://api.watchmode.com/v1/search/?apiKey=test_api_key&search_field=name&search_value=${encodeURIComponent(name)}`,
    );
  });
});
