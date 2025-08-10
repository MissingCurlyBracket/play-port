import { createFileRoute } from '@tanstack/react-router';
import MainPage from '../pages/MainPage.tsx';
import { useMutation } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { searchApi } = Route.useRouteContext();

  const searchMutation = useMutation({
    mutationKey: ['search'],
    mutationFn: async (name: string) => await searchApi.getByName(name),
  });

  const handleSearch = async (title: string) => {
    return await searchMutation.mutateAsync(title);
  };

  return <MainPage searchFn={handleSearch} />;
}
