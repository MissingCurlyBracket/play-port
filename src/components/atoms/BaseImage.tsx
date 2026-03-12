import { Box, type BoxProps } from '@mui/material';

interface BaseImageProps extends Omit<BoxProps, 'component'> {
  src: string;
  alt: string;
}

export default function BaseImage(props: Readonly<BaseImageProps>) {
  return <Box component="img" {...props} />;
}
