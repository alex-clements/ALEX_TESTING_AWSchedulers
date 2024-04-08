import { CSSProperties } from 'react';

const RedText = ({
  children,
  style,
}: {
  children: string | string[];
  style?: CSSProperties;
}) => {
  const allStyles = { ...style, color: 'red' };
  return <span style={allStyles}>{children}</span>;
};

export default RedText;
