import { Box, Modal } from '@mui/material';
import React from 'react';

interface ModalStandardFormProps {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode | React.ReactNode[];
}

const ModalStandardForm = ({
  open,
  handleClose,
  children,
}: ModalStandardFormProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          pt: 2,
          px: 4,
          pb: 3,
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default ModalStandardForm;
