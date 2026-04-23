import BasePaper from '../atoms/BasePaper';
import BaseTextField from '../atoms/BaseTextField';
import LoadingSpinner from '../atoms/LoadingSpinner';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  isLoading,
  placeholder,
}: Readonly<SearchBarProps>) {
  return (
    <BasePaper
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'rgba(26, 20, 48, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(169, 148, 222, 0.25)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        transition: 'border-color 160ms ease, box-shadow 160ms ease',
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: '0 8px 36px rgba(140, 114, 208, 0.3)',
        },
      }}
    >
      <BaseTextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search...'}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '1.05rem',
            '& fieldset': {
              border: 'none',
            },
          },
          '& input': {
            py: 1.5,
          },
        }}
      />
      {isLoading && <LoadingSpinner sx={{ mr: 2 }} />}
    </BasePaper>
  );
}
