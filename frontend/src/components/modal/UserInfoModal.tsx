import { Button, Typography, styled } from "@mui/material";
import ModalStandardForm from "./ModalStandardForm";
import { useState } from "react";
import UserModal from "./UserModal";
import DisableItemAlert from "../alerts/DisableItemAlert";
import useUserEdit from "../../hooks/useUserEdit";
import EnableItemAlert from "../alerts/EnableItemAlert";

const StyledRow = styled(Typography)({
  flex: 1, 
  wordBreak: 'break-all',
  margin: '0.3rem 0'
});

interface UserInfoModalProps {
  modalOpen: boolean;
//   handleModalOpen: () => void;
  handleModalClose: () => void;
  data: any;
//   setSelectedRow: React.Dispatch<React.SetStateAction<any>>
}

const UserInfoModal = ({
  modalOpen,
//   handleModalOpen,
  handleModalClose,
  data,
//   setSelectedRow,
}: UserInfoModalProps) => {
  const { editUser } = useUserEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeActivatingPopup, setIsDeActivatingPopup] = useState(false);
  const [isActivatingPopup, setIsActivatingPopup] = useState(false);
  const [isDisablingAdminPopup, setIsDisablingAdminPopup] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);


  const handleEdit = () => {
    setIsEditing(true);
  }

  const handleDisable = async () => {
    data.isActive = false;
    handleModalClose();
    await editUser(data.id, data);
  }

  const handleEnable = async () => {
    data.isActive = true;
    handleModalClose();
    await editUser(data.id, data);
  }

  const handleDisableAdmin = async () => {
    data.isAdmin = false;
    handleModalClose();
    await editUser(data.id, data);
  }

  const handleUserModalClose = () => {
    setUserModalOpen(false);
    setIsEditing(false);
    handleModalClose();
  }

  return (
    <>
      <ModalStandardForm open={modalOpen} handleClose={handleModalClose}>
        <Typography variant="h5">User Information</Typography>
        <UserModal
          modalOpen={isEditing}
          handleModalOpen={() => setUserModalOpen(true)}
          handleModalClose={handleUserModalClose}
          info={data}
          edit={true}
        />
        <DisableItemAlert 
          open={isDisablingAdminPopup} 
          handleModalClose={() => setIsDisablingAdminPopup(false)}
          handleDisable={handleDisableAdmin}
          description={`Admin privileges for user: ${data.name}, username: ${data.username}`}
        />
        <DisableItemAlert 
          open={isDeActivatingPopup} 
          handleModalClose={() => setIsDeActivatingPopup(false)}
          handleDisable={handleDisable}
          description={`User: ${data.name}. Username: ${data.username}`}
        />
        <EnableItemAlert
          open={isActivatingPopup} 
          handleModalClose={() => setIsActivatingPopup(false)}
          handleEnable={handleEnable}
          description={`User: ${data.name}. Username: ${data.username}`}
        />
        {!isEditing &&
            <>
                <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}}>
                    <StyledRow><strong>Name:</strong> {data.name}</StyledRow>
                    <StyledRow><strong>Username:</strong> {data.username}</StyledRow>
                    <StyledRow><strong>Email:</strong> {data.email}</StyledRow>
                    <StyledRow><strong>Building:</strong> {data.buildingName}</StyledRow>
                    <StyledRow><strong>Floor:</strong> {data.floorNumber}</StyledRow>
                    <div style={{display: 'flex'}}>
                      <StyledRow><strong>Admin Privileges:</strong> {data.isAdmin ? 'Yes' : 'No'}</StyledRow> 
                      {data.isAdmin && (
                      <Button variant="outlined" style={{ marginRight: '0.3rem' }} onClick={() => setIsDisablingAdminPopup(true)}>Disable Admin</Button>)}
                    </div>
                    {/* <StyledRow><strong>Admin Privileges:</strong> {data.isAdmin ? 'Yes' : 'No'}</StyledRow>  */}
                    <StyledRow><strong>Account Active:</strong> {data.isActive ? 'Yes' : 'No'}</StyledRow>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
                    <Button variant="outlined" style={{ marginRight: '0.3rem' }} onClick={handleModalClose}>Close</Button>
                    {data.isActive 
                        ? (<Button variant="contained" style={{ marginRight: '0.3rem' }} onClick={() => setIsDeActivatingPopup(true)}>De-Activate</Button>)
                        : (<Button variant="contained" style={{ marginRight: '0.3rem' }} onClick={() => setIsActivatingPopup(true)}>Activate</Button>)
                    }
                    {/* {data.isAdmin && (
                      <Button variant="contained" style={{ marginRight: '0.3rem' }} onClick={() => setIsDisablingAdmin(true)}>Disable Admin</Button>
                    )} */}
                    <Button variant="contained"  onClick={handleEdit}>Edit</Button>
                </div>
            </>
        }
      </ModalStandardForm>
    </>
  );
};

export default UserInfoModal;
