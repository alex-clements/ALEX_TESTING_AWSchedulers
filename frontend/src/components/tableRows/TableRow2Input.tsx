import { Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { FlexRow } from '../flexComponents';

interface TableRow2InputProps {
  label: string;
  info?: React.ReactNode;
  children: string | React.ReactNode | React.ReactNode[];
}

export default function TableRow2Input({
  label,
  info,
  children,
}: TableRow2InputProps) {
  return (
    <>
      <Grid
        item
        container
        spacing={1}
        alignItems={'center'}
        sx={{ paddingBlock: 1 }}
      >
        <Grid item xs={12} sm={4}>
          <FlexRow justifyContent="start">
            <Typography color="textPrimary" variant="subtitle2">
              {label}
            </Typography>
            {info}
          </FlexRow>
        </Grid>
        <Grid item xs={12} sm={8}>
          {children}
        </Grid>
      </Grid>
      <Divider />
    </>
  );
}
