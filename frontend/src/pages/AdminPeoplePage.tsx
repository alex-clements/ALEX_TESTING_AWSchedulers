import React, { useState } from 'react';
import {
  Button,
  Container,
  Box,
  Typography,
  Switch,
  Stack,
} from '@mui/material';
import AdminHeader from '../components/headers/AdminHeader';
import UserModal from '../components/modal/UserModal';
import BaseTable from '../components/BaseTable';
import { GridColDef } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../styles/theme';
import { useUserGetAll } from '../hooks/useUserGetAll';
import LoadingSpinner from '../components/spinner/LoadingSpinner';
import UserInfoModal from '../components/modal/UserInfoModal';
import { UserBulkUploadModal } from '../components/modal/UserBulkUploadModal';
import { blankUser } from '../mocks/user';
import { useBuildingGetAll } from '../hooks/useBuildingGetAll';

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
  { field: 'username', headerName: 'Username', flex: 3 },
  { field: 'email', headerName: 'Email', flex: 4 },
  { field: 'buildingName', headerName: 'Building', flex: 2 },
  // { field: 'Building', headerName: 'building ID', flex: 4 },
  { field: 'floorNumber', headerName: 'Floor', flex: 1 },
  {
    field: 'isAdmin',
    headerName: 'Is Admin?',
    flex: 2,
    renderCell: (params: any) => createIcon(params.row.isAdmin),
  },
  {
    field: 'isActive',
    headerName: 'Is Active?',
    flex: 2,
    renderCell: (params: any) => createIcon(params.row.isActive),
  },
];

const AdminPeoplePage = () => {
  const { isLoadingUsers, users } = useUserGetAll();
  const { isLoading, buildings, error } = useBuildingGetAll();

  const [isAddingRow, setIsAddingRow] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [isAddingBulkUsers, setIsAddingBulkUsers] = useState<boolean>(false);

  const handleUserDisplaySwitch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowAllUsers(event.target.checked);
  };

  const usersTableData = users.map((user) => {
    const buildingName = buildings.filter(
      (building) => building.id === user.Building
    )[0]?.name;
    const {
      id,
      email,
      floorNumber,
      Building,
      isActive,
      isAdmin,
      username,
      name,
    } = user;
    return {
      buildingName: buildingName,
      id,
      email,
      floorNumber,
      Building,
      isActive,
      isAdmin,
      username,
      name,
    };
  });

  return (
    <>
      <AdminHeader />
      <br />
      <br />
      <Container>
        <Typography variant="h4">People</Typography>

        <Box mb={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Stack direction="row" spacing={1}>
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
              Add User
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsAddingBulkUsers(true)}
              sx={{
                background: `${theme.palette.secondary.main}`,
                color: 'black',
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}`,
                  color: 'white',
                },
              }}
            >
              Bulk Add Users
            </Button>
          </Stack>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>Show Active Users</Typography>
          <Switch
            checked={showAllUsers}
            onChange={handleUserDisplaySwitch}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <Typography>Show All Users</Typography>
        </Stack>

        {isLoadingUsers ? (
          <LoadingSpinner />
        ) : showAllUsers ? (
          <BaseTable
            columns={columns}
            data={usersTableData}
            setSelectedRow={setSelectedRow}
          />
        ) : (
          <BaseTable
            columns={columns}
            data={usersTableData.filter((user) => user.isActive)}
            setSelectedRow={setSelectedRow}
          />
        )}

        {isAddingRow && (
          <UserModal
            modalOpen={isAddingRow}
            handleModalOpen={() => setIsAddingRow(true)}
            handleModalClose={() => setIsAddingRow(false)}
            info={blankUser}
            userPool={users}
            edit={false}
          />
        )}

        {selectedRow && (
          <UserInfoModal
            modalOpen={selectedRow != null}
            handleModalClose={() => setSelectedRow(null)}
            data={selectedRow}
          />
        )}

        <UserBulkUploadModal
          modalOpen={isAddingBulkUsers}
          handleModalClose={() => setIsAddingBulkUsers(false)}
        />
      </Container>
    </>
  );
};

export default AdminPeoplePage;
