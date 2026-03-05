import type { Provider } from '../api/TitleApi.ts';
import SourceCard from '../components/SourceCard.tsx';

export interface TitlePageProps {
  providers?: Provider[];
}

export default function TitlePage({ providers }: TitlePageProps) {
  return (
    <div className={'source-card ml-15'}>
      {providers?.map((provider) => (
        <SourceCard
          key={provider.provider_id}
          name={provider.provider_name}
          logo={provider.logo_url}
        />
      ))}
    </div>
  );
}
