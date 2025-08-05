const apiKey = import.meta.env.VITE_WATCHMODE_API_KEY;

export interface Source {
  source_id: number;
  name: string;
  type: string;
  region: string;
  ios_url: string;
  android_url: string;
  web_url: string;
  format: string;
  price?: number;
  seasons?: number;
  episodes?: number;
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
  private readonly apiKey: string;

  constructor() {
    this.apiKey = apiKey;
  }

  async getStreamingSources(titleId: number): Promise<Source[]> {
    const response = await fetch(
      `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=${this.apiKey}`,
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching streaming sources: ${response.statusText}`,
      );
    }

    const { data } = await response.json();
    return data;
  }
}
