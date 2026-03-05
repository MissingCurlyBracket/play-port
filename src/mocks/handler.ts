import { http, HttpResponse } from 'msw';
import type { SearchResult } from '../api/SearchApi.ts';
import type { Provider } from '../api/TitleApi.ts';

const mockSearchResults: SearchResult[] = [
  {
    id: 120982,
    title: 'Alan Partridge: Alpha Papa',
    overview:
      'To save his job, a famous radio DJ gets caught in a siege at his station and has to work with the police to diffuse the situation.',
    media_type: 'movie',
    release_date: '2013',
  },
  {
    id: 46583,
    title: 'Alan Partridge: Why, When, Where, How and Whom?',
    overview: 'A look back at the life of Alan Partridge.',
    media_type: 'movie',
    release_date: '2017',
  },
  {
    id: 35370,
    title: 'Alan Davies: As Yet Untitled',
    overview:
      'Alan Davies acts as host to four guests from the world of comedy and entertainment. The guests are all unprepared and have no idea what is going to happen.',
    media_type: 'tv',
    release_date: '2014',
  },
];

const mockProviders: Provider[] = [
  {
    provider_id: 8,
    provider_name: 'Netflix',
  },
  {
    provider_id: 337,
    provider_name: 'Disney Plus',
  },
];

export const handlers = [
  http.get('*/search', ({ request }) => {
    console.log('MSW intercepted: ', request.url);
    const url = new URL(request.url);
    const name = url.searchParams.get('name');

    if (!name) {
      return HttpResponse.json([]);
    }

    return HttpResponse.json(mockSearchResults);
  }),

  http.get('*/movie/:id/providers', ({ request }) => {
    console.log('MSW intercepted: ', request.url);
    const url = new URL(request.url);
    const region = url.searchParams.get('region');

    if (region) {
      return HttpResponse.json([mockProviders[0]]);
    }

    return HttpResponse.json(mockProviders);
  }),

  http.get('*/tv/:id/providers', ({ request }) => {
    console.log('MSW intercepted: ', request.url);
    const url = new URL(request.url);
    const region = url.searchParams.get('region');

    if (region) {
      return HttpResponse.json([mockProviders[0]]);
    }

    return HttpResponse.json(mockProviders);
  }),

  http.get('*', ({ request }) => {
    console.log('Unhandled request: ', request.url);
    return;
  }),
];
