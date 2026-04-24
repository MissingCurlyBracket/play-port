import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

function RootLayout() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {pathname !== '/' && (
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
          <IconButton
            onClick={() => router.history.back()}
            aria-label="Go back"
            sx={{
              pointerEvents: 'auto',
              color: 'primary.main',
              backgroundColor: 'rgba(26, 20, 48, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(169, 148, 222, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
              transition:
                'border-color 160ms ease, box-shadow 160ms ease, color 160ms ease',
              '&:hover': {
                backgroundColor: 'rgba(26, 20, 48, 0.75)',
                borderColor: 'primary.main',
                boxShadow: '0 8px 36px rgba(140, 114, 208, 0.3)',
                color: 'primary.light',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </BaseBox>
      )}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
