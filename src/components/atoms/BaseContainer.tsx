import { Container, type ContainerProps } from '@mui/material';

export default function BaseContainer(props: Readonly<ContainerProps>) {
  return <Container {...props} />;
}
