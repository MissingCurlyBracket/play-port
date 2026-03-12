import { Chip, type ChipProps } from '@mui/material';

export default function BaseChip(props: Readonly<ChipProps>) {
  return <Chip {...props} />;
}
