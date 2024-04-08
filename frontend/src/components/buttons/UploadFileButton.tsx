import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface UploadFileButtonProps {
  onLoadFileContents: (filename: string, contents: string) => void;
  acceptFileType?: string;
}

export const UploadFileButton = ({
  onLoadFileContents,
  acceptFileType,
}: UploadFileButtonProps) => {
  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let fileName: string = '';
    if (e.target.value === '' || e.target === undefined) return;
    const fileReader = new FileReader();
    fileReader.onload = async (file: any) => {
      onLoadFileContents(fileName, file.target.result);
      e.target.value = '';
    };
    if (e.target.files) {
      fileName = e?.target?.files[0].name;
      fileReader.readAsText(e?.target?.files[0]);
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput
        type="file"
        accept={acceptFileType}
        onChange={(e) => uploadFile(e)}
      />
    </Button>
  );
};
