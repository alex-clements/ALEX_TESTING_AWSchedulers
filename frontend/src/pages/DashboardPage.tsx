import { getFetchingStrategy } from '../services/0_FetchingStrategy';
import { getUsername } from '../utils/user';
import MeetingHeader from '../components/headers/MeetingHeader';
import { useMemo } from 'react';

const DashboardPage = () => {
  const handleClick = () => {
    const fetchingStrategy = getFetchingStrategy(
      'internal',
      import.meta.env.VITE_API_URL
    );
    fetchingStrategy
      .get('access')
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const username = useMemo(() => getUsername(), []);

  return (
    <>
      <MeetingHeader />
      <div>
        DashboardPage<button onClick={handleClick}>Test</button>
        {username && <p>{username}</p>}
      </div>
    </>
  );
};

export default DashboardPage;
