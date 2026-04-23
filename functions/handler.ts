import type { APIGatewayProxyEvent } from 'aws-lambda';

// Declare process for TS if types are missing in this context
// eslint-disable-next-line no-var
declare var process: {
  env: {
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

interface Region {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

interface TmdbSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
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

interface TmdbRegionsResponse {
  results: Region[];
}

interface TmdbAvailableProvider {
  display_priorities: unknown;
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

interface TmdbAvailableProvidersResponse {
  results: TmdbAvailableProvider[];
}

interface TmdbTrendingItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  media_type?: 'movie' | 'tv';
  backdrop_path?: string;
  poster_path?: string;
}

interface TmdbMovieDetails {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  release_date?: string;
  backdrop_path?: string;
  poster_path?: string;
}

interface TmdbTvDetails {
  id: number;
  name?: string;
  original_name?: string;
  overview?: string;
  first_air_date?: string;
  backdrop_path?: string;
  poster_path?: string;
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
  const providersParam = event.queryStringParameters?.providers;

  const providerIds = providersParam
    ? new Set(providersParam.split(',').map(Number))
    : null;

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
        const providers = (data.results[region]!.flatrate || [])
          .filter(
            (provider) => !providerIds || providerIds.has(provider.provider_id),
          )
          .map((provider) => ({
            provider_id: provider.provider_id,
            provider_name: provider.provider_name,
            logo_url: provider.logo_path
              ? `https://image.tmdb.org/t/p/w92/${provider.logo_path}`
              : '',
          }));

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
            if (
              !allProviders.has(provider.provider_id) &&
              (!providerIds || providerIds.has(provider.provider_id))
            ) {
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
  const providersParam = event.queryStringParameters?.providers;

  const providerIds = providersParam
    ? new Set(providersParam.split(',').map(Number))
    : null;

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
        const providers = (data.results[region]!.flatrate || [])
          .filter(
            (provider) => !providerIds || providerIds.has(provider.provider_id),
          )
          .map((provider) => ({
            provider_id: provider.provider_id,
            provider_name: provider.provider_name,
            logo_url: provider.logo_path
              ? `https://image.tmdb.org/t/p/w92/${provider.logo_path}`
              : '',
          }));

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
            if (
              !allProviders.has(provider.provider_id) &&
              (!providerIds || providerIds.has(provider.provider_id))
            ) {
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

    const data = (await response.json()) as TmdbRegionsResponse;

    const results = data.results.map((region: Region) => ({
      code: region.iso_3166_1,
      name: region.english_name,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getAvailableProviders = async (event: APIGatewayProxyEvent) => {
  const apiKey = getTmdbAccessToken();
  const region = event.queryStringParameters?.region;

  try {
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/watch/providers/movie?watch_region=${region}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const tvResponse = await fetch(
      `https://api.themoviedb.org/3/watch/providers/tv?watch_region=${region}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!movieResponse.ok || !tvResponse.ok) {
      const errorText = !movieResponse.ok
        ? await movieResponse.text()
        : await tvResponse.text();
      return {
        statusCode: !movieResponse.ok
          ? movieResponse.status
          : tvResponse.status,
        headers,
        body: JSON.stringify({ error: errorText }),
      };
    }

    const movieData =
      (await movieResponse.json()) as TmdbAvailableProvidersResponse;
    const tvData = (await tvResponse.json()) as TmdbAvailableProvidersResponse;

    const providersMap = new Map<number, TmdbAvailableProvider>();
    [...movieData.results, ...tvData.results].forEach((provider) => {
      if (!providersMap.has(provider.provider_id)) {
        providersMap.set(provider.provider_id, provider);
      }
    });

    const results = Array.from(providersMap.values()).map((provider) => ({
      provider_id: provider.provider_id,
      provider_name: provider.provider_name,
      logo_url: provider.logo_path
        ? `https://image.tmdb.org/t/p/w92/${provider.logo_path}`
        : '',
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getTrending = async () => {
  const apiKey = getTmdbAccessToken();

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week`,
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
      (await response.json()) as TmdbSearchResponse<TmdbTrendingItem>;

    const trending = results
      .filter((item) => !!item.backdrop_path)
      .map((item) => ({
        id: item.id,
        title:
          item.title ||
          item.name ||
          item.original_title ||
          item.original_name ||
          '',
        backdrop_url: `https://image.tmdb.org/t/p/w1280/${item.backdrop_path}`,
        poster_url: item.poster_path
          ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
          : '',
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(trending),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getMovieDetails = async (event: APIGatewayProxyEvent) => {
  const apiKey = getTmdbAccessToken();
  const movieId = event.pathParameters?.movieId;

  if (!movieId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing movieId parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}`,
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

    const data = (await response.json()) as TmdbMovieDetails;

    const details = {
      id: data.id,
      title: data.title || data.original_title || '',
      overview: data.overview || '',
      release_date: data.release_date ? data.release_date.split('-')[0] : '',
      media_type: 'movie' as const,
      backdrop_url: data.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280/${data.backdrop_path}`
        : '',
      poster_url: data.poster_path
        ? `https://image.tmdb.org/t/p/w500/${data.poster_path}`
        : '',
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(details),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getTvDetails = async (event: APIGatewayProxyEvent) => {
  const apiKey = getTmdbAccessToken();
  const seriesId = event.pathParameters?.seriesId;

  if (!seriesId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing seriesId parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}`,
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

    const data = (await response.json()) as TmdbTvDetails;

    const details = {
      id: data.id,
      title: data.name || data.original_name || '',
      overview: data.overview || '',
      release_date: data.first_air_date
        ? data.first_air_date.split('-')[0]
        : '',
      media_type: 'tv' as const,
      backdrop_url: data.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280/${data.backdrop_path}`
        : '',
      poster_url: data.poster_path
        ? `https://image.tmdb.org/t/p/w500/${data.poster_path}`
        : '',
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(details),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
