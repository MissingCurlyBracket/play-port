import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type SearchApi from '../api/SearchApi/SearchApi.ts';
import type { QueryClient } from '@tanstack/react-query';
import type TitleApi from '../api/TitleApi/TitleApi.ts';

interface RouterContext {
  searchApi: SearchApi;
  titleApi: TitleApi;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          padding: '16px',
          background: 'inherit',
        }}
      >
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
