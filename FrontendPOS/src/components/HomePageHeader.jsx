import Search from "@mui/icons-material/Search";
import { Box, InputAdornment, TextField } from "@mui/material";

const HomePageHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 4,
        py: 4,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <TextField
        placeholder="Search menu"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        sx={{ width: "500px" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default HomePageHeader;
