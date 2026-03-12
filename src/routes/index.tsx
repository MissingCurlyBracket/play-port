import { createFileRoute } from '@tanstack/react-router';
import MainPage from '../pages/MainPage.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: Index,
  loader: async ({ context: { queryClient, regionApi } }) => {
    await queryClient.prefetchQuery({
      queryKey: ['regions'],
      queryFn: async () => await regionApi.getRegions(),
    });
  },
});

function Index() {
  const { searchApi, regionApi, providerApi } = Route.useRouteContext();
  const [error, setError] = useState<Error | null>(null);

  const { data: regions, isLoading: regionsLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => await regionApi.getRegions(),
  });

  const searchMutation = useMutation({
    mutationKey: ['search'],
    mutationFn: async (name: string) => await searchApi.search({ name }),
    onError: (error: Error | null) => setError(error),
  }).mutateAsync;

  return (
    <MainPage
      searchFn={searchMutation}
      getProviders={(params) => providerApi.getProviders(params)}
      regions={regions ?? []}
      regionsLoading={regionsLoading}
      error={error}
    />
  );
}
