import { createFileRoute } from '@tanstack/react-router';
import TitlePage from '../../../pages/TitlePage.tsx';
import { useQuery } from '@tanstack/react-query';

const getRegionFromCookie = () => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )region=([^;]+)'));
  return match ? match[2] : undefined;
};

const getProvidersFromCookie = () => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )providers=([^;]+)'));
  return match ? match[2] : undefined;
};

export const Route = createFileRoute('/title/$type/$id')({
  component: TitleComponent,
  loader: async ({
    context: { queryClient, titleApi },
    params: { id, type },
  }) => {
    const region = getRegionFromCookie();
    const providers = getProvidersFromCookie();
    await queryClient.prefetchQuery({
      queryKey: ['providers', type, id, region, providers],
      queryFn: async () =>
        await titleApi.getProviders({
          id: Number(id),
          type: type as 'movie' | 'tv',
          region,
          providers,
        }),
    });
  },
});

function TitleComponent() {
  const { id, type } = Route.useParams();
  const { titleApi } = Route.useRouteContext();
  const region = getRegionFromCookie();
  const providers = getProvidersFromCookie();

  const { data: providersList } = useQuery({
    queryKey: ['providers', type, id, region, providers],
    queryFn: async () =>
      await titleApi.getProviders({
        id: Number(id),
        type: type as 'movie' | 'tv',
        region,
        providers,
      }),
  });

  return <TitlePage providers={providersList} />;
}
