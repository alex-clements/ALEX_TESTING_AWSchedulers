import { Container, Paper } from '@mui/material';
import React, { ReactNode } from 'react';
import PanelHeader from './PanelHeader';

interface StandardPanelProps {
  title: string | ReactNode | ReactNode[];
  subTitle?: ReactNode | ReactNode[];
  children: ReactNode | ReactNode[];
  style?: any;
}

const StandardPanel = ({
  title,
  subTitle,
  style,
  children,
}: StandardPanelProps) => {
  return (
    <Paper style={{ ...style, overflow: 'hidden', borderRadius: 15 }}>
      <PanelHeader title={title} />
      {subTitle && subTitle}
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'space-around',
          flexGrow: 1,
          gap: 10,
        }}
      >
        {children}
      </Container>
    </Paper>
  );
};

export default StandardPanel;
// style={{
//   display: 'flex',
//   flexDirection: 'column',
//   alignContent: 'space-around',
//   flexGrow: 1,
// }}
// >
