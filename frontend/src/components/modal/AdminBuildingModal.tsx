import React, { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import InputText1 from '../forms/controls/Input/InputText1';
import TableRow2Input from '../tableRows/TableRow2Input';
import { Button, Typography } from '@mui/material';
import ModalStandardForm from './ModalStandardForm';
import {
  DropdownT,
} from '../forms/controls/Input/InputDropdown1';
import InputNumber1 from '../forms/controls/Input/InputNumber1';

interface AdminModalProps {
  modalOpen: boolean;
  handleModalClose: () => void;
  row: any;
  setSelectedRow: React.Dispatch<React.SetStateAction<any>>;
}

const AdminBuildingModal = ({
  modalOpen,
  handleModalClose,
  row,
  setSelectedRow
}: AdminModalProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const methods = useForm({ defaultValues: row });
  const { handleSubmit, watch, setValue, getValues, clearErrors, control } = methods;

  const watchedBuildingID = useWatch({ control, name: 'buildingID' });
  const [floorOptions, setFloorOptions] = useState<DropdownT[]>([]);

  return (
    <ModalStandardForm open={modalOpen} handleClose={handleModalClose}>
      <Typography variant="h5">{isEditing ? 'Edit Building Information' : 'Building Information'}</Typography>
      {isEditing 
      ? <FormProvider {...methods}>
      <form > {/*TODO onSubmit={handleSubmit(onSubmit)} */}
        <TableRow2Input label={'Airport Code'}>
          <InputText1 name={'airportCode'} rules={{ required: true }} />
        </TableRow2Input>
        <TableRow2Input label={'Number'}>
          <InputNumber1 name={'number'} rules={{ required: true }} />
        </TableRow2Input>
        <TableRow2Input label={'Name'}>
          <InputText1 name={'name'} rules={{ required: true }} />
        </TableRow2Input>
        <TableRow2Input label={'Location'}>
          <InputText1 name={'location '} rules={{ required: true }} />
        </TableRow2Input>
        <TableRow2Input label={'Max Floor'}>
          <InputNumber1 name={'maxFloor'} rules={{ required: true, min: 1 }} />
        </TableRow2Input>
        <TableRow2Input label={'Latitude'}>
          <InputNumber1 name={'latitude'} rules={{ required: true }} />
        </TableRow2Input>
        <TableRow2Input label={'Longitude'}>
          <InputNumber1 name={'longitude'} rules={{ required: true }} />
        </TableRow2Input>
      </form>
    </FormProvider>
      : <div>
          <p><strong>Building ID:</strong> {row.id}</p>
          <p><strong>Airport Code:</strong> {row.airportCode}</p>
          <p><strong>Number:</strong> {row.number}</p>
          <p><strong>Name:</strong> {row.name}</p>
          <p><strong>Location:</strong> {row.location}</p>
          <p><strong>Latittude:</strong> {row.lat}</p>
          <p><strong>Longitude:</strong> {row.lon}</p>
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

export default AdminBuildingModal;
