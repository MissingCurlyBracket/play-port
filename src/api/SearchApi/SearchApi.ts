import type { Title } from '../TitleApi/TitleApi.ts';

const apiKey = import.meta.env.VITE_WATCHMODE_API_KEY;

export interface Person {
  resultType: 'person';
  id: number;
  name: string;
  main_profession: string | null;
  imdb_id: string | null;
  tmdb_id: number | null;
}

export interface SearchResult {
  title_results: Title[];
  people_results: Person[];
}

export interface AutocompleteResult {
  resultType: 'title';
  relevance: number;
  id: number;
  name: string;
  type: string;
  year: number;
  imdb_id: string;
  tmdb_id: number;
  tmdb_type: string;
  imageUrl: string;
}

export interface SearchApiInterface {
  getByName(name: string): Promise<SearchResult>;
  getAutocomplete(
    name: string,
    type: 1 | 2 | 3 | 4 | 5,
  ): Promise<AutocompleteResult[]>;
}

export default class SearchApi implements SearchApiInterface {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = apiKey;
  }

  async getByName(name: string): Promise<SearchResult> {
    const response = await fetch(
      `https://api.watchmode.com/v1/search/?apiKey=${this.apiKey}&search_field=name&search_value=${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching search results: ${response.statusText}`);
    }

    return await response.json();
  }

  async getAutocomplete(
    name: string,
    type: 1 | 2 | 3 | 4 | 5,
  ): Promise<AutocompleteResult[]> {
    const response = await fetch(
      `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${this.apiKey}&search_value=${encodeURIComponent(name)}&search_type=${type}`,
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching autocomplete results: ${response.statusText}`,
      );
    }

    return await response.json();
  }
}
