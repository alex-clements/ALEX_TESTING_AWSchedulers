import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';
import { BsBuildingsFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import {
  adminBuildingPageRoute,
  adminPeoplePageRoute,
  createMeetingPageRoute,
} from '../../routing/routes';
import { IoPeople } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaCalendarAlt } from 'react-icons/fa';

const subtitles = [
  {
    text: 'My Schedule',
    icon: <FaCalendarAlt size={23} />,
    link: createMeetingPageRoute,
  },
  {
    text: 'Buildings',
    icon: <BsBuildingsFill size={25} />,
    link: adminBuildingPageRoute,
  },
  { text: 'People', icon: <IoPeople size={25} />, link: adminPeoplePageRoute },
];

const AdminHamburgerButton = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDrawer = (isOpen: boolean) => {
    setDrawerOpen(isOpen);
  };
  const list = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {subtitles.map(({ text, icon, link }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate(link)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <>
      <RxHamburgerMenu
        cursor="pointer"
        size={30}
        onClick={() => toggleDrawer(true)}
      />
      <Drawer
        anchor={'left'}
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </>
  );
};

export default AdminHamburgerButton;
