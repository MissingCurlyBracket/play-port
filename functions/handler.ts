import type { APIGatewayProxyEvent } from 'aws-lambda';

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

const getTmdbAccessToken = () => process.env.TMDB_READ_ACCESS_TOKEN;

interface TmdbMultiSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  poster_path?: string;
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

interface Region {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

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

        const poster_url = result.poster_path
          ? `https://image.tmdb.org/t/p/w92/${result.poster_path}`
          : '';

        return {
          id: result.id,
          title,
          overview: result.overview || '',
          release_date,
          media_type: result.media_type,
          poster_url,
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
            logo_url: provider.logo_path
              ? `https://image.tmdb.org/t/p/w92/${provider.logo_path}`
              : '',
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
      { provider_id: number; provider_name: string; logo_url: string }
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
                logo_url: provider.logo_path
                  ? `https://image.tmdb.org/t/p/w92/${provider.logo_path}`
                  : '',
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
            logo_url: provider.logo_path
              ? `https://image.tmdb.org/t/p/w92/${provider.logo_path}`
              : '',
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
      { provider_id: number; provider_name: string; logo_url: string }
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
                logo_url: provider.logo_path
                  ? `https://image.tmdb.org/t/p/w92/${provider.logo_path}`
                  : '',
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

export const getRegions = async () => {
  const apiKey = getTmdbAccessToken();

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/watch/providers/regions`,
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

    const data = await response.json();

    return data.results.map((region: Region) => ({
      code: region.iso_3166_1,
      name: region.english_name,
    }));
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
