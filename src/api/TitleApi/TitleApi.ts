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

export interface Movie {
  id: number;
  name: string;
  type: 'movie';
  year: number;
  imdb_id: string;
  tmdb_id: number;
  tmdb_type: string;
}

export interface TvSeries {
  id: number;
  name: string;
  type: 'tv_series';
  year: number;
  imdb_id: string;
  tmdb_id: number;
  tmdb_type: 'tv';
}

export type Title = Movie | TvSeries;

export interface TitleApiInterface {
  getStreamingSources(titleId: number): Promise<Source[]>;
}

export default class TitleApi implements TitleApiInterface {
  private readonly apiKey: string;

  constructor(apiKey: string) {
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
