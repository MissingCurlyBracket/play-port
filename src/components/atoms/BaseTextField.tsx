import { TextField, type TextFieldProps } from '@mui/material';

export default function BaseTextField(props: Readonly<TextFieldProps>) {
  return <TextField {...props} />;
}
