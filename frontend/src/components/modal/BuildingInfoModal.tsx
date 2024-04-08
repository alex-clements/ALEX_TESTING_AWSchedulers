import { Button, Typography, styled } from '@mui/material';
import { BuildingT } from '../../types/generaltypes';
import ModalStandardForm from './ModalStandardForm';
import { useState } from 'react';
import BuildingModal from './BuildingModal';
import { useNavigate } from 'react-router-dom';
import { adminBuildingPageRoute } from '../../routing/routes';
import DisableItemAlert from '../alerts/DisableItemAlert';
import EnableItemAlert from '../alerts/EnableItemAlert';
import useBuildingEdit from '../../hooks/useBuildingEdit';

const StyledRow = styled(Typography)({
  flex: 1, 
  wordBreak: 'break-all',
  margin: '0.3rem 0'
});

interface BuildingInfoModalProps {
  modalOpen: boolean;
  //   handleModalOpen: () => void;
  handleModalClose: () => void;
  data: BuildingT;
  setBuildingState: React.Dispatch<React.SetStateAction<any>>;
}

const BuildingInfoModal = ({
  modalOpen,
  handleModalClose,
  data,
  setBuildingState,
}: BuildingInfoModalProps) => {
  const { editBuilding } = useBuildingEdit();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeActivating, setIsDeActivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const [buildingModalOpen, setBuildingModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  //   const handleDelete = async () => {
  //     console.log(data)
  //     // await deleteBuilding(data);

  //     handleModalClose();
  //     navigate(adminBuildingPageRoute);
  //   }

  const handleDisable = async () => {
    // console.log(data)
    data.isActive = false;
    handleModalClose();
    await editBuilding(data.id, data);
    // navigate(adminBuildingPageRoute);
  };

  const handleEnable = async () => {
    // console.log(data)
    data.isActive = true;
    handleModalClose();
    await editBuilding(data.id, data);
    // navigate(adminBuildingPageRoute);
  };

  const handleBuildingModalClose = () => {
    setBuildingModalOpen(false);
    setIsEditing(false);
    handleModalClose();
  };

//   console.log('building data: ', data);

  return (
    <>
      <ModalStandardForm open={modalOpen} handleClose={handleModalClose}>
        <Typography variant="h5">Building Information</Typography>
        <BuildingModal
          modalOpen={isEditing}
          handleModalOpen={() => setBuildingModalOpen(true)}
          handleModalClose={handleBuildingModalClose}
          info={data}
          edit={true}
          setBuildingState={setBuildingState}
        />
        <DisableItemAlert
          open={isDeActivating}
          handleModalClose={() => setIsDeActivating(false)}
          handleDisable={handleDisable}
          description={`Building: ${data.name} at Location: ${data.location}`}
        />
        <EnableItemAlert
          open={isActivating}
          handleModalClose={() => setIsActivating(false)}
          handleEnable={handleEnable}
          description={`Building: ${data.name} at Location: ${data.location}`}
        />
        {!isEditing && (
          <>
            <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}}>
              <StyledRow>
                <strong>Building ID:</strong> {data.id}
              </StyledRow>
              <StyledRow>
                <strong>Name:</strong> {data.name}
              </StyledRow>
              <StyledRow>
                <strong>Airport Code:</strong> {data.airportCode}
              </StyledRow>
              <StyledRow>
                <strong>Number:</strong> {data.number}
              </StyledRow>
              <StyledRow>
                <strong>Number of Floors:</strong> {data.maxFloor}
              </StyledRow>
              <StyledRow>
                <strong>Location:</strong> {data.location}
              </StyledRow>
              <StyledRow>
                <strong>Latittude:</strong> {data.latitude}
              </StyledRow>
              <StyledRow>
                <strong>Longitude:</strong> {data.longitude}
              </StyledRow>
              <StyledRow>
                <strong>Is Active:</strong> {data.isActive ? 'Yes' : 'No'}
              </StyledRow>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '1rem',
              }}
            >
              <Button
                variant="outlined"
                style={{ marginRight: '0.3rem' }}
                onClick={handleModalClose}
              >
                Close
              </Button>
              {data.isActive ? (
                <Button
                  variant="contained"
                  style={{ marginRight: '0.3rem' }}
                  onClick={() => setIsDeActivating(true)}
                >
                  De-Activate
                </Button>
              ) : (
                <Button
                  variant="contained"
                  style={{ marginRight: '0.3rem' }}
                  onClick={() => setIsActivating(true)}
                >
                  Activate
                </Button>
              )}

              <Button variant="contained" onClick={handleEdit}>
                Edit
              </Button>
            </div>
          </>
        )}
      </ModalStandardForm>
    </>
  );
};

export default BuildingInfoModal;
