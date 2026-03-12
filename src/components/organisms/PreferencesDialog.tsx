import BaseDialog from '../atoms/BaseDialog';
import BaseBox from '../atoms/BaseBox';
import BaseButton from '../atoms/BaseButton';
import RegionSelect from '../molecules/RegionSelect';
import ProviderSelect from '../molecules/ProviderSelect';
import type { Region } from '../../api/RegionApi';
import type { Provider } from '../../api/TitleApi';

interface PreferencesDialogProps {
  open: boolean;
  onClose: () => void;
  regions: Region[];
  regionsLoading?: boolean;
  modalRegion: Region | null;
  onRegionChange: (region: Region | null) => void;
  modalProviders: Provider[];
  modalSelectedProviders: Provider[];
  onProvidersChange: (providers: Provider[]) => void;
  modalLoading?: boolean;
  onSave: () => void;
}

export default function PreferencesDialog({
  open,
  onClose,
  regions,
  regionsLoading,
  modalRegion,
  onRegionChange,
  modalProviders,
  modalSelectedProviders,
  onProvidersChange,
  modalLoading,
  onSave,
}: Readonly<PreferencesDialogProps>) {
  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      title="Preferences"
      content={
        <BaseBox
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <RegionSelect
            regions={regions}
            selectedRegion={modalRegion}
            onChange={onRegionChange}
            loading={regionsLoading}
          />
          <ProviderSelect
            disabled={!modalRegion}
            loading={modalLoading}
            providers={modalProviders}
            selectedProviders={modalSelectedProviders}
            onChange={onProvidersChange}
          />
        </BaseBox>
      }
      actions={
        <>
          <BaseButton onClick={onClose}>Cancel</BaseButton>
          <BaseButton onClick={onSave} variant="contained">
            Save
          </BaseButton>
        </>
      }
    />
  );
}
