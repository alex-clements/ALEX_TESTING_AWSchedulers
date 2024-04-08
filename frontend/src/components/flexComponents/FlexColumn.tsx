import { ReactNode } from 'react';

interface FlexColumnProps {
  justifyContent?: string;
  alignItems?: string;
  children: ReactNode | ReactNode[];
  style?: React.CSSProperties;
}

export const FlexColumn = ({
  justifyContent = 'center',
  alignItems = 'center',
  children,
  style,
}: FlexColumnProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justifyContent,
        alignItems: alignItems,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
