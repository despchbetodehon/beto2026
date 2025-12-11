import React, { CSSProperties } from 'react';

interface GridContainerProps {
  children: React.ReactNode;
  spacing?: number;
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch';
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around';
  style?: CSSProperties;
}

interface GridItemProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  style?: CSSProperties;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  spacing = 0,
  alignItems,
  justifyContent,
  style,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${spacing * 8}px`,
        alignItems,
        justifyContent,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const GridItem: React.FC<GridItemProps> = ({
  children,
  xs = 12,
  sm,
  md,
  lg,
  xl,
  style,
}) => {
  const getFlexBasis = () => {
    // Simplified responsive logic
    // xs = default (mobile), sm = 600px+, md = 960px+, lg = 1280px+, xl = 1920px+
    const width = window.innerWidth;
    let cols = xs;
    
    if (xl && width >= 1920) cols = xl;
    else if (lg && width >= 1280) cols = lg;
    else if (md && width >= 960) cols = md;
    else if (sm && width >= 600) cols = sm;
    
    return `calc(${(cols / 12) * 100}% - 16px)`;
  };

  return (
    <div
      style={{
        flex: `0 0 ${getFlexBasis()}`,
        maxWidth: getFlexBasis(),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Default export as object for easier destructuring
const CustomGrid = {
  Container: GridContainer,
  Item: GridItem,
};

export default CustomGrid;
