import BaseAutocomplete from '../atoms/BaseAutocomplete';
import BaseTextField from '../atoms/BaseTextField';
import type { Region } from '../../api/RegionApi';

interface RegionSelectProps {
  regions: Region[];
  selectedRegion: Region | null;
  onChange: (region: Region | null) => void;
  loading?: boolean;
}

export default function RegionSelect({
  regions,
  selectedRegion,
  onChange,
  loading,
}: Readonly<RegionSelectProps>) {
  return (
    <BaseAutocomplete
      options={regions}
      loading={loading}
      getOptionLabel={(option) => (option as Region).name}
      value={selectedRegion}
      onChange={(_e, newValue) => onChange(newValue as Region | null)}
      renderInput={(params) => (
        <BaseTextField {...params} label="Select Region" variant="outlined" />
      )}
    />
  );
}
