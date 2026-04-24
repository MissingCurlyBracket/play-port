import { createFileRoute } from '@tanstack/react-router';
import MainPage from '../pages/MainPage.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/')({
  component: Index,
  loader: async ({ context: { queryClient, regionApi, trendingApi } }) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['regions'],
        queryFn: async () => await regionApi.getRegions(),
      }),
      queryClient.prefetchQuery({
        queryKey: ['trending'],
        queryFn: async () => await trendingApi.getTrending(),
      }),
    ]);
  },
});

export function Index() {
  const { searchApi, regionApi, providerApi, trendingApi, popularApi } =
    Route.useRouteContext();
  const [error, setError] = useState<Error | null>(null);
  const [backdropSeed] = useState(() => Math.random());

  const { data: regions, isLoading: regionsLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => await regionApi.getRegions(),
  });

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => await trendingApi.getTrending(),
  });

  const searchMutation = useMutation({
    mutationKey: ['search'],
    mutationFn: async (name: string) => await searchApi.search({ name }),
    onError: (error: Error | null) => setError(error),
  }).mutateAsync;

  const backdropUrl = useMemo(() => {
    if (!trending || trending.length === 0) return undefined;
    const index = Math.floor(backdropSeed * trending.length);
    return trending[index].backdrop_url;
  }, [trending, backdropSeed]);

  return (
    <MainPage
      searchFn={searchMutation}
      getProviders={(params) => providerApi.getProviders(params)}
      getPopular={(params) => popularApi.getPopular(params)}
      regions={regions ?? []}
      regionsLoading={regionsLoading}
      error={error}
      backdropUrl={backdropUrl}
    />
  );
}
