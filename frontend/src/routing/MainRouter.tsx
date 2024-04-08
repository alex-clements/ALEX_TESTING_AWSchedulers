import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CreateMeetingPage from '../pages/CreateMeetingPage';
import AdminRoomPage from '../pages/AdminRoomPage';
import AdminBuildingPage from '../pages/AdminBuildingPage';
import AdminPeoplePage from '../pages/AdminPeoplePage';
import AdminSettingsPage from '../pages/AdminSettingsPage';
import {
  defaultPageRoute,
  loginPageRoute,
  updatePasswordPageRoute,
  dashboardPageRoute,
  createMeetingPageRoute,
  adminRoomPageRoute,
  adminBuildingPageRoute,
  adminPeoplePageRoute,
  adminSettingsPageRoute,
} from './routes';
import UpdatePasswordPage from '../pages/UpdatePasswordPage';
// import HomePage from '../pages/HomePage';
import { ProtectedRoute } from './ProtectedRoute';

function MainRouter() {
  return (
    <Router>
      <Routes>
        {/*<Route path={defaultPageRoute} element={<HomePage />} />{/* For simple testing until some PRs are done for admin tables.  */}
        <Route path={defaultPageRoute} element={<LoginPage />} />
        <Route path={loginPageRoute} element={<LoginPage />} />
        <Route
          path={updatePasswordPageRoute}
          element={<UpdatePasswordPage />}
        />

        <Route element={<ProtectedRoute adminPermissionLevel={false} />}>
          <Route path={dashboardPageRoute} element={<DashboardPage />} />
          <Route
            path={createMeetingPageRoute}
            element={<CreateMeetingPage />}
          />
        </Route>

        <Route element={<ProtectedRoute adminPermissionLevel={true} />}>
          <Route path={adminRoomPageRoute} element={<AdminRoomPage />} />
          <Route
            path={adminBuildingPageRoute}
            element={<AdminBuildingPage />}
          />
          <Route path={adminPeoplePageRoute} element={<AdminPeoplePage />} />
          <Route
            path={adminSettingsPageRoute}
            element={<AdminSettingsPage />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
