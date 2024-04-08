import { Button, Typography, styled } from "@mui/material";
import { RoomT } from "../../types/generaltypes";
import ModalStandardForm from "./ModalStandardForm";
import { useState } from "react";
import RoomModal from "./RoomModal";
import DisableItemAlert from "../alerts/DisableItemAlert";
import EnableItemAlert from "../alerts/EnableItemAlert";
import useRoomEdit from "../../hooks/useRoomEdit";

const StyledRow = styled(Typography)({
  flex: 1, 
  wordBreak: 'break-all',
  margin: '0.3rem 0'
});

interface RoomInfoModalProps {
  modalOpen: boolean;
//   handleModalOpen: () => void;
  handleModalClose: () => void;
  data: RoomT;
  maxFloor: number;
  isActiveBuilding: boolean;
//   setSelectedRow: React.Dispatch<React.SetStateAction<any>>
}

const RoomInfoModal = ({
  modalOpen,
//   handleModalOpen,
  handleModalClose,
  data,
  maxFloor,
  isActiveBuilding
//   setSelectedRow,
}: RoomInfoModalProps) => {
//   const { deleteRoom } = useRoomDelete();
  const {editRoom} = useRoomEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeActivating, setIsDeActivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);


  const handleEdit = () => {
    setIsEditing(true);
  }

//   const handleDelete = async () => {
//     // await deleteRoom(data);
//     handleModalClose();
//   }

  const handleDisable = async () => {
    data.isActive = false;
    // console.log(data)
    await editRoom(data.id, data);
    handleModalClose();
  }
  const handleEnable = async () => {
    data.isActive = true;
    // console.log(data)
    await editRoom(data.id, data);
    handleModalClose();
  }

  const handleRoomModalClose = () => {
    setRoomModalOpen(false);
    setIsEditing(false);
    handleModalClose();
  }

  return (
    <>
      <ModalStandardForm open={modalOpen} handleClose={handleModalClose}>
        <Typography variant="h5">Room Information</Typography>
            <RoomModal
                modalOpen={isEditing}
                handleModalOpen={() => setRoomModalOpen(true)}
                handleModalClose={handleRoomModalClose}
                info={data}
                maxFloor={maxFloor}
                edit={true}
            />
            <DisableItemAlert 
                open={isDeActivating} 
                handleModalClose={() => setIsDeActivating(false)}
                handleDisable={handleDisable}
                description={`Room Number: ${data.roomNumber}`}
            />
            <EnableItemAlert
                open={isActivating} 
                handleModalClose={() => setIsActivating(false)}
                handleEnable={handleEnable}
                description={`Room Number: ${data.roomNumber}`}
            />
            {!isEditing &&
                <>
                    <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}}>
                        <StyledRow><strong>ID:</strong> {data.id}</StyledRow>
                        <StyledRow><strong>Room Number:</strong> {data.roomNumber}</StyledRow>
                        <StyledRow><strong>Room Name:</strong> {data.roomName}</StyledRow>
                        <StyledRow><strong>Floor Number:</strong> {data.floorNumber}</StyledRow>
                        <StyledRow><strong>Capacity:</strong> {data.capacity}</StyledRow>
                        <StyledRow><strong>AV:</strong> {data.AV ? 'Yes' : 'No'}</StyledRow>
                        <StyledRow><strong>VC:</strong> {data.VC ? 'Yes' : 'No'}</StyledRow>
                        <StyledRow><strong>Is Active:</strong> {data.isActive ? 'Yes' : 'No'}</StyledRow>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
                        <Button variant="outlined" style={{ marginRight: '0.3rem' }} onClick={handleModalClose}>Close</Button>
                        {isActiveBuilding ? (data.isActive
                        ? (<Button variant="contained" style={{ marginRight: '0.3rem' }} onClick={() => setIsDeActivating(true)}>De-Activate</Button>)
                        : (<Button variant="contained" style={{ marginRight: '0.3rem' }} onClick={() => setIsActivating(true)}>Activate</Button>)
                        ) : (<div></div>)
                        }
                        <Button variant="contained"  onClick={handleEdit}>Edit</Button>
                    </div>
                </>
            }
      </ModalStandardForm>
    </>
  );
};

export default RoomInfoModal;
