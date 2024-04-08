import { Typography } from '@mui/material';
import { extraColors } from '../../styles/theme';
import { ReactNode } from 'react';

const PanelHeader = ({
  title,
}: {
  title: string | ReactNode | ReactNode[];
}) => {
  return (
    <div style={{ backgroundColor: extraColors.headerPaperColor }}>
      <Typography variant="h5" style={{ padding: 10, color: 'white' }}>
        {title}
      </Typography>
    </div>
  );
};

export default PanelHeader;
