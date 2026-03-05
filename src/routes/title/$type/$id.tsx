import { createFileRoute } from '@tanstack/react-router';
import TitlePage from '../../../pages/TitlePage.tsx';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/title/$type/$id')({
  component: TitleComponent,
  loader: async ({
    context: { queryClient, titleApi },
    params: { id, type },
  }) => {
    await queryClient.prefetchQuery({
      queryKey: ['providers', type, id],
      queryFn: async () =>
        await titleApi.getProviders({
          id: Number(id),
          type: type as 'movie' | 'tv',
        }),
    });
  },
});

function TitleComponent() {
  const { id, type } = Route.useParams();
  const { titleApi } = Route.useRouteContext();

  const { data: providers } = useQuery({
    queryKey: ['providers', type, id],
    queryFn: async () =>
      await titleApi.getProviders({
        id: Number(id),
        type: type as 'movie' | 'tv',
      }),
  });

  return <TitlePage providers={providers} />;
}
