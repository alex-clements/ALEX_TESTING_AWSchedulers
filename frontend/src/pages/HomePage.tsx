import React, { useState } from 'react';
import { Button, Typography, styled } from '@mui/material';
import UserModal from '../components/modal/UserModal';
import { Link } from 'react-router-dom';
import BuildingModal from '../components/modal/BuildingModal';
import RoomModal from '../components/modal/RoomModal';
import { buildings } from '../mocks/buildings';
import theme from '../styles/theme';
import CreateMeetingModal from '../components/modal/CreateMeetingModal';

const StyledButton = styled(Button)(() => ({
  background: `${theme.palette.secondary.main}`,
  color: 'black',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}`,
    color: 'white',
  },
}));

const HomePage = () => {
  const [modalOpenUser, setModalOpenUser] = useState(false);
  const [modalOpenBuilding, setModalOpenBuilding] = useState(false);
  const [modalOpenRoom, setModalOpenRoom] = useState(false);
  const [modalOpenCreateMeeting, setModalOpenCreateMeeting] = useState(false);

  const handleModalOpenUser = () => {
    setModalOpenUser(true);
  };

  const handleModalCloseUser = () => {
    setModalOpenUser(false);
  };

  const handleModalOpenBuilding = () => {
    setModalOpenBuilding(true);
  };

  const handleModalCloseBuilding = () => {
    setModalOpenBuilding(false);
  };

  const handleModalOpenRoom = () => {
    setModalOpenRoom(true);
  };

  const handleModalCloseRoom = () => {
    setModalOpenRoom(false);
  };

  const handleModalOpenCreateMeeting = () => {
    setModalOpenCreateMeeting(true);
  };

  const handleModalCloseCreateMeeting = () => {
    setModalOpenCreateMeeting(false);
  };

  return (
    <div>
      <div>HomePage</div>
      <button>dog</button>
      <Link to="/about">About</Link>
      <Link to="/admin/building">Admin-Buildings</Link>
      <Link to="/admin/building">Admin-People</Link>
      <br />
      <Button variant="contained" color="primary">
        text
      </Button>
      <Button variant="contained" color="secondary">
        outlined
      </Button>
      <Button variant="contained" color="success">
        contained
      </Button>
      <StyledButton
        variant="contained"
        color="secondary"
        onClick={handleModalOpenBuilding}
      >
        Open Building Modal
      </StyledButton>
      <StyledButton
        variant="contained"
        color="secondary"
        onClick={handleModalOpenRoom}
      >
        Open Room Modal
      </StyledButton>
      <StyledButton
        variant="contained"
        color="secondary"
        onClick={handleModalOpenUser}
      >
        Open User Modal
      </StyledButton>
      <StyledButton
        variant="contained"
        color="secondary"
        onClick={handleModalOpenCreateMeeting}
      >
        Open Create Meeting Modal
      </StyledButton>
      <UserModal
        modalOpen={modalOpenUser}
        handleModalOpen={handleModalOpenUser}
        handleModalClose={handleModalCloseUser}
        info={{
          id: '1',
          username: 'John',
          name: 'Doe',
          email: 'johndoe@example.com',
          Building: '111',
          floorNumber: 1,
          isAdmin: true,
          isActive: true,
        }}
        edit={true}
      />
      <BuildingModal
        modalOpen={modalOpenBuilding}
        handleModalOpen={handleModalOpenBuilding}
        handleModalClose={handleModalCloseBuilding}
        info={buildings[0]}
        edit={true}
        setBuildingState={setModalOpenBuilding}
      />
      {/* <RoomModal
        modalOpen={modalOpenRoom}
        handleModalOpen={handleModalOpenRoom}
        handleModalClose={handleModalCloseRoom}
        info={{
          id: "4444",
          roomName: 'placeholder4444',
          roomNumber: "432",
          Building: "111",
          floorNumber: 10,
          capacity: 25,
          AV: true,
          VC: false
        }}
        maxFloor={5}
        edit={true}
      /> */}
      <CreateMeetingModal
        modalOpen={modalOpenCreateMeeting}
        handleModalOpen={handleModalOpenCreateMeeting}
        handleModalClose={handleModalCloseCreateMeeting}
        info={{
          id: 0,
          organizerID: 0,
          participantIDs: [],
          startTime: 0,
          endTime: 0,
          multiRoom: true,
          audio: true,
          video: true,
        }}
        edit={false}
      />
    </div>
  );
};
export default HomePage;
