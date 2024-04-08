import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { IconButton } from '@mui/material';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1 / 3,
  minWidth: 320,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

interface BasicModalProps {
  title: string;
  text: string;
  children: React.ReactNode;
}

export default function BasicIconModal({
  title,
  text,
  children,
}: BasicModalProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton size="small" onClick={handleOpen}>
        {children}
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ mt: 4, mb: 1, textAlign: 'center' }}
            id={`modal-${title}`}
            variant="h6"
            component="h2"
          >
            {title}
          </Typography>
          <Typography id={`modal-${title}-description`} sx={{ p: 1 }}>
            <pre
              style={{
                fontFamily: 'inherit',
                margin: 0,
                whiteSpace: 'pre-wrap'
              }}
            >
              {text}
            </pre>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
