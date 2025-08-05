import { http, HttpResponse } from 'msw';
import type { SearchResult } from '../api/SearchApi/SearchApi.ts';

const mockResults: SearchResult = {
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

    return HttpResponse.json(mockResults);
  }),

  http.get('*', ({ request }) => {
    if (request.url.includes('api.watchmode.com')) {
      console.log('Unhandled request:', request.url);
    }
    return;
  }),
];
