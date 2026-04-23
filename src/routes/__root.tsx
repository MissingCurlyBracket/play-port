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
import type ProviderApi from '../api/ProviderApi.ts';
import type TrendingApi from '../api/TrendingApi.ts';
import BaseBox from '../components/atoms/BaseBox';

interface RouterContext {
  searchApi: SearchApi;
  titleApi: TitleApi;
  regionApi: RegionApi;
  providerApi: ProviderApi;
  trendingApi: TrendingApi;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <BaseBox
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          p: 2,
          pointerEvents: 'none',
        }}
      >
        <Link to="/" style={{ display: 'inline-block', pointerEvents: 'auto' }}>
          <img
            src={`${import.meta.env.BASE_URL}play-port-logo.svg`}
            alt="play-port"
            style={{
              height: 36,
              width: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
            }}
          />
        </Link>
      </BaseBox>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
