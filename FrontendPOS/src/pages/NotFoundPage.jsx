import { Box, Link as MuiLink, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Box textAlign="center">
        <Typography variant="h1" component="h1" fontWeight="bold" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" color="text.secondary" gutterBottom>
          Oops! Page not found
        </Typography>
        <MuiLink component={Link} to="/" variant="h5" color="primary">
          Return to Homepage
        </MuiLink>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
