import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import InputText1 from '../forms/controls/Input/InputText1';
import TableRow2Input from '../tableRows/TableRow2Input';
import { Button, Typography } from '@mui/material';
import ModalStandardForm from './ModalStandardForm';
import { UserT } from '../../types/generaltypes';
import InputDropdown1, {
  DropdownT,
} from '../forms/controls/Input/InputDropdown1';
import InputCheckbox1 from '../forms/controls/Input/InputCheckbox1';
import InputEmail from '../forms/controls/Input/InputEmail';
import useUserAdd from '../../hooks/useUserAdd';
import { useBuildingGetAllActive } from '../../hooks/useBuildingGetAllActive';
import LoadingSpinner from '../spinner/LoadingSpinner';
import useUserEdit from '../../hooks/useUserEdit';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getAddUserModalSchema,
  getEditUserModalSchema,
} from '../../types/modalSchemas';
import { HelpOutline } from '@mui/icons-material';
import BasicModal from './BasicIconModal';

interface UserModalProps {
  modalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  info?: UserT;
  userPool?: UserT[];
  edit: boolean;
}

const temporaryPasswordHelpText = ` The following requirements must be met:
  - 8 characters or longer
  - At least one special character
  - At least one lower case character
  - At least one upper case character
  - At least one number \n
Temporary passwords are only valid for one week. \n
If no temporary password is provided a random password will be generated, and sent to the user's email. \n
Otherwise please provide the temporary password to the user. \n
`;

const UserModal = ({
  modalOpen,
  handleModalClose,
  info,
  userPool,
  edit,
}: UserModalProps) => {
  const { addUser } = useUserAdd();
  const { editUser } = useUserEdit();
  const [maxFloor, setMaxFloor] = useState(100);
  const methods = useForm({
    defaultValues: info,
    resolver: userPool
      ? zodResolver(getAddUserModalSchema(maxFloor, userPool))
      : zodResolver(getEditUserModalSchema(maxFloor)),
  });
  const { handleSubmit, control } = methods;
  const { isLoading, buildings, error } = useBuildingGetAllActive();
  const watchedBuildingID = useWatch({ control, name: 'Building' });
  const [floorOptions, setFloorOptions] = useState<DropdownT[]>([
    { value: info ? info.floorNumber : 0, label: `${info?.floorNumber}` },
  ]);

  const onSubmit = async (data: UserT) => {
    handleModalClose();
    if (edit) {
      await editUser(data.id, data);
    } else {
      if (!data.temporaryPassword || data.temporaryPassword.trim().length === 0) {
        delete data.temporaryPassword;
      }
      await addUser(data);
    }
  };

  const handleSelectBuilding = () => {
    const selectedBuilding = buildings.find(
      (building) => building.id === watchedBuildingID
    );
    if (selectedBuilding?.maxFloor) {
      setMaxFloor(selectedBuilding.maxFloor);
      const floorsOptions = Array.from(
        { length: selectedBuilding.maxFloor },
        (_, i) => ({
          value: i + 1,
          label: `${i + 1}`,
        })
      );

      setFloorOptions(floorsOptions);
    }
    // else {
    //   setFloorOptions([
    //     { value: info ? info.floorNumber : 0, label: `${info?.floorNumber}` },
    //   ]);
    // }
  };

  useEffect(() => {
    methods.reset(
      {},
      {
        keepValues: true,
      }
    );
  }, [maxFloor]);

  useEffect(() => {
    handleSelectBuilding();
  }, [watchedBuildingID, isLoading]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ModalStandardForm open={modalOpen} handleClose={handleModalClose}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h6">
                {edit ? 'Edit Employee Information' : 'Employee Information'}
              </Typography>
              {!edit && userPool && (
                <TableRow2Input label={'Username'}>
                  <InputText1
                    name={'username'}
                    rules={{
                      required: true,
                      validate: {
                        isUnique: (value: string) =>
                          !userPool.some((user) => user.username === value) ||
                          'Username is taken. Please choose another.',
                      },
                    }}
                  />
                </TableRow2Input>
              )}
              <TableRow2Input label={'Name'}>
                <InputText1 name={'name'} rules={{ required: true }} />
              </TableRow2Input>
              <TableRow2Input label={'Email'}>
                {(edit && (
                  <InputEmail
                    name={'email'}
                    rules={{ required: true }}
                    disabled={true}
                  />
                )) || <InputEmail name={'email'} rules={{ required: true }} />}
              </TableRow2Input>
              <TableRow2Input label={'Building'}>
                <InputDropdown1
                  name="Building"
                  options={buildings.map((b) => {
                    let x: any = null;
                    x = { value: b.id, label: b.name };
                    return x;
                  })}
                />
              </TableRow2Input>
              <TableRow2Input label={'Floor'}>
                <InputDropdown1 name="floorNumber" options={floorOptions} />
              </TableRow2Input>
              {info?.isAdmin ? 
                (<TableRow2Input label={'Admin Privileges'}>
                  <InputCheckbox1 name={'isAdmin'} rules={{ required: true }} disabled={true} />
                </TableRow2Input>) : (
                <TableRow2Input label={'Admin Privileges'}>
                  <InputCheckbox1 name={'isAdmin'} rules={{ required: true }} />
                </TableRow2Input>
              )}
              {!edit && (
                <TableRow2Input
                  label={'Temporary Password'}
                  info={
                    <BasicModal
                      text={temporaryPasswordHelpText}
                      title="Temporary Password Information"
                    >
                      <HelpOutline sx={{ width: 20 }} />
                    </BasicModal>
                  }
                >
                  <InputText1 name={'temporaryPassword'} />
                </TableRow2Input>
              )}

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

export default UserModal;
