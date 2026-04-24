import { createFileRoute } from '@tanstack/react-router';
import TitlePage from '../../../pages/TitlePage.tsx';
import { useQuery } from '@tanstack/react-query';
import {
  getProvidersFromCookie,
  getRegionFromCookie,
} from '../../../utils/cookies.ts';

export const Route = createFileRoute('/title/$type/$id')({
  component: TitleComponent,
  loader: async ({
    context: { queryClient, titleApi },
    params: { id, type },
  }) => {
    const region = getRegionFromCookie();
    const providers = getProvidersFromCookie();
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['title', type, id],
        queryFn: async () =>
          await titleApi.getTitle({
            id: Number(id),
            type: type as 'movie' | 'tv',
          }),
      }),
      queryClient.prefetchQuery({
        queryKey: ['providers', type, id, region, providers],
        queryFn: async () =>
          await titleApi.getProviders({
            id: Number(id),
            type: type as 'movie' | 'tv',
            region,
            providers,
          }),
      }),
    ]);
  },
});

export function TitleComponent() {
  const { id, type } = Route.useParams();
  const { titleApi } = Route.useRouteContext();
  const region = getRegionFromCookie();
  const providers = getProvidersFromCookie();

  const { data: titleDetails } = useQuery({
    queryKey: ['title', type, id],
    queryFn: async () =>
      await titleApi.getTitle({
        id: Number(id),
        type: type as 'movie' | 'tv',
      }),
  });

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

  return <TitlePage title={titleDetails} providers={providersList} />;
}
