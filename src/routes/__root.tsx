import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type SearchApi from '../api/SearchApi.ts';
import type { QueryClient } from '@tanstack/react-query';
import type TitleApi from '../api/TitleApi.ts';
import type RegionApi from '../api/RegionApi.ts';

interface RouterContext {
  searchApi: SearchApi;
  titleApi: TitleApi;
  regionApi: RegionApi;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <div
        style={{
          top: 0,
          left: 0,
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
