import { http, HttpResponse } from 'msw';
import type { SearchResult } from '../api/SearchApi.ts';
import type { Provider, TitleDetails } from '../api/TitleApi.ts';
import type { TrendingMovie } from '../api/TrendingApi.ts';
import type { PopularTitle } from '../api/PopularApi.ts';

const mockSearchResults: SearchResult[] = [
  {
    id: 120982,
    title: 'Alan Partridge: Alpha Papa',
    overview:
      'To save his job, a famous radio DJ gets caught in a siege at his station and has to work with the police to diffuse the situation. However, things take a turn for the worse when the siege becomes a national media event. Alan sees this as an opportunity to revitalize his career and regain his status as a beloved broadcaster. But as the tension mounts and the police presence grows, Alan must decide between his own ego and the safety of the hostages. Will he become the hero he always dreamt of being, or will his antics lead to disaster? The situation spirals out of control with hilarious and dangerous consequences.',
    media_type: 'movie',
    release_date: '2013',
    poster_url: 'https://placehold.co/500x750/1a1430/c9beec?text=Alpha+Papa',
  },
  {
    id: 46583,
    title: 'Alan Partridge: Why, When, Where, How and Whom?',
    overview: 'A look back at the life of Alan Partridge.',
    media_type: 'movie',
    release_date: '2017',
    poster_url: 'https://placehold.co/500x750/1a1430/c9beec?text=Alan+P',
  },
  {
    id: 35370,
    title: 'Alan Davies: As Yet Untitled',
    overview:
      'Alan Davies acts as host to four guests from the world of comedy and entertainment. The guests are all unprepared and have no idea what is going to happen.',
    media_type: 'tv',
    release_date: '2014',
    poster_url: 'https://placehold.co/500x750/1a1430/c9beec?text=Untitled',
  },
];

const mockProviders: Provider[] = [
  {
    provider_id: 8,
    provider_name: 'Netflix',
    logo_url: 'https://placehold.co/128x128/e50914/ffffff?text=N',
  },
  {
    provider_id: 337,
    provider_name: 'Disney Plus',
    logo_url: 'https://placehold.co/128x128/0a2540/ffffff?text=D%2B',
  },
  {
    provider_id: 9,
    provider_name: 'Prime Video',
    logo_url: 'https://placehold.co/128x128/00a8e1/ffffff?text=P',
  },
];

const mockRegions = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'RO', name: 'Romania' },
];

const mockTrending: TrendingMovie[] = [
  {
    id: 1,
    title: 'Featured Movie',
    backdrop_url:
      'https://placehold.co/1280x720/0f0a1f/8c72d0?text=Featured+Backdrop',
    poster_url:
      'https://placehold.co/500x750/1a1430/c9beec?text=Featured',
  },
];

const mockTitleDetails: TitleDetails = {
  id: 120982,
  title: 'Alan Partridge: Alpha Papa',
  overview:
    'To save his job, a famous radio DJ gets caught in a siege at his station and has to work with the police to diffuse the situation.',
  release_date: '2013',
  media_type: 'movie',
  backdrop_url:
    'https://placehold.co/1280x720/0f0a1f/8c72d0?text=Title+Backdrop',
  poster_url: 'https://placehold.co/500x750/1a1430/c9beec?text=Alpha+Papa',
};

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

  http.get('*/trending', ({ request }) => {
    console.log('MSW intercepted: ', request.url);
    return HttpResponse.json(mockTrending);
  }),

  http.get('*/popular/:type', ({ request, params }) => {
    console.log('MSW intercepted: ', request.url);
    const type = params.type as 'movie' | 'tv';
    const mockPopular: PopularTitle[] = Array.from({ length: 10 }, (_, i) => ({
      id: 120982 + i,
      title: `Mock Popular ${type === 'movie' ? 'Movie' : 'Show'} ${i + 1}`,
      media_type: type,
      poster_url: `https://placehold.co/500x750/1a1430/c9beec?text=Popular+${i + 1}`,
      backdrop_url: `https://placehold.co/1280x720/0f0a1f/8c72d0?text=Popular+${i + 1}`,
    }));
    return HttpResponse.json(mockPopular);
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

  http.get('*/movie/:id', ({ request, params }) => {
    console.log('MSW intercepted: ', request.url);
    return HttpResponse.json({
      ...mockTitleDetails,
      id: Number(params.id),
      media_type: 'movie',
    });
  }),

  http.get('*/tv/:id', ({ request, params }) => {
    console.log('MSW intercepted: ', request.url);
    return HttpResponse.json({
      ...mockTitleDetails,
      id: Number(params.id),
      media_type: 'tv',
    });
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
