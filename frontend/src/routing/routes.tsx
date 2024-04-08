export const defaultPageRoute = '/';
export const loginPageRoute = '/login';
export const updatePasswordPageRoute = '/update-password';
export const dashboardPageRoute = '/dashboard';
export const createMeetingPageRoute = '/create-meeting';
export const adminRoomPageRoute = '/admin/building/:buildingId';
export const adminBuildingPageRoute = '/admin/building';
export const adminPeoplePageRoute = '/admin/people';
export const adminSettingsPageRoute = '/admin/settings';
export const adminRoomPageRouteFn = (buildingId: string) => `${buildingId}`;
export const get_roomByBuildingIdRoute = (buildingId: string) =>
  `admin/rooms?building=${buildingId}`;
export const googleMapsRoute = 'https://www.google.com/maps/'
// export const apiRoute = import.meta.env.VITE_API_URL;
