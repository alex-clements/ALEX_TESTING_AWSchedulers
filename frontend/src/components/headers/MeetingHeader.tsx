import { useNavigate } from 'react-router-dom';
import { defaultPageRoute } from '../../routing/routes';
import awsLogo from './aws_logo_transparent.svg';
import { useGetAdminStatus } from '../../hooks/useGetAdminStatus';
import { ProfileButton } from './ProfileButton';
import AdminHamburgerButton from './AdminHamburgerButton';

const MeetingHeader = () => {
  const navigate = useNavigate();
  const { isAdmin } = useGetAdminStatus();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 10,
        height: 50,
        backgroundColor: '#232F3E',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 100,
        }}
      >
        <img
          style={{ width: 50, cursor: 'pointer' }}
          src={awsLogo}
          onClick={() => navigate(defaultPageRoute)}
          alt="AWS Logo"
          title="Navigate to the Home Page"
        />
        {/** Update this if there are non-admin routes that are navigable */}
        {isAdmin && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 50,
              color: 'white',
            }}
          >
            <AdminHamburgerButton />
          </div>
        )}
      </div>
      <div style={{ flexGrow: 1 }}></div>
      <ProfileButton />
    </div>
  );
};

export default MeetingHeader;
