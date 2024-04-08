interface BookMeetingRequestT {
  name: string;
  startTime: string;
  endTime: string;
  organizer: string;
  roomUser: RoomUser[];
}

interface RoomUser {
  id: string;
  users: string[];
}
