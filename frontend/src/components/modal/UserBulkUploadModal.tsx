import { useState, useEffect } from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import ModalStandardForm from './ModalStandardForm';
import { UploadFileButton } from '../buttons/UploadFileButton';
import { useAdminUpload } from '../../hooks/useAdminUpload';
import { CircularProgress } from '@mui/material';
import { DownloadButton } from '../buttons/DownloadButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CommitIcon from '@mui/icons-material/Commit';

interface MessagesBoxProps {
  heading: string;
  messages: string[];
}

const MessagesBox = ({ messages, heading }: MessagesBoxProps) => {
  return (
    <>
      <p style={{ color: '' }}>{heading}</p>
      <Box
        sx={{
          maxHeight: '200px',
          overflow: 'scroll',
          border: 'solid',
          padding: 1,
        }}
      >
        {messages.map((message, idx) => {
          return <p key={idx}>{message}</p>;
        })}
      </Box>
    </>
  );
};

interface UserBulkUploadModalProps {
  modalOpen: boolean;
  handleModalClose: () => void;
}

export const UserBulkUploadModal = ({
  modalOpen,
  handleModalClose: closeModal,
}: UserBulkUploadModalProps) => {
  const [fileContents, setFileContents] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [validationStarted, setValidationStarted] = useState<boolean>(false);
  const [commitStarted, setCommitStarted] = useState<boolean>(true);

  const {
    validateUsersData,
    clearState,
    uploadUsers,
    isLoading,
    isLoadingValidation,
    validationErrors,
    validationWarnings,
    uploadPercentComplete,
    uploadErrors,
  } = useAdminUpload();

  const handleModalClose = () => {
    setFileContents('');
    setFileName('');
    closeModal();
    setValidationStarted(false);
    setCommitStarted(false);
    clearState();
  };

  const handleLoadFileContents = (filename: string, contents: string) => {
    setFileName(filename);
    setFileContents(contents);
  };

  const handleValidateFileContents = () => {
    setValidationStarted(true);
    validateUsersData(fileContents);
  };

  const handleCommitFileChanges = () => {
    setCommitStarted(true);
    uploadUsers(fileContents);
  };

  const validationErrorState =
    validationStarted && !isLoadingValidation && validationErrors.length > 0;

  const validationSuccessState =
    validationStarted && !isLoadingValidation && validationErrors.length === 0;

  const commitSuccessState = commitStarted && !isLoading && !uploadErrors;

  const commitErrorState = commitStarted && !isLoading && uploadErrors;

  useEffect(() => {
    clearState();
    setValidationStarted(false);
    setCommitStarted(false);
  }, [fileContents]);

  return (
    <>
      <ModalStandardForm open={modalOpen} handleClose={handleModalClose}>
        <Typography variant="h6">Bulk Upload Users</Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <p>
          1. Download the uploader template. This contains an example to follow
          for bulk-uploading users.
        </p>
        <DownloadButton />
        <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
        <p>2. Choose a CSV file to upload.</p>
        <Stack direction="row" spacing={5}>
          <UploadFileButton
            onLoadFileContents={handleLoadFileContents}
            acceptFileType=".csv"
          />
          {fileName !== '' && <p>{fileName}</p>}
        </Stack>
        {fileContents !== '' && (
          <>
            <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
            <p>3. Check that the file meets all requirements.</p>
            <Stack direction="row" spacing={15}>
              <Button
                variant="contained"
                onClick={handleValidateFileContents}
                startIcon={<CheckCircleOutlineIcon />}
              >
                Check File
              </Button>
              {isLoadingValidation && <CircularProgress />}
              {validationErrorState && <ErrorOutlineIcon color="error" />}
              {validationSuccessState && (
                <CheckCircleOutlineIcon color="success" />
              )}
            </Stack>
            {validationErrorState && (
              <MessagesBox messages={validationErrors} heading="Errors" />
            )}
            {validationSuccessState && validationWarnings.length > 0 && (
              <MessagesBox
                messages={validationWarnings}
                heading="Notable Changes"
              />
            )}
          </>
        )}
        {validationSuccessState && (
          <>
            <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
            <p>4. Commit file changes.</p>
            <Stack direction="row" spacing={18}>
              <Button
                variant="contained"
                onClick={handleCommitFileChanges}
                startIcon={<CommitIcon />}
              >
                Commit
              </Button>
              {isLoading && <CircularProgress />}
              {commitSuccessState && <CheckCircleOutlineIcon color="success" />}
              {commitErrorState && <ErrorOutlineIcon color="error" />}
            </Stack>
            {isLoading && (
              <div style={{ marginTop: 10 }}>
                Percent Complete: {uploadPercentComplete}{' '}
              </div>
            )}
            {commitErrorState && (
              <div style={{ marginTop: 10 }}>
                Something went wrong during the commit. Please try again later.
              </div>
            )}
          </>
        )}
        <Divider sx={{ marginTop: 2 }} />
        <Box sx={{ float: 'right', marginTop: 2 }}>
          <Button variant="outlined" onClick={handleModalClose}>
            Close
          </Button>
        </Box>
      </ModalStandardForm>
    </>
  );
};
