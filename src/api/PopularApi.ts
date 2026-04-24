export interface PopularTitle {
  id: number;
  title: string;
  media_type: 'movie' | 'tv';
  poster_url: string;
  backdrop_url: string;
}

export interface PopularApiInterface {
  getPopular(params: {
    type: 'movie' | 'tv';
    region?: string;
    providers?: string;
  }): Promise<PopularTitle[]>;
}

export default class PopularApi implements PopularApiInterface {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async getPopular({
    type,
    region,
    providers,
  }: {
    type: 'movie' | 'tv';
    region?: string;
    providers?: string;
  }): Promise<PopularTitle[]> {
    const url = new URL(`${this.baseUrl}/popular/${type}`);
    if (region) {
      url.searchParams.append('region', region);
    }
    if (providers) {
      url.searchParams.append('providers', providers);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Error fetching popular ${type}: ${response.statusText}`);
    }

    return await response.json();
  }
}
