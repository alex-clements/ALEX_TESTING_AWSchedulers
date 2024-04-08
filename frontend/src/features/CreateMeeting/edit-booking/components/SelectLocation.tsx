import {
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  PaperProps,
  Alert,
} from '@mui/material';
import { BuildingT } from '../../../../types/generaltypes';
import { RoomAvailabilityT } from '../../types/bookingOptions';
import RoomSelectItem from './RoomSelectItem';
import { RoomSelectHeader } from './RoomSelectHeader';

interface SelectLocationProps {
  items: RoomAvailabilityT[] | BuildingT[];
  handleChange: (event: SelectChangeEvent<string>) => void;
  disabled: boolean;
  label: string;
  pickedItemId?: string;
  error?: string;
  loadingMessage?: string;
}

const ITEM_HEIGHT = 44;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 9 + ITEM_PADDING_TOP,
    } as PaperProps,
  },
};

export default function SelectLocation({
  items,
  pickedItemId,
  handleChange,
  disabled,
  label,
  error,
  loadingMessage,
}: SelectLocationProps) {
  const notFound = !items.length && `No ${label}s Found`;
  if (error || loadingMessage || notFound) {
    const severity = loadingMessage ? 'info' : 'error';
    return (
      <Alert
        sx={{ width: 1, marginBottom: 1 }}
        variant="outlined"
        severity={severity}
      >
        {error || loadingMessage || notFound}
      </Alert>
    );
  }

  const labelLowerCase = label.toLowerCase();
  const id = `${labelLowerCase}-select`;
  const labelId = `${labelLowerCase}-select-label`;
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          id={id}
          labelId={labelId}
          label={label}
          value={pickedItemId || ''}
          onChange={handleChange}
          disabled={disabled}
          MenuProps={MenuProps}
          renderValue={(value) => {
            const item = items.find((item) => item.id === value);
            return item ? getItemName(item) : '';
          }}
          fullWidth
        >
          {label === 'Room' && <RoomSelectHeader label={label} />}
          {items.map((item) => {
            const isRoom = 'roomNumber' in item;
            return (
              <MenuItem
                key={item.id}
                value={item.id}
                disabled={isRoom && !item.available}
                style={{ justifyContent: 'space-between' }}
              >
                {isRoom ? <RoomSelectItem room={item} /> : item.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
}

function getItemName(item: RoomAvailabilityT | BuildingT) {
  return 'roomNumber' in item
    ? `${item.floorNumber}.${item.roomNumber}${
        item.roomName === '' ? '' : ' - ' + item.roomName
      }`
    : item.name;
}
