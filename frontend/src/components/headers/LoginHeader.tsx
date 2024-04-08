import awsLogo from './aws_logo_transparent.svg';

export const LoginHeader = () => {
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
        <img style={{ width: 50 }} src={awsLogo} />
      </div>
      <div style={{ flexGrow: 1 }}></div>
    </div>
  );
};
