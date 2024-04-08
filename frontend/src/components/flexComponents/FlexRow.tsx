import { StandardLonghandProperties } from 'csstype';
import { ReactNode } from 'react';

interface FlexRowProps {
  justifyContent?: StandardLonghandProperties['justifyContent'];
  alignItems?: StandardLonghandProperties['alignItems'];
  children: ReactNode | ReactNode[];
  style?: React.CSSProperties;
}

export const FlexRow = ({
  justifyContent = 'center',
  alignItems = 'center',
  children,
  style,
}: FlexRowProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justifyContent,
        alignItems: alignItems,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
