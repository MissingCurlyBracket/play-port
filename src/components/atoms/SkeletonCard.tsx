import { styled } from '@mui/material/styles';
import { Skeleton } from 'boneyard-js/react';

const SkeletonCard = styled(Skeleton)({
  backgroundColor: 'rgba(26, 20, 48, 0.72)',
  backdropFilter: 'blur(8px)',
  outline: '1px solid rgba(169, 148, 222, 0.08)',
  outlineOffset: '-1px',
  borderRadius: 12,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
  overflow: 'hidden',
});

export default SkeletonCard;
