import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import MainRouter from './routing/MainRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // This will turn off retries for failed queries
    },
  },
});

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <SnackbarProvider
      autoHideDuration={3500}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  );
}

export default App;
