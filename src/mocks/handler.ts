import { http, HttpResponse } from 'msw';
import type { SearchResult } from '../api/SearchApi.ts';
import type { Provider } from '../api/TitleApi.ts';

const mockSearchResults: SearchResult[] = [
  {
    id: 120982,
    title: 'Alan Partridge: Alpha Papa',
    overview:
      'To save his job, a famous radio DJ gets caught in a siege at his station and has to work with the police to diffuse the situation. However, things take a turn for the worse when the siege becomes a national media event. Alan sees this as an opportunity to revitalize his career and regain his status as a beloved broadcaster. But as the tension mounts and the police presence grows, Alan must decide between his own ego and the safety of the hostages. Will he become the hero he always dreamt of being, or will his antics lead to disaster? The situation spirals out of control with hilarious and dangerous consequences.',
    media_type: 'movie',
    release_date: '2013',
    poster_url: 'https://placehold.co/92x138',
  },
  {
    id: 46583,
    title: 'Alan Partridge: Why, When, Where, How and Whom?',
    overview: 'A look back at the life of Alan Partridge.',
    media_type: 'movie',
    release_date: '2017',
    poster_url: 'https://placehold.co/92x138',
  },
  {
    id: 35370,
    title: 'Alan Davies: As Yet Untitled',
    overview:
      'Alan Davies acts as host to four guests from the world of comedy and entertainment. The guests are all unprepared and have no idea what is going to happen.',
    media_type: 'tv',
    release_date: '2014',
    poster_url: 'https://placehold.co/92x138',
  },
];

const mockProviders: Provider[] = [
  {
    provider_id: 8,
    provider_name: 'Netflix',
    logo_url: 'https://placehold.co/92x92',
  },
  {
    provider_id: 337,
    provider_name: 'Disney Plus',
    logo_url: 'https://placehold.co/92x92',
  },
];

const mockRegions = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'RO', name: 'Romania' },
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

  http.get('*/regions', ({ request }) => {
    console.log('MSW intercepted: ', request.url);
    return HttpResponse.json(mockRegions);
  }),

  http.get('*/providers', ({ request }) => {
    console.log('MSW intercepted: ', request.url);
    return HttpResponse.json(mockProviders);
  }),

  http.get('*', ({ request }) => {
    console.log('Unhandled request: ', request.url);
    return;
  }),
];
