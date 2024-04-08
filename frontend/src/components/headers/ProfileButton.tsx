import { useState } from 'react';
import { AccountCircle } from '@mui/icons-material';
import { Menu, MenuItem, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { getUsername } from '../../utils/user';
import BasicUserInfoModal from '../modal/BasicUserInfoModal';
import { useQueryClient } from '@tanstack/react-query';

// Attribution: This page references the App Bar Material UI documentation
// Source: https://mui.com/material-ui/react-app-bar/

// Set outside of hook so that it can be accessed from either functions
const userpool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});

export const ProfileButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    setAnchorEl(null);
    const user = userpool.getCurrentUser();
    if (user) {
      user?.signOut(() => {
        console.log('User logged out');
        queryClient.clear();
        navigate('/');
      });
    } else {
      console.log('User was already logged out');
      queryClient.clear();
      navigate('/');
    }
  };

  return (
    <>
      <Button
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        title="Profile Button"
        onClick={handleMenu}
        sx={{ color: 'white' }}
      >
        <AccountCircle />
        <Typography sx={{ marginLeft: 1, textTransform: 'none' }}>
          {getUsername()}
        </Typography>
      </Button>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <BasicUserInfoModal />
        </MenuItem>
        <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
      </Menu>
    </>
  );
};
