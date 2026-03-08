export interface Region {
  code: string;
  name: string;
}

export interface RegionsApiInterface {
  getRegions(): Promise<Region[]>;
}

export default class RegionApi implements RegionsApiInterface {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async getRegions(): Promise<Region[]> {
    const response = await fetch(`${this.baseUrl}/regions`);

    if (!response.ok) {
      throw new Error(`Error fetching regions: ${response.statusText}`);
    }

    return await response.json();
  }
}
