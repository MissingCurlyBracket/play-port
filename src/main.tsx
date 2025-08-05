import { StrictMode } from 'react';
import './index.css';
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SearchApi from './api/SearchApi/SearchApi.ts';

const memoryHistory = createMemoryHistory({ initialEntries: ['/'] });
const searchApi = new SearchApi();
const router = createRouter({
  routeTree,
  context: { searchApi },
  history: memoryHistory,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface RouteContext {
    searchApi: SearchApi;
  }
}

const queryClient = new QueryClient();

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
