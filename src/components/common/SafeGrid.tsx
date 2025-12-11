/**
 * SafeGrid - A simple div-based replacement for MUI Grid to avoid theme issues
 * This prevents the "Cannot read properties of undefined (reading 'forEach')" error
 */
import React from 'react';
import { GridProps } from '@mui/material';

const SafeGrid: React.FC<GridProps> = (props) => {
  // Always render a simple div to avoid Grid issues
  const { container, item, spacing, children, sx, ...rest } = props;
  const style = {
    display: container ? 'flex' : 'block',
    flexDirection: container ? 'row' : undefined,
    flexWrap: container ? 'wrap' : undefined,
    gap: spacing ? `${(spacing as number) * 8}px` : undefined,
    width: item ? 'auto' : undefined,
    ...sx,
  };

  return <div {...(rest as any)} style={style}>{children}</div>;
};export default SafeGrid;