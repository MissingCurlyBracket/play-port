import { Button, type ButtonProps } from '@mui/material';

export default function BaseButton(props: Readonly<ButtonProps>) {
  return <Button {...props} />;
}
