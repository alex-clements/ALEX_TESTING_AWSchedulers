import { FormProvider, useForm } from 'react-hook-form';
import { Button, Typography } from '@mui/material';
import ModalStandardForm from './ModalStandardForm';
import { MeetingT } from '../../types/generaltypes';
import InputCheckbox1 from '../forms/controls/Input/InputCheckbox1';
import { users } from '../../mocks/users';
import InputAutocompleteUsers from '../forms/controls/Input/InputAutocompleteUsers';

interface CreateMeetingModalProps {
  modalOpen: boolean;
  handleModalOpen?: () => void;
  handleModalClose?: () => void;
  info: MeetingT;
  edit: boolean;
}

const CreateMeetingModal = ({
  modalOpen,
  handleModalOpen,
  handleModalClose,
  info,
  edit,
}: CreateMeetingModalProps) => {
  const methods = useForm({ defaultValues: info });
  const { handleSubmit, watch, setValue, getValues, clearErrors, control } =
    methods;

  const onSubmit = (data: any) => {
    console.log(getValues());
    console.log(data);
  };

  return (
    <>
      <ModalStandardForm
        open={modalOpen}
        handleClose={handleModalClose as () => void}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h5">
              {edit ? 'Edit Meeting' : 'Book a Meeting'}
            </Typography>
            <InputAutocompleteUsers
              name="participantIDs"
              //@ts-ignore
              options={users}
              labelField={'firstName'}
              valueField={'id'}
            />
            <Typography variant="h6" sx={{ textDecoration: 'underline' }}>
              Meeting Options
            </Typography>
            {/* <FormGroup> */}
            <InputCheckbox1
              label="Multi-room Conference"
              name="multiRoom"
              rules={{ required: true }}
            />
            <InputCheckbox1
              label="Audio Conference"
              name="audio"
              rules={{ required: true }}
            />
            <InputCheckbox1
              label="Video Conference"
              name="video"
              rules={{ required: true }}
            />
            {/* </FormGroup> */}
            {/* <br /> */}
            {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}> */}
            {/* <Button variant="outlined" onClick={handleModalClose}>
                Cancel
              </Button> */}
            <Button variant="contained" type="submit">
              Find Availability
            </Button>
            {/* </div> */}
          </form>
        </FormProvider>
      </ModalStandardForm>
    </>
  );
};

export default CreateMeetingModal;
