import { Alert, type AlertProps } from '@mui/material';

export default function BaseAlert(props: Readonly<AlertProps>) {
  return <Alert {...props} />;
}
