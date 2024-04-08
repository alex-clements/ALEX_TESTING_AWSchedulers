import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, CircularProgress, Typography } from '@mui/material';
import { MeetingT, UserSimplifiedT } from '../../types/generaltypes';
import InputCheckbox1 from './controls/Input/InputCheckbox1';
import { users, usersSimplified } from '../../mocks/users';
import InputAutocompleteUsers from './controls/Input/InputAutocompleteUsers';
import {
  CreateMeetingStage,
  CreateMeetingState,
  useCreateMeeting,
  useCreateMeetingUpdate,
} from '../../features/CreateMeeting/context/useCreateMeetingContext';
import { useScheduleGetAllUsers } from '../../hooks/useScheduleGetAllUsers';
import useScheduleGetAvailability from '../../hooks/useScheduleGetAvailability';
import { requestBookingOptions } from '../../features/CreateMeeting/mocks/bookingOptions';
import { GetScheduleAvailabilityRequestT } from '../../features/CreateMeeting/types/bookingOptions';
import { useScheduleGetAllBookingOptionsWarmup } from '../../hooks/useScheduleGetAllBookingOptionsWarmup';
import LoadingButton from '@mui/lab/LoadingButton';
import RedText from '../text/RedText';
import { FlexColumn } from '../flexComponents';
import dayjs from 'dayjs';
interface FindAvailabilityFormProps {
  info: MeetingT;
  edit: boolean;
}

const FindAvailabilityForm = ({ info, edit }: FindAvailabilityFormProps) => {
  const { stage, calendarSettings } = useCreateMeeting();
  const { setCreateMeetingInfo } = useCreateMeetingUpdate();
  const methods = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleSubmit } = methods;
  const { isLoadingScheduleUsers, scheduleUsers } = useScheduleGetAllUsers();
  const { getScheduleAvailability } = useScheduleGetAvailability();
  const { getBookingOptionsWarmup } = useScheduleGetAllBookingOptionsWarmup();
  function findUsersById(
    scheduleUsers: UserSimplifiedT[] | undefined,
    ids: Array<string>
  ) {
    if (scheduleUsers === undefined) return;
    return scheduleUsers.filter((user) => ids.includes(user.id));
  }

  const handleFnSetCreateMeetingState = (
    availableTimes: any,
    partipipantIds: Array<string>,
    audio: boolean,
    video: boolean,
    singleRoom?: boolean
  ) => {
    scheduleUsers;

    const usersSelected = findUsersById(scheduleUsers, partipipantIds);
    if (usersSelected === undefined) return;

    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      return {
        ...createMeetingInfo,
        // REAL DATA REQUIRED HERE
        // put unavailable time here
        meetingOptions: {
          audio: audio || false,
          video: video || false,
          singleRoom: singleRoom || false,
        },
        participants: usersSelected,
        availableTimes: availableTimes,
        stage: CreateMeetingStage.ChooseBookingTime,
        isAvailabilityRequested: true,
      };
    });
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const { audio, video, participantIDs, singleRoom } = data;
    const startDay = calendarSettings.calendarWeekDays['MON'];
    const requestJson: GetScheduleAvailabilityRequestT = {
      users: data.participantIDs,
      startDay,
      currentDay: dayjs().format('YYYY-MM-DD'),
    };
    const availableTimes = await getScheduleAvailability(requestJson);
    await handleFnSetCreateMeetingState(
      availableTimes,
      participantIDs,
      audio,
      video,
      singleRoom
    );
    setIsLoading(false);
    // To Warmup Lambda -> this route will fail
    getBookingOptionsWarmup().then(() => {});
  };

  const handleResetMeetingOptions = () => {
    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      return {
        ...createMeetingInfo,
        stage: CreateMeetingStage.FindAvailability,
        availableTimes: {},
        isAvailabilityRequested: false,
      };
    });
  };

  getScheduleAvailability;
  const meetingFormActive = stage === CreateMeetingStage.FindAvailability;
  const canResetMeetingOptions = stage === CreateMeetingStage.ChooseBookingTime;
  if (isLoadingScheduleUsers) {
    return (
      <FlexColumn>
        <br />
        <br />
        <CircularProgress />
      </FlexColumn>
    );
  }
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <br />
          <InputAutocompleteUsers
            name="participantIDs"
            // @ts-ignore
            options={isLoadingScheduleUsers ? [] : scheduleUsers}
            labelField={'name'}
            valueField={'id'}
            disabled={!meetingFormActive}
          />
          <RedText style={{ fontSize: '11px' }}>
            * You will automatically be added as a participant
          </RedText>
          <br />
          <br />
          <Typography
            variant="h6"
            color={!meetingFormActive ? 'grey' : 'default'}
            sx={{ textDecoration: 'underline' }}
          >
            Meeting Options
          </Typography>
          <br />
          <InputCheckbox1
            color="secondary"
            label="Audio Conference"
            name="audio"
            disabled={!meetingFormActive}
            rules={{ required: true }}
          />
          <InputCheckbox1
            color="secondary"
            label="Video Conference"
            name="video"
            disabled={!meetingFormActive}
            rules={{ required: true }}
          />
          <InputCheckbox1
            color="secondary"
            label="Single Room Required"
            name="singleRoom"
            disabled={!meetingFormActive}
            rules={{ required: true }}
          />
          <br />
          <br />
          <LoadingButton
            loading={isLoading}
            fullWidth
            disabled={!meetingFormActive}
            variant="contained"
            color="secondary"
            type="submit"
          >
            Find Availability
          </LoadingButton>
        </form>
      </FormProvider>
      {canResetMeetingOptions && (
        <Button
          variant="outlined"
          onClick={handleResetMeetingOptions}
          color="error"
        >
          Reset Meeting Options
        </Button>
      )}
    </>
  );
};

export default FindAvailabilityForm;
