import { Autocomplete, type AutocompleteProps } from '@mui/material';

export default function BaseAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>(props: Readonly<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>>) {
  return <Autocomplete {...props} />;
}
