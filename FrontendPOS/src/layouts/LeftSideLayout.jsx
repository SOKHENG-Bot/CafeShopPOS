import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import LeftSideBar from '../components/LeftSideBar';

const LeftSideLayout = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        p: 0,
      }}
    >
      <Box
        sx={{
          width: '8rem',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LeftSideBar />
      </Box>

      <Box
        sx={{
          flex: 1,
          boxShadow: 3,
          bgcolor: 'grey.100',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default LeftSideLayout;
