import { beforeEach, describe, expect, it, vi } from 'vitest';
import TitleApi from './TitleApi.ts';

globalThis.fetch = vi.fn();

describe('TitleApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches streaming sources for a title', async () => {
    const titleId = 42;
    const mockResponse = {
      data: {
        source_id: 203,
        name: 'Netflix',
        type: 'sub',
        region: 'US',
        ios_url: 'https://www.netflix.com/title/123456',
        android_url: 'https://www.netflix.com/title/123456',
        web_url: 'https://www.netflix.com/title/123456',
        format: 'HD',
      },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const titleApi = new TitleApi();
    const result = await titleApi.getStreamingSources(titleId);
    expect(result).toEqual(mockResponse.data);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=test_api_key`,
    );
  });

  it('throws error when API response is not ok', async () => {
    const titleId = 42;
    const errorStatus = 'Not Found';

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      statusText: errorStatus,
    } as Response);

    const titleApi = new TitleApi();

    await expect(titleApi.getStreamingSources(titleId)).rejects.toThrow(
      `Error fetching streaming sources: ${errorStatus}`,
    );

    expect(fetch).toHaveBeenCalledWith(
      `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=test_api_key`,
    );
  });
});
