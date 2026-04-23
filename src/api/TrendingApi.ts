export interface TrendingMovie {
  id: number;
  title: string;
  backdrop_url: string;
  poster_url: string;
}

export interface TrendingApiInterface {
  getTrending(): Promise<TrendingMovie[]>;
}

export default class TrendingApi implements TrendingApiInterface {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async getTrending(): Promise<TrendingMovie[]> {
    const response = await fetch(`${this.baseUrl}/trending`);

    if (!response.ok) {
      throw new Error(`Error fetching trending: ${response.statusText}`);
    }

    return await response.json();
  }
}
