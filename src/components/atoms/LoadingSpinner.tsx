import { CircularProgress, type CircularProgressProps } from '@mui/material';

export default function LoadingSpinner(props: Readonly<CircularProgressProps>) {
  return <CircularProgress {...props} />;
}
