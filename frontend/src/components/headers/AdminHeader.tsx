import { RxHamburgerMenu } from 'react-icons/rx';
import { defaultPageRoute } from '../../routing/routes';
import { useNavigate } from 'react-router-dom';
import theme from '../../styles/theme';
import awsLogo from './aws_logo_transparent.svg';
import { ProfileButton } from './ProfileButton';
import AdminHamburgerButton from './AdminHamburgerButton';

const AdminHeader = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 10,
        height: 50,
        backgroundColor: `${theme.palette.primary.main}`,
        top: 0,
        position: 'sticky',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 50,
          marginLeft: 25,
        }}
      >
        <img
          style={{ width: 50, cursor: 'pointer' }}
          src={awsLogo}
          onClick={() => navigate(defaultPageRoute)}
          alt="AWS Logo"
          title="Navigate to the Home Page"
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 100,
          color: 'white',
        }}
      >
        <AdminHamburgerButton />
      </div>
      <div style={{ flexGrow: 1 }}></div>
      <ProfileButton />
    </div>
  );
};

export default AdminHeader;
