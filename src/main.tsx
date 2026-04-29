import { StrictMode } from 'react';
import './index.css';
import './bones/registry.ts';
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SearchApi from './api/SearchApi.ts';
import TitleApi from './api/TitleApi.ts';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import RegionApi from './api/RegionApi.ts';
import ProviderApi from './api/ProviderApi.ts';
import TrendingApi from './api/TrendingApi.ts';
import PopularApi from './api/PopularApi.ts';
import theme from './theme.ts';

const queryClient = new QueryClient();
const searchApi = new SearchApi();
const titleApi = new TitleApi();
const regionApi = new RegionApi();
const providerApi = new ProviderApi();
const trendingApi = new TrendingApi();
const popularApi = new PopularApi();
const router = createRouter({
  routeTree,
  context: {
    searchApi,
    titleApi,
    regionApi,
    queryClient,
    providerApi,
    trendingApi,
    popularApi,
  },
  history: createHashHistory(),
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface RouteContext {
    searchApi: SearchApi;
    queryClient: QueryClient;
    titleApi: TitleApi;
    regionApi: RegionApi;
    providerApi: ProviderApi;
    trendingApi: TrendingApi;
    popularApi: PopularApi;
  }
}

async function initializeApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      serviceWorker: {
        url: '/play-port/mockServiceWorker.js',
      },
    });
  }

  const rootElement = document.getElementById('root')!;
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ThemeProvider>
      </StrictMode>,
    );
  }
}

initializeApp();
