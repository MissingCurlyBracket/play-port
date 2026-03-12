import { Box, type BoxProps } from '@mui/material';

export default function BaseBox(props: Readonly<BoxProps>) {
  return <Box {...props} />;
}
