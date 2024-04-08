import { MenuItem, Typography } from '@mui/material';
import { FlexRow } from '../../../../components/flexComponents';

export function RoomSelectHeader({ label }: { label: string }) {
  return (
    <MenuItem disabled style={{ justifyContent: 'space-between' }}>
      <Typography
        variant="body2"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
          minWidth: 100,
        }}
      >
        {label}
      </Typography>
      <FlexRow style={{ gap: 10 }}>
        <HeaderSubItem label="Capacity" width={75} />
        <HeaderSubItem label="AV" width={25} />
        <HeaderSubItem label="VC" width={25} />
        <HeaderSubItem label="Available" width={50} />
      </FlexRow>
    </MenuItem>
  );
}

function HeaderSubItem({ label, width }: { label: string; width: number }) {
  return (
    <Typography variant="subtitle2" sx={{ width }} align="center">
      {label}
    </Typography>
  );
}
