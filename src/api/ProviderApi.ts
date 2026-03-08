import type { Provider } from './TitleApi.ts';

export interface ProviderApiInterface {
  getProviders(params: { region: string }): Promise<Provider[]>;
}

export default class ProviderApi implements ProviderApiInterface {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async getProviders({ region }: { region: string }): Promise<Provider[]> {
    const url = new URL(`${this.baseUrl}/providers`);
    url.searchParams.append('region', region);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Error fetching providers: ${response.statusText}`);
    }

    return await response.json();
  }
}
