import { createFileRoute } from '@tanstack/react-router';
import TitlePage from '../../pages/TitlePage.tsx';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/title/$id')({
  component: TitleComponent,
  loader: async ({ context: { queryClient, titleApi }, params: { id } }) => {
    await queryClient.prefetchQuery({
      queryKey: ['sources', id],
      queryFn: async () => await titleApi.getStreamingSources(Number(id)),
    });
  },
});

function TitleComponent() {
  const { id } = Route.useParams();
  const { titleApi } = Route.useRouteContext();

  const { data: sources } = useQuery({
    queryKey: ['sources', id],
    queryFn: async () => await titleApi.getStreamingSources(Number(id)),
  });

  return <TitlePage sources={sources} />;
}
