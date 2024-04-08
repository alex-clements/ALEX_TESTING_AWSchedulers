import React, {
  useContext,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  FC,
} from 'react';
import { UserSimplifiedT } from '../../../types/generaltypes';
import { RecommendationT } from '../types/bookingOptions';
import { getMonToFriDateFormatted } from '../../../utils/dateHelpers';
import dayjs from 'dayjs';

export enum CreateMeetingStage {
  FindAvailability = 'FindAvailability',
  ChooseBookingTime = 'ChooseBookingTime',
  ChooseMeetingOption = 'ChooseMeetingOption',
  EditMeeting = 'EditMeeting',
  FinalizeBooking = 'FinalizeBooking',
}

// CreateMeeting Types And Empty State -------------------------------------
export interface CreateMeetingState {
  stage: CreateMeetingStage;
  participants: UserSimplifiedT[];
  availableTimes: any;
  meetingOptions: { audio: boolean; video: boolean; singleRoom: boolean };
  timeslot: { timeStart: string; timeEnd: string };
  bookingInformation: RecommendationT | null;
  bookingOptions: RecommendationT[] | null;
  calendarSettings: {
    calendarSelectedDay: string;
    calendarWeekDays: CalendarWeekDaysInterface;
  };
  isAvailabilityRequested: boolean;
  rescheduledBooking: {
    bookingId: string | null;
    bookingName: string;
  };
}

export interface CalendarWeekDaysInterface {
  MON: string;
  TUE: string;
  WED: string;
  THU: string;
  FRI: string;
}

export const createMeetingStateEmpty: CreateMeetingState = {
  stage: CreateMeetingStage.FindAvailability,
  availableTimes: {},
  participants: [],
  meetingOptions: { audio: false, video: false, singleRoom: false },
  timeslot: { timeStart: '', timeEnd: '' },
  bookingOptions: null,
  bookingInformation: null,
  calendarSettings: {
    calendarSelectedDay: dayjs().format('YYYY-MM-DD'),
    calendarWeekDays: getMonToFriDateFormatted(dayjs().format('YYYY-MM-DD')),
  },
  isAvailabilityRequested: false,
  rescheduledBooking: {
    bookingId: null,
    bookingName: '',
  },
};

// CreateMeeting Create Contexts -------------------------------------------
const CreateMeetingContext = createContext<CreateMeetingState>(
  createMeetingStateEmpty
);

const CreateMeetingUpdateContext = createContext<{
  setCreateMeetingInfo: Dispatch<SetStateAction<CreateMeetingState>>;
}>({ setCreateMeetingInfo: () => null });

// CreateMeeting Hooks ------------------------------------------------------
export const useCreateMeeting = () => {
  return useContext(CreateMeetingContext);
};

export const useCreateMeetingUpdate = () => {
  return useContext(CreateMeetingUpdateContext);
};

// CreateMeeting Provider ---------------------------------------------------
interface CreateMeetingProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const CreateMeetingProvider: FC<
  PropsWithChildren<CreateMeetingProviderProps>
> = ({ children }) => {
  const [createMeetingInfo, setCreateMeetingInfo] =
    useState<CreateMeetingState>(createMeetingStateEmpty);

  return (
    <CreateMeetingContext.Provider value={createMeetingInfo}>
      <CreateMeetingUpdateContext.Provider value={{ setCreateMeetingInfo }}>
        {children}
      </CreateMeetingUpdateContext.Provider>
    </CreateMeetingContext.Provider>
  );
};
