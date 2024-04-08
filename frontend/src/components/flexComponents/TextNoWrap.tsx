import React, { ReactNode } from 'react';

interface TextNoWrapProps {
  children: ReactNode | ReactNode[];
  style?: React.CSSProperties;
}

const TextNoWrap = ({ children, style }: TextNoWrapProps) => {
  return (
    <div
      style={{
        lineHeight: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default TextNoWrap;
