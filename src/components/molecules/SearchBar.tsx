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
        boxShadow: 3,
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
            '& fieldset': {
              border: 'none',
            },
          },
        }}
      />
      {isLoading && <LoadingSpinner sx={{ mr: 2 }} />}
    </BasePaper>
  );
}
