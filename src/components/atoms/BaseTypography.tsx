import { Typography, type TypographyProps } from '@mui/material';

export default function BaseTypography(props: Readonly<TypographyProps>) {
  return <Typography {...props} />;
}
