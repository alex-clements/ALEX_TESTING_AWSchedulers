import React from 'react';
import { FlexRow } from '../../components/flexComponents';
import { extraColors } from '../../styles/theme';

const CalendarLegend = () => {
  return (
    <FlexRow style={{ gap: 20 }}>
      <LegendItem
        color={extraColors.unavailableTimeslotColor}
        text={'Unavailable Timeslot'}
      />
      <LegendItem
        color={extraColors.availableTimeslotColor}
        text={'Available Timeslot'}
      />
      <LegendItem
        color={extraColors.bookedMeetingColor}
        text={'Booked Meeting'}
      />
    </FlexRow>
  );
};

const LegendItem = ({ color, text }: { color: string; text: string }) => {
  return (
    <FlexRow>
      <LegendSquare color={color} />
      <div style={{ marginLeft: '5px' }}>{text}</div>
    </FlexRow>
  );
};

const LegendSquare = ({ color }: { color: string }) => {
  return (
    <div
      style={{
        width: '20px',
        height: '20px',
        backgroundColor: color,
        border: '1px solid black',
      }}
    ></div>
  );
};

export default CalendarLegend;
