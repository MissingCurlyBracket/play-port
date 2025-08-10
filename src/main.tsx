import { StrictMode } from 'react';
import './index.css';
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SearchApi from './api/SearchApi/SearchApi.ts';
import TitleApi from './api/TitleApi/TitleApi.ts';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const queryClient = new QueryClient();
const searchApi = new SearchApi();
const titleApi = new TitleApi();
const router = createRouter({
  routeTree,
  context: { searchApi, titleApi, queryClient },
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
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StrictMode>,
    );
  }
}

initializeApp();
