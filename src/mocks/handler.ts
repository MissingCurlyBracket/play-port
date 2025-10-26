import { http, HttpResponse } from 'msw';
import type {
  AutocompleteResponse,
  SearchResult,
} from '../api/SearchApi/SearchApi.ts';
import type { Source } from '../api/TitleApi/TitleApi.ts';

const mockSearchResults: SearchResult = {
  title_results: [
    {
      resultType: 'title',
      id: 120982,
      name: 'Alan Partridge: Alpha Papa',
      type: 'movie',
      year: 2013,
      imdb_id: 'tt0469021',
      tmdb_id: 177699,
      tmdb_type: 'movie',
    },
    {
      resultType: 'title',
      id: 46583,
      name: 'Alan Partridge: Why, When, Where, How and Whom?',
      type: 'tv_movie',
      year: 2017,
      imdb_id: 'tt7792316',
      tmdb_id: 493671,
      tmdb_type: 'movie',
    },
    {
      resultType: 'title',
      id: 35370,
      name: 'Alan Davies: As Yet Untitled',
      type: 'tv_series',
      year: 2014,
      imdb_id: 'tt4460168',
      tmdb_id: 70952,
      tmdb_type: 'tv',
    },
  ],
  people_results: [
    {
      resultType: 'person',
      id: 79805242,
      name: 'Alan',
      main_profession: null,
      imdb_id: null,
      tmdb_id: 2573101,
    },
  ],
};

const mockAutocompleteResults: AutocompleteResponse = {
  results: [
    {
      result_type: 'title',
      relevance: 496.91,
      id: 3173903,
      name: 'Breaking Bad',
      type: 'tv_series',
      year: 2008,
      imdb_id: 'tt0903747',
      tmdb_id: 1396,
      tmdb_type: 'tv',
      image_url: 'https://cdn.watchmode.com/posters/03173903_poster_w185.jpg',
    },
  ],
};

const mockStreamingSources: Source[] = [
  {
    source_id: 203,
    name: 'Netflix',
    type: 'sub',
    region: 'US',
    ios_url: 'https://www.netflix.com/title/123456',
    android_url: 'https://www.netflix.com/title/123456',
    web_url: 'https://www.netflix.com/title/123456',
    format: 'HD',
    price: null,
    seasons: null,
    episodes: null,
  },
  {
    source_id: 201,
    name: 'Disney +',
    type: 'sub',
    region: 'US',
    ios_url: 'https://www.netflix.com/title/123456',
    android_url: 'https://www.netflix.com/title/123456',
    web_url: 'https://www.netflix.com/title/123456',
    format: 'HD',
    price: null,
    seasons: null,
    episodes: null,
  },
];

export const handlers = [
  http.get('https://api.watchmode.com/v1/search/', ({ request }) => {
    console.log('MSW intercepted:', request.url);
    const url = new URL(request.url);
    const searchValue = url.searchParams.get('search_value');

    if (!searchValue) {
      return HttpResponse.json({
        data: {
          title_results: [],
          people_results: [],
        },
      });
    }

    return HttpResponse.json(mockSearchResults);
  }),

  http.get('https://api.watchmode.com/v1/title/*/sources/', ({ request }) => {
    console.log('MSW intercepted:', request.url);
    return HttpResponse.json(mockStreamingSources);
  }),

  http.get(
    'https://api.watchmode.com/v1/autocomplete-search/',
    ({ request }) => {
      console.log('MSW intercepted:', request.url);
      return HttpResponse.json(mockAutocompleteResults);
    },
  ),

  http.get('*', ({ request }) => {
    if (request.url.includes('api.watchmode.com')) {
      console.log('Unhandled request:', request.url);
    }
    return;
  }),
];
