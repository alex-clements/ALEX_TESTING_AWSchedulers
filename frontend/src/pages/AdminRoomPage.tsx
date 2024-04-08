import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  colors,
  Stack,
  Switch,
} from '@mui/material';
import AdminHeader from '../components/headers/AdminHeader';
import RoomModal from '../components/modal/RoomModal';
import BaseTable from '../components/BaseTable';
import { GridColDef } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../styles/theme';
import LoadingSpinner from '../components/spinner/LoadingSpinner';
import { useLocation, useParams } from 'react-router-dom';
import { userRoomGetByBuildingId } from '../hooks/useRoomGetByBuildingId';
import BuildingInfoModal from '../components/modal/BuildingInfoModal';
import RoomInfoModal from '../components/modal/RoomInfoModal';
import useBuildingEdit from '../hooks/useBuildingEdit';
import { BuildingT } from '../types/generaltypes';

const createIcon = (condition: boolean) => {
  return (
    (condition && (
      <div style={{ color: 'green' }}>
        <CheckIcon />
      </div>
    )) || (
      <div style={{ color: 'red' }}>
        <CloseIcon />
      </div>
    )
  );
};

const columns: GridColDef[] = [
  { field: 'roomNumber', headerName: 'Room Number', flex: 2 },
  { field: 'roomName', headerName: 'Room Name', flex: 2 },
  { field: 'floorNumber', headerName: 'Floor', flex: 2 },
  { field: 'capacity', headerName: 'Capacity', flex: 2 },
  {
    field: 'AV',
    headerName: 'AV',
    flex: 2,
    renderCell: (params: any) => createIcon(params.row.AV),
  },
  {
    field: 'VC',
    headerName: 'VC',
    flex: 2,
    renderCell: (params: any) => createIcon(params.row.VC),
  },
  {
    field: 'isActive',
    headerName: 'Is Active?',
    flex: 2,
    renderCell: (params: any) => createIcon(params.row.isActive),
  },
];

const AdminRoomPage = () => {
  let { buildingId } = useParams();
  const location = useLocation();
  const [buildingState, setBuildingState] = useState(location.state);

  const { editBuilding } = useBuildingEdit();

  if (buildingId === undefined) {
    buildingId = '';
  }
  const { isLoadingRooms, rooms, isErrorLoadingRooms } =
    userRoomGetByBuildingId({ buildingId });

  const [isEditBuilding, setIsEditBuilding] = useState(false);
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [isActivatingAllRooms, setIsActivatingAllRooms] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAllRooms, setShowAllRooms] = useState(false);

  const handleRoomDisplaySwitch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowAllRooms(event.target.checked);
  };

  const handleActivateAllRooms = () => {
    const buildingData: BuildingT = {
      id: buildingState.id,
      number: buildingState.number,
      name: buildingState.name,
      airportCode: buildingState.airportCode,
      location: buildingState.location,
      latitude: buildingState.latitude,
      longitude: buildingState.longitude,
      maxFloor: buildingState.maxFloor,
      isActive: buildingState.isActive,
      activateAllRooms: true,
    };

    // TODO: ADD ERROR HANDLING HERE
    if (!buildingId) {
      return;
    }

    editBuilding(buildingId, buildingData);
  };
  return (
    <>
      <AdminHeader />
      <Container>
        <br />
        <br />
        <Typography variant="h4">
          Rooms{' '}
          <span style={{ color: `#4d4d4d` }}> - {buildingState.name}</span>
        </Typography>
        <br />

        <Box mb={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={() => setIsEditBuilding(true)}
            sx={{
              background: `${theme.palette.secondary.main}`,
              color: 'black',
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}`,
                color: 'white',
              },
            }}
          >
            Edit Building
          </Button>
        </Box>
        <Paper elevation={2} sx={{ paddingX: 4, paddingY: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography>
                <b>Name: </b>
                {buildingState.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Airport Code: </b>
                {buildingState.airportCode}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Number: </b>
                {buildingState.number}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Latitude: </b>
                {Math.round(buildingState.latitude * 100) / 100}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Number of Floors: </b>
                {buildingState.maxFloor}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Longitude: </b>
                {Math.round(buildingState.longitude * 100) / 100}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <b>Location: </b>
                {buildingState.location}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Is Active: </b>
                {buildingState.isActive ? 'Yes' : 'No'}
              </Typography>
            </Grid>
          </Grid>
          {/* <Container>
            <FlexRow justifyContent='space-between'>
              <Typography><b>Name:</b>{state.name}</Typography>
              <Typography ml={20}><b>Airport Code:</b>{state.airportCode}</Typography>
            </FlexRow>
            <FlexRow justifyContent='space-between'>
              <Typography><b>Number:</b>{state.number}</Typography>
              <Typography><b>Latitude:</b>{state.lat}</Typography>
            </FlexRow>
            <FlexRow justifyContent='space-between'>
              <Typography><b>Address:</b>{state.address}</Typography>
              <Typography><b>Longitude:</b>{state.lon}</Typography>
            </FlexRow>
          </Container> */}
        </Paper>
        <br />
        <br />
        <Box mb={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={() => setIsAddingRow(true)}
            sx={{
              background: `${theme.palette.secondary.main}`,
              color: 'black',
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}`,
                color: 'white',
              },
            }}
          >
            Add Room
          </Button>
        </Box>
        <Stack
          style={{ display: 'flex', justifyContent: 'flex' }}
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Typography>Show Active Rooms</Typography>
          <Switch
            checked={showAllRooms}
            onChange={handleRoomDisplaySwitch}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <Typography>Show All Rooms</Typography>
        
        {buildingState.isActive ? (
            <Button
            style={{ marginLeft: 'auto' }}
            variant="contained"
            onClick={handleActivateAllRooms}
          >
            Activate All Rooms
          </Button>
        ):(<div></div>)}
          
        </Stack>
        {isLoadingRooms ? (
          <LoadingSpinner />
        ) : showAllRooms ? (
          <BaseTable
            columns={columns}
            data={rooms}
            setSelectedRow={setSelectedRow}
          />
        ) : (
          <BaseTable
            columns={columns}
            data={rooms.filter((room) => room.isActive)}
            setSelectedRow={setSelectedRow}
          />
        )}

        {isEditBuilding && (
          <BuildingInfoModal
            modalOpen={isEditBuilding}
            handleModalClose={() => setIsEditBuilding(false)}
            data={buildingState}
            setBuildingState={setBuildingState}
            // setSelectedRow={(data :any) => handleClickRow(data)}
          />
        )}

        {isAddingRow && (
          <RoomModal
            modalOpen={isAddingRow}
            handleModalOpen={() => setIsAddingRow(true)}
            handleModalClose={() => setIsAddingRow(false)}
            info={{
              id: '',
              roomName: '',
              roomNumber: '',
              Building: buildingState.id,
              floorNumber: 1,
              capacity: 0,
              AV: false,
              VC: false,
              isActive: true,
            }}
            maxFloor={buildingState.maxFloor}
            edit={false}
          />
        )}

        {selectedRow && (
          <RoomInfoModal
            modalOpen={selectedRow !== null}
            handleModalClose={() => setSelectedRow(null)}
            data={selectedRow}
            maxFloor={buildingState.maxFloor}
            isActiveBuilding={buildingState.isActive}
          />
        )}
      </Container>
    </>
  );
};

export default AdminRoomPage;
