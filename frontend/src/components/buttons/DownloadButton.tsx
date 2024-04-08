import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export const DownloadButton = () => {
  return (
    <a href="/usersUploadTemplate.csv" target="_blank" download>
      <Button variant="contained" startIcon={<DownloadIcon />}>
        Template
      </Button>
    </a>
  );
};
