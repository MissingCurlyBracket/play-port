export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_url: string;
}

export interface TitleApiInterface {
  getProviders(params: {
    type: 'movie' | 'tv';
    id: number;
    region?: string;
    providers?: string;
  }): Promise<Provider[]>;
}

export default class TitleApi implements TitleApiInterface {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async getProviders({
    type,
    id,
    region,
    providers,
  }: {
    type: 'movie' | 'tv';
    id: number;
    region?: string;
    providers?: string;
  }): Promise<Provider[]> {
    const url = new URL(`${this.baseUrl}/${type}/${id}/providers`);
    if (region) {
      url.searchParams.append('region', region);
    }
    if (providers) {
      url.searchParams.append('providers', providers);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Error fetching providers: ${response.statusText}`);
    }

    return await response.json();
  }
}
