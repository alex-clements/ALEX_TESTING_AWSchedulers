import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import useGetUserInfo from '../../hooks/useGetUserInfo';
import { Alert, styled } from '@mui/material';
import { useState } from 'react';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  minWidth: '320px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

const StyledRow = styled(Typography)({
  flex: 1, 
  wordBreak: 'break-all',
  margin: '0.05rem 0'
});

export default function BasicUserInfoModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { data, error, isLoading } = useGetUserInfo();

  return (
    <div>
      <Typography sx={{ cursor: 'pointer' }} onClick={handleOpen}>
        User Information
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="user-information"
        aria-describedby="information about the current user"
      >
        <Box sx={style}>
          <Typography
            textAlign="center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            User Information
          </Typography>
          {isLoading && <Alert severity="info">Loading User Information</Alert>}
          {error && <Alert severity="error">{error.message}</Alert>}
          {data && (
            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 1 }}>
              <StyledRow variant="body1">Name: {data.name}</StyledRow>
              <StyledRow variant="body1">Username: {data.username}</StyledRow>
              <StyledRow variant="body1">Email: {data.email}</StyledRow>
              <StyledRow variant="body1">
                Work Building: {data.Building.airportCode}{' '}
                {data.Building.number}
              </StyledRow>
              <StyledRow variant="body1">
                Desk Floor: {data.floorNumber}
              </StyledRow>
              <StyledRow>Location: {data.Building.location}</StyledRow>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
