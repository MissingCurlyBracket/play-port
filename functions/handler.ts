import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Declare process for TS if types are missing in this context
// eslint-disable-next-line no-var
declare var process: {
  env: {
    WATCHMODE_API_KEY: string;
    TMDB_READ_ACCESS_TOKEN: string;
    [key: string]: string | undefined;
  };
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};

const getWatchmodeApiKey = () => process.env.WATCHMODE_API_KEY;
const getTmdbAccessToken = () => process.env.TMDB_READ_ACCESS_TOKEN;

interface WatchmodeSource {
  source_id: number;
  name: string;
  type: string;
  region: string;
  ios_url: string;
  android_url: string;
  web_url: string;
  format: string;
  price: number | null;
  seasons: number;
  episodes: number;
}

interface TmdbMultiSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  overview?: string;
  // Movie specific
  title?: string;
  original_title?: string;
  release_date?: string;
  // TV specific
  name?: string;
  original_name?: string;
  first_air_date?: string;
}

interface TmdbProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

interface TmdbProvidersResponse {
  id: number;
  results: {
    [region: string]:
      | {
          link: string;
          flatrate?: TmdbProvider[];
          rent?: TmdbProvider[];
          buy?: TmdbProvider[];
        }
      | undefined;
  };
}

interface TmdbSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export const searchByName = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const apiKey = getWatchmodeApiKey();
  const name = event.queryStringParameters?.name;

  if (!name) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing name parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const autocomplete = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const apiKey = getWatchmodeApiKey();
  const name = event.queryStringParameters?.name;
  const type = event.queryStringParameters?.type;

  if (!name || !type) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing name or type parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${apiKey}&search_value=${encodeURIComponent(name)}&search_type=${type}`,
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getStreamingSources = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const apiKey = getWatchmodeApiKey();
  const titleId = event.pathParameters?.id;
  const region = event.queryStringParameters?.region;

  if (!titleId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing titleId parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=${apiKey}`,
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const data = await response.json();

    if (region) {
      if (Array.isArray(data)) {
        const filteredData = (data as WatchmodeSource[]).filter(
          (source) => source.region === region,
        );
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(filteredData),
        };
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const search = async (event: APIGatewayProxyEvent) => {
  const apiKey = getTmdbAccessToken();
  const name = event.queryStringParameters?.name;

  if (!name) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing name parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(name)}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const { results } =
      (await response.json()) as TmdbSearchResponse<TmdbMultiSearchResult>;

    const filteredResults = results
      .filter(
        (result) => result.media_type === 'movie' || result.media_type === 'tv',
      )
      .map((result) => {
        let title = '';
        let release_date = '';

        if (result.media_type === 'movie') {
          title = result.title || result.original_title || '';
          release_date = result.release_date
            ? result.release_date.split('-')[0]
            : '';
        } else if (result.media_type === 'tv') {
          title = result.name || result.original_name || '';
          release_date = result.first_air_date
            ? result.first_air_date.split('-')[0]
            : '';
        }

        return {
          id: result.id,
          title,
          overview: result.overview || '',
          release_date,
          media_type: result.media_type,
        };
      });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(filteredResults),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getMovieProviders = async (event: APIGatewayProxyEvent) => {
  const apiKey = getTmdbAccessToken();
  const movieId = event.pathParameters?.movieId;
  const region = event.queryStringParameters?.region;

  if (!movieId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing titleId parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const data = (await response.json()) as TmdbProvidersResponse;
    if (region) {
      if (data.results && data.results[region]) {
        const providers = (data.results[region]!.flatrate || []).map(
          (provider) => ({
            provider_id: provider.provider_id,
            provider_name: provider.provider_name,
          }),
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(providers),
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([]),
      };
    }

    const allProviders = new Map<
      number,
      { provider_id: number; provider_name: string }
    >();

    if (data.results) {
      Object.keys(data.results).forEach((key) => {
        const regionData = data.results[key];
        if (regionData && regionData.flatrate) {
          regionData.flatrate.forEach((provider) => {
            if (!allProviders.has(provider.provider_id)) {
              allProviders.set(provider.provider_id, {
                provider_id: provider.provider_id,
                provider_name: provider.provider_name,
              });
            }
          });
        }
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(Array.from(allProviders.values())),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getTvProviders = async (event: APIGatewayProxyEvent) => {
  const apiKey = getTmdbAccessToken();
  const seriesId = event.pathParameters?.seriesId;
  const region = event.queryStringParameters?.region;

  if (!seriesId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing titleId parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}/watch/providers`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const data = (await response.json()) as TmdbProvidersResponse;
    if (region) {
      if (data.results && data.results[region]) {
        const providers = (data.results[region]!.flatrate || []).map(
          (provider) => ({
            provider_id: provider.provider_id,
            provider_name: provider.provider_name,
          }),
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(providers),
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([]),
      };
    }

    const allProviders = new Map<
      number,
      { provider_id: number; provider_name: string }
    >();

    if (data.results) {
      Object.keys(data.results).forEach((key) => {
        const regionData = data.results[key];
        if (regionData && regionData.flatrate) {
          regionData.flatrate.forEach((provider) => {
            if (!allProviders.has(provider.provider_id)) {
              allProviders.set(provider.provider_id, {
                provider_id: provider.provider_id,
                provider_name: provider.provider_name,
              });
            }
          });
        }
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(Array.from(allProviders.values())),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
