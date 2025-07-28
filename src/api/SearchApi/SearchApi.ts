import type { Title } from '../TitleApi/TitleApi.ts';

interface Person {
  id: number;
  name: string;
  main_profession: string;
  imdb_id: string;
  tmdb_id: number;
}

type SearchResult = Title | Person;

export interface SearchApiInterface {
  getByName(name: string): Promise<SearchResult[]>;
}

export default class SearchApi implements SearchApiInterface {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getByName(name: string): Promise<SearchResult[]> {
    const response = await fetch(
      `https://api.watchmode.com/v1/search/?apiKey=${this.apiKey}&search_field=name&search_value=${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching search results: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  }
}
