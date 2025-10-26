import { createFileRoute } from '@tanstack/react-router';
import MainPage from '../pages/MainPage.tsx';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { searchApi } = Route.useRouteContext();
  const [error, setError] = useState<Error | null>(null);

  const searchMutation = useMutation({
    mutationKey: ['search'],
    mutationFn: async (name: string) =>
      await searchApi.getAutocomplete(name, 2),
    onError: (error: Error | null) => setError(error),
  }).mutateAsync;

  return <MainPage autocompleteFn={searchMutation} error={error} />;
}
