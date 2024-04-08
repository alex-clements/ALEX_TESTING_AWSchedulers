import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import InputText1 from '../forms/controls/Input/InputText1';
import TableRow2Input from '../tableRows/TableRow2Input';
import { Button, Typography } from '@mui/material';
import ModalStandardForm from './ModalStandardForm';
import { BuildingT } from '../../types/generaltypes';
import InputNumber1 from '../forms/controls/Input/InputNumber1';
import useBuildingAdd from '../../hooks/useBuildingAdd';
import useBuildingEdit from '../../hooks/useBuildingEdit';
import { zodResolver } from "@hookform/resolvers/zod";
import { buildingModalSchema } from '../../types/modalSchemas';
import InputFloat1 from '../forms/controls/Input/InputFloat1';
import InputFloat3 from '../forms/controls/Input/InputFloat3';
import { googleMapsRoute } from '../../routing/routes';

interface BuildingModalProps {
  modalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  info: BuildingT;
  edit: boolean;
  setBuildingState: React.Dispatch<React.SetStateAction<any>>;
}

const BuildingModal = ({
  modalOpen,
  handleModalOpen,
  handleModalClose,
  info,
  edit,
  setBuildingState
}: BuildingModalProps) => {
  const {addBuilding} = useBuildingAdd();
  const {editBuilding} = useBuildingEdit();
  const methods = useForm({ 
    // defaultValues: (() => {
    //   if(edit) {
    //     return info;
    //   } else {
    //     return {
    //       id: info.id,
    //       number: info.number,
    //       name: info.name,
    //       airportCode: info.airportCode,
    //       location: info.location,
    //       latitude: '',
    //       longitude: '', 
    //       maxFloor: info.maxFloor
    //     };
    //   }
    // }),
    defaultValues: info, 
    resolver: zodResolver(buildingModalSchema)
  });
  const { handleSubmit, watch, setValue, getValues, clearErrors } = methods;
  // const { deleteBuilding } = useBuildingDelete();
  // const [isDeleting, setIsDeleting] = useState(false);

  const onSubmit = async (data: BuildingT) => {
    handleModalClose();
    data.airportCode = data.airportCode.toUpperCase();
    if (edit) {
      const response = await editBuilding(data.id, data);
      if (!response.error) { // don't update the state if there's an error
        setBuildingState((prevState: BuildingT) => ({
          ...prevState,
          location: data.location,
          longitude: data.longitude,
          latitude: data.latitude,
          maxFloor: data.maxFloor,
          number: data.number,
          airportCode: data.airportCode,
          name: `${data.airportCode} ${data.number}`
        }));
      }
    } else {
      await addBuilding(data);
    }
  };

  // https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react
  const openGoogleMaps = () => {
    const newWindow = window.open(googleMapsRoute, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  }

// proof of concept for deleting:
  // const handleDelete = async () => {
  //   await deleteBuilding(info);
  //   handleModalClose();
  // }

  return (
    <>
      <ModalStandardForm open={modalOpen} handleClose={handleModalClose}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6">
              {edit ? 'Edit Building Information' : 'Building Information'}
            </Typography>
            {/* <TableRow2Input label={'Building ID'}>
              <InputNumber1 name={'id'} rules={{ required: true }} />
            </TableRow2Input> */}
            <TableRow2Input label={'Airport Code'}>
              <InputText1 
                name={'airportCode'} 
                rules={{ required: true }}
                placeholder='E.g., ABC or XYZ.'
                help='Standard airport code is three alphabetic characters. '
             />
            </TableRow2Input>
            <TableRow2Input label={'Number'}>
              <InputNumber1 name={'number'} rules={{ required: true }} />
            </TableRow2Input>
            <TableRow2Input label={'Address'}>
              <InputText1 
                name={'location'} 
                rules={{ required: true }} 
                placeholder='Enter street address details.'
                help='For example: 1455 Quebec St, Vancouver, BC V6A 3Z7, Canada.'
              />
            </TableRow2Input>
            <TableRow2Input label={'Max Floor'}>
              {/* <InputNumber1 name={'maxFloor'} rules={{
                  required: true,
                  validate: (value: number) => (value > 0 || 'Max Floor must be greater than zero.')
                 }} /> */}
               <InputNumber1 name={'maxFloor'} rules={{ required: true }} />
            </TableRow2Input>
            <TableRow2Input label={'Latitude'}>
              <InputFloat3 name={'latitude'} rules={{ required: true }} 
              help="Input a number between -90 and 90. Click the icon to open Google Maps and assist in locating your building's coordinates."
              helpOnClick={openGoogleMaps}
              />
            </TableRow2Input>
            <TableRow2Input label={'Longitude'}>
              <InputFloat3 name={'longitude'} rules={{ required: true }} 
              help="Input a number between -180 and 180. Click the icon to open Google Maps and assist in locating your building's coordinates."
              helpOnClick={openGoogleMaps}
              />
            </TableRow2Input>
            <br />

              {/* proof of concept for deleting */}
            {/* <DeleteItemAlert 
              open={isDeleting} 
              handleModalClose={() => setIsDeleting(false)}
              handleDelete={handleDelete}
              description={`Building: ${info.name}`}
            /> */}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div />
              <div />
              <div />
              <Button variant="outlined" onClick={handleModalClose}>
                Cancel
              </Button>
              {/* {edit && (
                <Button variant="contained" onClick={() => setIsDeleting(true)}>
                  Delete
                </Button>
              )} */}
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </ModalStandardForm>
    </>
  );
};

export default BuildingModal;
