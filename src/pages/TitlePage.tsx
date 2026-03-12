import type { Provider } from '../api/TitleApi.ts';
import SourceItem from '../components/molecules/SourceItem.tsx';
import BaseBox from '../components/atoms/BaseBox.tsx';

export interface TitlePageProps {
  providers?: Provider[];
}

export default function TitlePage({ providers }: Readonly<TitlePageProps>) {
  return (
    <BaseBox className={'source-card ml-15'}>
      {providers?.map((provider) => (
        <SourceItem
          key={provider.provider_id}
          name={provider.provider_name}
          logo={provider.logo_url}
        />
      ))}
    </BaseBox>
  );
}
