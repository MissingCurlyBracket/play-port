export interface SearchResult {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  media_type: string;
}

export interface SearchApiInterface {
  search(params: { name: string }): Promise<SearchResult[]>;
}

export default class SearchApi implements SearchApiInterface {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async search({ name }: { name: string }): Promise<SearchResult[]> {
    const response = await fetch(
      `${this.baseUrl}/search?name=${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching search results: ${response.statusText}`);
    }

    return await response.json();
  }
}
