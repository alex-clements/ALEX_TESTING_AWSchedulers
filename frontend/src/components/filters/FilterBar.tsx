import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

interface FilterBarProps {
  roomCapacities: (number | string)[];
  visible: boolean;
  onSelectAv: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectVc: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetMinCapacity: (e: string) => void;
  onSetMaxCapacity: (e: string) => void;
}

export const FilterBar = ({
  roomCapacities,
  visible,
  onSelectAv: handleCheckAV,
  onSelectVc: handleCheckVC,
  onSetMinCapacity: handleSetMinCapacity,
  onSetMaxCapacity: handleSetMaxCapacity,
}: FilterBarProps) => {
  const [maxCapacity, setMaxCapacity] = useState<string>('');
  const [minCapacity, setMinCapacity] = useState<string>('');

  const handleMaxCapacityChange = (e: SelectChangeEvent) => {
    setMaxCapacity(e.target.value);
    handleSetMaxCapacity(e.target.value);
  };

  const handleMinCapacityChange = (e: SelectChangeEvent) => {
    setMinCapacity(e.target.value);
    handleSetMinCapacity(e.target.value);
  };

  const minRoomCapacitiesOptions: (number | string)[] = [
    '',
    ...roomCapacities,
  ].filter((val) => {
    return val === '' || maxCapacity === '' || val <= maxCapacity;
  });

  const maxRoomCapacitiesOptions: (number | string)[] = [
    '',
    ...roomCapacities,
  ].filter((val) => {
    return val === '' || minCapacity === '' || val >= minCapacity;
  });

  return (
    <>
      {visible && (
        <FormGroup
          sx={{
            display: 'flex',
            flexDirection: 'row',
            paddingLeft: 6,
            paddingTop: 2,
            paddingBottom: 1,
            backgroundColor: '#e6e6e6',
            border: 'solid',
            borderWidth: '0px 0px 1px 0px',
            borderColor: 'grey',
          }}
        >
          <Typography variant="h6" sx={{ marginRight: 2 }}>
            Filter Options:{' '}
          </Typography>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="min-capacity-select-label">Min Capacity</InputLabel>
            <Select
              labelId="min-capacity-select-label"
              label="Min Capacity"
              value={minCapacity}
              onChange={handleMinCapacityChange}
              error={
                maxCapacity !== '' &&
                minCapacity !== '' &&
                maxCapacity < minCapacity
              }
            >
              {minRoomCapacitiesOptions.map((capacity) => (
                <MenuItem key={capacity} value={capacity}>
                  {capacity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{ minWidth: 150, marginLeft: 2, marginRight: 2 }}
            size="small"
          >
            <InputLabel id="max-capacity-select-label">Max Capacity</InputLabel>
            <Select
              labelId="max-capacity-select-label"
              label="Max Capacity"
              value={maxCapacity}
              onChange={handleMaxCapacityChange}
              error={
                maxCapacity !== '' &&
                minCapacity !== '' &&
                maxCapacity < minCapacity
              }
            >
              {maxRoomCapacitiesOptions.map((capacity) => (
                <MenuItem key={capacity} value={capacity}>
                  {capacity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox onChange={handleCheckAV} />}
            label="Audio"
          />
          <FormControlLabel
            control={<Checkbox onChange={handleCheckVC} />}
            label="Video"
          />
        </FormGroup>
      )}
    </>
  );
};
