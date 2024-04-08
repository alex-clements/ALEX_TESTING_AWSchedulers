import { useQueryClient } from '@tanstack/react-query';
import { UploadService } from '../services/upload-service';
import { useState } from 'react';

const countLines = (str: string, char: string) => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === char) {
      count++;
    }
  }
  return count;
};

const batchData = (data: string): string[] => {
  const res = [];

  const firstRowEndIndex = data.indexOf('\n', 0);
  let headerRow = data.slice(0, firstRowEndIndex);

  // Adds a comma to deal with issue where its is not correctly detecting the username
  if (!headerRow.startsWith(',')) {
    headerRow = ',' + headerRow;
  }

  const numRows = countLines(data, '\n');
  let startingIndex: number = firstRowEndIndex + 1;
  for (let i = 1; i <= numRows; i = i + 20) {
    const rowData = getRows(data, 20, startingIndex);
    const rowString = headerRow + '\n' + rowData.data;
    startingIndex = rowData.finalIndex + 1;
    res.push(rowString);
  }

  return res;
};

const getRows = (
  data: string,
  numRows: number,
  startIndex: number
): { data: string; finalIndex: number } => {
  let res = '';

  let i1: number = startIndex;
  let i2: number = 0;

  for (let i: number = 0; i < numRows; i++) {
    i2 = data.indexOf('\n', i1);
    if (i2 < i1) {
      break;
    }
    let currString = data.slice(i1, i2);
    if (!currString.startsWith(',')) {
      currString = ',' + currString;
    }
    res += currString + '\n';
    i1 = i2 + 1;
  }

  return {
    data: res,
    finalIndex: i2,
  };
};

export const useAdminUpload = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingValidation, setIsLoadingValidation] =
    useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadErrors, setUploadErrors] = useState<boolean>(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [uploadPercentComplete, setUploadPercentComplete] =
    useState<string>('0%');
  const queryClient = useQueryClient();

  const uploadUsers = async (data: string) => {
    setIsLoading(true);
    const batchedData = batchData(data);
    const totalBatches: number = batchedData.length;

    const uploadService = new UploadService();
    let batchesComplete = 0;

    const executableBatches: string[][] = [];

    for (let i = 0; i < totalBatches; i = i + 2) {
      const new_batch = [];
      new_batch.push(batchedData[i]);
      if (i + 1 < totalBatches) {
        new_batch.push(batchedData[i + 1]);
      }
      executableBatches.push(new_batch);
    }

    for (const batches of executableBatches) {
      try {
        const promises = [];
        for (let i = 0; i < batches.length; i++) {
          const curr_batch = batches[i];
          const dataJSON = JSON.stringify({
            data: curr_batch,
            stage: 'upload',
          });
          promises.push(uploadService.post_users(dataJSON));
        }
        await Promise.all(promises);

        const percentComplete =
          (++batchesComplete / executableBatches.length) * 100;
        const formattedPercentage = percentComplete.toFixed(0) + '%';
        console.log(formattedPercentage);
        setUploadPercentComplete(formattedPercentage);
      } catch (err) {
        // Todo handle errors
        console.log('uploadUsers error:', err);
        setIsLoading(false);
        setUploadErrors(true);
        break;
      }
    }

    queryClient.invalidateQueries();
    setIsLoading(false);
  };

  const validateUsersData = (data: string) => {
    const dataJSON = JSON.stringify({ data, stage: 'validate' });
    setIsLoadingValidation(true);
    setValidationErrors([]);
    setValidationWarnings([]);
    const uploadService = new UploadService();
    uploadService
      .post_users(dataJSON)
      .then((data) => {
        console.log(data);
        setIsLoadingValidation(false);
        setValidationErrors(data.errorsList);
        setValidationWarnings(data.warningsList);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingValidation(false);
      });
  };

  const clearState = () => {
    setIsLoading(false);
    setIsLoadingValidation(false);
    setValidationErrors([]);
    setValidationWarnings([]);
    setUploadErrors(false);
  };

  return {
    uploadUsers,
    validateUsersData,
    clearState,
    isLoading,
    isLoadingValidation,
    validationErrors,
    validationWarnings,
    uploadPercentComplete,
    uploadErrors,
  };
};
