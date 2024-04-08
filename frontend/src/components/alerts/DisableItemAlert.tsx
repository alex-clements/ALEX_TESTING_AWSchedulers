import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import theme from '../../styles/theme';

interface DisableAlertProps {
    open: boolean;
    handleModalClose: () => void;
    handleDisable: () => void;
    description: string
    
  }

const StyledButton = styled(Button)(() => ({
    background:`${theme.palette.primary.main}`,
    color: "white", 
    '&:hover': {backgroundColor: 'red', color: 'black'}
}));

const DisableItemAlert = ({
    open,
    handleModalClose,
    handleDisable,
    description
}: DisableAlertProps) => {
  const handleConfirm = () => {
    handleDisable();
    handleModalClose();
  }

  return (
      <>
        <Dialog
            open={open}
            onClose={handleModalClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to disable the following?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={handleModalClose}>Cancel</Button>
                <StyledButton variant='contained' onClick={handleConfirm} autoFocus>
                    Confirm
                </StyledButton>
            </DialogActions>
        </Dialog>
      </>
  );
}

export default DisableItemAlert;
