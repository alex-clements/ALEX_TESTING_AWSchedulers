import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import TableRow2Input from '../tableRows/TableRow2Input';
import { Button, Typography } from '@mui/material';
import ModalStandardForm from './ModalStandardForm';
import { RoomT, addingItemID } from '../../types/generaltypes';
import InputNumber1 from '../forms/controls/Input/InputNumber1';
import InputCheckbox1 from '../forms/controls/Input/InputCheckbox1';
import InputDropdown1, { DropdownT } from '../forms/controls/Input/InputDropdown1';
import useRoomAdd from '../../hooks/useRoomAdd';
import LoadingSpinner from '../spinner/LoadingSpinner';
import InputText1 from '../forms/controls/Input/InputText1';
import useRoomEdit from '../../hooks/useRoomEdit';
import { zodResolver } from "@hookform/resolvers/zod";
import { getRoomModalSchema } from '../../types/modalSchemas';

interface RoomModalProps {
  modalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  info: RoomT;
  maxFloor: number;
  edit: boolean;
}

const RoomModal = ({
  modalOpen,
  handleModalOpen,
  handleModalClose,
  info,
  maxFloor,
  edit,
}: RoomModalProps) => {
  const { addRoom } = useRoomAdd();
  const { editRoom } = useRoomEdit();
  // const [maxFloor, setMaxFloor] = useState(100);
  const methods = useForm({ 
    defaultValues: info, 
    resolver: zodResolver(getRoomModalSchema(maxFloor)) 
  });
  const { handleSubmit, watch, setValue, getValues, clearErrors, control } = methods;
  // const { isLoadingBuildings, buildings, isErrorLoadingBuildings } = useBuildingGetAll();
  // const watchedBuildingID = useWatch({ control, name: 'Building' });
  // const [floorOptions, setFloorOptions] = useState<DropdownT[]>([{ value: info ? info.floorNumber : 0, label: `${info?.floorNumber}` }]);
  
  const onSubmit = async (data: RoomT) => {
    handleModalClose();
    data.Building = info.Building;
    if(edit) {
      await editRoom(data.id, data);
    } else {
      data.id = addingItemID;
      await addRoom(data);
    }
  };

  // const handleSelectBuilding = () => {
  //   // const selectedBuilding = buildings.find(building => JSON.stringify(building.id) === watchedBuildingID);
  //   const selectedBuilding = buildings.find(
  //     (building) => building.id === watchedBuildingID
  //   );
  //   if (selectedBuilding?.maxFloor) {
  //     setMaxFloor(selectedBuilding.maxFloor);
  //     const floorsOptions = Array.from({ length: selectedBuilding.maxFloor }, (_, i) => ({
  //       value: i + 1,
  //       label: `${i + 1}`
  //     }));

  //     setFloorOptions(floorsOptions);
  //   } 
  //   // else {
  //   //   setFloorOptions([{value: info? info.floorNumber : 0, label: `${info?.floorNumber}`}]);
  //   // }
  // };

  // useEffect(() => {
  //   methods.reset({}, {
  //     keepValues: true
  //   });
  // }, [maxFloor]);

  // useEffect(() => {
  //   handleSelectBuilding()
  // }, [watchedBuildingID, isLoadingBuildings]);

  return (
    <>
      {false ? (
        <LoadingSpinner />
      ) : (
      <ModalStandardForm open={modalOpen} handleClose={handleModalClose}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6">{edit? 'Edit Room Information' : 'Room Information'}</Typography>
            {/* <TableRow2Input label={'Room ID'}>
              <InputNumber1 name={'id'} rules={{ required: true }} />
            </TableRow2Input> */}
            <TableRow2Input label={'Room Name'}>
              <InputText1 name={'roomName'} rules={{ required: true }} />
            </TableRow2Input>
            <TableRow2Input label={'Room Number'}>
              <InputText1 name={'roomNumber'} rules={{ required: true }}/>
            </TableRow2Input>
            {/* {!edit && (
              <TableRow2Input label={'Building'}>
                <InputDropdown1 name='Building' options={
                  buildings.map((b) => {
                    let x:any = null;
                    x = {value: b.id, label: b.name};
                    return x;
                })
              }
              />
            </TableRow2Input>)} */}
            {/* <TableRow2Input label={'Floor Number'}>
              <InputDropdown1 name='floorNumber' options={floorOptions}/>
            </TableRow2Input> */}
            <TableRow2Input label={'Floor Number'}>
              <InputDropdown1 name='floorNumber' options={
                Array.from({ length: maxFloor }, (_, i) => ({
                  value: i + 1,
                  label: `${i + 1}`
                }))
              }/>
            </TableRow2Input>
            <TableRow2Input label={'Capacity'}>
              <InputNumber1 name={'capacity'} rules={{ 
                  required: true,
                  validate: (value: number) => (value > 0 || 'Capacity must be greater than zero.')
                }} />
            </TableRow2Input>
            <TableRow2Input label={'AV?'}>
              <InputCheckbox1 name={'AV'} rules={{ required: true }} />
            </TableRow2Input>
            <TableRow2Input label={'VC?'}>
              <InputCheckbox1 name={'VC'} rules={{ required: true }} />
            </TableRow2Input>
            {/* {edit && (
              <TableRow2Input label={'Active Room'}>
                <InputCheckbox1 name={'status'} rules={{ required: true }} />
              </TableRow2Input>
            )} */}
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div />
              <div />
              <div />
              <Button variant="outlined" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </ModalStandardForm>
      )}
    </>
  );
};

export default RoomModal;
