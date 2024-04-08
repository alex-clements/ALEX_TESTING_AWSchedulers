import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import TableRow2Input from '../tableRows/TableRow2Input';
import { Button, Typography } from '@mui/material';
import ModalStandardForm from './ModalStandardForm';
import InputDropdown1, {
  DropdownT,
} from '../forms/controls/Input/InputDropdown1';
import { buildings } from '../../mocks/buildings';
import InputCheckbox1 from '../forms/controls/Input/InputCheckbox1';
import useUserAdd from '../../hooks/useUserAdd';
import InputNumber1 from '../forms/controls/Input/InputNumber1';

interface AdminModalProps {
  modalOpen: boolean;
  handleModalClose: () => void;
  row: any;
  setSelectedRow: React.Dispatch<React.SetStateAction<any>>;
}

const AdminRoomModal = ({
  modalOpen,
  handleModalClose,
  row,
  setSelectedRow
}: AdminModalProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { addUser } = useUserAdd();
  const methods = useForm({ defaultValues: row });
  const { handleSubmit, watch, setValue, getValues, clearErrors, control } = methods;

  const watchedBuildingID = useWatch({ control, name: 'buildingID' });
  const [floorOptions, setFloorOptions] = useState<DropdownT[]>([]);

  return (
    <ModalStandardForm open={modalOpen} handleClose={handleModalClose}>
      <Typography variant="h5">{isEditing ? 'Edit Room Information' : 'Room Information'}</Typography>
      {isEditing 
      ? <FormProvider {...methods}>
      <form > {/*TODO onSubmit={handleSubmit(onSubmit)} */}
        <TableRow2Input label={'Room Number'}>
          <InputNumber1 name={'roomNumber'} rules={{ required: true }} />
        </TableRow2Input>
        <TableRow2Input label={'Floor'}>
          <InputDropdown1 name='floorNumber' options={floorOptions}/>
        </TableRow2Input>
        <TableRow2Input label={'Capacity'}>
          <InputNumber1 name={'capacity'} rules={{ required: true }} />
        </TableRow2Input>
        <TableRow2Input label={'AV?'}>
          <InputCheckbox1 name={'AV'} rules={{ required: true }} />
        </TableRow2Input>
        <TableRow2Input label={'VC?'}>
          <InputCheckbox1 name={'VC'} rules={{ required: true }} />
        </TableRow2Input>
        <br />
      </form>
    </FormProvider>
      : <div>
          <p><strong>ID:</strong> {row.id}</p>
          <p><strong>Room Number:</strong> {row.roomNumber}</p>
          <p><strong>Floor:</strong> {row.floorNumber}</p>
          <p><strong>Capacity:</strong> {row.capacity}</p>
          <p><strong>AV:</strong> {row.AV ? 'Yes' : 'No'}</p>
          <p><strong>VC:</strong> {row.VC ? 'Yes' : 'No'}</p>
        </div>
      }
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
          <Button variant="outlined" style={{ marginRight: '1rem' }} onClick={() => {
            isEditing ? setIsEditing(false) : setSelectedRow(false)
          }}>
          {isEditing ? 'Cancel' : "Close"}
          </Button>
          {isEditing 
          ? <Button variant="contained" type="submit" onClick={() => setIsEditing(false)}>Submit</Button>
          : <Button variant="contained"  onClick={() => setIsEditing(true)}>Edit</Button>
        }
      </div>
    </ModalStandardForm>
  );
};

export default AdminRoomModal;
