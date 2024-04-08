import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Switch,
} from '@mui/material';
import { blankBuilding } from '../mocks/buildings';
import AdminHeader from '../components/headers/AdminHeader';
import BuildingModal from '../components/modal/BuildingModal';
import BaseTable from '../components/BaseTable';
import { GridColDef } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { BuildingT } from '../types/generaltypes';
import theme from '../styles/theme';
import { useBuildingGetAll } from '../hooks/useBuildingGetAll';
import LoadingSpinner from '../components/spinner/LoadingSpinner';
import AdminBuildingModal from '../components/modal/AdminBuildingModal';
import { useNavigate, useNavigation } from 'react-router-dom';
import BuildingInfoModal from '../components/modal/BuildingInfoModal';
import { adminRoomPageRouteFn } from '../routing/routes';

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
  { field: 'name', headerName: 'Name', flex: 3 },
  { field: 'number', headerName: 'Number', flex: 2 },
  { field: 'airportCode', headerName: 'AirportCode', flex: 2 },
  { field: 'location', headerName: 'Location', flex: 5 },
  { field: 'maxFloor', headerName: '# Floors', flex: 2 },
  {
    field: 'latitude',
    headerName: 'Latitude',
    flex: 2,
    valueGetter: (lat) => Math.round(lat.value * 100) / 100,
  },
  {
    field: 'longitude',
    headerName: 'Longitude',
    flex: 2,
    valueGetter: (lon) => Math.round(lon.value * 100) / 100,
  },
  {
    field: 'isActive',
    headerName: 'Is Active?',
    flex: 2,
    renderCell: (params: any) => createIcon(params.row.isActive),
  },
];

const AdminBuildingPage = () => {
  const { isLoading, buildings, error } = useBuildingGetAll();
  const navigate = useNavigate();

  const columnInitialization = {
    latitude: false,
    longitude: false,
  };

  const [isAddingRow, setIsAddingRow] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAllBuildings, setShowAllBuildings] = useState(false);
  const handleClickRow = (data: any) => {
    navigate(adminRoomPageRouteFn(data.id), { state: data });
  };

  const handleBuildingDisplaySwitch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowAllBuildings(event.target.checked);
  };

  return (
    <>
      <AdminHeader />
      <br />
      <br />
      <Container>
        <Typography variant="h4">Buildings</Typography>

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
            Add Building
          </Button>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>Show Active Buildings</Typography>
          <Switch
            checked={showAllBuildings}
            onChange={handleBuildingDisplaySwitch}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <Typography>Show All Buildings</Typography>
        </Stack>

        {isLoading ? (
          <LoadingSpinner />
        ) : showAllBuildings ? (
          <BaseTable
            columns={columns}
            data={buildings}
            columnInitialization={columnInitialization}
            setSelectedRow={(data: any) => handleClickRow(data)}
          />
        ) : (
          <BaseTable
            columns={columns}
            data={buildings.filter((building) => building.isActive)}
            columnInitialization={columnInitialization}
            setSelectedRow={(data: any) => handleClickRow(data)}
          />
        )}

        {isAddingRow && (
          <BuildingModal
            modalOpen={isAddingRow}
            handleModalOpen={() => setIsAddingRow(true)}
            handleModalClose={() => setIsAddingRow(false)}
            info={blankBuilding}
            edit={false}
            setBuildingState={setSelectedRow}
          />
        )}

        {/* {selectedRow &&
          <BuildingInfoModal
            modalOpen={selectedRow !== null}
            handleModalClose={() => setSelectedRow(null)}
            data={selectedRow}
            // setSelectedRow={(data :any) => handleClickRow(data)}
          /> 
        } */}
      </Container>
    </>
  );
};

export default AdminBuildingPage;
