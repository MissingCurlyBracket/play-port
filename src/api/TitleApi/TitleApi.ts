const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export interface Source {
  source_id: number;
  name: string;
  type: string;
  region: string;
  ios_url: string;
  android_url: string;
  web_url: string;
  format: string;
  price: number | null;
  seasons: number | null;
  episodes: number | null;
}

export interface Title {
  resultType: 'title';
  id: number;
  name: string;
  type: string;
  year: number;
  imdb_id: string;
  tmdb_id: number;
  tmdb_type: string;
}

export interface TitleApiInterface {
  getStreamingSources(titleId: number): Promise<Source[]>;
}

export default class TitleApi implements TitleApiInterface {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = apiBaseUrl;
  }

  async getStreamingSources(titleId: number): Promise<Source[]> {
    const response = await fetch(`${this.baseUrl}/title/${titleId}/sources`);

    if (!response.ok) {
      throw new Error(
        `Error fetching streaming sources: ${response.statusText}`,
      );
    }

    return await response.json();
  }
}
