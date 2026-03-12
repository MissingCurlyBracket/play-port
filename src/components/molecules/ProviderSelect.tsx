import BaseAutocomplete from '../atoms/BaseAutocomplete';
import BaseTextField from '../atoms/BaseTextField';
import type { Provider } from '../../api/TitleApi';

interface ProviderSelectProps {
  providers: Provider[];
  selectedProviders: Provider[];
  onChange: (providers: Provider[]) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function ProviderSelect({
  providers,
  selectedProviders,
  onChange,
  loading,
  disabled,
}: Readonly<ProviderSelectProps>) {
  return (
    <BaseAutocomplete
      multiple
      disabled={disabled}
      loading={loading}
      options={providers}
      getOptionLabel={(option) => (option as Provider).provider_name}
      value={selectedProviders}
      onChange={(_e, newValue) => onChange(newValue as Provider[])}
      renderInput={(params) => (
        <BaseTextField
          {...params}
          label="Select Providers"
          variant="outlined"
          placeholder="Providers"
        />
      )}
    />
  );
}
