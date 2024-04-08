// src/theme.js
import { createTheme } from '@mui/material/styles';

export const extraColors = {
  cellBorderColor: '#ebebeb',
  availableTimeslotColor: '#FFFFFF',
  unavailableTimeslotColor: '#b0acac',
  bookedMeetingColor: '#84e0f0',
  headerPaperColor: '#232F3E',
  createMeetingBackground: '#171D1E',
  lightGreyBorder: '#D4D4D4',
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A6266', // Blue color
    },
    secondary: {
      main: '#ff9902', // Pink color
      light: '#fcc065',
    },
  },
});

export default theme;
