import type { Title } from '../TitleApi/TitleApi.ts';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
  result_type: 'title';
  relevance: number;
  id: number;
  name: string;
  type: string;
  year: number;
  imdb_id: string;
  tmdb_id: number;
  tmdb_type: string;
  image_url: string;
}

export interface AutocompleteResponse {
  results: AutocompleteResult[];
}

export interface SearchApiInterface {
  getByName(name: string): Promise<SearchResult>;
  getAutocomplete(
    name: string,
    type: 1 | 2 | 3 | 4 | 5,
  ): Promise<AutocompleteResponse>;
}

export default class SearchApi implements SearchApiInterface {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = apiBaseUrl;
  }

  async getByName(name: string): Promise<SearchResult> {
    const response = await fetch(
      `${this.baseUrl}/search?name=${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching search results: ${response.statusText}`);
    }

    return await response.json();
  }

  async getAutocomplete(
    name: string,
    type: 1 | 2 | 3 | 4 | 5,
  ): Promise<AutocompleteResponse> {
    const response = await fetch(
      `${this.baseUrl}/autocomplete?name=${encodeURIComponent(name)}&type=${type}`,
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching autocomplete results: ${response.statusText}`,
      );
    }

    return await response.json();
  }
}
