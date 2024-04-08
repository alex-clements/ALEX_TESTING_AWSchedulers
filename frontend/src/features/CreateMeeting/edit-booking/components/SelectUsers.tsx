import { useCreateMeeting } from '../../context/useCreateMeetingContext';
import { AttendeeT } from '../../types/bookingOptions';
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  PaperProps,
} from '@mui/material';

interface SelectUsersProps {
  handleChange: (event: SelectChangeEvent<string[]>) => void;
  currentRoomUsers?: AttendeeT[];
  pickedUserAlerts: string;
  isRoomFull: boolean;
}
const ITEM_HEIGHT = 44;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
      width: 250,
      sx: { paddingTop: 0 },
    } as PaperProps,
  },
};
export default function SelectUsers({
  handleChange,
  currentRoomUsers,
  pickedUserAlerts,
  isRoomFull,
}: SelectUsersProps) {
  const { participants } = useCreateMeeting();
  return (
    <div style={{ width: '100%' }}>
      {pickedUserAlerts && (
        <Alert
          sx={{ marginTop: 2, maxHeight: 100 }}
          variant="outlined"
          severity="info"
        >
          {pickedUserAlerts}
        </Alert>
      )}

      {isRoomFull && (
        <Alert sx={{ marginTop: 2 }} variant="outlined" severity="warning">
          Room is full
        </Alert>
      )}

      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel id="user-select-label">Participants</InputLabel>
        <Select
          labelId="user-select-label"
          id="user-multiple-checkbox"
          multiple
          value={currentRoomUsers?.map((user) => user.id) || []}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          MenuProps={MenuProps}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={participants.find((p) => p.id === value)?.name}
                />
              ))}
            </Box>
          )}
        >
          {participants.map((participant) => {
            const isParticipantInRoom = currentRoomUsers?.some(
              (currentRoomUsers) => currentRoomUsers.id === participant.id
            );
            return (
              <MenuItem
                disabled={isRoomFull && !isParticipantInRoom}
                key={participant.id}
                value={participant.id}
              >
                <Checkbox checked={isParticipantInRoom} />
                <ListItemText primary={participant.name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
